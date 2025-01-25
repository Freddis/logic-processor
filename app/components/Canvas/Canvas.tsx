import {createRef, MouseEventHandler, useEffect, useMemo, useState} from 'react';
import {MouseCatcher} from '../../utls/MouseCatcher/MouseCatcher';
import {CanvasContext} from './CanvasContext';
import {LogicComponentDto} from '../../model/AndGate';
import {CanvasSquareCreator} from '../../utls/CanvasSquareGenerator/CanvasSquareGenerator';


export function Canvas(props: {
  elements: LogicComponentDto[],
  scale?: number,
  width: number,
  height: number,
}) {
  const debug = false;
  const scale = props.scale ?? 1;
  const catcher = useMemo(() => new MouseCatcher(), []);
  const [minX, setMinX] = useState(-1 * props.width / 2);
  const [minY, setMinY] = useState(-1 * props.height / 2);
  const initialWidth = props.width;
  const initialHeight = props.height;
  const scaledWidth = (initialWidth) / scale;
  const scaledHeight = (initialHeight) / scale;
  const [scrolling, setScrolling] = useState(false);
  const [scrollInitialX, setScrollInitialX] = useState(0);
  const [scrollInitialY, setScrollInitialY] = useState(0);
  const [scrollMinX, setScrollMinX] = useState(0);
  const [scrollMinY, setScrollMinY] = useState(0);
  const boundaries = {
    left: minX,
    top: minY,
    right: minX + scaledWidth,
    bottom: minY + scaledHeight,
  };
  const squareCreator = useMemo(() => new CanvasSquareCreator(1, boundaries, props.elements),
    [props.elements, scale]
  );
  const svgRef = createRef<SVGSVGElement>();
  const drawables = useMemo(() => {
    const squeres = squareCreator.getSqueres();
    return squeres;
  }, [
    scale,
  ]);


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
    if (scrollInitialX === minX && scrollInitialY === minY) {
      console.log('No scrolling happened, skipping ');
      return;
    }
    // setOffset({x: minX, y: minY});
    squareCreator.viewPortChanged(boundaries);

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

  const content = useMemo(() => {
    console.log('Redrawing', drawables.length);
    return (
      <CanvasContext.Provider value={{offsetX: 0, offsetY: 0, scale, debug, mouse: catcher}}>
        <rect key="dasd" x={'-100000%'} y={'-100000%'} width="200000%" height="200000%" fill="#222222" />
        {drawables}
      </CanvasContext.Provider>
    );
  }
  , [scale, debug, drawables]);

  return [
    <div key="div" style={{position: 'relative'}}>
      <svg
        style={{background: 'red'}}
        ref={svgRef}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width={initialWidth}
        height={initialHeight}
        cursor="pointer"
        onMouseDown={startScrolling}
        viewBox={`${minX},${minY},${scaledWidth},${scaledHeight}`}
      >{content}</svg>
    </div>,
  ];

}
