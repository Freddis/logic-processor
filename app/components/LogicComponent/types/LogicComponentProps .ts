import {LogicComponentDto} from '../../../model/LogicComponentDto';
import {CanvasElementProps} from '../../Canvas/types/CanvasElementProps';
import {DraggableComponentProps} from '../../Canvas/types/DraggableComponentProps';
import {FocusableComponentProps} from '../../Canvas/types/FocusableComponentProps';

export interface LogicComponentProps extends CanvasElementProps, DraggableComponentProps, FocusableComponentProps {
  component: LogicComponentDto
}
