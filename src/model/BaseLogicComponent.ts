export class BaseLogicComponent {
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
