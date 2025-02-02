import {Point} from '../components/Canvas/types/Point';
import {ConnectorDto} from './ConnectorDto';
import {ConnectorTarget} from './ConnectorTarget';

export class ConnectorJoint {
  protected connector: ConnectorDto;
  protected target: ConnectorTarget | null = null;

  constructor(connector: ConnectorDto, target: ConnectorTarget | null = null) {
    this.connector = connector;
    this.target = target;
  }

  setTarget(target: ConnectorTarget) {
    this.target = target;
  }

  getPosition(): Point | null {
    return this.target?.getPosition() ?? null;
  }
  getConnector(): ConnectorDto {
    return this.connector;
  }
}


export class DefiniteConnectorJoint extends ConnectorJoint {
  protected override target: ConnectorTarget;

  constructor(connector: ConnectorDto, target: ConnectorTarget) {
    super(connector, target);
    this.target = target;
  }

  override getPosition(): Point {
    return this.target.getPosition();
  }
}
