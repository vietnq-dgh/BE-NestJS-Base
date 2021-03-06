import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const config: TypeOrmModuleOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username:'root',
    database:'DB_TEST_03',
    password: 'phuocidol@113Aa',
    entities: ["dist/**/*.entity{.ts,.js}"],
    synchronize: true
};