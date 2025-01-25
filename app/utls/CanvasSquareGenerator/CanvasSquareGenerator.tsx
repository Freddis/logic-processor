import {JSX, ReactNode} from 'react';
import {LogicComponentDto} from '../../model/AndGate';
import {CanvasSquare} from '../../components/Canvas/components/CanvasSquare/CanvasSquare';
import {FocusSquare} from '../../components/Canvas/components/FocusSquare/FocusSquare';
import {CanvasSquareStateSetter} from '../../components/Canvas/components/CanvasSquare/types/CanvasSquareStateSetter';
import {RectCoords} from '../../types/RectCoords';
import {CanvasLogicComponent, CanvasLogicComponentProps} from '../../components/CanvasLogicComponent/CanvasLogicComponent';
import {SquareLocation} from './types/SquareLocation';
import {CanvasComponentState} from '../../types/CanvasComponentState';

export class CanvasSquareCreator {
  squareWidth: number;
  elements: LogicComponentDto[];
  squareHeight: number;
  viewPort: RectCoords;
  listnerMatrix: CanvasSquareStateSetter[][] = [];
  prevListeners: CanvasSquareStateSetter[][] = [];
  numberOfSquares: number;
  updateCounter = 0;
  prevListnersCount: number = 0;
  elementsMatrix: JSX.Element[][][] = [];
  // eslint-disable-next-line no-empty-function
  focusSetter: (node: JSX.Element| null) => void = () => {};

  constructor(numberOfSquares: number, viewPort: RectCoords, elements: LogicComponentDto[]) {
    const squareWidth = (viewPort.right - viewPort.left) / numberOfSquares;
    const squareHeight = (viewPort.bottom - viewPort.top) / numberOfSquares;
    this.numberOfSquares = numberOfSquares;
    this.elements = elements;
    this.squareWidth = squareWidth;
    this.squareHeight = squareHeight;
    this.viewPort = viewPort;
    console.log('Constructed square creator', viewPort, squareWidth, squareHeight);
  }

  getSqueres(): JSX.Element[] {
    const result: JSX.Element[] = [];
    const viewPort = this.viewPort;
    const globalBoundary = this.elements.reduce((acc, current) => {
      if (current.x < acc.left) {
        acc.left = current.x;
      } else if (current.x > acc.right) {
        acc.right = current.x;
      }

      if (current.y < acc.top) {
        acc.top = current.y;
      } else if (current.y > acc.bottom) {
        acc.bottom = current.y;
      }
      return acc;
    }, {...viewPort});
    const safeFloor = this.safeFloor;
    const sqWidth = this.squareWidth;
    const sqHeight = this.squareHeight;
    const matrix: LogicComponentDto[][][] = [];
    const listnerMatrix: CanvasSquareStateSetter[][] = [];
    const squareNumbers: RectCoords = {
      left: safeFloor(globalBoundary.left / sqWidth),
      top: safeFloor(globalBoundary.top / sqHeight),
      right: safeFloor(globalBoundary.right / sqWidth),
      bottom: safeFloor(globalBoundary.bottom / sqHeight),
    };
    for (let i = squareNumbers.left; i <= squareNumbers.right; i++) {
      const arr: LogicComponentDto[][] = [];
      const listeners: ((isHidden: boolean)=>void)[] = [];
      for (let j = squareNumbers.top; j <= squareNumbers.bottom; j++) {
        arr[j] = [];
        // eslint-disable-next-line no-empty-function
        listeners[j] = () => {};
      }
      matrix[i] = arr;
      listnerMatrix[i] = listeners;
    }
    this.listnerMatrix = listnerMatrix;
    for (const element of this.elements) {
      const squareNumberX = safeFloor(element.x / sqWidth);
      const squareNumberY = safeFloor(element.y / sqHeight);
      if (matrix[squareNumberX] && matrix[squareNumberX][squareNumberY]) {
        matrix[squareNumberX][squareNumberY].push(element);
        continue;
      }
      throw new Error('Square not found');
    }
    const colors = [
      'red',
      'blue',
      'green',
      'cyan',
      'magenta',
      // 'silver',
      'yellow',
      'orange',
      'grey',
      'pink',
      'purple',
    ];

    let colorIndex = 0;

    const matrixRect = this.getVisibleSquares(this.viewPort);
    const time = new Date().getTime();
    console.log('Drawing squares', squareNumbers, matrixRect, time);
    const xStart = squareNumbers.left;
    const xEnd = squareNumbers.right;
    const yStart = squareNumbers.top;
    const yEnd = squareNumbers.bottom;
    let prevListnersCount = 0;
    const prevListenersMatrix: CanvasSquareStateSetter[][] = [];
    this.prevListeners = prevListenersMatrix;
    const elementMatrix: JSX.Element[][][] = [];
    this.elementsMatrix = elementMatrix;
    for (let rowI = xStart; rowI <= xEnd; rowI++) {
      const prevListenersRow:CanvasSquareStateSetter[] = [];
      prevListenersMatrix[rowI] = prevListenersRow;
      const elementMatrixRow: JSX.Element[][] = [];
      elementMatrix[rowI] = elementMatrixRow;
      const row = matrix[rowI];
      if (!row) {
        const msg = `Row ${rowI} not found`;
        throw Error(msg);
        // console.log(msg);
        // continue;
      }
      for (let colI = yStart; colI <= yEnd; colI++) {
        const col = row[colI];
        if (!col) {
          const msg = `Column ${rowI},${colI} not found`;
          throw new Error(msg);
          // console.log(msg);
          // continue;
        }
        const elementMatrixCol: JSX.Element[] = [];
        elementMatrixRow[colI] = elementMatrixCol;
        const drawables: JSX.Element[] = Array(yEnd - yStart);
        for (const [i, el] of col.entries()) {
          const element = this.createElement(el, rowI, colI, i);
          elementMatrixCol.push(element);
          drawables[i] = element;
        }
        const rect: RectCoords = {
          left: rowI * sqWidth,
          top: colI * sqHeight,
          right: rowI * sqWidth + sqWidth,
          bottom: colI * sqHeight + sqHeight,
        };
        if (colorIndex > colors.length - 1) {
          colorIndex = 0;
        }
        const color = colors[colorIndex++];
        const id = rowI + '_' + colI + '_' + time;
        const isHidden = rowI < matrixRect.left || rowI > matrixRect.right || colI < matrixRect.top || colI > matrixRect.bottom;
        if (!isHidden) {
          prevListnersCount++;
        }
        const canvasChange = (setPosition: (isHidden: boolean, focus: ReactNode | null, x: number)=>void) => {
          const listnerRow = listnerMatrix[rowI];
          if (listnerRow) {
            listnerRow[colI] = setPosition;
            if (!isHidden) {
              prevListenersRow[colI] = setPosition;
            }
          } else {
            console.log("Couldn't find listener in matrix");
          }
        };
        // console.log(rowI, colI);
        const element = <CanvasSquare lastUpdate={time} stateSetterConsumer={canvasChange} key={id}
          {...{...rect, id: id, viewPort, color, isHidden: isHidden}}>{drawables}</CanvasSquare>;
        result.push(element);
      }
    }
    this.prevListnersCount = prevListnersCount;
    const addChildren = (setter: (node: JSX.Element| null) => void) => {
      // console.log('registered focus setter');
      this.focusSetter = setter;
    };
    const focusSquare = <FocusSquare key="focus" addChildren={addChildren}/>;
    result.push(focusSquare);
    return result;
  }
  protected createElement(el: LogicComponentDto, rowI: number, colI:number, i: number): JSX.Element {
    let dragged = false;
    const location: SquareLocation = {
      column: colI,
      row: rowI,
      index: i,
    };
    const props: CanvasLogicComponentProps = {
      ...el,
      component: el,
      onDrag: () => {
        console.log('locking drag', dragged);
        dragged = true;
      },
      onDragStop: () => {
        dragged = false;
        console.log('unlocking drag');
      },
      onFocus: (state) => {
        console.log('Focusing');
        this.focusChanged(el, location, state);
      },
      onFocusOut: (state) => {
        console.log('focus out', dragged);
        if (dragged) {
          console.log('skip focus out', dragged);
          return;
        }
        this.focusChanged(el, location, state);
      },
    };
    const element = <CanvasLogicComponent key={el.id} {...props}/>;
    return element;
  }

  viewPortChanged(boundaries: RectCoords) {
    const matrixRect = this.getVisibleSquares(boundaries);
    const updateCounter = new Date().getTime();
    const updateCounter1 = new Date().getTime() - 12321312;
    const matrix = this.listnerMatrix;
    const prevListeners = this.prevListeners;
    let notifiedCount = 0;
    let notifiedCountOld = 0;
    for (const prevRow of prevListeners) {
      for (const listener of prevRow) {
        if (listener) {
          listener(true, null, updateCounter1);
          notifiedCountOld++;
          continue;
        }
      }
    }
    const notifiedListeners: CanvasSquareStateSetter[][] = [];
    for (let i = matrixRect.left; i <= matrixRect.right; i++) {
      const notifiedListenersCurrentRow:CanvasSquareStateSetter[] = [];
      if (!notifiedListeners[i]) {
        notifiedListeners[i] = notifiedListenersCurrentRow;
      }
      for (let j = matrixRect.top; j < matrixRect.bottom; j++) {
        const row = matrix[i];
        if (row) {
          const listener = row[j];
          if (!listener) {
            continue;
          }
          listener(false, null, updateCounter);
          notifiedListenersCurrentRow[j] = listener;
          notifiedCount++;
          continue;
        }
      }

    }
    this.prevListeners = notifiedListeners;
    this.prevListnersCount = notifiedCount;
    const listenersCount = notifiedCount + this.prevListnersCount;
    console.log(`Listeners found ${listenersCount}, notified ${notifiedCount},
       notified old: ${notifiedCountOld}`, prevListeners, notifiedListeners);
  }

  focusChanged(el: LogicComponentDto, location: SquareLocation, state: CanvasComponentState) {
    const rowIndex = location.row;
    const colIndex = location.column;
    const index = location.index;
    console.log(state);
    const row = this.elementsMatrix[rowIndex];
    if (!row) {
      throw new Error(`Focus row ${rowIndex} not found`);
    }

    const col = row[colIndex];
    if (!col) {
      throw new Error(`Focus column ${colIndex}, ${rowIndex} not found`);
    }

    const node = col[index];
    if (!node) {
      throw new Error(`Focus node ${colIndex}, ${rowIndex}, ${index} not found`);
    }
    const focusedThing = state.isFocused ? node : null;
    this.focusSetter(focusedThing);
    const updateListener = this.listnerMatrix[rowIndex]![colIndex];
    if (updateListener) {
      updateListener(false, focusedThing, new Date().getTime());
    }
  }
  protected safeFloor(val: number) {
    return Math.floor(val);
  };
  protected getVisibleSquares(boundaries: RectCoords): RectCoords {
    const safetyX = Math.ceil((this.viewPort.right - this.viewPort.left) / (this.squareWidth * 2));
    const safetyY = Math.ceil((this.viewPort.bottom - this.viewPort.top) / (this.squareHeight * 2));

    const matrixRect : RectCoords = {
      left: this.safeFloor(boundaries.left / this.squareWidth) - safetyX,
      right: this.safeFloor(boundaries.right / this.squareWidth) + safetyX,
      top: this.safeFloor(boundaries.top / this.squareHeight) - safetyY,
      bottom: this.safeFloor(boundaries.bottom / this.squareHeight) + safetyY,
    };
    console.log('Visible Square', boundaries, matrixRect, safetyX, safetyY);
    return matrixRect;
  }

}
