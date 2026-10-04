import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

export default defineConfig({
  html: {
    title: 'Shell',
  },
  server: {
    host: '::',
    port: 3000,
    strictPort: true,
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'shell',
      dts: {
        displayErrorInTerminal: true,
        generateTypes: false,
        consumeTypes: true,
      },
      remotes: {
        menu: 'menu@http://127.0.0.1:3004/mf-manifest.json',
        shared: 'shared@http://127.0.0.1:3005/mf-manifest.json',
        widget1: 'widget1@http://127.0.0.1:3001/mf-manifest.json',
        widget2: 'widget2@http://127.0.0.1:3002/mf-manifest.json',
        widget3: 'widget3@http://127.0.0.1:3003/mf-manifest.json',
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
