import {LogicComponent} from '../../../model/AndGate';

export interface AndGateProps {
  component: LogicComponent
  onFocus?: () => void,
  onFocusOut?: () => void
  onDrag?: () => void
  onDragStop?: () => void
}
