import {useState} from 'react';
import {LogicComponentDto} from '../../model/AndGate';
import {ConnectorProps} from '../Connector/types/ConnectorProps';
import {Draggable} from '../Draggable/Draggable';
import {DraggableComponentProps} from '../../types/DraggableComponentProps';
import {FocusableComponentProps} from '../../types/FocusableComponentProps';
import {Connector} from '../Connector/Connector';
import {DraggableProps} from '../Draggable/types/DraggableProps';
import {CanvasFocusEventHandler} from '../Draggable/types/CanvasFocusEventHandler';
import {CanvasActivationEventHandler} from '../Draggable/types/CanvasActivationEventHandler';

export interface CanvasComponentState {
  isFocused?: boolean
  isActive?: boolean
  isHidden?: boolean
}
export interface CanvasLogicComponentProps extends CanvasComponentState, DraggableComponentProps, FocusableComponentProps {
  component: LogicComponentDto
}

export function CanvasLogicComponent(props:CanvasLogicComponentProps) {
  const [x, setX] = useState(props.component.x);
  const [y, setY] = useState(props.component.y);
  const height = 100;
  const width = 60;
  const [focused, setFocus] = useState(props.isFocused ?? false);
  const [active, setActive] = useState(props.isActive ?? false);
  const [connectorDragged, setConnectorDragged] = useState(false);
  const backgroundColor = '#333';
  const defaultColor = 'white';
  const activeColor = 'orange';
  const outlineColor = active ? activeColor : defaultColor;
  const showControls = focused || active;
  const onFocus: CanvasFocusEventHandler = (state) => {
    setFocus(true);
    if (props.onFocus) {
      props.onFocus(state);
    }
  };
  const onFocusOut: CanvasFocusEventHandler = (state) => {
    console.log(connectorDragged);
    if (connectorDragged) {
      console.log('Connector dragged, skipin');
      return;
    }

    setFocus(false);
    if (props.onFocusOut) {
      props.onFocusOut(state);
    }
  };
  const activate: CanvasActivationEventHandler = (e) => {
    // e.preventDefault();
    setActive(e.isActive);
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
    if (props.onDrag) {
      props.onDrag(x, y);
    }
  };

  // html visibility
  const textX = x + width / 2;
  const textY = y + height / 2;
  const id = props.component.id;
  const connectorProps: Omit<ConnectorProps, 'x'|'y'|'id'> = {
    isHidden: !showControls,
    color: outlineColor,
    onFocus,
    onFocusOut,
    onDrag: () => {
      console.log('onconnector drag');
      setConnectorDragged(true);
    },
    onDragStop: () => {
      console.log('on connector drag stop');
      setConnectorDragged(false);
    },
  };

  const draggableProps: Omit<DraggableProps, 'children'> = {
    ...props,
    id: props.component.id,
    margin: 10,
    x,
    y,
    width,
    height,
    onActive: activate,
    onActiveOut: activate,
    onDrag,
    onDragStop,
    onFocus,
    onFocusOut,
  };

  const inputStep = height / (props.component.inputs.length + 1);
  const outputStep = height / (props.component.outputs.length + 1);
  let keyCounter = 2;
  const inputs = props.component.inputs.map((input, i) => (
    <Connector key={keyCounter++} {...{id: id + '_i' + (i + 1), x, y: y + inputStep * (i + 1), ...connectorProps}}/>
  ));
  const outputs = props.component.outputs.map((input, i) => (
    <Connector key={keyCounter++} {...{id: id + '_o' + (i + 1), x: x + width, y: y + outputStep * (i + 1), ...connectorProps}}/>
  ));
  const connectors = [...inputs, ...outputs];
  return [
    <Draggable key={1} {...draggableProps}>
      <rect {...{x, y, width, height, rx: 10, ry: 10, fill: backgroundColor, strokeWidth: 4, stroke: outlineColor}} />
      <text {...{x: textX, y: textY, fontFamily: 'arial', dominantBaseline: 'middle', fill: outlineColor, textAnchor: 'middle'}}>
        <>{props.component.label}</>
      </text>
    </Draggable>,
    ...connectors,
  ];

}
