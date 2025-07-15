import {PageContainer} from '../components/PageContainer/PageContainer';
import {useQuery} from '@tanstack/react-query';
import {Link} from '@tanstack/react-router';
import {getProjectsOptions} from '../openapi-client/@tanstack/react-query.gen';

export function HomePage() {
  const items = useQuery(getProjectsOptions());
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
