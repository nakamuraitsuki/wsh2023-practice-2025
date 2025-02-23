import http from 'node:http';
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
  const httpServer = http.createServer(app.callback());

  // HTTP Keep-Alive の最適化
  httpServer.keepAliveTimeout = 65 * 1000; // 65秒間 Keep-Alive を維持
  httpServer.headersTimeout = 70 * 1000; // ヘッダータイムアウトを 70秒に設定
  httpServer.requestTimeout = 0; // リクエストのタイムアウトは無制限（適宜調整）

  app.keys = ['cookie-key'];

  if (process.env.NODE_ENV !== 'production') {
    app.use(logger());
  }

  app.use(bodyParser({ enableTypes: ['json'] }));
  app.use(session({}, app));

  app.use(
    compress({
      filter: (content_type: string) => {
        return content_type && content_type.includes('application/json') ? true : false;
      },
      threshold: 2048,
    })
  );

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
      })
    )
  );

  app.use(
    route.post('/initialize', async (ctx) => {
      await initializeDatabase();
      ctx.status = 204;
    })
  );

  app.use(serve(rootResolve('dist'), { maxage: 86400000 }));
  app.use(serve(rootResolve('public'), { maxage: 86400000 }));

  app.use(async (ctx) => await send(ctx, rootResolve('/dist/index.html')));

  httpServer.listen({ port: PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
  });

  gracefulShutdown(httpServer, {
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
