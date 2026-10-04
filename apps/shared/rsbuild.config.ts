import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

const port = 3005;

export default defineConfig({
  html: {
    title: 'Shared',
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
      name: 'shared',
      filename: 'remoteEntry.js',
      exposes: {
        './Widget': './src/Widget.tsx',
      },
      manifest: true,
      dts: {
        displayErrorInTerminal: true,
        generateTypes: {
          tsConfigPath: './tsconfig.json',
        },
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
