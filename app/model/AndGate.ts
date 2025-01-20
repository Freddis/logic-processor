
export abstract class LogicComponent {
  id: string;
  x: number;
  y: number;

  constructor(id: string, x: number, y: number) {
    this.id = id;
    this.x = x;
    this.y = y;
  }
  setPosition(x: number, y:number) {
    this.x = x;
    this.y = y;
  }
}

export class Connector {
  start: LogicComponent;
  end?: LogicComponent;

  constructor(start:LogicComponent) {
    this.start = start;
  }
}

export class EndGateDto extends LogicComponent {
  input1: Connector;
  input2: Connector;
  output1: Connector;

  constructor(id: string, x: number, y: number) {
    super(id, x, y);
    this.input1 = new Connector(this);
    this.input2 = new Connector(this);
    this.output1 = new Connector(this);
  }
}
