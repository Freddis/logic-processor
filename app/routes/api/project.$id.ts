import {json} from '@tanstack/start';
import {createAPIFileRoute} from '@tanstack/start/api';
import {db} from '../../server/drizzle/db';
import {z} from 'vinxi';

export interface ProjectResponse {
  data: {
    project: {
      id: number,
      name: string,
      description: string | null,
      componentTypes: {
        id: number,
        label: string,
        joints: {
          label: string,
          type: 'input' | 'output'
        }[]
      }[]
      components: {
        type: number,
        x: number,
        y: number,
      }[]
    }
  }
}
export const APIRoute = createAPIFileRoute('/api/project/$id')({
  GET: async (req) => {
    const id = z.number().parse(Number(req.params.id));
    console.log(`Getting project: ${id} `);
    const project = await db.query.projectsInMain.findFirst({
      where: (table, {eq}) => eq(table.id, id),
    });
    if (!project) {
      throw new Error('Project not found');
    }
    const components = await db.query.componentsInMain.findMany({
      where: (table, {eq}) => eq(table.projectid, id),
      with: {
        projectsInMain_componentid: {
          with: {
            projectJointsInMains: true,
          },
        },
      },
    });
    const response: ProjectResponse = {
      data: {
        project: {
          id: project.id,
          name: project.name,
          description: project.description,
          componentTypes: components.map((x) => ({
            id: x.componentid!,
            label: x.label,
            joints: x.projectsInMain_componentid?.projectJointsInMains.map((x) => ({
              label: x.label,
              type: z.enum(['input', 'output']).parse(x.type),
            })) ?? [],
          })),
          components: components.map((x) => ({
            id: x.id,
            type: x.componentid!,
            x: x.x,
            y: x.y,
          })),
        },
      },
    };
    console.log(response);
    return json(response);
  },
});
