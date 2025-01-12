import {useContext} from 'react';
import {ReactNode} from '@tanstack/react-router';
import {MouseCatcher} from '../../utls/MouseCatcher/MouseCatcher';
import {CanvasContext} from './CanvasContext';


export function Canvas(props: {mouseCatcher: MouseCatcher, children: ReactNode[] | ReactNode}) {
  const minX = 0;
  const minY = 0;
  const initialWidth = 500;
  const initialHeight = 400;
  const context = useContext(CanvasContext);
  const scaledWidth = initialWidth / context.scale;
  const scaledHeight = initialHeight / context.scale;
  return <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width={initialWidth}
    height={initialHeight}
    onMouseMove={(e) => props.mouseCatcher.captureMouseMove(e)}
    viewBox={`${minX},${minY},${scaledWidth},${scaledHeight}`}
    >
      <rect width="100%" height="100%" fill="#eeeeee" />
      {props.children}
    </svg>;
}
