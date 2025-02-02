import {ReactElement} from 'react';
import {CanvasElementProps} from './CanvasElementProps';

export interface CanvasProps {
  children: ReactElement<CanvasElementProps> | ReactElement<CanvasElementProps>[]
}
