import {JSX} from 'react';
import {CanvasFocusEventHandler} from './CanvasFocusEventHandler';
import {CanvasActivationEventHandler} from './CanvasActivationEventHandler';

export interface DraggableProps {
  x: number,
  y: number,
  width: number,
  height: number,
  id:string,
  children: JSX.Element | JSX.Element[]
  isHidden?: boolean
  isActive?: boolean
  margin?: number
  onActive?: CanvasActivationEventHandler
  onActiveOut?: CanvasActivationEventHandler
  onFocus?: CanvasFocusEventHandler,
  onFocusOut?: CanvasFocusEventHandler,
  onDrag?: (x: number, y: number) => void,
  onDragStop?: (x: number, y: number) => void,
  onDragStart?: (x: number, y: number) => void,
}
