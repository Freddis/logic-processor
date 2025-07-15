import {OpenApiRouteMap, OpenApiSampleRouteType} from 'strap-on-openapi';
import {listProjects} from './projects/listProjects';
import {getProject} from './projects/getProject';

export const openApiRoutes: OpenApiRouteMap<OpenApiSampleRouteType> = {
  '/projects': [listProjects, getProject],
};
