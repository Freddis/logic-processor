import {dbSchema} from '../drizzle/db';

export type Component = typeof dbSchema.components.$inferSelect
