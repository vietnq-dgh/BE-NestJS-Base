import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const config: TypeOrmModuleOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username:'root',
    database:'DB_TEST_03',
    password: 'mysqlVSL@03112000',
    entities: ["dist/**/*.entity{.ts,.js}"],
    synchronize: true
};