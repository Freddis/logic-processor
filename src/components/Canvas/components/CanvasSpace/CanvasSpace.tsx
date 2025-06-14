import {useState, ContextType, FC, useContext, CSSProperties, ReactElement} from 'react';
import {CanvasContext} from '../CanvasContext/CanvasContext';
import {CanvasInternalContext} from '../CanvasInternalContext/CanvasInternalContext';
import {CanvasSpaceProps} from './types/CanvasSpaceProps';
import {MouseCatcher} from '../../utils/MouseCatcher/MouseCatcher';
import {Canvas} from '../../Canvas';
import {CanvasElementProps} from '../../types/CanvasElementProps';
import {CanvasElementManager} from './utils/CanvasElementManger';

export const CanvasSpace: FC<CanvasSpaceProps> = (props) => {
  const [activeElements, setActiveElements] = useState(0);
  const [globalCanvasChildren, setGlobalCanvasChildren] = useState<ReactElement<CanvasElementProps>[]>([]);
  const debug = props.debug ?? false;
  const existingContxt = useContext(CanvasInternalContext);
  const existingCanvasContext = useContext(CanvasContext);
  const childrenSetter = existingContxt.childContext ? existingCanvasContext.setGlobalCanvasChildren : setGlobalCanvasChildren;
  let targetCanvasId: string | null = null;
  let targetCanvas: SVGSVGElement | null = null;
  const elementManager = new CanvasElementManager();
  const contextValue: ContextType<typeof CanvasContext> = {
    debug: props.debug ?? debug,
    mouse: new MouseCatcher(0, 0, 0),
    activeElements: activeElements,
    scale: props.scale ?? 1,
    size: {
      width: props.width,
      height: props.height,
    },
    canvas: () => {
      if (targetCanvas === null) {
        throw new Error('Target canvas is not set, make sure <Canvas/> is placed into <CanvasSpace/>');
      }
      return targetCanvas;
    },
    // eslint-disable-next-line no-empty-function
    setFocusedElement: () => { },
    // eslint-disable-next-line no-empty-function
    setActive: () => {},
    setGlobalCanvasChildren: (elems: ReactElement<CanvasElementProps>[]) => {
      childrenSetter(elems);
    },
    addElement: elementManager.addElement.bind(elementManager),

  };
  const internalContextValue: ContextType<typeof CanvasInternalContext> = {
    scale: props.scale ?? 1,
    debug: props.debug ?? debug,
    size: {
      width: props.width,
      height: props.height,
    },
    position: {
      x: props.minX,
      y: props.minY,
    },
    globalCanvas: false,
    childContext: true,
    enableScrolling: props.enableScrolling ?? true,
    setActiveElements,
    subsribeToElementUpdates: elementManager.subscribe.bind(elementManager),
    setTargetCanvas: (id: string, canvas: SVGSVGElement) => {
      if (targetCanvasId && targetCanvasId !== id) {
        throw new Error(`Attempt to register canvas '${id}' while '${targetCanvasId}' already registered as target`);
      }
      targetCanvas = canvas;
      targetCanvasId = id;
    },
  };

  const globalCanvasContextValue: ContextType<typeof CanvasInternalContext> = {
    ...internalContextValue,
    globalCanvas: true,
    enableScrolling: false,
    scale: 1,
  };
  const children = props.children;
  const globalCanvasStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 100,
  };
  const globalCanvas = (
  <CanvasInternalContext.Provider value={globalCanvasContextValue}>
    <div className="global-canvas" style={globalCanvasStyle}>
      <Canvas id="global">{globalCanvasChildren}</Canvas>
    </div>
  </CanvasInternalContext.Provider>
);

  const globalCanvasOutput = existingContxt.childContext || globalCanvasChildren.length === 0 ? null : globalCanvas;
  return (
  <CanvasContext.Provider value={contextValue}>
    <CanvasInternalContext.Provider value={internalContextValue}>
      {children}
    </CanvasInternalContext.Provider>
    {globalCanvasOutput}
  </CanvasContext.Provider>
  );
};
