import {FC, MouseEventHandler, useContext, useRef, useState} from 'react';
import {DraggableProps} from './types/DraggableProps';
import {CanvasContext} from '../Canvas/CanvasContext';

export const Draggable: FC<DraggableProps> = (props) => {
  const elementColor = 'yellow';
  const focusColor = 'red';
  const elementRef = useRef<SVGRectElement>(null);
  const [mouseOffsetX, setMouseOffsetX] = useState(0);
  const [mouseOffsetY, setMouseOffsetY] = useState(0);
  const [dragElementInitialPageX, setDraggedElementInitialPageX] = useState(0);
  const [dragElementInitialPageY, setDraggedElementInitialPageY] = useState(0);
  const [dragElementInitialX, setDraggedElementInitialX] = useState(0);
  const [dragElementInitialY, setDraggedElementInitialY] = useState(0);
  const [isDragging, setDragging] = useState(false);
  const [elementX, setElementX] = useState(props.x);
  const [elementY, setElementY] = useState(props.y);
  const [color, setColor] = useState(elementColor);
  const [cursor, setCursor] = useState('default');
  const context = useContext(CanvasContext);
  const focus = () => {
    setColor(focusColor);
    setCursor('pointer');
    if (props.onFocus) {
      props.onFocus();
    }
  };
  const unfocus = () => {
    setColor(elementColor);
    setCursor('default');
    if (props.onFocusOut) {
      props.onFocusOut();
    }
  };
  context.mouse.onMouseMove(props.id, (e) => processMouseMove(e));
  const processStartDrag = (e: {pageX: number, pageY:number, preventDefault: () => void}) => {
    console.log('Start drag');
    e.preventDefault();
    const element = elementRef.current?.getBoundingClientRect();
    if (!element) {
      throw new Error('Refernce to element not found');
    }
    setDragging(true);
    setMouseOffsetX(e.pageX);
    setMouseOffsetY(e.pageY);
    setDraggedElementInitialPageX(element.x);
    setDraggedElementInitialPageY(element.y);
    setDraggedElementInitialX(elementX);
    setDraggedElementInitialY(elementY);
  };

  const startDrag: MouseEventHandler = (e) => {
    processStartDrag(e);
  };

  const stopDrag: MouseEventHandler = (e) => {
    console.log('Stop drag');
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
      const mouseDeltaX = (e.pageX - mouseOffsetX) / context.scale;
      const mouseDeltaY = (e.pageY - mouseOffsetY) / context.scale;
      const calculatedNewX = dragElementInitialX + mouseDeltaX;
      const calculatedNewY = dragElementInitialY + mouseDeltaY;
      const ltr = elementX < calculatedNewX;
      const utd = elementY < calculatedNewY;
      let newX = calculatedNewX;
      if (ltr) {
        const newRight = dragElementInitialPageX / context.scale + mouseDeltaX + element.width / context.scale;
        newX = newRight >= svg.right / context.scale ? (svg.width - element.width) / context.scale : calculatedNewX;
      } else {
        const newLeft = dragElementInitialPageX / context.scale + mouseDeltaX;
        newX = newLeft <= svg.left / context.scale ? 0 : calculatedNewX;
      }
      let newY = calculatedNewY;
      if (utd) {
        const newBottom = dragElementInitialPageY / context.scale + mouseDeltaY + element.height / context.scale;
        newY = newBottom >= svg.bottom / context.scale ? (svg.height - element.height) / context.scale : calculatedNewY;
      } else {
        const newTop = dragElementInitialPageY / context.scale + mouseDeltaY;
        newY = newTop <= svg.top / context.scale ? 0 : calculatedNewY;
      }
      setElementX(newX);
      setElementY(newY);
      if (props.onDrag) {
        props.onDrag(newX, newY);
      }
    }
  };

  return [
    props.children,
    <rect
      ref={elementRef}
      onMouseUp={stopDrag}
      onMouseDown={startDrag}
      cursor={cursor}
      onMouseOver={focus}
      onMouseLeave={unfocus}
      x={elementX}
      y={elementY}
    fill={color}
    opacity={context.debug ? 0.4 : 0}
    width={props.width}
    height={props.height}></rect>,
  ];
};
