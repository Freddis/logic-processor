import {CSSProperties, useEffect, useMemo, useState} from 'react';
import {Canvas} from '../Canvas/Canvas';
import {LogicComponentDto} from '../../model/AndGate';
import {Route} from '../../routes/constructor.$id';
import {queryOptions, useQuery} from '@tanstack/react-query';

import {ProjectResponse} from '../../routes/api/project.$id';
export const componentsQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['project', id],
    queryFn: async () => {
      const res = await fetch('http://localhost:3000/api/project/' + id, {
        method: 'GET',
      });
      const json = await res.json();
      return json as ProjectResponse;
    },
  });


export function LogicConstructor() {
  const {id} = Route.useParams();
  const items = useQuery(componentsQueryOptions(id));

  const [scale, setScale] = useState(1);
  const [canvasWidth, setCanvasWidth] = useState(500);
  const [canvasheight, setCanvasheight] = useState(400);
  const [isLoading, setIsloading] = useState(true);
  const [isReLoading, setIsReloading] = useState(false);
  const [reloadCounter, setReloadCounter] = useState(1);
  const containerStyle: CSSProperties = {
    width: '100%',
    // height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  const menuWidth = 200;
  const menuStyle: CSSProperties = {
    width: menuWidth,
    justifyItems: 'top',
    display: 'flex',
    flexDirection: 'column',
    padding: '62.5px 20px 0px 20px',
    boxSizing: 'border-box',
    height: '100vh',
  };
  const scaleStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'left',
    flexDirection: 'row',
    marginTop: 20,
  };
  const scaleStep = 1.5;
  const scaleUp = () => {
    setIsReloading(true);
    setScale(scale * scaleStep);
  };
  const scaleDown = () => {
    setIsReloading(true);
    setScale(scale / scaleStep);
  };

  useEffect(() => {
    setIsloading(false);
    setReloadCounter(reloadCounter + 1);
    setCanvasWidth(() => {
      return window.innerWidth - menuWidth;
    });
    setCanvasheight(() => {
      return window.innerHeight;
    });
  }, []);

  const elements = useMemo(() => {
    const result: LogicComponentDto[] = [];
    if (!items.data) {
      console.log('here');
      return result;
    }

    for (const item of items.data.data.project.components) {
      const type = items.data.data.project.componentTypes.find((x) => x.id === item.type);
      if (!type) {
        throw new Error(`Component type '${item.type}' not found`);
      }
      const gate = new LogicComponentDto('and' + item.x + '_' + item.y, type.label, item.x, item.y, type.joints);
      result.push(gate);
    }
    console.log(result);
    // const maxHorizontal = 100;
    // const maxVertical = 100;
    // const hSpacing = 130;
    // const vSpacing = 180;
    // const startX = maxHorizontal / 2 * hSpacing * -1;
    // const startY = maxVertical / 2 * vSpacing * -1;
    // console.log(`Generating gates X: ${maxHorizontal} from ${startX} to ${maxHorizontal * hSpacing}`);
    // console.log(`Generating gates Y: ${maxVertical} from ${startY} to ${maxVertical * vSpacing}`);
    // for (let x = 0; x < maxHorizontal; x++) {
    //   for (let y = 0; y < maxVertical; y++) {
    //     const elX = startX + x * hSpacing;
    //     const elY = startY + y * vSpacing;
    //     // console.log(elX, elY);
    //     const gate = new EndGateDto('and' + x + '_' + y, elX, elY);
    //     result.push(gate);
    //   }
    // }
    return result;
  }, [items.isLoading]);

  const canvasMemo = useMemo(
    () => {
      console.log('Memoing canvas', reloadCounter);
      return <Canvas elements={elements} scale={scale} width={canvasWidth} height={canvasheight} />;
    },
    [reloadCounter, items.isLoading]
  );
  if (isLoading || isReLoading || items.isLoading) {
    if (isReLoading) {
      setTimeout(() => {
        setReloadCounter(reloadCounter + 1);
        setIsReloading(false);
      }, 100);
    }
    return <div style={{margin: '62.5px auto 0px', width: '1024px', marginTop: 62.5, paddingTop: '10px'}}>
      <div>Loading... This can take some time.</div>
      <div> What you expect? It's designed to create x86 CPUs</div>
    </div>;
  }

  return (
    <div style={containerStyle}>
      <div style={menuStyle}>
        <div style={scaleStyle}>
          <b style={{marginRight: 10}}>Scale:</b>
          <button onClick={scaleUp}>+</button>
          <span style={{margin: '0px 5px'}}>{(scale * 100).toFixed(0)}%</span>
          <button onClick={scaleDown}>-</button>
        </div>
      </div>
      {canvasMemo}
    </div>
  );
}
