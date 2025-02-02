import {json} from '@tanstack/start';
import {createAPIFileRoute} from '@tanstack/start/api';
import {db} from '../../server/drizzle/db';
import {z} from 'vinxi';
import {ProjectResponse} from './types/ProjectResponse';
import {Logger} from '../../utls/Logger/Logger';

export const APIRoute = createAPIFileRoute('/api/project/$id')({
  GET: async (req) => {
    const logger = new Logger('API');
    const id = z.number().parse(Number(req.params.id));
    logger.info(`Getting project: ${id} `);
    const project = await db.query.projects.findFirst({
      where: (table, {eq}) => eq(table.id, id),
    });
    if (!project) {
      throw new Error('Project not found');
    }
    const components = await db.query.components.findMany({
      where: (table, {eq}) => eq(table.projectId, id),
      with: {
        referencedProject: {
          with: {
            joints: true,
          },
        },
      },
    });
    const connections = await db.query.connections.findMany({
      where: (table, {eq}) => eq(table.projectId, id),
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
            joints: x.referencedProject?.joints.map((x) => ({
              id: x.id,
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
          connections: connections.map((x) => ({
            id: x.id,
            inputX: x.inputX,
            inputY: x.inputY,
            inputComponentId: x.inputComponentId,
            inputJointId: x.inputJointId,
            inputConnectorId: x.inputConnectorId,
            inputConnectorPosition: x.inpuitConnectorPosition,
            outputX: x.outputX,
            outputY: x.outputY,
            outputComponentId: x.outputComponentId,
            outputJointId: x.outputJointId,
            outputConnectorId: x.outputConnectorId,
            outputConnectorPosition: x.outputConnectorPosition,
          })),
        },
      },
    };
    logger.debug('Response', response);
    return json(response);
  },
});
