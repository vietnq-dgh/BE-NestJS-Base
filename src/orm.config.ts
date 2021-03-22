import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const config: TypeOrmModuleOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username:'root',
    database:'DB_MY_HUFIER',
    password: 'mysqlVSL@03112000',
    entities: ["dist/common/entities/*.entity{.ts,.js}"],
    synchronize: true
};