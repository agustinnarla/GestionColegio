import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

export const pool = new pg.Pool({
    host:process.env.HOST, //localhost     
    port:process.env.PORT,         //5432
    database:process.env.DATABASE,   //gestion-colegio    
    user:process.env.USER, //postgres
    password:process.env.PASSWORD      //roma
})

try {
    await pool.query("SELECT NOW()");
    console.log("Base de datos conectada exitosamente");
  } catch (error) {
    console.log("Hay un error en la conexión de la base de datos: " + error.message);
  }