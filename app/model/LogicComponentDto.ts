import {JointDto} from './JointDto';
import {BaseLogicComponent} from './BaseLogicComponent';

export class LogicComponentDto extends BaseLogicComponent {
  inputs: JointDto[];
  outputs: JointDto[];

  constructor(id: string, label: string, x: number, y: number, joints: {id: number, label: string, type: 'input' | 'output'}[]) {
    super(id, label, x, y);
    const inputs: JointDto[] = [];
    const outputs: JointDto[] = [];

    for (const row of joints) {
      const isInput = row.type === 'input';
      const joint = new JointDto(this, row.label);
      if (isInput) {
        inputs.push(joint);
        continue;
      }
      outputs.push(joint);
    }
    this.inputs = inputs;
    this.outputs = outputs;
  }

  getJoints(): JointDto[] {
    return [...this.inputs, ...this.outputs];
  }
}
