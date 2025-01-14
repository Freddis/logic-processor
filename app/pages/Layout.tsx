import {Outlet, ScrollRestoration} from '@tanstack/react-router';
import {Meta, Scripts} from '@tanstack/start';
import {Header} from '../components/Header/Header';
import {CSSProperties, useEffect} from 'react';

export function Layout() {
  useEffect(() => {
    document.body.style.margin = '0px';
  });
  const bodyStyle: CSSProperties = {
    background: 'rgb(15, 18, 20)',
    color: 'white',
  };
  return (
      <html>
        <head>
          <Meta />
        </head>
        <body style={bodyStyle}>
          <Header/>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
  );
}
