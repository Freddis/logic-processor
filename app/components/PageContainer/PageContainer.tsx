import {ReactNode} from '@tanstack/react-router';
import {CSSProperties} from 'react';

export function PageContainer(props: {children: ReactNode | ReactNode[]}) {

  const style: CSSProperties = {
    padding: '20px',
  };
  return <div style={style}>{props.children}</div>;
}
