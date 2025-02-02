import {ConnectorDto} from '../../../model/ConnectorDto';
import {CanvasFocusEventHandler} from '../../Canvas/components/Draggable/types/CanvasFocusEventHandler';
import {CanvasElementProps} from '../../Canvas/types/CanvasElementProps';

export interface ConnectorProps extends CanvasElementProps {
  connector: ConnectorDto
  isHidden?: boolean,
  isFocused?: boolean,
  color?: string,
  onFocusOut?: CanvasFocusEventHandler
  onFocus?: CanvasFocusEventHandler
  onDrag?: () => void
  onDragStop?: () => void
}
