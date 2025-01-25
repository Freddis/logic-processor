import {dbSchema} from '../server/drizzle/db';
import {Component} from './Component';

export type Project = typeof dbSchema.projectsInMain.$inferSelect & {
  components: Component[]
}
