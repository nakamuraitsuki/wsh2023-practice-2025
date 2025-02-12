import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import topLevelAwait from 'vite-plugin-top-level-await';
import wasm from 'vite-plugin-wasm';
import { visualizer } from 'rollup-plugin-visualizer';
import viteImagemin from 'vite-plugin-imagemin';

import { getFileList } from './tools/get_file_list';

const publicDir = path.resolve(__dirname, './public');
const getPublicFileList = async (targetPath: string) => {
  const filePaths = await getFileList(targetPath);
  const publicFiles = filePaths
    .map((filePath) => path.relative(publicDir, filePath))
    .map((filePath) => path.join('/', filePath));

  return publicFiles;
};

export default defineConfig(async () => {
  const videos = await getPublicFileList(path.resolve(publicDir, 'videos'));

  return {
    build: {
      assetsInlineLimit: 20480,
      cssCodeSplit: true,
      cssTarget: 'es6',
      minify: true,
      rollupOptions: {
        output: {
          experimentalMinChunkSize: 40960,
        },
        plugins: [
          visualizer({
            filename: 'dist/stats.html',
          }),
        ],
      },
      target: 'es2015',
    },
    plugins: [
      react(),
      wasm(),
      topLevelAwait(),
      ViteEjsPlugin({
        module: '/src/client/index.tsx',
        title: '買えるオーガニック',
        videos,
      }),
      viteImagemin({
        gifsicle: {
          optimizationLevel: 3,
        },
        mozjpeg: {
          quality: 80,
        },
        optipng: {
          optimizationLevel: 5,
        },
        pngquant: {
          quality: [0.65, 0.8],
          speed: 4,
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox',
            },
            {
              name: 'removeDimensions',
            },
          ],
        },
      }),
      {
        name: 'add-defer-to-scripts',
        transformIndexHtml(html) {
          return html.replace(
            /<script.*src=".*\.js"><\/script>/g,
            (match) => match.replace('<script', '<script defer')
          );
        },
      },
    ],
  };
});
