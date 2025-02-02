import {createContext} from 'react';
import {MouseCatcher} from '../../utils/MouseCatcher/MouseCatcher';

export const CanvasContext = createContext({
  debug: true,
  activeElements: 0,
  scale: 1,
  size: {
    width: 0,
    height: 0,
  },
  mouse: new MouseCatcher(0, 0, 0),
  // eslint-disable-next-line no-empty-function, @typescript-eslint/no-unused-vars
  setFocusedElement: (id: string| null) => {},
  // eslint-disable-next-line no-empty-function, @typescript-eslint/no-unused-vars
  setActive: (id: string, value: boolean) => {},
});


