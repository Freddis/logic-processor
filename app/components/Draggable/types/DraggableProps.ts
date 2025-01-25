import {JSX} from 'react';
import {SimpleMouseEvent} from '../../../utls/MouseCatcher/types/SimpleMouseEvent';
import {CanvasFocusEventHandler} from './CanvasFocusEventHandler';

export interface DraggableProps {
  x: number,
  y: number,
  width: number,
  height: number,
  id:string,
  children: JSX.Element | JSX.Element[]
  isHidden?: boolean
  margin?: number
  onClick?: (e: SimpleMouseEvent) => void,
  onFocus?: CanvasFocusEventHandler,
  onFocusOut?: CanvasFocusEventHandler,
  onDrag?: (x: number, y: number) => void,
  onDragStop?: (x: number, y: number) => void,
  onDragStart?: (x: number, y: number) => void,
}
