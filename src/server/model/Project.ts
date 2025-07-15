import {TypeOf} from 'zod';
import {dbSchema} from '../drizzle/db';
import {createSelectSchema} from 'drizzle-zod';
import {openApi} from '../api/openApi';

export const projectValidator = openApi.validators.describeShape(createSelectSchema(dbSchema.projects), {
  id: 'Project Id',
  name: 'Name of the Project',
  description: 'Description of the project',
  createdAt: 'Date of creaton',
  updatedAt: 'Last time project was updated',
  deletedAt: 'Date when project was deleted',
}).openapi({description: 'Project', ref: 'Project'});
export type ProjectValidator = typeof projectValidator
export type Project = TypeOf<ProjectValidator>
