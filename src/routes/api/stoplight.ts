import {createAPIFileRoute} from '@tanstack/react-start/api';
import {openApi} from '../../server/api/openApi';

const methods = openApi.wrappers.tanstackStart.createStoplightMethods('/api/schema');
export const APIRoute = createAPIFileRoute('/api/stoplight')(methods);
