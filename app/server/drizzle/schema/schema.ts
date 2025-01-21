import {pgSchema, integer, varchar, text, timestamp} from 'drizzle-orm/pg-core';

export const main = pgSchema('main');
export const componentsInMain = main.table('components', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({
    name: 'main.components_id_seq',
    startWith: 1,
    increment: 1,
    minValue: 1,
    maxValue: 2147483647,
    cache: 1,
  }),
  name: varchar().notNull(),
  description: text(),
  createdat: timestamp({withTimezone: true, mode: 'date'}).notNull(),
  updatedat: timestamp({withTimezone: true, mode: 'date'}),
  deletedat: timestamp({withTimezone: true, mode: 'date'}),
});
