import {CanvasComponentState} from '../../types/CanvasComponentState';

export class CanvasElementStateManager {
  protected listeners: Record<string, (val: CanvasComponentState) => void> = {};
  protected frontListeners: Record<string, (val: CanvasComponentState) => void> = {};
  protected backListeners: Record<string, (val: CanvasComponentState) => void> = {};
  protected states: Record<string, CanvasComponentState> = {};
  protected prev?: string;
  subscribe(id: string, front: boolean, state: CanvasComponentState, callback: (val: CanvasComponentState)=> void) {
    if (front) {
      this.frontListeners[id] = callback;
    } else {
      this.backListeners[id] = callback;
    }
    this.states[id] = state;
  }

  update(id: string, state: Partial<CanvasComponentState> = {}) {
    const prevState = this.states[id];
    if (!prevState) {
      throw new Error('State not found for ' + id);
    }
    const newState = {...prevState, ...state};
    this.states[id] = newState;
    this.updateElement(id, newState);
  }

  resetLayers(extraState: Partial<CanvasComponentState>) {
    const toUpdate = Object.entries(this.states).filter((x) => x[1].onFrontLayer === true);
    for (const [id] of toUpdate) {
      this.update(id, {...extraState, onFrontLayer: false});
    }
  }

  protected updateElement(id: string, state: CanvasComponentState) {
    const listener1 = this.frontListeners[id];
    const listener2 = this.backListeners[id];
    if (listener1 && listener2 && state) {
      const newState = {...state};
      this.prev = id;
      this.states[id] = newState;
      listener1(newState);
      listener2(newState);
    } else {
      throw new Error("Element with id '${id}' not found");
    }
  }
}
