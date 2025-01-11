import {useRef, useState, MouseEventHandler, CSSProperties} from 'react';

export function SampleCanvas() {
  const circleColor = 'blue';
  const focusColor = 'red';
  const circleRef = useRef<SVGCircleElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [mouseOffsetX, setMouseOffsetX] = useState(0);
  const [mouseOffsetY, setMouseOffsetY] = useState(0);
  const [dragElementInitialPageX, setDraggedElementInitialPageX] = useState(0);
  const [dragElementInitialPageY, setDraggedElementInitialPageY] = useState(0);
  const [dragElementInitialX, setDraggedElementInitialX] = useState(0);
  const [dragElementInitialY, setDraggedElementInitialY] = useState(0);
  const [isDragging, setDragging] = useState(false);
  const [circleX, setCircleX] = useState(150);
  const [circleY, setCircleY] = useState(100);
  const [color, setColor] = useState(circleColor);
  const [cursor, setCursor] = useState('default');
  const focus = () => {
    setColor(focusColor);
    setCursor('pointer');
  };
  const unfocus = () => {
    setColor(circleColor);
    setCursor('default');
  };

  const startDrag: MouseEventHandler = (e) => {
    console.log('Start drag');
    e.preventDefault();
    const element = circleRef.current?.getBoundingClientRect();
    if (!element) {
      throw new Error('Refernces to element and canvas not found');
    }
    setDragging(true);
    setMouseOffsetX(e.pageX);
    setMouseOffsetY(e.pageY);
    setDraggedElementInitialPageX(element.x);
    setDraggedElementInitialPageY(element.y);
    setDraggedElementInitialX(circleX);
    setDraggedElementInitialY(circleY);
    processMouseMove(e);
  };

  const stopDrag: MouseEventHandler = (e) => {
    console.log('Stop drag');
    setDragging(false);
    const element = circleRef.current?.getBoundingClientRect();
    if (!element) {
      throw new Error('Refernces to element and canvas not found');
    }
    const inHorizontally = e.pageX > element.left && e.pageX < element.right;
    const inVertically = e.pageY > element.top && e.pageY < element.bottom;
    const inside = inHorizontally && inVertically;
    if (!inside) {
      unfocus();
    }
  };

  const processMouseMove: MouseEventHandler = (e) => {
    if (isDragging) {
      focus();
      const element = circleRef.current?.getBoundingClientRect();
      const svg = svgRef.current?.getBoundingClientRect();
      if (!element || !svg) {
        throw new Error('Refernces to element and canvas not found');
      }
      const mouseDeltaX = e.pageX - mouseOffsetX;
      const mouseDeltaY = e.pageY - mouseOffsetY;
      const calculatedNewX = dragElementInitialX + mouseDeltaX;
      const calculatedNewY = dragElementInitialY + mouseDeltaY;
      const ltr = circleX < calculatedNewX;
      const utd = circleY < calculatedNewY;
      let newX = calculatedNewX;
      if (ltr) {
        const newRight = dragElementInitialPageX + mouseDeltaX + element.width;
        newX = newRight >= svg.right ? svg.width - element.width / 2 : calculatedNewX;
      } else {
        const newLeft = dragElementInitialPageX + mouseDeltaX;
        newX = newLeft <= svg.left ? 0 + element.width / 2 : calculatedNewX;
      }
      let newY = calculatedNewY;
      if (utd) {
        const newBottom = dragElementInitialPageY + mouseDeltaY + element.height;
        newY = newBottom >= svg.bottom ? svg.height - element.height / 2 : calculatedNewY;
      } else {
        const newTop = dragElementInitialPageY + mouseDeltaY;
        newY = newTop <= svg.top ? 0 + element.height / 2 : calculatedNewY;
      }
      setCircleX(newX);
      setCircleY(newY);
    }
  };

  const svgStyle: CSSProperties = {
    width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
  return (
    <div onMouseUp={stopDrag} style={svgStyle} onMouseMove={processMouseMove}>
      <svg ref={svgRef} version="1.1" width="500" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#dddddd" />
        <circle
          ref={circleRef}
          onMouseUp={stopDrag}
          onMouseDown={startDrag}
          cursor={cursor}
          onMouseOver={focus}
          onMouseLeave={unfocus}
          cx={circleX}
          cy={circleY}
          r="40"
          fill={color}
        />
        <text
          cursor={cursor}
          onMouseUp={stopDrag}
          onMouseDown={startDrag}
          onMouseOver={focus}
          onMouseLeave={unfocus}
          x={circleX}
          y={circleY + 6}
          fontSize="14"
          textAnchor="middle"
          fill="white"
        >Element</text>
      </svg>
    </div>
  );
}
