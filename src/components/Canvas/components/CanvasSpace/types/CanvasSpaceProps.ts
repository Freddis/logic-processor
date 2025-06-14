import {ReactNode} from 'react';

export interface CanvasSpaceProps {
  children: ReactNode | ReactNode[],
  width: number,
  height: number,
  scale?: number,
  debug?: boolean,
  enableScrolling?: boolean
  minX?: number,
  minY?: number,
  cacheKey?: string,
}
