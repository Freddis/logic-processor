import {useState, ContextType, FC} from 'react';
import {CanvasContext} from '../CanvasContext/CanvasContext';
import {CanvasInternalContext} from '../CanvasInternalContext/CanvasInternalContext';
import {CanvasSpaceProps} from './types/CanvasSpaceProps';
import {MouseCatcher} from '../../utils/MouseCatcher/MouseCatcher';

export const CanvasSpace: FC<CanvasSpaceProps> = (props) => {
  const [activeElements, setActiveElements] = useState(0);
  const debug = props.debug ?? false;
  const contextValue: ContextType<typeof CanvasContext> = {
    debug: props.debug ?? debug,
    mouse: new MouseCatcher(0, 0, 0),
    activeElements: activeElements,
    scale: props.scale ?? 1,
    size: {
      width: props.width,
      height: props.height,
    },
    // eslint-disable-next-line no-empty-function
    setFocusedElement: () => { },
    // eslint-disable-next-line no-empty-function
    setActive: () => {},
  };
  const internalContextValue: ContextType<typeof CanvasInternalContext> = {
    scale: props.scale ?? 1,
    debug: props.debug ?? debug,
    size: {
      width: props.width,
      height: props.height,
    },
    setActiveElements,
  };

  return (
  <CanvasContext.Provider value={contextValue}>
    <CanvasInternalContext.Provider value={internalContextValue}>
      {props.children}
    </CanvasInternalContext.Provider>
  </CanvasContext.Provider>
  );
};
