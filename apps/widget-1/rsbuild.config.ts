import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

const port = 3001;

export default defineConfig({
  html: {
    title: 'Widget 1',
  },
  server: {
    host: '::',
    port,
    strictPort: true,
    cors: {
      origin: /^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/,
    },
  },
  dev: {
    assetPrefix: `http://127.0.0.1:${port}/`,
  },
  output: {
    assetPrefix: `http://127.0.0.1:${port}/`,
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'widget1',
      filename: 'remoteEntry.js',
      exposes: {
        './Widget': './src/Widget.tsx',
      },
      remotes: {
        shared: 'shared@http://127.0.0.1:3005/mf-manifest.json',
        widget3: 'widget3@http://127.0.0.1:3003/mf-manifest.json',
      },
      manifest: true,
      dts: {
        displayErrorInTerminal: true,
        generateTypes: {
          tsConfigPath: './tsconfig.json',
        },
        consumeTypes: true,
      },
      shared: {
        react: {
          singleton: true,
          eager: true,
          requiredVersion: '19.3.0',
        },
        'react-dom': {
          singleton: true,
          eager: true,
          requiredVersion: '19.3.0',
        },
      },
    }),
  ],
});
