import {OpenApi} from 'strap-on-openapi';

export const openApi = OpenApi.builder.defineGlobalConfig({
  basePath: '/api/v1',
}).create();
