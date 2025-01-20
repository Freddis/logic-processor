import {ReactNode, useMemo, useState} from 'react';
import {CanvasSquareProps} from './types/CanvasSquareProps';


export function CanvasSquare(props: CanvasSquareProps) {
  const [isHidden, setIsHidden] = useState(props.isHidden);
  const [update, setUpdate] = useState(props.lastUpdate);
  const [focused, setFocused] = useState<ReactNode | null>(null);
  props.stateSetterConsumer((isHidden, focused: ReactNode | null, update) => {
    setIsHidden(isHidden);
    setUpdate(update);
    setFocused(focused);
  });

  let content = useMemo<ReactNode[]>(() => {
    // console.log('memoing', update, isHidden);
    const arr = Array.isArray(props.children) ? props.children : [props.children];
    return [
      // <rect key={1} x={props.left}
      //       y={props.top} width={props.right - props.left}
      //       height={props.bottom - props.top} fill={props.color ?? 'red'} opacity={0.2} />,
      arr.filter((x) => x !== focused),
    ];
  }, [isHidden, update, focused]);
  if (isHidden) {
    content = [null];
    // return null;
  }
  return <g id={props.id}>{content}</g>;
}
