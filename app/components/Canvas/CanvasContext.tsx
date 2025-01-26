import {createContext} from 'react';
import {MouseCatcher} from '../../utls/MouseCatcher/MouseCatcher';
import {CanvasSquareCreator} from '../../utls/CanvasSquareGenerator/CanvasSquareGenerator';

export const CanvasContext = createContext({
  scale: 1,
  debug: false,
  mouse: new MouseCatcher(),
  squareCreator: new CanvasSquareCreator(0, {left: 0, right: 0, top: 0, bottom: 0}, []),
  offsetX: 0,
  offsetY: 0,
});
