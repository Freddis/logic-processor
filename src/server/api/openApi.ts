import {ApiService} from '../ApiService/ApiService';

const service = new ApiService();
export const openApi = service.getOpenApiInstance();
