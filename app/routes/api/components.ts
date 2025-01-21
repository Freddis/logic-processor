import {json} from '@tanstack/start';
import {createAPIFileRoute} from '@tanstack/start/api';
import {db} from '../../server/drizzle/db';

export const APIRoute = createAPIFileRoute('/api/components')({
  GET: async () => {
    console.log('Getting components ');
    const values = await db.query.componentsInMain.findMany();
    const response = {items: values};
    console.log(response);
    return json(response);
  },
});
