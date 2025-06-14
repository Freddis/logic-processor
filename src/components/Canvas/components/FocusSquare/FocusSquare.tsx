import {JSX, useState} from 'react';

export function FocusSquare(
  props: {
    addChildren: (setter: (node: JSX.Element| null) => void) => void
  }
) {
  const [children, setChildren] = useState<JSX.Element | null>(null);
  props.addChildren((node: JSX.Element| null) => {
    setChildren(node);
  });
  return <g>{children}</g>;
}
