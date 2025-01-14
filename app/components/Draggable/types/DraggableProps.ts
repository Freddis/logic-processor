import {JSX} from 'react';
import {SimpleMouseEvent} from '../../../utls/MouseCatcher/types/SimpleMouseEvent';

export interface DraggableProps {
  x: number,
  y: number,
  width: number,
  height: number,
  id:string,
  children: JSX.Element[]
  isHidden?: boolean
  onClick?: (e: SimpleMouseEvent) => void,
  onFocus?: () => void,
  onFocusOut?: () => void,
  onDrag?: (x: number, y: number) => void,
}
