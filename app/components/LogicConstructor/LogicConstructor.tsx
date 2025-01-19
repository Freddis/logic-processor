import {CSSProperties, JSX, useEffect, useMemo, useState} from 'react';
import {Circle} from '../Circle/Circle';
import {Canvas} from '../Canvas/Canvas';
import {AndGate} from '../AndGate/AndGate';

export function LogicConstructor() {
  const [scale, setScale] = useState(1);
  const [canvasWidth, setCanvasWidth] = useState(500);
  const [canvasheight, setCanvasheight] = useState(400);
  const [isLoading, setIsloading] = useState(true);
  const containerStyle: CSSProperties = {
    width: '100%',
    // height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  const menuWidth = 200;
  const menuStyle: CSSProperties = {
    width: menuWidth,
    justifyItems: 'top',
    display: 'flex',
    flexDirection: 'column',
    padding: '62.5px 20px 0px 20px',
    boxSizing: 'border-box',
    height: '100vh',
  };
  const scaleStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'left',
    flexDirection: 'row',
    marginTop: 20,
  };
  const scaleUp = () => {
    setScale(scale * 2);
  };
  const scaleDown = () => {
    setScale(scale / 2);
  };

  useEffect(() => {
    setIsloading(false);
    setCanvasWidth(() => {
      return window.innerWidth - menuWidth;
    });
    setCanvasheight(() => {
      return window.innerHeight;
    });
  }, []);

  const elements = useMemo(() => {
    const result: JSX.Element[] = [];
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 5; y++) {
        const child = <AndGate key={'and' + x + '_' + y} id={'and' + x + '_' + y} x={300 + x * 100 } y= {250 + y * 200}/>;
        result.push(child);
      }
    }
    result.push(<Circle key="circle1" x={250} y={100} id={'circle1'} label="Circle 1" />);
    result.push(<Circle key="circle2" x={280} y={220} id={'circle2'} label="Circle 2" />);
    result.push(<AndGate key="and1" x={10} y={20} id={'andGate'}/>);
    result.push(<AndGate key="and2" x={10} y={200} id={'andGate2'}/>);
    return result;
  }, [1]);

  if (isLoading) {
    return <div style={{margin: '62.5px auto 0px', width: '1024px', marginTop: 62.5, paddingTop: '10px'}}>Loading...</div>;
  }
  return (
    <div style={containerStyle}>
      <div style={menuStyle}>
        <div style={scaleStyle}>
          <b style={{marginRight: 10}}>Scale:</b>
          <button onClick={scaleUp}>+</button>
          <span style={{margin: '0px 5px'}}>{scale * 100}%</span>
          <button onClick={scaleDown}>-</button>
        </div>
      </div>
        <Canvas scale={scale} width={canvasWidth} height={canvasheight}>
          {elements}
        </Canvas>
    </div>
  );
}
