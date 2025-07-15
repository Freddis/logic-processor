import {createAPIFileRoute} from '@tanstack/react-start/api';
import {openApi} from '../../server/api/openApi';

const methods = openApi.wrappers.tanstackStart.createShemaMethods();
export const APIRoute = createAPIFileRoute('/api/schema')(methods);
