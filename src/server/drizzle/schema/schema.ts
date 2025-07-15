import { pgSchema, foreignKey, integer, varchar, text, timestamp } from "drizzle-orm/pg-core"

export const logicConstructor = pgSchema("logic_constructor");

export const projectJoints = logicConstructor.table("project_joints", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	projectId: integer().notNull(),
	type: varchar().notNull(),
	label: varchar().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [projects.id],
		}),
]);

export const projects = logicConstructor.table("projects", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar().notNull(),
	description: text(),
	createdAt: timestamp({ withTimezone: true, mode: 'date' }).notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'date' }),
	deletedAt: timestamp({ withTimezone: true, mode: 'date' }),
});

export const components = logicConstructor.table("components", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	projectId: integer().notNull(),
	componentid: integer(),
	label: varchar().notNull(),
	x: integer().notNull(),
	y: integer().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'date' }).notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'date' }),
	deletedAt: timestamp({ withTimezone: true, mode: 'date' }),
}, (table) => [
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [projects.id],
		}),
	foreignKey({
			columns: [table.componentid],
			foreignColumns: [projects.id],
		}),
]);

export const connections = logicConstructor.table("connections", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	projectId: integer().notNull(),
	inputX: integer().notNull(),
	inputY: integer().notNull(),
	inputJointId: integer(),
	inputComponentId: integer(),
	inputConnectorId: integer(),
	inputConnectorPosition: integer('inpuitConnectorPosition'),
	outputX: integer().notNull(),
	outputY: integer().notNull(),
	outputJointId: integer(),
	outputComponentId: integer(),
	outputConnectorId: integer(),
	outputConnectorPosition: integer(),
	createdat: timestamp({ withTimezone: true, mode: 'date' }).notNull(),
	updatedat: timestamp({ withTimezone: true, mode: 'date' }),
	deletedat: timestamp({ withTimezone: true, mode: 'date' }),
}, (table) => [
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [projects.id],
		}),
	foreignKey({
			columns: [table.outputComponentId],
			foreignColumns: [components.id],
		}),
	foreignKey({
			columns: [table.inputConnectorId],
			foreignColumns: [table.id],
		}),
	foreignKey({
			columns: [table.outputConnectorId],
			foreignColumns: [table.id],
		}),
	foreignKey({
			columns: [table.inputComponentId],
			foreignColumns: [components.id],
		}),
	foreignKey({
			columns: [table.inputJointId],
			foreignColumns: [projectJoints.id],
		}),
	foreignKey({
			columns: [table.outputJointId],
			foreignColumns: [projectJoints.id],
		}),
]);
