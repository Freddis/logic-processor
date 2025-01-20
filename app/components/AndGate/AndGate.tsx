import {useState} from 'react';
import {Draggable} from '../Draggable/Draggable';
import {MouseCatcherListener} from '../../utls/MouseCatcher/types/MouseCatcherListener';
import {Connector} from '../Connector/Connector';
import {AndGateProps} from './types/AndGateProps';
import {ConnectorProps} from '../Connector/types/ConnectorProps';

export function AndGate(props: AndGateProps) {
  const [x, setX] = useState(props.component.x);
  const [y, setY] = useState(props.component.y);
  const height = 100;
  const width = 60;
  const [focused, setFocus] = useState(false);
  const [active, setActive] = useState(false);
  const [connectorDragged, setConnectorDragged] = useState(false);
  const backgroundColor = '#333';
  const defaultColor = 'white';
  const activeColor = 'orange';
  const outlineColor = active ? activeColor : defaultColor;
  const showControls = focused || active;
  const onFocus = () => {
    setFocus(true);
    if (props.onFocus) {
      props.onFocus();
    }
  };
  const onFocusOut = () => {
    console.log(connectorDragged);
    if (connectorDragged) {
      console.log('Connector dragged, skipin');
      return;
    }

    setFocus(false);
    if (props.onFocusOut) {
      props.onFocusOut();
    }
  };
  const activate: MouseCatcherListener = (e) => {
    e.preventDefault();
    setActive(!active);
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
      props.onDrag();
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
  return [
    <Draggable key={1} {...{id, margin: 10, x, y, width, height, onClick: activate, onDrag, onDragStop, onFocus, onFocusOut}}>
      <rect {...{x, y, width, height, rx: 10, ry: 10, fill: backgroundColor, strokeWidth: 4, stroke: outlineColor}} />
      <text {...{x: textX, y: textY, fontFamily: 'arial', dominantBaseline: 'middle', fill: outlineColor, textAnchor: 'middle'}}>
        <>AND</>
      </text>
    </Draggable>,
    <Connector key={2} {...{id: id + '_i1', x, y: y + 30, ...connectorProps}}/>,
    <Connector key={3} {...{id: id + '_i2', x, y: y + height - 30, ...connectorProps}}/>,
    <Connector key={4} {...{id: id + '_o1', x: x + width, y: y + height / 2, ...connectorProps}}/>,
  ];

}
