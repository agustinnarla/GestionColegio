import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

export const pool = new pg.Pool({
    host:process.env.HOST,
    port:process.env.PORT,       
    database:process.env.DATABASE,
    user:process.env.USER,
    password:process.env.PASSWORD
})

try {
    await pool.query("SELECT NOW()");
    console.log("Base de datos conectada exitosamente");
  } catch (error) {
    console.log("Hay un error en la conexión de la base de datos: " + error.message);
  }