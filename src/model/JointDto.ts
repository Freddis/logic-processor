import {Point} from '../components/Canvas/types/Point';
import {ConnectorDto} from './ConnectorDto';
import {JointTargetDto} from './JointTargetDto';
import {LogicComponentDto} from './LogicComponentDto';
import {PointTargetDto} from './PointTargetDto';

export class JointDto {
  protected label: string;
  protected component: LogicComponentDto;
  protected parentWidth: number = 0;
  protected parentHeight: number = 0;
  protected target: JointTargetDto;
  public readonly id: number;

  constructor(component: LogicComponentDto, data: {id: number, label: string}) {
    this.component = component;
    this.label = data.label;
    this.id = data.id;
    const connector = new ConnectorDto(0, new PointTargetDto({x: 0, y: 0}));
    this.target = new JointTargetDto(connector, this);
    connector.start.setTarget(this.target);
  }

  getOffset(): Point {
    const step = this.getStepSize();
    const index = this.getIndex();
    return {
      x: this.isInput() ? 0 : this.parentWidth,
      y: step * (index + 1),
    };
  }

  setComponentSize(parentWidth: number, parentHeight: number) {
    this.parentWidth = parentWidth;
    this.parentHeight = parentHeight;
  }

  getLabel(): string {
    return this.label;
  }

  hasLogicOne(): boolean {
    return true;
  }

  setTarget(target: JointTargetDto): void {
    this.target = target;
  }

  getTarget(): JointTargetDto {
    return this.target;
  }

  getPosition(): Point {
    const componentX = this.component.x;
    const componentY = this.component.y;
    const offset = this.getOffset();
    return {x: componentX + offset.x, y: componentY + offset.y};
  }

  getComponent(): LogicComponentDto {
    return this.component;
  }

  isInput(): boolean {
    return this.component.inputs.includes(this);
  }

  protected getStepSize(): number {
    if (this.isInput()) {
      return this.parentHeight / (this.component.inputs.length + 1);
    }
    return this.parentHeight / (this.component.outputs.length + 1);
  };
  protected getIndex(): number {
    if (this.isInput()) {
      const result = this.component.inputs.findIndex((x) => x === this);
      return result;
    }
    return this.component.outputs.findIndex((x) => x === this);
  };
}
