import {createContext, ReactElement} from 'react';
import {Point} from '../../types/Point';
import {CanvasComponentState} from '../../types/CanvasComponentState';
import {CanvasElementProps} from '../../types/CanvasElementProps';

export const CanvasInternalContext = createContext({
  scale: 1,
  debug: false,
  size: {
    width: 0,
    height: 0,
  },
  position: {
    x: undefined,
    y: undefined,
  } as Partial<Point>,
  globalCanvas: false,
  childContext: false,
  enableScrolling: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty-function
  setActiveElements: (value: number) => {},
  // eslint-disable-next-line max-len, @typescript-eslint/no-unused-vars, no-empty-function
  subsribeToElementUpdates: (id: string, callback: (element: ReactElement<CanvasElementProps>, state?: CanvasComponentState)=> void) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty-function
  setTargetCanvas: (id: string, canvas: SVGSVGElement) => {},
});
