import {CanvasComponentState} from './CanvasComponentState';

export interface FocusableComponentProps {
  onFocus?: (state: CanvasComponentState) => void,
  onFocusOut?: (state: CanvasComponentState) => void
}
