import {useState} from 'react';
import {Draggable} from '../Draggable/Draggable';
import {MouseCatcherListener} from '../../utls/MouseCatcher/types/MouseCatcherListener';
import {Connector} from '../Connector/Connector';

export function AndGate(props: {x: number, y: number, id: string}) {
  const [x, setX] = useState(props.x);
  const [y, setY] = useState(props.y);
  const height = 100;
  const width = 60;
  const [focused, setFocus] = useState(false);
  const [active, setActive] = useState(false);
  const defaultColor = 'black';
  const activeColor = 'orange';
  const outlineColor = active ? activeColor : defaultColor;
  const showControls = focused || active;
  const onFocus = () => {
    setFocus(true);
  };
  const onFocusOut = () => {
    setFocus(false);
  };
  const activate: MouseCatcherListener = (e) => {
    e.preventDefault();
    setActive(!active);
  };
  const onDrag = (x: number, y: number) => {
    setX(x);
    setY(y);
  };

  // html visibility
  const textX = x + width / 2;
  const textY = y + height / 2;
  const id = props.id;
  const connectorProps = {
    isHidden: !showControls,
    color: outlineColor,
    onFocus,
    onFocusOut,
  };
  return [
    <Draggable key={1} {...{id, x, y, width, height, onClick: activate, onDrag, onFocus, onFocusOut}}>
      <rect {...{x, y, width, height, rx: 10, ry: 10, fill: 'white', strokeWidth: 4, stroke: outlineColor}} />
      <text {...{x: textX, y: textY, fontFamily: 'arial', dominantBaseline: 'middle', fill: outlineColor, textAnchor: 'middle'}}>
        <>AND</>
      </text>
    </Draggable>,
    <Connector key={2} {...{id: id + '_i1', x, y: y + 30, ...connectorProps}}/>,
    <Connector key={3} {...{id: id + '_i2', x, y: y + height - 30, ...connectorProps}}/>,
    <Connector key={4} {...{id: id + '_o1', x: x + width, y: y + height / 2, ...connectorProps}}/>,
  ];

}
