import {ReactNode} from 'react';

export type CanvasSquareStateSetter = (isHidden: boolean, focused: ReactNode | null, x: number)=>void
