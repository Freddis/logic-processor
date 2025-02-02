import {FC, MouseEventHandler, useContext, useRef, useState} from 'react';
import {DraggableProps} from './types/DraggableProps';
import {Logger} from '../../../../utls/Logger/Logger';
import {Point} from '../../types/Point';
import {MouseCatcherListener} from '../../utils/MouseCatcher/types/MouseCatcherListener';
import {CanvasContext} from '../CanvasContext/CanvasContext';
import {ElementContext} from '../ElementContext/ElementContext';
import {DragableForeground} from './components/DragableForeground';
import {DraggableContext} from './components/DraggableContext';


export const Draggable: FC<DraggableProps> = (props) => {
  if (props.isHidden) {
    return null;
  }
  const margin = props.margin ?? 0;
  const context = useContext(CanvasContext);
  const elContext = useContext(ElementContext);
  const dContext = useContext(DraggableContext);
  const logger = new Logger(Draggable.name + ':' + props.id);
  const elementColor = 'yellow';
  const focusColor = 'red';
  const elementRef = useRef<SVGRectElement>(null);
  const [mouseOffsetX, setMouseOffsetX] = useState(0);
  const [mouseOffsetY, setMouseOffsetY] = useState(0);
  const [isFocused, setFocused] = useState(elContext.state.isFocused);
  const [isActive, setActive] = useState(props.isActive ?? elContext.state.isActive);
  const [dragElementInitialX, setDraggedElementInitialX] = useState(0);
  const [dragElementInitialY, setDraggedElementInitialY] = useState(0);
  const [isDragging, setDragging] = useState(false);
  const elementX = props.x;
  const elementY = props.y;
  const [color, setColor] = useState(elementColor);
  const [cursor, setCursor] = useState(isFocused ? 'poiner' : 'default');
  context.mouse.onMouseMove(props.id, (e) => processMouseMove(e));
  context.mouse.onMouseUp(props.id, (e) => stopDrag(e));


  const pageCoordsToCanvasCoords = (pageX: number, pageY: number): Point => {
    const scale = context.scale;
    const mouseDeltaX = (pageX - mouseOffsetX) / scale;
    const mouseDeltaY = (pageY - mouseOffsetY) / scale;
    const calculatedNewX = dragElementInitialX + mouseDeltaX;
    const calculatedNewY = dragElementInitialY + mouseDeltaY;
    const x = calculatedNewX;
    const y = calculatedNewY;
    return {x, y};
  };

  context.mouse.onDragOver(props.id, props.x, props.y, props.width, props.height, (e) => {
    if (props.onDragOver) {
      return props.onDragOver(e);
    }
    return true;
  });
  context.mouse.onDrop(props.id, props.x, props.y, props.width, props.height, (e) => {
    if (props.onDrop) {
      return props.onDrop(e);
    }
    return true;
  });
  context.mouse.onDragOut(props.id, props.x, props.y, props.width, props.height, (e) => {
    if (props.onDragOut) {
      return props.onDragOut(e);
    }
    return true;
  });

  const focus: MouseEventHandler<SVGRectElement> = () => {
    if (context.mouse.hasLock()) {
      return;
    }
    if (isFocused) {
      logger.debug('Already focused, skipping');
      return;
    }
    logger.debug('Focus');
    if (props.onFocus) {
      const result = props.onFocus({
        ...elContext.state,
        isFocused: true,
      });
      if (!result) {
        logger.debug('Focus stopped');
        return;
      }
    }
    setColor(focusColor);
    setCursor('pointer');
    setFocused(true);
    context.setFocusedElement(dContext?.parentId ?? props.id);
  };

  const unfocusHandler:MouseEventHandler<SVGRectElement> = () => {
    if (isDragging) {
      return;
    }
    unfocus();
  };

  const unfocus = () => {
    if (context.mouse.hasLock()) {
      return;
    }
    logger.debug('Focus out');
    if (props.onFocusOut) {

      const result = props.onFocusOut({
        ...elContext.state,
        isFocused: false,
      });
      if (!result) {
        logger.debug('Focus out stopped');
        return;
      }
    }
    setColor(elementColor);
    setCursor('default');
    setFocused(false);
    if (dContext) {
      return;
    }
    context.setFocusedElement(null);
  };

  const processStartDrag = (e: {pageX: number, pageY:number, preventDefault: () => void}) => {
    if (!context.mouse.lock(props.id)) {
      logger.debug("Couldn't lock element");
      return;
    }
    logger.debug('Start drag');
    e.preventDefault();
    const htmlCoords = elementRef.current?.getBoundingClientRect();
    if (!htmlCoords) {
      throw new Error('Refernce to element not found');
    }

    setDragging(true);
    setMouseOffsetX(e.pageX);
    setMouseOffsetY(e.pageY);
    setDraggedElementInitialX(elementX);
    setDraggedElementInitialY(elementY);
    if (props.onDragStart) {
      props.onDragStart({
        position: {x: elementX, y: elementY},
        setPayload: (x) => {
          context.mouse.setPayload(x);
        },
      });
    }
  };

  const startDrag: MouseEventHandler = (e) => {
    e.stopPropagation();
    processStartDrag(e);
  };

  const stopDrag: MouseCatcherListener = (e) => {
    if (!isDragging) {
      return;
    }
    const mouseDeltaX = e.pageX - mouseOffsetX;
    const mouseDeltaY = e.pageY - mouseOffsetY;
    if (mouseDeltaX === 0 && mouseDeltaY === 0) {
      setActive(!isActive);
      logger.debug('Active', {active: !isActive});
      context.setActive(props.id, !isActive);
      if (props.onActive) {
        props.onActive({
          ...elContext.state,
          isActive: !isActive,
        });
      }
    }
    logger.debug('Stop drag');
    context.mouse.unlock(props.id);
    setDragging(false);
    const element = elementRef.current?.getBoundingClientRect();
    if (!element) {
      throw new Error('Refernce to element not found');
    }
    if (props.onDragStop) {
      const position = pageCoordsToCanvasCoords(e.pageX, e.pageY);
      props.onDragStop(position.x, position.y);
      context.mouse.setPayload(null);
    }
    const inHorizontally = e.pageX > element.left && e.pageX < element.right;
    const inVertically = e.pageY > element.top && e.pageY < element.bottom;
    const inside = inHorizontally && inVertically;
    if (!inside) {
      unfocus();
    }
  };
  const processMouseMove = (e: {pageX: number, pageY: number, canvas: SVGSVGElement}) => {
    if (isDragging) {
      const element = elementRef.current?.getBoundingClientRect();
      if (!element) {
        throw new Error('Refernces to element not found');
      }
      const newCoords = pageCoordsToCanvasCoords(e.pageX, e.pageY);
      // todo: decide if we need this calculation
      // const ltr = elementX < calculatedNewX;
      // const utd = elementY < calculatedNewY;
      // if (ltr) {
      //   const newRight = dragElementInitialPageX / scale + mouseDeltaX + element.width / scale;
      //   newX = newRight >= svg.right / scale ? (svg.width - element.width + context.offsetX) / scale : calculatedNewX;
      // } else {
      //   const newLeft = dragElementInitialPageX / scale + mouseDeltaX;
      //   newX = newLeft <= svg.left / scale ? 0 + context.offsetX : calculatedNewX;
      // }
      // if (utd) {
      //   const newBottom = dragElementInitialPageY / scale + mouseDeltaY + element.height / scale;
      //   newY = newBottom >= svg.bottom / scale ? (svg.height - element.height + context.offsetY) / scale : calculatedNewY;
      // } else {
      //   const newTop = dragElementInitialPageY / scale + mouseDeltaY;
      //   newY = newTop <= svg.top / scale ? 0 + context.offsetY : calculatedNewY;
      // }
      // setOffsetX(newCoords.x - dragElementInitialX);
      // setOffsetY(newCoords.y - dragElementInitialY);
      if (props.onDrag) {
        props.onDrag(newCoords.x, newCoords.y);
      }
    }
  };
  const children = Array.isArray(props.children) ? props.children : [props.children];
  return <DraggableContext.Provider value={{parentId: props.id}}>
    <g id={props.id} cursor={cursor}>
      {children.filter((x) => x.type !== DragableForeground)}
      <g onMouseLeave={unfocusHandler}>
      <rect
        key="key"
        ref={elementRef}
        onMouseDown={startDrag}
        cursor={cursor}
        onMouseOver={focus}
        x={props.x - margin}
        y={props.y - margin}
        fill={color}
        opacity={context.debug ? 0.4 : 0}
        width={props.width + margin * 2}
        height={props.height + margin * 2}/>
      {children.filter((x) => x.type === DragableForeground)}
      </g>
    </g>
  </DraggableContext.Provider>;
};
