import {useState} from 'react';
import {Draggable} from '../Draggable/Draggable';

export function Connector(props: {
  x: number,
  y: number,
  isHidden: boolean,
  color: string,
  id: string,
  onFocusOut?: () => void
  onFocus?: () => void
  onDrag?: () => void
}) {
  const radius = 7;
  const [offset, setOffset] = useState({x: 0, y: 0});
  const [focused, setFocused] = useState(false);
  if (props.isHidden) {
    return <></>;
  }
  const id = props.id;
  const x = offset.x + props.x - radius;
  const y = offset.y + props.y - radius;
  const width = radius * 2;
  const height = width;
  const focusColor = 'red';
  const color = focused ? focusColor : props.color;
  const onFocus = () => {
    setFocused(true);
    if (props.onFocus) {
      props.onFocus();
    }
  };

  const onFocusOut = () => {
    setFocused(false);
    if (props.onFocusOut) {
      props.onFocusOut();
    }
  };
  const onDrag = (x: number, y: number) => {
    setOffset({x: x - props.x + radius, y: y - props.y + radius});
  };
  return (
  <Draggable {...{id, x, y, width, height, onDrag, onFocus, onFocusOut}}>
    <circle onMouseDown={(e) => e.stopPropagation()} cursor={'pointer'} cx={x + radius} cy={y + radius} r={radius} fill={color}/>
  </Draggable>
  );
}

