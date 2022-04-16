import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from 'config';



const dbconfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: dbconfig.type,
    host: process.env.RDS_HOSTNAME || dbconfig.host,
    port: process.env.RDS_PORT ||dbconfig.port,
    username: process.env.RDS_USERNAME || dbconfig.username,
    password: process.env.RDS_PASSWORD || dbconfig.password,
    database: process.env.RDS_DB_NAME|| dbconfig.database,
    // entities: [__dirname + '/../**/*.entity.ts'],
    autoLoadEntities: true,
    synchronize: process.env.TYPEORM_SYNC || dbconfig.synchronize
}