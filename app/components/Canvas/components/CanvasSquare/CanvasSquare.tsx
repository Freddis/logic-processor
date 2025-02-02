import {JSX, SVGProps, useContext, useMemo, useState} from 'react';
import {CanvasSquareProps} from './types/CanvasSquareProps';
import {CanvasSquareStateSetter} from './types/CanvasSquareStateSetter';
import {CanvasInternalContext} from '../CanvasInternalContext/CanvasInternalContext';


export function CanvasSquare(props: CanvasSquareProps) {
  const context = useContext(CanvasInternalContext);
  const [isHidden, setIsHidden] = useState(props.isHidden);
  const [debugVisibleColor, setDebugVisibleColor] = useState('green');
  const [debugHiddenColor, setDebugHiddenColor] = useState('red');
  const stateSetter: CanvasSquareStateSetter = (isHidden) => {
    setIsHidden(isHidden);
    if (context.debug) {
      setDebugVisibleColor('lightgreen');
      setDebugHiddenColor('pink');
    }
  };
  props.stateSetterConsumer(stateSetter);
  const rectProps: SVGProps<SVGRectElement> = {
    x: props.left,
    y: props.top,
    width: props.right - props.left,
    height: props.bottom - props.top,
    fill: debugVisibleColor,
    stroke: 'black',
    opacity: 0.2,
  };
  let content: JSX.Element[] = useMemo(() => {
    if (context.debug) {
      return [
        <rect key="debug-bg" {...rectProps} />,
        ...props.children,
      ];
    }
    return props.children;
  }, [debugVisibleColor, isHidden]);

  if (isHidden) {
    content = [];
    if (context.debug) {
      const hiddenProps = {
        ...rectProps,
        fill: debugHiddenColor,
      };
      content = [<rect key="debug-bg" {...hiddenProps} />];
    }
  }
  return <g id={props.id}>{content}</g>;
}
