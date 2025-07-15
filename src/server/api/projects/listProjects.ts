import {OpenApiMethod, OpenApiSampleRouteType} from 'strap-on-openapi';
import {openApi} from '../openApi';
import z from 'zod';
import {projectValidator} from '../../model/Project';
import {db} from '../../drizzle/db';

export const listProjects = openApi.factory.createRoute({
  type: OpenApiSampleRouteType.Public,
  method: OpenApiMethod.GET,
  path: '/',
  description: 'Lists logic circuit projects of the user',
  validators: {
    response: z.object({
      items: projectValidator.array().openapi({description: 'Projects'}),
    }).openapi({description: 'List of projects'}),
  },
  handler: async () => {
    console.log('Getting components ');
    const values = await db.query.projects.findMany();
    const response = {items: values};
    console.log(response);
    return response;
  },
});
