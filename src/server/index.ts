import http2 from 'node:http2';
import { koaMiddleware } from '@as-integrations/koa';
import gracefulShutdown from 'http-graceful-shutdown';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import route from 'koa-route';
import send from 'koa-send';
import session from 'koa-session';
import serve from 'koa-static';
import compress from 'koa-compress'; // Gzip圧縮のために追加

import type { Context } from './context';
import { dataSource } from './data_source';
import { initializeApolloServer } from './graphql';
import { initializeDatabase } from './utils/initialize_database';
import { rootResolve } from './utils/root_resolve';

const PORT = Number(process.env.PORT ?? 8080);

async function init(): Promise<void> {
  await initializeDatabase();
  await dataSource.initialize();

  const app = new Koa();

  // HTTP/2サーバーの作成
  const http2Server = http2.createSecureServer(app.callback());

  app.keys = ['cookie-key'];

  // 本番環境では logger を無効にするなど調整
  if (process.env.NODE_ENV !== 'production') {
    app.use(logger());
  }

  // bodyParser の JSON のみパースを有効化
  app.use(bodyParser({ enableTypes: ['json'] }));

  // セッション設定
  app.use(session({}, app));

  // Gzip 圧縮の設定
  app.use(compress({
    filter: (content_type: string) => content_type && content_type.includes('application/json') ? true : false,
    threshold: 2048, // 2KB 以上のレスポンスを圧縮対象に
  }));

  // Apollo Server の設定
  const apolloServer = await initializeApolloServer();
  await apolloServer.start();

  app.use(
    route.all(
      '/graphql',
      koaMiddleware(apolloServer, {
        context: async ({ ctx }) => {
          return { session: ctx.session } as Context;
        },
      }),
    ),
  );

  // 初期化用の POST ルート
  app.use(
    route.post('/initialize', async (ctx) => {
      await initializeDatabase();
      ctx.status = 204;
    }),
  );

  // 静的ファイルの配信設定
  app.use(serve(rootResolve('dist'), { maxage: 86400000 })); // 1日キャッシュ
  app.use(serve(rootResolve('public'), { maxage: 86400000 }));

  // すべてのリクエストに対して、インデックスページを返す
  app.use(async (ctx) => await send(ctx, rootResolve('/dist/index.html')));

  // サーバー開始
  http2Server.listen(PORT, () => {
    console.log(`🚀 Server ready at https://localhost:${PORT}`);
  });

  // graceful shutdown
  gracefulShutdown(http2Server, {
    async onShutdown(signal) {
      console.log(`Received signal to terminate: ${signal}`);
      await apolloServer.stop();
      await dataSource.destroy();
    },
  });
}

init().catch((err) => {
  console.error(err);
  process.exit(1);
});
