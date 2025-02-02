import {JointDto} from '../../model/JointDto';
import {LogicComponentDto} from '../../model/LogicComponentDto';

export interface CodeComponent {
  inputs: JointDto[]
  outputs: JointDto[]
  hasLogicOne: (output: JointDto) => boolean
}

export function createAnd(component: LogicComponentDto): CodeComponent {
  const input1 = new JointDto(component, 'a');
  const input2 = new JointDto(component, 'b');
  const output = new JointDto(component, 'out');
  const result: CodeComponent = {
    inputs: [input1, input2],
    outputs: [output],
    hasLogicOne: function(): boolean {
      if (input1.hasLogicOne() && input2.hasLogicOne()) {
        return true;
      }
      return false;
    },
  };
  return result;
}

export function createNot(component: LogicComponentDto): CodeComponent {
  const input = new JointDto(component, 'in');
  const output = new JointDto(component, 'out');
  const result: CodeComponent = {
    inputs: [input],
    outputs: [output],
    hasLogicOne: function(): boolean {
      return !input.hasLogicOne();
    },
  };
  return result;
}

export function createLogicOne(component: LogicComponentDto): CodeComponent {
  const output = new JointDto(component, 'out');
  const result: CodeComponent = {
    inputs: [],
    outputs: [output],
    hasLogicOne: function(): boolean {
      return true;
    },
  };
  return result;
}

export function createLogicZero(component: LogicComponentDto): CodeComponent {
  const output = new JointDto(component, 'out');
  const result: CodeComponent = {
    inputs: [],
    outputs: [output],
    hasLogicOne: function(): boolean {
      return false;
    },
  };
  return result;
}
