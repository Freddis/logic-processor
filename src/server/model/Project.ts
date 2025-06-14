import {dbSchema} from '../drizzle/db';
import {Component} from './Component';

export type Project = typeof dbSchema.projects.$inferSelect & {
  components: Component[]
}
