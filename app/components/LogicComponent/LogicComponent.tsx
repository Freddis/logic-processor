import {FC, useContext, useState} from 'react';
import {ConnectorProps} from '../Connector/types/ConnectorProps';
import {LogicComponentProps} from './types/LogicComponentProps ';
import {ElementContext} from '../Canvas/components/ElementContext/ElementContext';
import {JointDto} from '../../model/JointDto';
import {DragableForeground} from '../Canvas/components/Draggable/components/DragableForeground';
import {Draggable} from '../Canvas/components/Draggable/Draggable';
import {CanvasFocusEventHandler} from '../Canvas/components/Draggable/types/CanvasFocusEventHandler';
import {
  CanvasDragOverHandler,
  CanvasDragOutHandler,
  CanvasDropHandler,
  DraggableProps,
} from '../Canvas/components/Draggable/types/DraggableProps';
import {Point} from '../Canvas/types/Point';
import {Connector} from '../Connector/Connector';
import {LogicComponentJoint} from './components/LogicComponentJoint/LogicComponentJoint';
import {LogicComponentJointProps} from './components/LogicComponentJoint/types/LogicComponentJointProps';
import {JointTargetDto} from '../../model/JointTargetDto';
import {ConnectorJoint} from '../../model/ConnectorJoint';

export const LogicComponent: FC<LogicComponentProps> = (props) => {
  const [x, setX] = useState(props.component.x);
  const [y, setY] = useState(props.component.y);
  const context = useContext(ElementContext);
  const height = 80;
  const width = 120;
  const [dragOver, setDragOver] = useState(false);
  const focused = context.state.isFocused;
  const active = context.state.isActive;
  const [connectorDragged, setConnectorDragged] = useState(false);
  const [focusedJoint, setFocusedJoint] = useState<JointDto | null>(null);
  const [connectorKeyOffset, setConnectorKeyOffset] = useState(0);
  const [jointKeyOffset, setJointKeyOffset] = useState(0);
  const backgroundColor = '#333';
  const defaultColor = 'white';
  const activeColor = 'orange';
  const outlineColor = active ? activeColor : defaultColor;
  const showControls = focused || active || dragOver;
  const textX = x + width / 2;
  const textY = y + height / 2;
  const onFocus: CanvasFocusEventHandler = (state) => {
    if (props.onFocus) {
      props.onFocus(state);
    }
    return true;
  };
  const onFocusOut: CanvasFocusEventHandler = (state) => {
    if (connectorDragged) {
      context.logger.debug('Connector dragged, skiping');
      return false;
    }
    context.logger.debug('focus out from draggable');
    if (props.onFocusOut) {
      props.onFocusOut(state);
    }
    return true;
  };

  const onDragStop = () => {
    props.component.setPosition(x, y);
    if (props.onDragStop) {
      props.onDragStop();
    }
  };
  const onDrag = (x: number, y: number) => {
    setX(x);
    setY(y);
    props.component.setPosition(x, y);
    const numberOfInputs = props.component.outputs.length + props.component.inputs.length;
    setConnectorKeyOffset(connectorKeyOffset + numberOfInputs);
    setJointKeyOffset(jointKeyOffset + numberOfInputs);
    if (props.onDrag) {
      props.onDrag(x, y);
    }
  };
  const getDistance = (a: Point, b: Point): number => {
    const xDiff = a.x - b.x;
    const yDiff = a.y - b.y;
    const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    return distance;
  };
  const getClosestConnector = (pos: Point): JointDto| null => {
    let shortestDistance = 10000000;
    let foundJoint: JointDto | null = null;
    const joints = [...props.component.inputs, ...props.component.outputs];
    for (const joint of joints) {
      const position = joint.getPosition();
      const distance = getDistance(position, pos);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        foundJoint = joint;
      }
    }
    return foundJoint;
  };

  const onDragOver: CanvasDragOverHandler = (e) => {
    context.logger.debug('DragOver');
    if (e.payload instanceof ConnectorJoint) {
      setDragOver(true);
      const foundConnector = getClosestConnector(e.position);
      setFocusedJoint(foundConnector);
      return false;
    }
    return true;
  };

  const onDragOut: CanvasDragOutHandler = () => {
    context.logger.debug('DragOut');
    setDragOver(false);
    setFocusedJoint(null);
    return true;
  };

  const onDrop:CanvasDropHandler = (e) => {
    if (e.payload instanceof ConnectorJoint) {
      console.log('Drop', e.payload);
      setDragOver(false);
      setFocusedJoint(null);
      const foundJoint = getClosestConnector(e.position);
      if (!foundJoint) {
        throw new Error('Connector not found');
      }
      const position = foundJoint.getPosition();
      const target = new JointTargetDto(e.payload.getConnector(), foundJoint);
      console.log(e.payload.getPosition(), position);
      e.payload.setTarget(target);
      return false;
    }
    return true;
  };

  const draggableProps: Omit<DraggableProps, 'children'> = {
    ...props,
    id: props.component.id,
    margin: 10,
    x,
    y,
    width,
    height,
    onDrag,
    onDragStop,
    onFocus,
    onFocusOut,
    onDragOver,
    onDragOut,
    onDrop,
  };

  const joints = props.component.getJoints();
  let keyCounter = jointKeyOffset;
  const jointComponents = joints.map((joint) => {
    const props: LogicComponentJointProps = {
      isFocused: focusedJoint === joint,
      color: outlineColor,
      parentHeight: height,
      parentWidth: width,
      joint: joint,
      labelPosition: joint.isInput() ? 'right' : 'left',
      label: joint.getLabel(),
    };
    return <LogicComponentJoint key={keyCounter++} {...props}/>;
  });

  let keyCounter2 = connectorKeyOffset;
  const connectors = joints.map((joint) => {
    const props: ConnectorProps = {
      connector: joint.getTarget().getConnector(),
      isHidden: !showControls && joint.getTarget().getConnector().end.getPosition() === null,
      isFocused: focusedJoint === joint,
      color: outlineColor,
      onFocus,
      onFocusOut,
      onDrag: () => {
        setConnectorDragged(true);
      },
      onDragStop: () => {
        setConnectorDragged(false);
      },
    };
    return <Connector key={keyCounter2++} {...props}/>;
  });

  return (
    <Draggable key={1} {...draggableProps}>
      <rect {...{x, y, width, height, rx: 10, ry: 10, fill: backgroundColor, strokeWidth: 4, stroke: outlineColor}} />
      <text {...{x: textX, y: textY, fontFamily: 'arial', dominantBaseline: 'middle', fill: outlineColor, textAnchor: 'middle'}}>
        <>{props.component.label}</>
      </text>
      <>{jointComponents}</>
      <DragableForeground>{connectors}</DragableForeground>
    </Draggable>
  );

};
