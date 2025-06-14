import {ReactElement} from 'react';
import {CanvasElementProps} from './CanvasElementProps';

export interface CanvasProps {
  id: string,
  displayInChunks?: boolean;
  updateCounter?: number,
  children: ReactElement<CanvasElementProps> | ReactElement<CanvasElementProps>[]
}
