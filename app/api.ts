import {
  createStartAPIHandler,
  defaultAPIFileRouteHandler,
} from '@tanstack/start/api';
import {Logger} from './utls/Logger/Logger';

Logger.useJsonStringify = true;

export default createStartAPIHandler(defaultAPIFileRouteHandler);
