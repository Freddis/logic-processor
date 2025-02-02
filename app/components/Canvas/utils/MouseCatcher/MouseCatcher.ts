import {Logger} from '../../../../utls/Logger/Logger';
import {CanvasDragOverHandler, CanvasDropHandler} from '../../components/Draggable/types/DraggableProps';
import {Point} from '../../types/Point';
import {RectCoords} from '../../types/RectCoords';
import {MouseCatcherListener} from './types/MouseCatcherListener';
import {MouseEvent as ReactMouseEvent} from 'react';

interface ElementInfo {
  id: string,
  space: RectCoords
  onDragOver?: CanvasDragOverHandler
  onDragOut?: CanvasDragOverHandler
  onDrop?: CanvasDragOverHandler
}
export class MouseCatcher {
  setScale(scale: number) {
    this.scale = scale;
  }
  protected canvasCoords: RectCoords = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  };
  protected minX: number;
  protected minY: number;
  protected scale: number;
  protected logger: Logger;
  protected elements: Record<string, ElementInfo> = {};
  protected previousEvents: {
    dragOver: ElementInfo[],
  } = {
    dragOver: [],
  };
  protected dragPayload: unknown = null;

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

  constructor(minX: number, minY: number, scale: number) {
    this.minX = minX;
    this.minY = minY;
    this.scale = scale;
    this.logger = new Logger(MouseCatcher.name);
  }

  setCanvasBoundaries(rect: RectCoords) {
    this.canvasCoords = rect;
  }

  onDragOver(id: string, x: number, y: number, width: number, height: number, handler: CanvasDragOverHandler) {
    this.elements[id] = {
      ...this.elements[id],
      id,
      space: {
        left: x,
        right: x + width,
        top: y,
        bottom: y + height,
      },
      onDragOver: handler,
    };
  }
  onDrop(id: string, x: number, y: number, width: number, height: number, handler: CanvasDropHandler) {
    this.elements[id] = {
      ...this.elements[id],
      id,
      space: {
        left: x,
        right: x + width,
        top: y,
        bottom: y + height,
      },
      onDrop: handler,
    };
  }
  onDragOut(id: string, x: number, y: number, width: number, height: number, handler: CanvasDragOverHandler) {
    this.elements[id] = {
      ...this.elements[id],
      id,
      space: {
        left: x,
        right: x + width,
        top: y,
        bottom: y + height,
      },
      onDragOut: handler,
    };
  }
  captureLegacyMouseUp(event: MouseEvent, canvas: SVGSVGElement) {
    const x = event.pageX;
    const y = event.pageY;
    const dragover = this.previousEvents.dragOver;
    const payload = this.dragPayload;
    const position = this.convertToCanvasCoords({x: event.pageX, y: event.pageY});
    for (const element of dragover) {
      if (element.onDrop) {
        this.logger.debug('Firing drop on', element);
        const stop = element.onDrop({position, payload});
        if (stop) {
          break;
        }
      }
    }

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
    const elements = Object.values(this.elements);
    const hitElements: ElementInfo[] = [];
    const canvasPosition = this.convertToCanvasCoords({x, y});
    // intentional, saving on checks
    const canvasX = canvasPosition.x;
    const canvasY = canvasPosition.y;
    for (const element of elements) {
      if (this.isHit(element, canvasX, canvasY)) {
        hitElements.push(element);
      }
    }
    const dragPayload = this.dragPayload;
    if (dragPayload) {
      const previouslyHitElements = this.previousEvents.dragOver;
      const newlyHitElements = hitElements; //this.difference(hitElements, previouslyHitElements);
      for (const el of newlyHitElements) {
        if (el.onDragOver) {
          this.logger.debug('Firing dragover', el);
          const result = el.onDragOver({
            position: {
              x: canvasX,
              y: canvasY,
            },
            payload: dragPayload,
          });
          if (!result) {
            break;
          }
        }
      }

      const dragOutHitElments: ElementInfo[] = [];
      const dragOutRemainder: ElementInfo[] = [];
      for (const el of previouslyHitElements) {
        if (this.isHit(el, canvasX, canvasY)) {
          dragOutRemainder.push(el);
          continue;
        }
        dragOutHitElments.push(el);
      }

      for (const el of dragOutHitElments) {
        if (el.onDragOut) {
          this.logger.debug('Firing dragOut', el);
          el.onDragOut({
            position: {
              x: canvasX,
              y: canvasY,
            },
            payload: dragPayload,
          });
        }
      }
      this.previousEvents.dragOver = [...new Set([...dragOutRemainder, ...newlyHitElements])];
    }
    // logger.debug(elements.length, canvasX, canvasY, elements[0]?.space.left, hitElements);
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

  hasSpecificLock(id: string) {
    return this.mutex === id;
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

  setPayload(value: unknown) {
    this.dragPayload = value;
  }

  protected convertToCanvasCoords(point: Point): Point {
    const x = (point.x - this.canvasCoords.left) / this.scale + this.minX;
    const y = (point.y - this.canvasCoords.top) / this.scale + this.minY;
    return {x, y};
  }

  protected intersection<T>(arr1: T[], arr2: T[]):T[] {
    const setA = new Set(arr1);
    const setB = new Set(arr2);
    const intersection = new Set([...setA].filter((x) => setB.has(x)));
    return Array.from(intersection);
  }

  protected difference<T>(arr1: T[], arr2: T[]):T[] {
    const setB = new Set(arr2);
    const intersection = arr1.filter((x) => !setB.has(x));
    return intersection; ;
  }

  protected isHit(element: ElementInfo, x: number, y: number) {
    const space = element.space;
    if (x < space.left) {
      return false;
    }
    if (x > space.right) {
      return false;
    }
    if (y < space.top) {
      return false;
    }
    if (y > space.bottom) {
      return false;
    }
    return true;
  }
}
