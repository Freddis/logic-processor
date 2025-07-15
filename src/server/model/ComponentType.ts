import {TypeOf} from 'zod';
import {componentValidator} from './Component';
import {componentJointValidator} from './ComponentJoint';

export const componentTypeValidator = componentValidator.pick({
  id: true,
  label: true,
}).extend({
  joints: componentJointValidator.omit({
    projectId: true,
  }).array().openapi({description: 'List of component joints'}),
}).openapi({
  description: 'Type of Component that can be included into projects.',
  ref: 'ComponentType',
});

export type ComponentTypeValidator = typeof componentTypeValidator
export type ComponentType = TypeOf<ComponentTypeValidator>
