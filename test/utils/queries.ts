import { IDatabase } from "../../src/databases/IDatabase";

export function insertVipUserQuery(db: IDatabase, hashedUserId: string): Promise<any | any[] | void> {
    return db.prepare("run", 'INSERT INTO "vipUsers" ("userID") VALUES (?)', [hashedUserId]);
}