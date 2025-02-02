import {createContext} from 'react';
import {Logger} from '../../../../utls/Logger/Logger';

export const ElementContext = createContext({
  // isFocused: false,
  // isActive: false,
  // onFrontLayer: false,
  state: {
    isDragged: false,
    isFocused: false,
    isActive: false,
    onFrontLayer: false,
  },
  logger: new Logger('unknown'),
});
