import {Point} from '../components/Canvas/types/Point';
import {ConnectorDto} from './ConnectorDto';
import {ConnectorTarget} from './ConnectorTarget';
import {JointDto} from './JointDto';

export class JointTargetDto extends ConnectorTarget {
  protected joint: JointDto;
  protected connector: ConnectorDto;

  constructor(connector: ConnectorDto, joint: JointDto) {
    super();
    this.joint = joint;
    this.connector = connector;
  }

  getPosition(): Point {
    return this.joint.getPosition();
  }
  getConnector(): ConnectorDto {
    return this.connector;
  }
}
