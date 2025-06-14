import {useState, SVGLineElementAttributes} from 'react';
import {PointTargetDto} from '../../model/PointTargetDto';
import {Draggable} from '../Canvas/components/Draggable/Draggable';
import {CanvasFocusEventHandler} from '../Canvas/components/Draggable/types/CanvasFocusEventHandler';
import {CanvasDragStartEvent, DraggableProps} from '../Canvas/components/Draggable/types/DraggableProps';
import {Point} from '../Canvas/types/Point';
import {ConnectorProps} from './types/ConnectorProps';

export function Connector(props: ConnectorProps) {
  const radius = 7;
  const [start, setStart] = useState(props.connector.start.getPosition());
  const [target, setTarget] = useState(props.connector.end.getPosition());
  const [dragType, setDragType] = useState<'start'| 'end'>('end');
  const [initialDragTarget, setInitialDragTarget] = useState<Point | null>(null);
  const [initialDragStart, setInitialDragStart] = useState<Point | null>(null);
  const [focusedState, setFocused] = useState<boolean | null>(null);
  const focused = focusedState !== null ? focusedState : props.isFocused;
  const focusColor = 'red';
  const propColor = props.color ?? 'white';
  const color = focused ? focusColor : propColor;
  if (props.isHidden) {
    return <></>;
  }

  const width = radius * 2;
  const height = width;
  const onFocus: CanvasFocusEventHandler = (state) => {
    setFocused(true);
    if (props.onFocus) {
      props.onFocus(state);
    }
    return true;
  };

  const onFocusOut: CanvasFocusEventHandler = (state) => {
    setFocused(false);
    if (props.onFocusOut) {
      props.onFocusOut(state);
    }
    return true;
  };

  const onDrag = (x: number, y: number) => {
    const pos = {x: x + radius, y: y + radius};
    if (dragType === 'end') {
      setTarget(pos);
    } else {
      setStart(pos);
    }
    if (props.onDrag) {
      props.onDrag();
    }
  };

  const onDragStop = (x: number, y: number) => {
    // todo: rework drop detection it in favor of event props
    const initialTarget = dragType === 'end' ? initialDragTarget : initialDragStart;
    const targetPosition = props.connector.end?.getPosition() ?? null;
    const startPosition = props.connector.start.getPosition();
    const currentTarget = dragType === 'end' ? targetPosition : startPosition;
    const wasDropped = initialTarget?.x !== currentTarget?.x || initialTarget?.y !== currentTarget?.y;
    if (!wasDropped) {
      const target = {x: x + radius, y: y + radius};
      if (dragType === 'end') {
        setTarget(target);
        props.connector.end.setTarget(new PointTargetDto(target));
      } else {
        setStart(start);
        props.connector.start.setTarget(new PointTargetDto(start));
      }
    } else {
      if (dragType === 'end') {
        setTarget(props.connector.end.getPosition());
      } else {
        setStart(props.connector.start.getPosition());
      }
    }
    setInitialDragStart(null);
    setInitialDragTarget(null);

    if (props.onDragStop) {
      props.onDragStop();
    }
  };

  const onDragStart = (e: CanvasDragStartEvent, type: 'start' | 'end' = 'end') => {
    const pos: Point = {x: e.position.x + radius, y: e.position.y + radius};
    setDragType(type);
    if (type === 'end') {
      const payload = props.connector.end ?? new PointTargetDto({x: 0, y: 0});
      e.setPayload(payload);
      setInitialDragTarget(props.connector.end?.getPosition() ?? null);
      setTarget(pos);
    } else {
      e.setPayload(props.connector.start);
      setInitialDragStart(props.connector.start.getPosition());
      setStart(pos);
    }
    return true;
  };

  const lineHidden = props.isHidden || target === null;
  const lineProps: SVGLineElementAttributes<SVGLineElement> = {
    x1: start.x,
    y1: start.y,
    x2: target?.x ?? 0,
    y2: target?.y ?? 0,
    stroke: color,
    strokeWidth: 3,
    display: lineHidden ? 'none' : 'initial',
  };
  const draggableProps: Omit<DraggableProps, 'children'> = {
    id: props.connector.id.toString(),
    x: start.x - radius,
    y: start.y - radius,
    width,
    height,
    onDrag,
    onDragStart: (e) => {
      const type = props.connector.end.getPosition() ? 'start' : 'end';
      return onDragStart(e, type);
    },
    onFocus,
    onDragStop,
    onFocusOut,
  };


  const endCircle = (() => {
    const end = props.connector.end.getPosition();
    if (!end) {
      return <></>;
    }
    const dProps: Omit<DraggableProps, 'children'> = {
      ...draggableProps,
      x: end.x - radius,
      y: end.y - radius,
      id: draggableProps.id + '2',
      onDragStart: (e) => {
        return onDragStart(e, 'end');
      },
    };
    const displayCircle = dragType !== 'end' || initialDragTarget === null;
    const circle = displayCircle ? <circle cursor={'pointer'} cx={end.x} cy={end.y} r={radius} fill={color} /> : <></>;
    return <Draggable key={'drag-end'} {...dProps }>{circle}</Draggable>;
  })();

  const startCircle = (() => {
    const displayCircle = dragType !== 'start' || initialDragStart === null;
    const circle = displayCircle ? <circle cursor={'pointer'} cx={start.x} cy={start.y} r={radius} fill={color}/> : <></>;
    return <Draggable key={'drag-start'} {...draggableProps}>{circle}</Draggable>;
  })();

  return (
    <>
      <line {...lineProps}/>
      {startCircle}
      {endCircle}
    </>
  );
}

