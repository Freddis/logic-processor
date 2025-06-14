import {CanvasSquereStateSetterConsumer} from './CanvasSquereStateSetterConsumer';
import {CanvasSquareGenerator} from '../../../utils/CanvasSquareGenerator/CanvasSquareGenerator';
import {JSX} from 'react';

export interface CanvasSquareProps {
  id: string,
  left: number,
  right: number,
  top: number,
  bottom: number,
  isHidden: boolean,
  children: JSX.Element[],
  // viewPort: RectCoords,
  stateSetterConsumer: CanvasSquereStateSetterConsumer,
  creator: CanvasSquareGenerator
}
