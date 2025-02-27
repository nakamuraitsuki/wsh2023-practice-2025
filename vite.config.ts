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
      assetsInlineLimit: 4096,
      cssCodeSplit: true,
      cssTarget: 'esnext',
      minify: true,
      rollupOptions: {
        output: {
          experimentalMinChunkSize: 40960,
          manualChunks(id) {
            if (id.includes('@apollo/client')) {
              if (id.includes('core')) {
                return 'apollo-core';
              }

              if (id.includes('react')) {
                return 'apollo-react';
              }
              if (id.includes('utilities')) {
                return 'apollo-utilities';
              }
              
              return 'apollo-client';
            }
            if (id.includes('react') || id.includes('formik')) {
              return 'react';
            }
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          }          
        },
        plugins: [
          visualizer({
            filename: 'dist/stats.html',
          }),
        ],
      },
      target: 'esnext',
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
          quality: 70,
        },
        optipng: {
          optimizationLevel: 3,
        },
        pngquant: {
          quality: [0.65, 0.8],
          speed: 10,
        },
        webp: {
          quality: 50,
        },
        svgo: {
          plugins: [
            { removeViewBox: false },
            { cleanupIDs: false },
            { removeComments: true },
            { removeMetadata: true },
            { removeXMLProcInst: true },
            { collapseGroups: true },
            { convertTransform: true },
            { mergePaths: true },
            { convertShapeToPath: true },
            { convertColors: true },
            { removeUselessStrokeAndFill: true },
            { cleanupAttrs: true },
            { optimizeCompressions: true },
          ],
        },
      }),
    ],
  };
});
