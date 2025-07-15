import {createAPIFileRoute} from '@tanstack/react-start/api';
import {openApi} from '../../server/api/openApi';

const methods = openApi.wrappers.tanstackStart.getOpenApiRootMethods();
export const APIRoute = createAPIFileRoute('/api/v1')(methods);
