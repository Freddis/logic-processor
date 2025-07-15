import {
  createStartAPIHandler,
  defaultAPIFileRouteHandler,
} from '@tanstack/react-start/api';
import {Logger} from './utls/Logger/Logger';
import {openApi} from './server/api/openApi';
import {openApiRoutes} from './server/api/openApiRoutes';

Logger.useJsonStringify = true;
openApi.addRouteMap(openApiRoutes);
export default createStartAPIHandler(defaultAPIFileRouteHandler);
