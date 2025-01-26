import {useState, MouseEventHandler, SVGLineElementAttributes} from 'react';
import {Draggable} from '../Draggable/Draggable';
import {ConnectorProps} from './types/ConnectorProps';
import {CanvasFocusEventHandler} from '../Draggable/types/CanvasFocusEventHandler';

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
  const onFocus: CanvasFocusEventHandler = (state) => {
    setFocused(true);
    if (props.onFocus) {
      props.onFocus(state);
    }
  };

  const onFocusOut: CanvasFocusEventHandler = (state) => {
    setFocused(false);
    if (props.onFocusOut) {
      props.onFocusOut(state);
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

  const lineHidden = props.isHidden || target === null;
  const lineProps: SVGLineElementAttributes<SVGLineElement> = {
    x1: x + radius,
    y1: y + radius,
    x2: target?.x ?? 0,
    y2: target?.y ?? 0,
    stroke: color,
    strokeWidth: 3,
    display: lineHidden ? 'none' : 'initial',
  };
  return [
    <Draggable key={'drag'} {...{id, x, y, width, height, onDrag, onDragStart, onFocus, onDragStop, onFocusOut}}>
      <line {...lineProps}/>
      <circle onMouseDown={noPropagation} cursor={'pointer'} cx={x + radius} cy={y + radius} r={radius} fill={color}/>
    </Draggable>,
  ];
}

