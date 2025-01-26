import {JSX, ReactElement, useContext, useMemo, useState} from 'react';
import {CanvasSquareProps} from './types/CanvasSquareProps';
import {CanvasSquareStateSetter} from './types/CanvasSquareStateSetter';
import {LogicComponentDto} from '../../../../model/AndGate';
import {
  CanvasComponentState,
  CanvasLogicComponent,
  CanvasLogicComponentProps,
} from '../../../CanvasLogicComponent/CanvasLogicComponent';
import {CanvasContext} from '../../CanvasContext';


export function CanvasSquare(props: CanvasSquareProps) {
  const [isHidden, setIsHidden] = useState(props.isHidden);
  const [update, setUpdate] = useState(props.lastUpdate);
  const [focused, setFocused] = useState<string | null>(null);
  const context = useContext(CanvasContext);
  const [childrenStates, setChildrenState] = useState<Map<string, CanvasComponentState>>(new Map());

  const createElement = (el: LogicComponentDto, props?: CanvasComponentState): JSX.Element => {
    let dragged = false;
    const componentProps: CanvasLogicComponentProps = {
      ...el,
      ...props,
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
        console.log('Focus in', state);
        const copy = <CanvasLogicComponent key={el.id} {...{...componentProps, ...state}}/>;
        context.squareCreator.focusSetter(copy);
        setFocused(el.id);
      },
      onFocusOut: (state) => {
        console.log('Focus out', state);
        if (dragged) {
          console.log('skip focus out', dragged);
          return;
        }
        setFocused(null);
        setUpdate(new Date().getTime());
        context.squareCreator.focusSetter(null);
        childrenStates.set(el.id, state);
        setChildrenState(childrenStates);
      },
    };
    const element = <CanvasLogicComponent key={el.id} {...componentProps}/>;
    return element;
  };
  const stateSetter: CanvasSquareStateSetter = (isHidden, updatedNode, update) => {
    setIsHidden(isHidden);
    setUpdate(update);
    if (!updatedNode) {
      return;
    }
  };
  props.stateSetterConsumer(stateSetter);

  let content: ReactElement<CanvasLogicComponentProps>[] | null = useMemo(() => {
    console.log('memoing', props.id, update, isHidden);
    const arr = props.children.filter((x) => x.id !== focused).map((x) => {
      const state: CanvasComponentState = childrenStates.get(x.id) ?? {};
      return createElement(x, state);
    });

    return [
      // <rect key={1} x={props.left}
      //       y={props.top} width={props.right - props.left}
      //       height={props.bottom - props.top} fill={props.color ?? 'red'} opacity={0.2} />,
      ...arr, //.filter((x) => x !== focused),
    ];
  }, [isHidden, update]);
  if (isHidden) {
    content = null;
  // return null;
  }
  return <g id={props.id}>{content}</g>;
}
