import {defineConfig} from '@tanstack/react-start/config';
import tsConfigPaths from 'vite-tsconfig-paths';
import {openApi} from './src/server/api/openApi';
import {openApiRoutes} from './src/server/api/openApiRoutes';

export default defineConfig({
  tsr: {
    appDirectory: 'src',
  },
  server: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      {
        name: 'open-api-client-generator',
        configureServer: async () => {
          console.log('Generating Open API client');
          openApi.addRouteMap(openApiRoutes);
          await openApi.clientGenerator.generate({
            output: 'src/openapi-client',
          });
        },
      },
    ],
  },
});
