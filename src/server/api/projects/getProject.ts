import {OpenApiMethod, OpenApiSampleRouteType} from 'strap-on-openapi';
import {openApi} from '../openApi';
import z from 'zod';
import {Logger} from '../../../utls/Logger/Logger';
import {DecoratedProject, decoratedProjectValidator} from '../../model/DecoratedProject';
import {getDb} from '../../drizzle/db';

export const getProject = openApi.factory.createRoute({
  type: OpenApiSampleRouteType.Public,
  method: OpenApiMethod.GET,
  path: '/{id}',
  description: 'Lists logic circuit projects of the user',
  validators: {
    path: z.object({
      id: openApi.validators.strings.number.openapi({description: 'Id of the project'}),
    }),
    response: z.object({
      data: z.object({
        project: decoratedProjectValidator,
      }).openapi({description: 'Data envelope'}),
    }).openapi({description: 'Project response'}),
  },
  handler: async (ctx) => {
    const db = await getDb();
    const logger = new Logger('API');
    const id = z.number().parse(ctx.params.path.id);
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
    const decoratedProject: DecoratedProject = {
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
        inputConnectorPosition: x.inputConnectorPosition,
        outputX: x.outputX,
        outputY: x.outputY,
        outputComponentId: x.outputComponentId,
        outputJointId: x.outputJointId,
        outputConnectorId: x.outputConnectorId,
        outputConnectorPosition: x.outputConnectorPosition,
      })),
    };

    return {
      data: {
        project: decoratedProject,
      },
    };
  },
});
