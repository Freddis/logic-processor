import {createRef, FC, JSX, MouseEventHandler, SVGProps, useContext, useEffect, useMemo, useState} from 'react';
import {CanvasProps} from './types/CanvasProps';
import {Logger} from '../../utls/Logger/Logger';
import {CanvasInternalContext} from './components/CanvasInternalContext/CanvasInternalContext';
import {MouseCatcher} from './utils/MouseCatcher/MouseCatcher';
import {CanvasContext} from './components/CanvasContext/CanvasContext';
import {CanvasComponentState} from './types/CanvasComponentState';
import {PlaneContext} from './components/PlaneContext/PlaneContext';
import {CanvasElementStateManager} from './utils/CanvasElementStateManager/CanvasElementStateManager';
import {StatefulCanvasElement} from './components/StatefulCanvasElement/StatefulCanvasElement';
import {StatefulCanvasElementProps} from './components/StatefulCanvasElement/types/StatefulCanvasElementProps';
import {CanvasSquareGenerator} from './utils/CanvasSquareGenerator/CanvasSquareGenerator';
import {RectCoords} from './types/RectCoords';


export const Canvas: FC<CanvasProps> = (props) => {
  const context = useContext(CanvasInternalContext);
  const logger = new Logger(Canvas.name);
  const debug = context.debug;
  const scale = context.scale;
  const [minX, setMinX] = useState(-1 * context.size.width / 2);
  const [minY, setMinY] = useState(-1 * context.size.height / 2);
  const [updateCounter, setUpdateCounter] = useState(0);
  const catcher = useMemo(() => new MouseCatcher(minX, minY, scale), [scale, updateCounter]);
  const stateManager = useMemo(() => new CanvasElementStateManager(), []);
  const initialWidth = context.size.width;
  const initialHeight = context.size.height;
  const scaledWidth = (initialWidth) / scale;
  const scaledHeight = (initialHeight) / scale;
  const [scrolling, setScrolling] = useState(false);
  const [scrollInitialX, setScrollInitialX] = useState(0);
  const [scrollInitialY, setScrollInitialY] = useState(0);
  const [scrollMinX, setScrollMinX] = useState(0);
  const [scrollMinY, setScrollMinY] = useState(0);
  const [focusedElementId] = useState<string | null>(null);
  const boundaries: RectCoords = {
    left: minX,
    top: minY,
    bottom: minY + scaledHeight,
    right: minX + scaledWidth,
  };
  const squareCreator = useMemo(() => new CanvasSquareGenerator(boundaries, true), []);
  const setFocusedElement = (id: string| null) => {
    stateManager.resetLayers({isFocused: false});
    if (!id) {
      return;
    }
    stateManager.update(id, {onFrontLayer: true, isFocused: true});
  };
  const [activeElements, setActiveElements] = useState<Record<string, boolean>>({});
  const setActive = (id: string, value: boolean) => {
    const newValue = {...activeElements, [id]: value};
    setActiveElements(newValue);
    stateManager.update(id, {isActive: value});
    const activeElementsNumber = Object.values(newValue).filter((x) => x === true).length;
    context.setActiveElements(activeElementsNumber);
  };
  const svgRef = createRef<SVGSVGElement>();
  useEffect(() => {
    if (!svgRef.current) {
      throw new Error('Canvas ref not found, make sure canvas is on screen');
    }
    const rect = svgRef.current.getBoundingClientRect();
    catcher.setCanvasBoundaries(rect);
    const moveListener = (e: MouseEvent) => {
      if (!svgRef.current) {
        return;
      }
      catcher.captureLegacyMouseMove(e, svgRef.current);
    };
    const upListener = (e: MouseEvent) => {
      if (!svgRef.current) {
        return;
      }
      catcher.captureLegacyMouseUp(e, svgRef.current);
    };
    window.addEventListener('mousemove', moveListener);
    window.addEventListener('mouseup', upListener);
    return () => {
      window.removeEventListener('mousemove', moveListener);
      window.removeEventListener('mouseup', upListener);
    };
  });
  const startScrolling: MouseEventHandler = (e) => {
    if (!catcher.lock('canvas')) {
      return;
    }
    logger.debug('Start scrolling');
    setScrolling(true);
    setScrollInitialX(e.pageX);
    setScrollInitialY(e.pageY);
    setScrollMinX(minX);
    setScrollMinY(minY);
  };
  const stopScrolling = () => {
    if (!catcher.hasSpecificLock('canvas')) {
      return;
    }
    catcher.unlock('canvas');
    logger.debug('Stop scrolling');
    setScrolling(false);
    if (scrollInitialX === minX && scrollInitialY === minY) {
      logger.debug('No scrolling happened, skipping ');
      return;
    }
    setUpdateCounter(updateCounter + 1);
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
  const svgProps: SVGProps<SVGSVGElement> = {
    style: {background: 'red'},
    ref: svgRef,
    version: '1.1',
    xmlns: 'http://www.w3.org/2000/svg',
    width: initialWidth,
    height: initialHeight,
    cursor: 'pointer',
    onMouseDown: startScrolling,
    viewBox: `${minX},${minY},${scaledWidth},${scaledHeight}`,
  };
  const defaultContext = useContext(CanvasContext);
  const elementData = useMemo(() => {
    logger.debug('Rendering components');
    const childrenArr = Array.isArray(props.children) ? props.children : [props.children];
    const result: JSX.Element[] = [];
    for (const element of childrenArr) {
      const isFocused = element.props.id === focusedElementId;
      const isActive = !!activeElements[element.props.id];
      const state: CanvasComponentState = {
        isFocused: isFocused,
        isDragged: false,
        isActive: isActive,
        onFrontLayer: isFocused,
      };
      const props: Omit<StatefulCanvasElementProps, 'children'> = {
        id: element.props.id,
        x: element.props.x,
        y: element.props.y,
        manager: stateManager,
        elementState: state,
      };
      if (!props.id) {
        // todo: remove this after sorting squares
        continue;
      }
      const jsx = <StatefulCanvasElement {...props} key={props.id}>{element}</StatefulCanvasElement>;
      result.push(jsx);
    }
    return result;
  }, [scale]);

  const canvasLayers = useMemo(() => {
    logger.debug('Rendering planes');
    const frontplane = squareCreator.getSqueres(elementData);
    const elements = [
      <rect key="bg" x={'-100000%'} y={'-100000%'} width="200000%" height="200000%" fill="#222222" />,
      <g id="middle" key="middle">
        {frontplane}
      </g>,
      <g id="front" key="front">
        <PlaneContext value={{frontLayer: true}}>
        {elementData}
        </PlaneContext>
      </g>,
    ];
    return elements;
  }, []);

  const canvasWithContext = useMemo(() => {
    logger.debug('Rendering context');
    return <CanvasContext.Provider value={{...defaultContext, setFocusedElement, setActive, scale, debug, mouse: catcher}}>
      {canvasLayers}
    </CanvasContext.Provider>;
  }, [scale, updateCounter]);

  return (
  <div key="div" style={{position: 'relative'}}>
    <svg {...svgProps} >{canvasWithContext}</svg>
  </div>
  );
};
