import {createRef, MouseEventHandler, useEffect, useMemo, useState} from 'react';
import {ReactNode} from '@tanstack/react-router';
import {MouseCatcher} from '../../utls/MouseCatcher/MouseCatcher';
import {CanvasContext} from './CanvasContext';

export function Canvas(props: {scale?: number, width: number, height: number, children: ReactNode[] | ReactNode}) {
  const debug = false;
  const scale = props.scale ?? 1;
  const children = useMemo(() => {
    return props.children;
  }, []);
  const catcher = useMemo(() => new MouseCatcher(), []);
  const [minX, setMinX] = useState(0);
  const [minY, setMinY] = useState(0);
  const initialWidth = props.width;
  const initialHeight = props.height;

  const scaledWidth = (initialWidth) / scale;
  const scaledHeight = (initialHeight) / scale;
  const [scrolling, setScrolling] = useState(false);
  const [scrollInitialX, setScrollInitialX] = useState(0);
  const [scrollInitialY, setScrollInitialY] = useState(0);
  const [scrollMinX, setScrollMinX] = useState(0);
  const [scrollMinY, setScrollMinY] = useState(0);
  const svgRef = createRef<SVGSVGElement>();
  useEffect(() => {
    window.addEventListener('mousemove', (e) => {
      if (!svgRef.current) {
        return;
      }
      catcher.captureLegacyMouseMove(e, svgRef.current);
    });
    window.addEventListener('mouseup', (e) => {
      if (!svgRef.current) {
        return;
      }
      catcher.captureLegacyMouseUp(e, svgRef.current);
    });
  });
  const startScrolling: MouseEventHandler = (e) => {
    if (!catcher.lock('canvas')) {
      return;
    }
    console.log('Start scrolling');
    setScrolling(true);
    setScrollInitialX(e.pageX);
    setScrollInitialY(e.pageY);
    setScrollMinX(minX);
    setScrollMinY(minY);
  };
  const stopScrolling = () => {
    catcher.unlock('canvas');
    console.log('Stop scrolling');
    setScrolling(false);
  };
  catcher.onMouseMove('canvas', (e) => {
    if (!scrolling) {
      return;
    }
    const xMovement = (scrollInitialX - e.pageX) / scale;
    const yMovement = (scrollInitialY - e.pageY) / scale;
    const newMinX = scrollMinX + xMovement;
    const newMinY = scrollMinY + yMovement;
    setMinX(newMinX);
    setMinY(newMinY);
  });
  catcher.onMouseUp('canvas', stopScrolling);

  const content = useMemo(() =>
    <CanvasContext.Provider value={{offsetX: 0, offsetY: 0, scale, debug, mouse: catcher}}>
          <rect x={'-100000%'} y={'-100000%'} width="200000%" height="200000%" fill="#222222" />
          {children}
    </CanvasContext.Provider>
  , [scale, debug]);

  return <svg
    style={{background: 'red'}}
    ref={svgRef}
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width={initialWidth}
    height={initialHeight}
    cursor="pointer"
    onMouseDown={startScrolling}
    viewBox={`${minX},${minY},${scaledWidth},${scaledHeight}`}
    >{content}</svg>;

}
