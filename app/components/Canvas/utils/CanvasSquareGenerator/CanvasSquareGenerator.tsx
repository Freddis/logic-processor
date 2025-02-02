import {JSX, ReactElement} from 'react';
import {CanvasSquare} from '../../components/CanvasSquare/CanvasSquare';
import {CanvasSquareProps} from '../../components/CanvasSquare/types/CanvasSquareProps';
import {CanvasSquareStateSetter} from '../../components/CanvasSquare/types/CanvasSquareStateSetter';
import {RectCoords} from '../../types/RectCoords';
import {CanvasElementProps} from '../../types/CanvasElementProps';
import {Logger} from '../../../../utls/Logger/Logger';


export class CanvasSquareGenerator {
  protected squareWidth: number = 1000;
  protected squareHeight: number = 1000;
  protected extraGenerationMarginPx = 2000;
  protected extraPreloadMarginPx = 1000;
  protected viewPort: RectCoords;
  protected listnerMatrix: CanvasSquareStateSetter[][] = [];
  protected prevListeners2: CanvasSquareStateSetter[] = [];
  protected updateCounter = 0;
  // protected prevListnersCount: number = 0;
  protected elementsMatrix: JSX.Element[][][] = [];
  // eslint-disable-next-line no-empty-function
  protected focusSetter: (node: JSX.Element| null) => void = () => {};
  protected debug: boolean;
  protected logger = new Logger(CanvasSquareGenerator.name);

  constructor(viewPort: RectCoords, debug = false) {
    this.viewPort = viewPort;
    this.debug = debug;
    this.logger.debug('Constructed square creator', {
      viewPort,
      squareWidth: this.squareWidth,
      squareHeight: this.squareHeight,
    });
  }

  getSqueres(elements : ReactElement<CanvasElementProps>[]): JSX.Element[] {
    const squaresIndexBoundaries: RectCoords = this.getSquareIndexes(elements);
    const elementMatrix = this.createElementMatrix(elements, squaresIndexBoundaries);
    const result = this.createSquares(squaresIndexBoundaries, elementMatrix.elements);
    return result;
  }

  viewPortChanged(viewPort: RectCoords) {
    this.logger.debug('Viewport changed: ', {viewPort});
    const matrixRect = this.getVisibleSquares(viewPort);
    const matrix = this.listnerMatrix;
    let notifiedCount = 0;
    let notifiedCountOld = 0;
    for (const listener of this.prevListeners2) {
      listener(true);
      notifiedCountOld++;
    }
    const notified: CanvasSquareStateSetter[] = [];
    for (let i = matrixRect.left; i <= matrixRect.right; i++) {
      const notifiedListenersCurrentRow:CanvasSquareStateSetter[] = [];
      for (let j = matrixRect.top; j <= matrixRect.bottom; j++) {
        const row = matrix[i];
        if (row) {
          const listener = row[j];
          if (!listener) {
            continue;
          }
          listener(false);
          notified.push(listener);
          notifiedListenersCurrentRow[j] = listener;
          notifiedCount++;
          continue;
        } else {
          throw new Error(`Row ${i} not found`);
        }
      }
    }
    this.prevListeners2 = notified;
    const listenersCount = notifiedCount + notifiedCountOld;
    const msg = `Listeners found ${listenersCount}, notified ${notifiedCount},notified old: ${notifiedCountOld}`;
    this.logger.debug(msg);
  }

  protected createElementMatrix(
    elements: ReactElement<CanvasElementProps>[],
    squareNumbers: RectCoords,
  ): {
    listeners: CanvasSquareStateSetter[][],
    elements: ReactElement<CanvasElementProps>[][][],
  } {
    const sqWidth = this.squareWidth;
    const sqHeight = this.squareHeight;
    const matrix: ReactElement<CanvasElementProps>[][][] = [];
    const listnerMatrix: CanvasSquareStateSetter[][] = [];
    for (let i = squareNumbers.left; i <= squareNumbers.right; i++) {
      const arr: ReactElement<CanvasElementProps>[][] = [];
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
    for (const element of elements) {
      if (!element.props.id) {
        continue;
      }
      const squareNumberX = Math.floor(element.props.x / sqWidth);
      const squareNumberY = Math.floor(element.props.y / sqHeight);
      const matrixRow = matrix[squareNumberX];
      if (matrixRow) {
        const matrixCol = matrixRow[squareNumberY];
        if (matrixCol) {
          matrixCol.push(element);
          continue;
        }
      }
      throw new Error('Square not found');
    }
    return {
      listeners: listnerMatrix,
      elements: matrix,
    };
  }

  protected createSquares(
    squareIndexBoundaries: RectCoords,
    matrix: ReactElement<CanvasElementProps>[][][],
  ): JSX.Element[] {
    const visibleSquaresIndexBoundaries = this.getVisibleSquares(this.viewPort);
    const result: JSX.Element[] = [];
    const time = new Date().getTime();
    this.logger.debug('Drawing squares', {
      squareNumbers: squareIndexBoundaries,
      visibleSquaresIndexes: visibleSquaresIndexBoundaries,
    });
    const xStart = squareIndexBoundaries.left;
    const xEnd = squareIndexBoundaries.right;
    const yStart = squareIndexBoundaries.top;
    const yEnd = squareIndexBoundaries.bottom;
    const elementMatrix: JSX.Element[][][] = [];
    this.elementsMatrix = elementMatrix;
    for (let rowI = xStart; rowI <= xEnd; rowI++) {
      const elementMatrixRow: JSX.Element[][] = [];
      elementMatrix[rowI] = elementMatrixRow;
      const row = matrix[rowI];
      if (!row) {
        const msg = `Row ${rowI} not found`;
        throw Error(msg);
      }
      for (let colI = yStart; colI <= yEnd; colI++) {
        const col = row[colI];
        if (!col) {
          const msg = `Column ${rowI},${colI} not found`;
          throw new Error(msg);
        }
        const elementMatrixCol: JSX.Element[] = [];
        elementMatrixRow[colI] = elementMatrixCol;
        const square = this.createSquare(col, rowI, colI, time, visibleSquaresIndexBoundaries);
        result.push(square);
      }
    }
    return result;
  }
  protected createSquare(
    children: ReactElement<CanvasElementProps>[],
    rowI: number,
    colI: number,
    time: number,
    visibleSquaresIndexBoundaries: RectCoords,
  ) {
    const sqWidth = this.squareWidth;
    const sqHeight = this.squareHeight;
    const rect: RectCoords = {
      left: rowI * sqWidth,
      top: colI * sqHeight,
      right: rowI * sqWidth + sqWidth,
      bottom: colI * sqHeight + sqHeight,
    };
    const id = rowI + '_' + colI;
    const notVisibleHorizontally = rowI < visibleSquaresIndexBoundaries.left || rowI > visibleSquaresIndexBoundaries.right;
    const notVisibleVertically = colI < visibleSquaresIndexBoundaries.top || colI > visibleSquaresIndexBoundaries.bottom;
    const isHidden = notVisibleHorizontally || notVisibleVertically;
    const canvasChange = (setPosition: CanvasSquareStateSetter) => {
      const listnerRow = this.listnerMatrix[rowI];
      if (listnerRow) {
        listnerRow[colI] = setPosition;
        if (!isHidden) {
          this.prevListeners2.push(setPosition);
        }
      } else {
        this.logger.debug("Couldn't find listener in matrix");
      }
    };
    const props: CanvasSquareProps = {
      ...rect,
      id: id,
      isHidden: isHidden,
      children,
      creator: this,
      stateSetterConsumer: canvasChange,
    };
    const element = <CanvasSquare key={id} {...props}></CanvasSquare>;
    return element;
  }

  protected getVisibleSquares(viewPort: RectCoords): RectCoords {
    const safetyX = Math.floor(this.extraPreloadMarginPx / this.squareWidth);
    const safetyY = Math.floor(this.extraPreloadMarginPx / this.squareHeight);

    const visibleSquares : RectCoords = {
      left: Math.floor(viewPort.left / this.squareWidth) - safetyX,
      right: Math.floor(viewPort.right / this.squareWidth) + safetyX,
      top: Math.floor(viewPort.top / this.squareHeight) - safetyY,
      bottom: Math.floor(viewPort.bottom / this.squareHeight) + safetyY,
    };
    this.logger.debug('Visible Squares', {visibleSquares, viewPort, safetyX, safetyY});
    return visibleSquares;
  }

  protected getSquareIndexes(elements: {props: {x: number, y: number}}[]): RectCoords {
    const viewPort = this.viewPort;
    const globalBoundary = elements.reduce((acc, current) => {
      const curX = current.props.x;
      const curY = current.props.y;
      if (curX < acc.left) {
        acc.left = curX;
        console.log('-X', current.props);
      } else if (curX > acc.right) {
        acc.right = curX;
        console.log('+X', current.props);
      }

      if (curY < acc.top) {
        acc.top = curY;
        console.log('-Y', current.props);
      } else if (curY > acc.bottom) {
        acc.bottom = curY;
        console.log('+Y', current.props);
      }
      return acc;
    }, {...viewPort});
    const sqWidth = this.squareWidth;
    const sqHeight = this.squareHeight;
    const extraSquaresX = Math.ceil(this.extraGenerationMarginPx / sqWidth);
    const extraSquaresY = Math.ceil(this.extraGenerationMarginPx / sqHeight);
    const squareNumbers: RectCoords = {
      left: Math.floor(globalBoundary.left / sqWidth) - extraSquaresX,
      top: Math.floor(globalBoundary.top / sqHeight) - extraSquaresY,
      right: Math.floor(globalBoundary.right / sqWidth) + extraSquaresX,
      bottom: Math.floor(globalBoundary.bottom / sqHeight) + extraSquaresY,
    };
    this.logger.debug('Square size: ', {squareNumbers, globalBoundary, extraX: extraSquaresX, extraY: extraSquaresY});
    return squareNumbers;
  }
}
