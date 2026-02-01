import { TypeOrmModuleOptions } from "@nestjs/typeorm";
const ormconfig: TypeOrmModuleOptions = {
  logging: ["error"],
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: 5432,
  database: process.env.POSTGRES_DATABASE || "scheduler",
  username: process.env.POSTGRES_USER || "schdusr",
  password: process.env.POSTGRES_PASSWORD || "password",
  entities: [
    
  ],
  synchronize: false,
};
export default ormconfig;
