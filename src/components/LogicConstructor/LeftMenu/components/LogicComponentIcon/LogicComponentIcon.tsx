import {useState, useContext} from 'react';
import {LogicComponentDto} from '../../../../../model/LogicComponentDto';
import {CanvasContext} from '../../../../Canvas/components/CanvasContext/CanvasContext';
import {CanvasFocusEventHandler} from '../../../../Canvas/components/Draggable/types/CanvasFocusEventHandler';
import {LogicComponent} from '../../../../LogicComponent/LogicComponent';
import {LogicComponentIconProps} from './types/LogicComponentIconProps';

export function LogicComponentIcon(props: LogicComponentIconProps) {
  const [canvas, setCanvas] = useState<SVGSVGElement| null>(null);
  const context = useContext(CanvasContext);
  const hide = () => {
    context.setGlobalCanvasChildren([]);
  };
  const drop = (x: number, y:number) => {
    const rect = props.targetCanvasContext.canvas().getBoundingClientRect();
    const viewBox = props.targetCanvasContext.canvas().viewBox.baseVal;
      // console.log(viewBox, props.x, props.y, rect2.x, rect2.y);
    // console.log('target context', props.targetCanvasContext);
    const newX = (x - rect.x) / props.targetCanvasContext.scale + viewBox.x;
    const newY = (y - rect.y) / props.targetCanvasContext.scale + viewBox.y;
    const id = new Date().getTime().toString();
    const dto = new LogicComponentDto(id, 'AND', newX, newY, []);
    const component = <LogicComponent key={id} id={id} x={0} y={0} component={dto} />;
    props.targetCanvasContext.addElement(component);
    hide();
  };

  const onFocus: CanvasFocusEventHandler = () => {
    const svg = canvas ?? context.canvas();
    if (!canvas) {
      setCanvas(svg);
    }
    const rect = svg.getBoundingClientRect();
    const dto = new LogicComponentDto(props.id, 'DRAG', rect.x + props.x, rect.y + props.y, []);
    const time = new Date().getTime();
    const component = <LogicComponent key={time} id={dto.id} onFocusOut={hide} onDragStop={drop} x={0} y={0} component={dto} />;
    context.setGlobalCanvasChildren([component]);
    return false;
  };
  const dto = new LogicComponentDto(props.id, 'AND', props.x, props.y, []);
  const component = <LogicComponent id={dto.id} onFocus={onFocus} onDrag={() => false} x={props.x} y={props.y} component={dto} />;
  return component;
}
