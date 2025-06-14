import {useContext, useState} from 'react';
import {ElementContext} from '../Canvas/components/ElementContext/ElementContext';
import {Draggable} from '../Canvas/components/Draggable/Draggable';

export function Circle(props: {
  label: string,
  x: number,
  y: number,
  id: string,
}) {
  const [x, setX] = useState(props.x);
  const [y, setY] = useState(props.y);
  const context = useContext(ElementContext);
  const color = context.state.isFocused ? 'lightgreen' : 'green';
  const width = 80;
  const circle = <circle fill={color} cx={x + width / 2} cy={y + width / 2} r={width / 2}></circle>;
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
  );
}

