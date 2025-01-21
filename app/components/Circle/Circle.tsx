import {JSX, useState, useContext} from 'react';
import {CanvasContext} from '../Canvas/CanvasContext';
import {Draggable} from '../Draggable/Draggable';

function createCircle(
  x: number,
  y: number,
  width: number
): JSX.Element & {type: 'circle', props: { cx: number, cy: number, r: number}} {
  return <circle cx={x + width / 2} cy={y + width / 2} r={width / 2}></circle>;
}
export function Circle(props: {
  label: string,
  x: number,
  y: number,
  id: string,
}) {
  const context = useContext(CanvasContext);
  const [x, setX] = useState(props.x * context.scale);
  const [y, setY] = useState(props.y * context.scale);
  const width = 80;
  const circle = createCircle(x, y, width);
  const label = <text
    fontFamily="arial"
    x={x + width / 2}
    y={y + width / 2}
    fontSize="14"
    width={width}
    dominantBaseline={'middle'}
    textAnchor="middle"
    fill="white"
  >{props.label}</text>;

  const updatePosition = (x:number, y: number) => {
    setX(x);
    setY(y);
  };
  return (
    <g fill="green">
      <Draggable
        id={props.id}
        x={x}
        y={y}
        width={width}
        height={width}
        onDrag={updatePosition}
      >
        {circle}
        {label}
      </Draggable>
    </g>
  );
}

