import {CSSProperties, useContext} from 'react';
import {CanvasContext} from '../../Canvas/components/CanvasContext/CanvasContext';
import {Canvas} from '../../Canvas/Canvas';
import {CanvasSpace} from '../../Canvas/components/CanvasSpace/CanvasSpace';
import {LogicComponentIcon} from './components/LogicComponentIcon/LogicComponentIcon';

export function LeftMenu(props: {
  width: number,
  setScale: (scale: number) => void
}) {
  const context = useContext(CanvasContext);
  const menuStyle: CSSProperties = {
    width: props.width,
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
  const scaleStep = 1.5;
  const scaleUp = () => {
    props.setScale(context.scale * scaleStep);
  };
  const scaleDown = () => {
    props.setScale(context.scale / scaleStep);
  };

  const padding = 10;
  const elementWidth = 120;
  const elementHeight = 80;
  const canvasWidth = props.width - 40;
  const canvasheight = elementHeight + padding * 2;
  const elementX = (canvasWidth - elementWidth) / 2;
  const elementY = padding;
  const time = new Date().getTime();
  return (
    <div style={menuStyle}>
    <div style={scaleStyle}>
      <b>Selected: {context.activeElements}</b>
      </div>
    <div style={scaleStyle}>
      <b style={{marginRight: 10}}>Scale:</b>
      <button onClick={scaleUp}>+</button>
      <span style={{margin: '0px 5px'}}>{(context.scale * 100).toFixed(0)}%</span>
      <button onClick={scaleDown}>-</button>
    </div>
    <div style={{padding: 10}}>
      <CanvasSpace width={canvasWidth} height={canvasheight} scale={1} enableScrolling={false} minX={0} minY={0}>
        <Canvas key={time} id={'palette'} updateCounter={time}>
          <LogicComponentIcon targetCanvasContext={context} id="pand" x={elementX} y={elementY} />
        </Canvas>
      </CanvasSpace>
    </div>
  </div>
  );
}
