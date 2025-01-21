import {dbSchema} from '../server/drizzle/db';

export type Component = typeof dbSchema.componentsInMain.$inferSelect
