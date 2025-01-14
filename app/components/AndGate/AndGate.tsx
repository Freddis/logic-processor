import {useState} from 'react';
import {Draggable} from '../Draggable/Draggable';
import {MouseCatcherListener} from '../../utls/MouseCatcher/types/MouseCatcherListener';

export function AndGate(props: {x: number, y: number, id: string}) {
  const [x, setX] = useState(props.x);
  const [y, setY] = useState(props.y);
  const height = 100;
  const width = 60;
  const [outputX, setOutputX] = useState(x + width);
  const [outputY, setOutputY] = useState(y + height / 2);
  const connectorRadius = 7;
  const [focused, setFocus] = useState(false);
  const [active, setActive] = useState(false);
  const [input1Focused, setInput1Focus] = useState(false);
  const [input2Focused, setInput2Focus] = useState(false);
  const [outputFocused, setOutputFocus] = useState(false);
  const defaultColor = 'black';
  const activeColor = 'orange';
  const outlineColor = active ? activeColor : defaultColor;
  const connectionColor = outlineColor;
  const connectionFocusColor = 'red';
  const input1Color = input1Focused ? connectionFocusColor : connectionColor;
  const input2Color = input2Focused ? connectionFocusColor : connectionColor;
  const outputColor = outputFocused ? connectionFocusColor : connectionColor;
  const showControls = focused || active;
  const focus = () => {
    setFocus(true);
  };
  const unfocus = () => {
    setFocus(false);
  };
  const activate: MouseCatcherListener = (e) => {
    e.preventDefault();
    setActive(!active);
  };
  const onDrag = (x: number, y: number) => {
    setX(x);
    setY(y);
    setOutputX(x + width);
    setOutputY(y + height / 2);
  };
  const onOutputDrag = (x: number, y: number) => {
    setOutputX(x + connectorRadius);
    setOutputY(y + connectorRadius);
  };
  return <>
  <Draggable
    id={props.id}
    x={x}
    y={y}
    width={width}
    height={height}
    onClick={activate}
    onDrag={onDrag}
    onFocusOut={unfocus}
    onFocus={focus}
  >
      <rect
        width={width} height={height} rx={10} ry={10} x={x} y={y} fill="white" strokeWidth={4}
        stroke={outlineColor}
      />
      <text
        x={x + width / 2}
        y={y + height / 2}
        fontFamily="arial"
        dominantBaseline="middle"
        fill={outlineColor}
        textAnchor="middle"
      >AND</text>
      {!showControls ? <></> : <circle
          onMouseOver={setInput1Focus.bind(null, true)}
          onMouseOut={setInput1Focus.bind(null, false)}
          onMouseDown={(e) => e.stopPropagation()}
          cursor={'pointer'}
          cx={x}
          cy={y + 30}
          r={connectorRadius}
          fill={input1Color}
      /> }
      {!showControls ? <></> : <circle
          onMouseOver={setInput2Focus.bind(null, true)}
          onMouseOut={setInput2Focus.bind(null, false)}
          cursor={'pointer'}
          cx={x}
          cy={y + height - 30}
          r={connectorRadius}
          fill={input2Color}
      />}
      <Draggable
        isHidden={!showControls}
        x={outputX - connectorRadius}
        y={outputY - connectorRadius}
        width={connectorRadius * 2}
        height={connectorRadius * 2}
        onDrag={onOutputDrag}
        onFocus={() => {focus(); setOutputFocus(true);}}
        onFocusOut={setOutputFocus.bind(null, false)}
        id={props.id + 'output'}
      >
        <circle
            onMouseOver={setOutputFocus.bind(null, true)}
            onMouseOut={setOutputFocus.bind(null, false)}
            cursor={'pointer'}
            cx={outputX}
            cy={outputY}
            r={connectorRadius}
            fill={outputColor}
          />
          <></>
      </Draggable>
    </Draggable>
  </>;
}
