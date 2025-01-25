import {relations} from 'drizzle-orm/relations';
import {projectsInMain, projectJointsInMain, componentsInMain, connectionsInMain} from './schema';

export const projectJointsInMainRelations = relations(projectJointsInMain, ({one}) => ({
  projectsInMain: one(projectsInMain, {
    fields: [projectJointsInMain.projectid],
    references: [projectsInMain.id],
  }),
}));

export const projectsInMainRelations = relations(projectsInMain, ({many}) => ({
  projectJointsInMains: many(projectJointsInMain),
  componentsInMains_projectid: many(componentsInMain, {
    relationName: 'componentsInMain_projectid_projectsInMain_id',
  }),
  componentsInMains_componentid: many(componentsInMain, {
    relationName: 'componentsInMain_componentid_projectsInMain_id',
  }),
  connectionsInMains: many(connectionsInMain),
}));

export const componentsInMainRelations = relations(componentsInMain, ({one, many}) => ({
  projectsInMain_projectid: one(projectsInMain, {
    fields: [componentsInMain.projectid],
    references: [projectsInMain.id],
    relationName: 'componentsInMain_projectid_projectsInMain_id',
  }),
  projectsInMain_componentid: one(projectsInMain, {
    fields: [componentsInMain.componentid],
    references: [projectsInMain.id],
    relationName: 'componentsInMain_componentid_projectsInMain_id',
  }),
  connectionsInMains_inputid: many(connectionsInMain, {
    relationName: 'connectionsInMain_inputid_componentsInMain_id',
  }),
  connectionsInMains_outputid: many(connectionsInMain, {
    relationName: 'connectionsInMain_outputid_componentsInMain_id',
  }),
}));

export const connectionsInMainRelations = relations(connectionsInMain, ({one}) => ({
  projectsInMain: one(projectsInMain, {
    fields: [connectionsInMain.projectid],
    references: [projectsInMain.id],
  }),
  componentsInMain_inputid: one(componentsInMain, {
    fields: [connectionsInMain.inputid],
    references: [componentsInMain.id],
    relationName: 'connectionsInMain_inputid_componentsInMain_id',
  }),
  componentsInMain_outputid: one(componentsInMain, {
    fields: [connectionsInMain.outputid],
    references: [componentsInMain.id],
    relationName: 'connectionsInMain_outputid_componentsInMain_id',
  }),
}));
