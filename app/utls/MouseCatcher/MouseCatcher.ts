import {MouseCatcherListener} from './types/MouseCatcherListener';
import {MouseEvent as ReactMouseEvent} from 'react';

export class MouseCatcher {
  protected listeners: {
    mouseup: Record<string, MouseCatcherListener>,
    mousemove: Record<string, MouseCatcherListener>
  } = {
    mouseup: {},
    mousemove: {},
  };
  protected cachedListeners: {
    mouseup: MouseCatcherListener[]
    mousemove: MouseCatcherListener[]
  } = {
    mouseup: [],
    mousemove: [],
  };
  protected mutex: string | null = null;

  captureLegacyMouseUp(event: MouseEvent, canvas: SVGSVGElement) {
    const x = event.pageX;
    const y = event.pageY;
    for (const listener of this.cachedListeners.mouseup) {
      listener({
        pageX: x,
        pageY: y,
        canvas: canvas,
        preventDefault: event.preventDefault.bind(event),
      });
    }
  }

  captureLegacyMouseMove(event: MouseEvent, canvas: SVGSVGElement) {
    const x = event.pageX;
    const y = event.pageY;
    for (const listener of this.cachedListeners.mousemove) {
      listener({
        pageX: x,
        pageY: y,
        canvas: canvas,
        preventDefault: event.preventDefault.bind(event),
      });
    }
  }
  captureMouseMove(event: ReactMouseEvent<SVGSVGElement>) {
    const x = event.pageX;
    const y = event.pageY;
    for (const listener of this.cachedListeners.mousemove) {
      listener({
        pageX: x,
        pageY: y,
        canvas: event.currentTarget,
        preventDefault: event.preventDefault.bind(event),
      });
    }
  }

  lock(id: string): boolean {
    if (!this.mutex || this.mutex === id) {
      this.mutex = id;
      return true;
    }
    return false;
  }

  unlock(id: string): void {
    if (this.mutex === id) {
      this.mutex = null;
    }
  }

  hasLock() {
    return this.mutex !== null;
  }

  onMouseMove(id: string, listener: MouseCatcherListener) {
    this.listeners.mousemove[id] = listener;
    this.cachedListeners.mousemove = Object.values(this.listeners.mousemove);
  }

  onMouseUp(id: string, listener: MouseCatcherListener) {
    this.listeners.mouseup[id] = listener;
    this.cachedListeners.mouseup = Object.values(this.listeners.mouseup);
  }
}
