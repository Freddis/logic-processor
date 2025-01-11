import {useRef, useState, MouseEventHandler, CSSProperties} from 'react';

export function SampleCanvas() {
  const circleColor = 'blue';
  const focusColor = 'red';
  const circleRef = useRef<SVGCircleElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [mouseOffsetX, setMouseOffsetX] = useState(0);
  const [mouseOffsetY, setMouseOffsetY] = useState(0);
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
    e.preventDefault();
    setDragging(true);
    setMouseOffsetX(e.pageX);
    setMouseOffsetY(e.pageY);
    setDraggedElementInitialX(circleX);
    setDraggedElementInitialY(circleY);
    processMouseMove(e);
  };

  const stopDrag: MouseEventHandler = () => {
    console.log('Stop drag');
    setDragging(false);
    unfocus();
  };

  const processMouseMove: MouseEventHandler = (e) => {
    // console.log('mouse, x: ',e.pageX,', y: ',e.pageY)
    if (isDragging) {
      focus();
      const element = circleRef.current?.getBoundingClientRect();
      const svg = svgRef.current?.getBoundingClientRect();
      if (!element || !svg) {
        throw new Error('Refernces to element and canvas not found');
      }
      const newX = dragElementInitialX + e.pageX - mouseOffsetX;
      const newY = dragElementInitialY + e.pageY - mouseOffsetY;
      const ltr = circleX < newX;
      const utd = circleY < newY;
      const rightMovementAllowed = ltr && element.right < svg.right;
      const leftMovementAllowed = !ltr && element.left > svg.left;
      const horzontalMovementAllowed = rightMovementAllowed || leftMovementAllowed;
      const downMovementAllowed = utd && element.bottom < svg.bottom;
      const upMovementAllowed = !utd && element.top > svg.top;
      const verticalMovementAllowed = upMovementAllowed || downMovementAllowed;
      if (horzontalMovementAllowed) {
        setCircleX(newX);
      }
      if (verticalMovementAllowed) {
        setCircleY(newY);
      }
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
