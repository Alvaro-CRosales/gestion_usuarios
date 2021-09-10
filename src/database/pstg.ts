import {Pool} from "pg"
import * as dotenv from "dotenv";
dotenv.config();
const PORTPG: number = parseInt(process.env.PORTP as string);


const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: PORTPG
});

export const connect = async () => {
    try {
        await pool.connect();
        console.log(`conectado a la base de datos`)
    } catch (error) {
        console.log(error)
    }
}

export default pool;