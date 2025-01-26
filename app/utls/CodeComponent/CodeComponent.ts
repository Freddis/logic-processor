import {Connector, LogicComponent} from '../../model/AndGate';

export interface CodeComponent {
  inputs: Connector[]
  outputs: Connector[]
  hasLogicOne: (output: Connector) => boolean
}

export function createAnd(component: LogicComponent): CodeComponent {
  const input1 = new Connector(component, 'a');
  const input2 = new Connector(component, 'b');
  const output = new Connector(component, 'out');
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

export function createNot(component: LogicComponent): CodeComponent {
  const input = new Connector(component, 'in');
  const output = new Connector(component, 'out');
  const result: CodeComponent = {
    inputs: [input],
    outputs: [output],
    hasLogicOne: function(): boolean {
      return !input.hasLogicOne();
    },
  };
  return result;
}

export function createLogicOne(component: LogicComponent): CodeComponent {
  const output = new Connector(component, 'out');
  const result: CodeComponent = {
    inputs: [],
    outputs: [output],
    hasLogicOne: function(): boolean {
      return true;
    },
  };
  return result;
}

export function createLogicZero(component: LogicComponent): CodeComponent {
  const output = new Connector(component, 'out');
  const result: CodeComponent = {
    inputs: [],
    outputs: [output],
    hasLogicOne: function(): boolean {
      return false;
    },
  };
  return result;
}
