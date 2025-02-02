import {createContext} from 'react';

export const DraggableContext = createContext <{parentId: string}| null >(null);
