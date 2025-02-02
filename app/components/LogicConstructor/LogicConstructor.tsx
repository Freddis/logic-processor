import {CSSProperties, ReactElement, useEffect, useMemo, useState} from 'react';
import {Route} from '../../routes/constructor.$id';
import {queryOptions, useQuery} from '@tanstack/react-query';
import {Canvas} from '../Canvas/Canvas';
import {LogicComponent} from '../LogicComponent/LogicComponent';
import {CanvasElementProps} from '../Canvas/types/CanvasElementProps';
import {LeftMenu} from './LeftMenu';
import {Connector} from '../Connector/Connector';
import {ConnectorDto} from '../../model/ConnectorDto';
import {LogicComponentDto} from '../../model/LogicComponentDto';
import {CanvasSpace} from '../Canvas/components/CanvasSpace/CanvasSpace';
import {PointTargetDto} from '../../model/PointTargetDto';
import {ProjectResponse} from '../../routes/api/types/ProjectResponse';
import {ConnectorProps} from '../Connector/types/ConnectorProps';

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
  const menuWidth = 200;
  const [scale, setScale] = useState(1);
  const [canvasSize, setCanvasSize] = useState({x: 500, y: 400});
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

  useEffect(() => {
    setIsloading(false);
    setReloadCounter(reloadCounter + 1);
    const canvasSizeUpdater = () => {
      setCanvasSize({x: window.innerWidth - menuWidth, y: window.innerHeight});
    };
    canvasSizeUpdater();
    window.addEventListener('resize', canvasSizeUpdater);
    document.addEventListener('fullscreenchange', canvasSizeUpdater);
    return () => {
      window.removeEventListener('resize', canvasSizeUpdater);
      document.removeEventListener('fullscreenchange', canvasSizeUpdater);
    };
  }, []);

  const elements = useMemo(() => {
    const result: {
      components: LogicComponentDto[],
      connections: ConnectorDto[],
    } = {
      components: [],
      connections: [],
    };
    if (!items.data) {
      return result;
    }
    for (const item of items.data.data.project.components) {
      const type = items.data.data.project.componentTypes.find((x) => x.id === item.type);
      if (!type) {
        throw new Error(`Component type '${item.type}' not found`);
      }
      const id = type.label.toLowerCase() + '_' + item.x + '_' + item.y;
      const gate = new LogicComponentDto(id, type.label, item.x, item.y, type.joints);
      result.components.push(gate);
    }

    for (const item of items.data.data.project.connections) {
      const input = new PointTargetDto({x: item.inputX, y: item.inputY});
      const output = new PointTargetDto({x: item.outputX, y: item.outputY});
      const connection = new ConnectorDto(item.id, input, output);
      result.connections.push(connection);
    }

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
    //     const gate = new LogicComponentDto('nand' + x + '_' + y, 'NAND', elX, elY, []);
    //     result.components.push(gate);
    //   }
    // }
    return result;
  }, [items.isLoading]);

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

  const canvasElements: ReactElement<CanvasElementProps>[] = [
    ...elements.components.map((x) => <LogicComponent key={x.id} id={x.id} x={x.x} y={x.y} component={x} />),
    ...elements.connections.map((x) => {
      const props: ConnectorProps = {
        id: x.id.toString(),
        x: x.start.getPosition().x,
        y: x.start.getPosition().y,
        connector: x,
      };
      return <Connector key={x.id} {...props} />;
    }),
  ];

  return (
    <CanvasSpace debug={false} scale={scale} width={canvasSize.x} height={canvasSize.y} >
      <div style={containerStyle}>
        <LeftMenu width={200} setScale={setScale} />
        <Canvas >{canvasElements}</Canvas>
      </div>
    </CanvasSpace>
  );
}
