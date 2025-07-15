import {TypeOf} from 'zod';
import {dbSchema} from '../drizzle/db';
import {createSelectSchema} from 'drizzle-zod';
import {describe} from '../api/describe';

export const componentValidator = describe(createSelectSchema(dbSchema.components), {
  id: 'Id of the component',
  projectId: 'Id of the parent project',
  componentid: 'Id of the parent component',
  label: 'Label in the project',
  x: 'X coordinate in the project',
  y: 'Y coordinate in the project',
  createdAt: 'Creation date',
  updatedAt: 'Date of the last update',
  deletedAt: 'Date the component was deleted',
}).openapi({description: 'Component', ref: 'Component'});
export type Component = TypeOf<typeof componentValidator>
