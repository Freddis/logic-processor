import {json} from '@tanstack/react-start';
import {db} from '../../server/drizzle/db';
import {createAPIFileRoute} from '@tanstack/start-api-routes';

export const APIRoute = createAPIFileRoute('/api/projects')({
  GET: async () => {
    console.log('Getting components ');
    const values = await db.query.projects.findMany();
    const response = {items: values};
    console.log(response);
    return json(response);
  },
});
