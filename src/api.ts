import {
  createStartAPIHandler,
  defaultAPIFileRouteHandler,
} from '@tanstack/react-start/api';
import {Logger} from './utls/Logger/Logger';

Logger.useJsonStringify = true;
// openApiInstance.addRoutesByMap(openApiRoutes);
export default createStartAPIHandler(defaultAPIFileRouteHandler);
