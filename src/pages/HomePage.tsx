import {PageContainer} from '../components/PageContainer/PageContainer';
import {queryOptions, useQuery} from '@tanstack/react-query';
import {Project} from '../server/model/Project';
import {Link} from '@tanstack/react-router';

export const componentsQueryOptions = () =>
  queryOptions({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3000/api/v1/projects', {
        method: 'GET',
      });
      const json = await res.json();
      return json as {items: Project[]};
    },
  });

export function HomePage() {
  const items = useQuery(componentsQueryOptions());
  if (items.isLoading) {
    return (
      <PageContainer>
        <div>Loading...</div>
      </PageContainer>
    );
  }
  return (
    <PageContainer>
      <h2>Your projects:</h2>
      <div style={{marginTop: '20px'}}>
        {items.data?.items.map((item) => (
          <div style={{marginTop: 10}} key={item.name}>
            <Link style={{color: '#3399ff', textDecoration: 'none'}} to="/constructor/$id" params={{id: item.id.toString()}}>
              <h3>{item.name}</h3>
            </Link>
          <div>{item.description}</div>
        </div>
        ))}
      </div>
    </PageContainer>
  );
}
