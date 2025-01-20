import {useState, MouseEventHandler, SVGLineElementAttributes} from 'react';
import {Draggable} from '../Draggable/Draggable';
import {ConnectorProps} from './types/ConnectorProps';

export function Connector(props: ConnectorProps) {
  const radius = 7;
  const [target, setTarget] = useState < {x: number, y: number} | null>(null);
  const [focused, setFocused] = useState(false);
  if (props.isHidden) {
    return <></>;
  }
  const id = props.id;
  const x = props.x - radius;
  const y = props.y - radius;
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
  const noPropagation: MouseEventHandler = (e) => {
    e.stopPropagation();
  };
  const onDrag = (x: number, y: number) => {
    setTarget({x: x + radius, y: y + radius});
    if (props.onDrag) {
      props.onDrag();
    }
  };

  const onDragStop = (x: number, y: number) => {
    setTarget({x: x + radius, y: y + radius});
    if (props.onDragStop) {
      props.onDragStop();
    }
  };

  const onDragStart = (x:number, y:number) => {
    setTarget({x: x - 2, y: y - 2});
  };

  const lineProps: SVGLineElementAttributes<SVGLineElement> = {
    onMouseOver: onFocus,
    // onMouseOut: onFocusOut,
    x1: x + radius,
    y1: y + radius,
    x2: target?.x ?? 0,
    y2: target?.y ?? 0,
    stroke: color,
    strokeWidth: 3,
    opacity: target !== null ? 1 : 0,
  };
  return [
    <Draggable key={'drag'} {...{id, x, y, width, height, onDrag, onDragStart, onFocus, onDragStop, onFocusOut}}>
      <line visibility={props.isHidden ? 'none' : 'visible'} {...lineProps}/>
      <circle onMouseDown={noPropagation} cursor={'pointer'} cx={x + radius} cy={y + radius} r={radius} fill={color}/>
    </Draggable>,
  ];
}

