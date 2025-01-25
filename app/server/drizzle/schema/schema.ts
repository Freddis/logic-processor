import {pgTable, pgSchema, foreignKey, integer, varchar, text, timestamp} from 'drizzle-orm/pg-core';
import {sql} from 'drizzle-orm';

export const main = pgSchema('main');

export const mainComponentsIdSeqInMain = main.sequence('main.components_id_seq', {startWith: '1', increment: '1', minValue: '1', maxValue: '2147483647', cache: '1', cycle: false});

export const projectJointsInMain = main.table('project_joints', {
  id: integer().generatedAlwaysAsIdentity({name: 'main.project_joints_id_seq', startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1}),
  projectid: integer().notNull(),
  type: varchar().notNull(),
  label: varchar().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.projectid],
    foreignColumns: [projectsInMain.id],
    name: 'project_joints_projects_id_fk',
  }),
]);

export const projectsInMain = main.table('projects', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({name: 'main.main.components_id_seq', startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647}),
  name: varchar().notNull(),
  description: text(),
  createdat: timestamp({withTimezone: true, mode: 'string'}).notNull(),
  updatedat: timestamp({withTimezone: true, mode: 'string'}),
  deletedat: timestamp({withTimezone: true, mode: 'string'}),
});

export const componentsInMain = main.table('components', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({name: 'main.projects_id_seq', startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1}),
  label: varchar().notNull(),
  x: integer().notNull(),
  y: integer().notNull(),
  createdat: timestamp({withTimezone: true, mode: 'string'}).notNull(),
  updatedat: timestamp({withTimezone: true, mode: 'string'}),
  deletedat: timestamp({withTimezone: true, mode: 'string'}),
  projectid: integer().notNull(),
  componentid: integer(),
}, (table) => [
  foreignKey({
    columns: [table.projectid],
    foreignColumns: [projectsInMain.id],
    name: 'components___fk',
  }),
  foreignKey({
    columns: [table.componentid],
    foreignColumns: [projectsInMain.id],
    name: 'components_projects_id_fk',
  }),
]);

export const connectionsInMain = main.table('connections', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({name: 'main.connections_id_seq', startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1}),
  projectid: integer(),
  inputid: integer(),
  outputid: integer(),
  createdat: timestamp({withTimezone: true, mode: 'string'}).notNull(),
  updatedat: timestamp({withTimezone: true, mode: 'string'}),
  deletedat: timestamp({withTimezone: true, mode: 'string'}),
}, (table) => [
  foreignKey({
    columns: [table.projectid],
    foreignColumns: [projectsInMain.id],
    name: 'connections_projects_id_fk',
  }),
  foreignKey({
    columns: [table.inputid],
    foreignColumns: [componentsInMain.id],
    name: 'connections_components_id_fk',
  }),
  foreignKey({
    columns: [table.outputid],
    foreignColumns: [componentsInMain.id],
    name: 'connections_components_id_fk_2',
  }),
]);
