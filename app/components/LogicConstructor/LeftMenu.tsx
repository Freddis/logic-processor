import {CSSProperties, useContext} from 'react';
import {CanvasContext} from '../Canvas/components/CanvasContext/CanvasContext';

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
  </div>
  );
}
