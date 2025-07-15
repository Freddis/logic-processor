import {TypeOf} from 'zod';
import {projectValidator} from './Project';
import {componentValidator} from './Component';
import {connectionValidator} from './ComponentConnection';
import {componentTypeValidator} from './ComponentType';

export const decoratedProjectValidator = projectValidator.pick({
  id: true,
  name: true,
  description: true,
}).extend({
  componentTypes: componentTypeValidator.array().openapi({
    description: 'List of component types in the project',
  }),
  components: componentValidator
    .pick({
      x: true,
      y: true,
    }).extend({
      type: componentValidator.shape.componentid,
    }).array().openapi({description: 'List of project components'}),
  connections: connectionValidator.omit({
    projectId: true,
    deletedat: true,
    updatedat: true,
    createdat: true,
  }).array().openapi({
    description: 'List of project connections',
  }),

}).openapi({description: 'Decorated Project', ref: 'DecoratedProject'});
export type DecoratedProjectValidator = typeof decoratedProjectValidator;
export type DecoratedProject = TypeOf<DecoratedProjectValidator>
