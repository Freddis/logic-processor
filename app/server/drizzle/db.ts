import pg from 'pg';
import {serverConfig} from '../../utls/ServerConfig/config';
import {drizzle as pgDrizzle} from 'drizzle-orm/node-postgres';
import {QueryLogger} from '../../utls/QueryLogger/QueryLogger';
import * as schema from './schema/schema';

const pgClient = new pg.Client(serverConfig.database);
await pgClient.connect();
export const db = pgDrizzle(pgClient, {
  logger: new QueryLogger(false, true, 'postgres'),
  schema: schema,
});

export const dbSchema = schema;
