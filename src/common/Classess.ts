import { Connection } from "typeorm";
import PublicModules from "./PublicModules";

export class ParamsForService {
    conn: Connection;
    libs: PublicModules;
}

export class TaskRes {
    statusCode: number;
    message: string;
    result: any;
    total: number;
    bonus: any;
}