FROM node:18.13.0-bullseye AS build
ENV TZ Asia/Tokyo
ENV NODE_ENV development

# 必要なパッケージをインストール
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init sqlite3

# pnpm をインストール
RUN npm install -g pnpm

# 作業ディレクトリの作成
RUN mkdir /app
WORKDIR /app

# プロジェクトファイルをコピー
COPY package.json pnpm-lock.yaml tsconfig.json tsconfig.node.json vite.config.ts index.html .npmrc /app/
COPY databases/ /app/databases/
COPY public/ /app/public/
COPY tools/ /app/tools/
COPY src/ /app/src/

# 依存関係をインストール
RUN pnpm install

# プロジェクトのビルド
RUN pnpm build

########################################################################

FROM node:18.13.0-bullseye-slim
ENV TZ Asia/Tokyo
ENV NODE_ENV development

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=build /usr/bin/sqlite3 /usr/bin/sqlite3
COPY --from=build --chown=node:node /app /app
WORKDIR /app
USER node

CMD ["dumb-init", "./node_modules/.bin/ts-node", "./src/server/migrations/run-migrations.ts", "&&", "./node_modules/.bin/ts-node", "./src/server/index.ts"]
