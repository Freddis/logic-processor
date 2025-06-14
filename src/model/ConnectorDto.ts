import {ConnectorJoint, DefiniteConnectorJoint} from './ConnectorJoint';
import {ConnectorTarget} from './ConnectorTarget';


export class ConnectorDto {
  id: number;
  start: DefiniteConnectorJoint;
  end: ConnectorJoint;

  constructor(id: number, start:ConnectorTarget, end?: ConnectorTarget) {
    this.id = id;
    this.start = new DefiniteConnectorJoint(this, start);
    this.end = new ConnectorJoint(this);
    if (end) {
      this.end.setTarget(end);
    }
  }

  hasLogicOne(): boolean {
    return true;
  }
}
