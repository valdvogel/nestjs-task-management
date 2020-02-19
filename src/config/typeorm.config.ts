import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig : TypeOrmModuleOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 33061,
    username: 'root',
    password:'12345678',
    database: 'taskmanagement',
    entities: [__dirname + '/../**/*.entity{.js,.ts}'],
    synchronize: true,
}