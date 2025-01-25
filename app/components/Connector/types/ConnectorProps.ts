import {CanvasFocusEventHandler} from '../../Draggable/types/CanvasFocusEventHandler';

export interface ConnectorProps {
  x: number,
  y: number,
  isHidden: boolean,
  color: string,
  id: string,
  onFocusOut?: CanvasFocusEventHandler
  onFocus?: CanvasFocusEventHandler
  onDrag?: () => void
  onDragStop?: () => void
}
