import {ReactNode} from 'react';
import {CanvasSquereStateSetterConsumer} from './CanvasSquereStateSetterConsumer';
import {RectCoords} from '../../../../../types/RectCoords';

export interface CanvasSquareProps {
  id: string,
  left: number,
  right: number,
  top: number,
  bottom: number,
  color?: string
  isHidden: boolean,
  children: ReactNode| ReactNode[],
  lastUpdate: number,
  viewPort: RectCoords,
  stateSetterConsumer: CanvasSquereStateSetterConsumer,
}
