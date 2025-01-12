import {createContext} from 'react';
import {MouseCatcher} from '../../utls/MouseCatcher/MouseCatcher';

export const CanvasContext = createContext({
  scale: 1,
  debug: false,
  mouse: new MouseCatcher(),
});
