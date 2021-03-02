import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const config: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username:'postgres',
    database:'user-demo',
    password: '123456789',
    entities: ["dist/**/*.entity{.ts,.js}"],
    synchronize: true
};