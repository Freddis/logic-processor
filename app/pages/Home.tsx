import {CSSProperties, useState} from 'react';
import {Canvas} from '../components/Canvas/Canvas';
import {AndGate} from '../components/AndGate/AndGate';
import {Circle} from '../components/Circle/Circle';

export function Home() {
  const [scale, setScale] = useState(1);
  const containerStyle: CSSProperties = {
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  const scaleUp = () => {
    setScale(scale * 2);
  };
  const scaleDown = () => {
    setScale(scale / 2);
  };
  return (
    <div style={containerStyle}>
      <button onClick={scaleUp}>+</button>
      <button onClick={scaleDown}>-</button>
        <Canvas scale={scale}>
          <Circle x={250} y={100} id={'circle1'} label="Circle 1" />
          <Circle x={280} y={220} id={'circle2'} label="Circle 2" />
          <AndGate x={10} y={20} id={'andGate'}/>
        </Canvas>
    </div>
  );
}
