import {ReactElement} from 'react';
import {CanvasComponentState} from '../../../types/CanvasComponentState';
import {CanvasElementProps} from '../../../types/CanvasElementProps';


export class CanvasElementManager {
  protected listeners: Record<string, (element: ReactElement<CanvasElementProps>, state?: CanvasComponentState) => void> = {};
  protected listenersArr: ((element: ReactElement<CanvasElementProps>, state?: CanvasComponentState) => void)[] = [];
  protected states: Record<string, CanvasComponentState> = {};
  protected prev?: string;

  public subscribe(id: string, callback: (element: ReactElement<CanvasElementProps>, state?: CanvasComponentState)=> void) {
    this.listeners[id] = callback;
    this.listenersArr = Object.values(this.listeners);
  }


  public addElement(element: ReactElement<CanvasElementProps>, state?: CanvasComponentState) {
    for (const listener of this.listenersArr) {
      listener(element, state);
    }
  }
}
