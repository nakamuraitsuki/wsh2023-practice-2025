import http from 'node:http';
import cluster from 'node:cluster';
import os from 'node:os';
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

  // HTTP Keep-Alive タイムアウトの設定
  const httpServer = http.createServer(app.callback());
  httpServer.keepAliveTimeout = 60 * 1000; // 60 秒

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
  app.use(route.post('/initialize', async (ctx) => {
    await initializeDatabase();
    ctx.status = 204;
  }));

  // 静的ファイルの配信設定
  app.use(serve(rootResolve('dist'), { maxage: 86400000 })); // 1日キャッシュ
  app.use(serve(rootResolve('public'), { maxage: 86400000 }));

  // すべてのリクエストに対して、インデックスページを返す
  app.use(async (ctx) => await send(ctx, rootResolve('/dist/index.html')));

  // サーバー開始
  httpServer.listen({ port: PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
  });

  // graceful shutdown
  gracefulShutdown(httpServer, {
    async onShutdown(signal) {
      console.log(`Received signal to terminate: ${signal}`);
      await apolloServer.stop();
      await dataSource.destroy();
    },
  });
}

if (cluster.isMaster) {
  // マスターが利用する CPU コア数を取得
  const numCPUs = os.cpus().length;

  console.log(`Master process is running on ${process.pid}.`);

  // 各 CPU コアに対してワーカープロセスを生成
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork(); // 新しいワーカーを起動
  }

  // ワーカーが死んだ場合の処理
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  // 各ワーカープロセスでサーバーを起動
  init().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
