import {CanvasSquereStateSetterConsumer} from './CanvasSquereStateSetterConsumer';
import {RectCoords} from '../../../../../types/RectCoords';
import {LogicComponentDto} from '../../../../../model/AndGate';

export interface CanvasSquareProps {
  id: string,
  left: number,
  right: number,
  top: number,
  bottom: number,
  color?: string
  isHidden: boolean,
  children: LogicComponentDto[],
  lastUpdate: number,
  viewPort: RectCoords,
  stateSetterConsumer: CanvasSquereStateSetterConsumer,
}
