import {MouseCatcherListener} from './types/MouseCatcherListener';
import {MouseEvent} from 'react';

export class MouseCatcher {
  protected listeners: Record<number, MouseCatcherListener> = {};
  protected cachedListeners: MouseCatcherListener[] = [];

  captureMouseMove(event: MouseEvent<SVGSVGElement>) {
    const x = event.pageX;
    const y = event.pageY;
    for (const listener of this.cachedListeners) {
      listener({
        pageX: x,
        pageY: y,
        canvas: event.currentTarget,
      });
    }
  }

  onMouseMove(id: number, listener: MouseCatcherListener) {
    this.listeners[id] = listener;
    this.cachedListeners = Object.values(this.listeners);
  }
}
