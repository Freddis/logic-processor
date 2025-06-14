import {createContext, ReactElement} from 'react';
import {MouseCatcher} from '../../utils/MouseCatcher/MouseCatcher';
import {CanvasElementProps} from '../../types/CanvasElementProps';
import {CanvasComponentState} from '../../types/CanvasComponentState';

export const CanvasContext = createContext({
  debug: true,
  activeElements: 0,
  scale: 1,
  size: {
    width: 0,
    height: 0,
  },
  canvas: (() => {throw new Error('Canvas not found');}) as () => SVGSVGElement,
  mouse: new MouseCatcher(0, 0, 0),
  // eslint-disable-next-line no-empty-function, @typescript-eslint/no-unused-vars
  setFocusedElement: (id: string| null) => {},
  // eslint-disable-next-line no-empty-function, @typescript-eslint/no-unused-vars
  setActive: (id: string, value: boolean) => {},
  // eslint-disable-next-line no-empty-function, @typescript-eslint/no-unused-vars
  setGlobalCanvasChildren: (nodes: ReactElement<CanvasElementProps>[], canvasPosition?: DOMRect) => {},
  // eslint-disable-next-line no-empty-function, @typescript-eslint/no-unused-vars
  addElement: (element: ReactElement<CanvasElementProps>, state?: CanvasComponentState) => {},
});


