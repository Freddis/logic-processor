import {ContextType} from 'react';
import {CanvasElementProps} from '../../../../../Canvas/types/CanvasElementProps';
import {CanvasContext} from '../../../../../Canvas/components/CanvasContext/CanvasContext';

export interface LogicComponentIconProps extends CanvasElementProps {
  targetCanvasContext: ContextType<typeof CanvasContext>
}
