import { TypeOrmModuleOptions } from "@nestjs/typeorm";
require('dotenv/config');

const {
  DB_HOST,
  DB_DATABASE_PORT,
  DB_USERNAME,
  DB_DATABASE,
  DB_PASSWORD,
  DB_TYPE
} = process.env;

interface IDbType {
  type: 'mysql' | 'postgres',
}

const getDbType = (): IDbType => {
  if (DB_TYPE && DB_TYPE.toLowerCase() === 'mysql') {
    const type: IDbType = { type: 'mysql' };
    return type;
  }
  const type: IDbType = { type: 'postgres' };
  return type;
}

export const config: TypeOrmModuleOptions = {
  type: getDbType().type,
  host: DB_HOST,
  port: Number.parseInt(DB_DATABASE_PORT),
  username: DB_USERNAME,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  entities: ["dist/entities/*.entity{.ts,.js}"],
  synchronize: true
};