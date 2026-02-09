import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import config from '../ormconfig';

const dataSourceCache = new Map<string, DataSource>();

export async function getOrganizationConnection(organizationId: string): Promise<DataSource> {
  const connectionName = `org_${organizationId}`;

  if (dataSourceCache.has(connectionName)) {
    const dataSource = dataSourceCache.get(connectionName)!;
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    return dataSource;
  }

  const newDataSource = new DataSource({
    ...(config as PostgresConnectionOptions),
    name: connectionName,
    schema: connectionName,
  });

  dataSourceCache.set(connectionName, newDataSource);
  await newDataSource.initialize();
  return newDataSource;
}
