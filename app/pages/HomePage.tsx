import {CSSProperties} from 'react';
import {PageContainer} from '../components/PageContainer/PageContainer';

export function HomePage() {
  const style: CSSProperties = {
    marginTop: '62.5px',
    margin: '62.5px auto 0px',
    width: '1024px',
  };
  return (
    <PageContainer>
      <div style={style}>Hello world</div>
   </PageContainer>
  );
}
