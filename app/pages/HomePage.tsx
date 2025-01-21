import {PageContainer} from '../components/PageContainer/PageContainer';
import {Component} from '../model/Component';
import {queryOptions, useQuery} from '@tanstack/react-query';

export const componentsQueryOptions = () =>
  queryOptions({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3000/api/components', {
        method: 'GET',
      });
      const json = await res.json();
      return json as {items: Component[]};
    },
  });

export function HomePage() {

  const components = useQuery(componentsQueryOptions());
  console.log(components);
  if (components.isLoading) {
    return (
      <PageContainer>
        <div>Loading...</div>
      </PageContainer>
    );
  }
  return (
    <PageContainer>
      <div>Your projects:</div>
      <div style={{marginTop: '20px'}}>
        {components.data?.items.map((component) => (
          <div key={component.name}>{component.name}</div>
        ))}
      </div>
    </PageContainer>
  );
}
