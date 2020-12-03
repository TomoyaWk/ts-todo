import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";

//接続情報
const pool = new Pool({
    database: 'development',
    user: 'admin',
    password: 'password',
    host: '127.0.0.1',
    port: 5433
});

/**
 * DB接続クラス
 * 
 */
export class DBAccessor {

    /**
     * タスク一覧情報取得
     * @returns { any } result
     */
    public get = async () => {
        //接続
        const client = await pool.connect();

        try {
            //実行SQL
            const query = {
                text: 'select * from public."TodoTasks"',
            };
            
            //sql投げる
            const result = await client.query(query);
            
            return result.rows;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            //接続終了
            client.release()
        }
    };

    /**
     * 
     * @param title 
     */ 
    public create = async (title: string) => {
        //接続
        const client = await pool.connect();

        try {
            //実行SQL
            const query = {
                text: 'insert into public."TodoTasks" (uuid, title, "createdAt", "updatedAt") VALUES ( $1, $2, current_timestamp, current_timestamp)',
                values: [uuidv4(), title]
            };
            
            //sql投げる
            await client.query(query);
            
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            //接続終了
            client.release()
        }
    };

    /**
     * 更新
     * 
     * 
     */
    public update = async ({
        uuid,
        title,
        status,
    }: {
        uuid: string;
        title: string;
        status: string;
    }) => {

        //接続
        const client = await pool.connect();

        try {
            //実行SQL
            const query = {
                text: 'update public."TodoTasks" set title = $2, status=$3, updateAt=current_timestamp where uuid = $1',
                values: [uuid, title, status]
            };
            
            //sql投げる
            await client.query(query);
            
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            //接続終了
            client.release()
        }
    };

    public delete = async ( { uuid } : {uuid: string} ) => {

        //接続
        const client = await pool.connect();

        try {
            //実行SQL
            const query = {
                text: 'delte from public."TodoTasks" where uuid = $1',
                values: [uuid]
            };
            
            //sql投げる
            await client.query(query);
            
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            //接続終了
            client.release()
        }
    };

}