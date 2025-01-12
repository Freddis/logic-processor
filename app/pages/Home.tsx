import {CSSProperties, useState} from 'react';
import {Canvas} from '../components/Canvas/Canvas';
import {AndGate} from '../components/AndGate/AndGate';
import {Circle} from '../components/Circle/Circle';
import {MouseCatcher} from '../utls/MouseCatcher/MouseCatcher';
import {CanvasContext} from '../components/Canvas/CanvasContext';

export function Home() {
  const debug = false;
  const [scale, setScale] = useState(1);
  const containerStyle: CSSProperties = {
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  const catcher = new MouseCatcher();
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
      <CanvasContext.Provider value={{scale, debug, mouse: catcher}}>
        <Canvas mouseCatcher={catcher}>
          <Circle x={250} y={100} key={1231} mouseCatcher={catcher} label="Circle 1" />
          <Circle x={280} y={220} key={12323}mouseCatcher={catcher} label="Circle 2" />
          <AndGate x={10} y={20} key={12312312}/>
        </Canvas>
      </CanvasContext.Provider>
    </div>
  );
}
