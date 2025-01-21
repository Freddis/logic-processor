import 'dotenv/config';
import {defineConfig} from 'drizzle-kit';
import {serverConfig} from './app/utls/ServerConfig/config';

export default defineConfig({
  out: './.drizzle',
  schema: './app/server/drizzle/schema/schema.ts',
  dialect: 'postgresql',
  schemaFilter: serverConfig.database.schema,
  dbCredentials: serverConfig.database,
});
