import { relations } from "drizzle-orm/relations";
import { projects, projectJoints, components, connections } from "./schema";

export const projectJointsRelations = relations(projectJoints, ({one, many}) => ({
	project: one(projects, {
		fields: [projectJoints.projectId],
		references: [projects.id]
	}),
	connectionInput: many(connections),
	connectionOutput: many(connections),
}));

export const projectsRelations = relations(projects, ({many}) => ({
	joints: many(projectJoints),
	components: many(components),
	references: many(components),
	connections: many(connections),
}));

export const componentsRelations = relations(components, ({one, many}) => ({
	project: one(projects, {
		fields: [components.projectId],
		references: [projects.id],
	}),
	referencedProject: one(projects, {
		fields: [components.componentid],
		references: [projects.id],
	}),
	connectedInputs: many(connections),
	connectedOutputs: many(connections),
}));

export const connectionsRelations = relations(connections, ({one, many}) => ({
	project: one(projects, {
		fields: [connections.projectId],
		references: [projects.id]
	}),
	inputComponent: one(components, {
		fields: [connections.inputComponentId],
		references: [components.id],
	}),
	inputJoint: one(projectJoints, {
		fields: [connections.inputJointId],
		references: [projectJoints.id],
	}),
	inputConnector: one(connections, {
		fields: [connections.inputConnectorId],
		references: [connections.id]
	}),
	inputConnectors: many(connections),
	outputComponent: one(components, {
		fields: [connections.outputComponentId],
		references: [components.id],
	}),
	outputJoint: one(projectJoints, {
		fields: [connections.outputJointId],
		references: [projectJoints.id],
	}),
	outputConnector: one(connections, {
		fields: [connections.outputConnectorId],
		references: [connections.id],
	}),
	outputConnectors: many(connections),
}));