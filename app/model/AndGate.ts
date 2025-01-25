
export class LogicComponent {
  id: string;
  label: string;
  x: number;
  y: number;

  constructor(id: string, label: string, x: number, y: number) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.label = label;
  }
  setPosition(x: number, y:number) {
    this.x = x;
    this.y = y;
  }
}

export class Connector {
  label: string;
  start: LogicComponent;
  end?: LogicComponent;

  constructor(start:LogicComponent, label: string) {
    this.start = start;
    this.label = label;
  }

  hasLogicOne(): boolean {
    return true;
  }
}

export class LogicComponentDto extends LogicComponent {
  inputs: Connector[];
  outputs: Connector[];

  constructor(id: string, label: string, x: number, y: number, joints: {label: string, type: 'input' | 'output'}[]) {
    super(id, label, x, y);
    const inputs: Connector[] = [];
    const outputs: Connector[] = [];

    for (const joint of joints) {
      const connector = new Connector(this, joint.label);
      if (joint.type === 'input') {
        inputs.push(connector);
        continue;
      }
      outputs.push(connector);
    }
    this.inputs = inputs;
    this.outputs = outputs;
  }
}

export class EndGateDto extends LogicComponent {
  input1: Connector;
  input2: Connector;
  output1: Connector;

  constructor(id: string, label: string, x: number, y: number) {
    super(id, label, x, y);
    this.input1 = new Connector(this, 'a');
    this.input2 = new Connector(this, 'b');
    this.output1 = new Connector(this, 'out');
  }
}


interface CodeComponent {
  inputs: Connector[]
  outputs: Connector[]
  hasLogicOne: (output: Connector) => boolean
}

function createAnd(component: LogicComponent): CodeComponent {
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

function createNot(component: LogicComponent): CodeComponent {
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

function createLogicOne(component: LogicComponent): CodeComponent {
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

function createLogicZero(component: LogicComponent): CodeComponent {
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
