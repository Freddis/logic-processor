import {JSX} from 'react';

export interface DraggableProps {
  x: number,
  y: number,
  width: number,
  height: number,
  id:number,
  children: JSX.Element[] | JSX.Element
  onFocus?: () => void,
  onFocusOut?: () => void,
  onDrag?: (x: number, y: number) => void,
}
