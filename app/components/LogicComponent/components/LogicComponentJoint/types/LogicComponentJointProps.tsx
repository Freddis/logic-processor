import {JointDto} from '../../../../../model/JointDto';

export interface LogicComponentJointProps {
  joint: JointDto
  parentWidth: number,
  parentHeight: number,
  isFocused?: boolean,
  label: string,
  color: string,
  labelPosition: 'left' | 'right'
}
