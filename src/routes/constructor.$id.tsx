import {createFileRoute} from '@tanstack/react-router';
import {ConstructorPage} from '../pages/ConstructorPage';

export const Route = createFileRoute('/constructor/$id')({
  component: ConstructorPage,
});
