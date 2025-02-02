import {FC, useContext, useState, useMemo, ContextType} from 'react';
import {Logger} from '../../../../utls/Logger/Logger';
import {ElementContext} from '../ElementContext/ElementContext';
import {PlaneContext} from '../PlaneContext/PlaneContext';
import {StatefulCanvasElementProps} from './types/StatefulCanvasElementProps';

export const StatefulCanvasElement: FC<StatefulCanvasElementProps> = (props) => {
  const context = useContext(PlaneContext);
  const [display, setDisplay] = useState(context.frontLayer === props.elementState.onFrontLayer);
  const [state, setState] = useState(props.elementState);
  props.manager.subscribe(props.id, context.frontLayer, state, (state) => {
    const result = state.onFrontLayer === context.frontLayer;
    setDisplay(result);
    setState(state);
  });
  const children = useMemo(() => {
    if (!display) {
      return null;
    }
    const contextValue: ContextType<typeof ElementContext> = {
      state,
      logger: new Logger(props.id),
    };
    return (
      <ElementContext value={contextValue}>{props.children}</ElementContext>
    );
  }, [state]);
  return children;
};
