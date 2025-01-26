import {JSX} from 'react';
import {CanvasComponentState} from '../../../../../types/CanvasComponentState';

export type CanvasSquareStateSetter = (
  isHidden: boolean,
  updatedNode: {
    node: JSX.Element,
    state: CanvasComponentState
  } | null,
  updatedTime: number,
)=>void
