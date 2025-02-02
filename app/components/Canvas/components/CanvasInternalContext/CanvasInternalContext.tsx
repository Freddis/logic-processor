import {createContext} from 'react';

export const CanvasInternalContext = createContext({
  scale: 1,
  debug: false,
  size: {
    width: 0,
    height: 0,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty-function
  setActiveElements: (value: number) => {},
});
