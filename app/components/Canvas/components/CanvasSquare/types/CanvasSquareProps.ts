import {ReactNode} from 'react';
import {RectCoords} from '../../../../../utls/CanvasSquareGenerator/CanvasSquareGenerator';
import {CanvasSquereStateSetterConsumer} from './CanvasSquereStateSetterConsumer';

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
