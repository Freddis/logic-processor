import {TypeOf} from 'zod';
import {dbSchema} from '../drizzle/db';
import {createSelectSchema} from 'drizzle-zod';
import {openApi} from '../api/openApi';

export const connectionValidator = openApi.validators.describeShape(createSelectSchema(dbSchema.connections), {
  id: 'Id of the component',
  projectId: 'Id of the project this connection belongs to',
  inputX: 'Input X coordinate in case if input is not connected',
  inputY: 'Input Y coordinate in case if input is not connected.',
  // eslint-disable-next-line max-len
  inputJointId: 'Id of the joint of the component this input is connected to. A component can multiple joints, this field specifies which joint was used.',
  inputComponentId: 'Id of the component in case if this input connected to a component',
  inputConnectorId: 'Id of another connection this input',
  // eslint-disable-next-line max-len
  inputConnectorPosition: 'Position on another connector this input is connected to. The percantage from 1 to 100 that indicated the spot on the line.',
  outputX: 'Output X coordinate in case if output is not connected',
  outputY: 'Output Y coordinate in case if output is not connected',
// eslint-disable-next-line max-len
  outputJointId: 'Id of the joint of the component this output is connected to. A component can multiple joints, this field specifies which joint was used.',
  outputComponentId: 'Id of the component in case if this output connected to a component',
  outputConnectorId: 'Id of another connection this output',
  // eslint-disable-next-line max-len
  outputConnectorPosition: 'Position on another connector this output is connected to. The percantage from 1 to 100 that indicated the spot on the line.',
  createdat: 'Date this connection was created',
  updatedat: 'Last time this connection was updated',
  deletedat: 'Date when this connection was deleted',
}).openapi({
  // eslint-disable-next-line max-len
  description: 'Component Connection. Has input and output which can be connected to: component, another connection or just hang in the "air" unconnected. ',
  ref: 'ComponentConnection',
});
export type ComponentConnection = TypeOf<typeof connectionValidator>
