import {JSX} from 'react';
import {CanvasComponentState} from '../../../types/CanvasComponentState';
import {CanvasElementStateManager} from '../../../utils/CanvasElementStateManager/CanvasElementStateManager';

export interface StatefulCanvasElementProps {
  id: string
  x: number,
  y: number
  manager: CanvasElementStateManager
  elementState: CanvasComponentState
  children: JSX.Element
}
