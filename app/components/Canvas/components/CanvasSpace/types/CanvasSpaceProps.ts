import {ReactNode} from 'react';

export interface CanvasSpaceProps {
  children: ReactNode | ReactNode[],
  scale?: number,
  width: number,
  height: number,
  debug?: boolean,
}
