import {OpenApi} from 'strap-on-openapi';

export class ApiService {

  getOpenApiInstance() {
    const api = OpenApi.builder.defineGlobalConfig({
      basePath: '/api/v1',
    }).create();
    return api;
  }
}
