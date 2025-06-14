import {json} from '@tanstack/react-start';
import {createAPIFileRoute} from '@tanstack/start-api-routes';

export const APIRoute = createAPIFileRoute('/api/api')({
  GET: () => {
    return json({message: 'Hello "/api/api"!'});
  },
});
