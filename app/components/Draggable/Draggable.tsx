import {createContext, FC, MouseEventHandler, useContext, useRef, useState} from 'react';
import {DraggableProps} from './types/DraggableProps';
import {CanvasContext} from '../Canvas/CanvasContext';
import {MouseCatcherListener} from '../../utls/MouseCatcher/types/MouseCatcherListener';

const DraggableContext = createContext({
  xOffset: 0,
  yOffset: 0,
});

export const Draggable: FC<DraggableProps> = (props) => {
  if (props.isHidden) {
    return null;
  }
  const dContext = useContext(DraggableContext);
  const context = useContext(CanvasContext);
  const elementColor = 'yellow';
  const focusColor = 'red';
  const elementRef = useRef<SVGRectElement>(null);
  const [mouseOffsetX, setMouseOffsetX] = useState(0);
  const [mouseOffsetY, setMouseOffsetY] = useState(0);
  // const [dragElementInitialPageX, setDraggedElementInitialPageX] = useState(0);
  // const [dragElementInitialPageY, setDraggedElementInitialPageY] = useState(0);
  const [dragElementInitialX, setDraggedElementInitialX] = useState(0);
  const [dragElementInitialY, setDraggedElementInitialY] = useState(0);
  const [isDragging, setDragging] = useState(false);
  const elementX = props.x;
  const elementY = props.y;
  const [color, setColor] = useState(elementColor);
  const [cursor, setCursor] = useState('default');
  const [xOffset, setOffsetX] = useState(dragElementInitialX);
  const [yOffset, setOffsetY] = useState(dragElementInitialY);
  context.mouse.onMouseMove(props.id, (e) => processMouseMove(e));
  context.mouse.onMouseUp(props.id, (e) => stopDrag(e));

  const focus = () => {
    setColor(focusColor);
    setCursor('pointer');
    if (props.onFocus) {
      props.onFocus();
    }
  };
  const unfocusHandler = () => {
    if (isDragging) {
      return;
    }
    unfocus();
  };
  const unfocus = () => {
    setColor(elementColor);
    setCursor('default');
    if (props.onFocusOut) {
      props.onFocusOut();
    }
  };
  const processStartDrag = (e: {pageX: number, pageY:number, preventDefault: () => void}) => {
    if (!context.mouse.lock(props.id)) {
      console.log("Couldn't lock element");
      return;
    }
    console.log('Start drag');
    e.preventDefault();
    const htmlCoords = elementRef.current?.getBoundingClientRect();
    if (!htmlCoords) {
      throw new Error('Refernce to element not found');
    }
    setDragging(true);
    setMouseOffsetX(e.pageX);
    setMouseOffsetY(e.pageY);
    // setDraggedElementInitialPageX(htmlCoords.x);
    // setDraggedElementInitialPageY(htmlCoords.y);
    setDraggedElementInitialX(elementX);
    setDraggedElementInitialY(elementY);
  };

  const startDrag: MouseEventHandler = (e) => {
    processStartDrag(e);
  };

  const stopDrag: MouseCatcherListener = (e) => {
    if (!isDragging) {
      return;
    }
    if (props.onClick) {
      const mouseDeltaX = e.pageX - mouseOffsetX;
      const mouseDeltaY = e.pageY - mouseOffsetY;
      if (mouseDeltaX === 0 && mouseDeltaY === 0) {
        props.onClick(e);
      }
    }
    console.log('Stop drag');
    context.mouse.unlock(props.id);
    setDragging(false);
    const element = elementRef.current?.getBoundingClientRect();
    if (!element) {
      throw new Error('Refernce to element not found');
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
      const svg = e.canvas.getBoundingClientRect();
      if (!element || !svg) {
        throw new Error('Refernces to element and canvas not found');
      }
      const scale = context.scale;
      const mouseDeltaX = (e.pageX - mouseOffsetX) / scale;
      const mouseDeltaY = (e.pageY - mouseOffsetY) / scale;
      const calculatedNewX = dragElementInitialX + mouseDeltaX;
      const calculatedNewY = dragElementInitialY + mouseDeltaY;
      const newX = calculatedNewX;
      const newY = calculatedNewY;
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
      setOffsetX(newX - dragElementInitialX);
      setOffsetY(newY - dragElementInitialY);
      if (props.onDrag) {
        props.onDrag(newX, newY);
      }
    }
  };

  console.log(props.id, dContext, xOffset, yOffset, dragElementInitialX, dragElementInitialY, props.x, props.y);
  return <DraggableContext.Provider value={{xOffset, yOffset}}>
      {props.children.filter((x) => x.type.name !== 'Draggable')},
      <rect
      key="key"
      ref={elementRef}
      onMouseDown={startDrag}
      cursor={cursor}
      onMouseOver={focus}
      onMouseLeave={unfocusHandler}
      x={props.x}
      y={props.y}
      fill={color}
      opacity={context.debug ? 0.4 : 0}
      width={props.width}
      height={props.height}/>
      {props.children.filter((x) => x.type.name === 'Draggable')},
  </DraggableContext.Provider>;
};
