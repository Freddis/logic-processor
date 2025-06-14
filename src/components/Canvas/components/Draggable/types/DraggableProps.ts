import {JSX} from 'react';
import {CanvasFocusEventHandler} from './CanvasFocusEventHandler';
import {CanvasActivationEventHandler} from './CanvasActivationEventHandler';
import {Point} from '../../../types/Point';

export interface CanvasDragStartEvent {
    position: Point
    setPayload: (payload: unknown) => void;
}

export interface CanvasDragOverEvent {
  position: Point
  payload: unknown
}

export type CanvasDragStartHandler = (e: CanvasDragStartEvent) => boolean
export type CanvasDragOverHandler = (e: CanvasDragOverEvent) => boolean
export type CanvasDragOutHandler = (e: CanvasDragOverEvent) => boolean
export type CanvasDropHandler = (e: CanvasDragOverEvent) => boolean

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
  onDragStart?: CanvasDragStartHandler
  onDragOver?: CanvasDragOverHandler
  onDragOut?: CanvasDragOutHandler
  onDrop?: CanvasDropHandler
}
