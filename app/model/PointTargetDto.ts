import {Point} from '../components/Canvas/types/Point';
import {ConnectorTarget} from './ConnectorTarget';

export class PointTargetDto extends ConnectorTarget {
  protected position: Point;

  constructor(position: Point) {
    super();
    this.position = position;
  }

  getPosition(): Point {
    return this.position;
  }
}
