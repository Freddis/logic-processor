import {FC} from 'react';
import {LogicComponentJointProps} from './types/LogicComponentJointProps';
import {Point} from '../../../Canvas/types/Point';

export const LogicComponentJoint: FC<LogicComponentJointProps> = (props) => {
  const joint = props.joint;
  const component = joint.getComponent();
  joint.setComponentSize(props.parentWidth, props.parentHeight);
  const offset = joint.getOffset();

  const position: Point = {x: component.x + offset.x, y: component.y + offset.y};
  const focusColor = 'red';
  const focused = props.isFocused;
  const color = focused ? focusColor : props.color;
  const labelOffset = 2;
  const labelWidth = 30;
  const labelHeight = 15;
  const finalLabelOffset = props.labelPosition === 'right' ? labelOffset : (-labelWidth - labelOffset);
  const offsetDirection = props.labelPosition === 'right' ? 1 : -1;
  const rectX = position.x + finalLabelOffset;
  const rectY = position.y - labelHeight / 2;


  return <>
    <rect x={rectX} y={rectY} width={labelWidth} height={labelHeight} fill="black" />
    <text
      textAnchor={offsetDirection > 0 ? 'start' : 'end'}
      fill={color}
      fontSize={12}
      fontFamily={'arial'}
      width={labelWidth}
      height={labelHeight}
      x={position.x + 10 * offsetDirection}
      y={position.y + 3} >
      {props.label}
    </text>
  </>;
};

