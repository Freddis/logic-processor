import {createSelectSchema} from 'drizzle-zod';
import {dbSchema} from '../drizzle/db';
import {describe} from '../api/describe';
import {TypeOf} from 'zod';

export const componentJointValidator = describe(createSelectSchema(dbSchema.projectJoints), {
  type: 'Type of the joint: input or output.',
  id: 'Joint Id',
  projectId: 'Id of the project that contains this joint',
  label: 'Short name of this joint that helps to identify it visually',
}).openapi({
  description: 'Input / output connection slot on the component',
  ref: 'Component Joint',
});

export type ComponentJointValidator = typeof componentJointValidator
export type ComponentJoint = TypeOf<ComponentJointValidator>
