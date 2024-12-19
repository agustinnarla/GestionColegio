import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

export const pool = new pg.Pool({
    host:"localhost",//process.env.HOST,        
    port:"5432", //process.env.PORT,         
    database:"gestion-colegio", //process.env.DATABASE,       
    user:"postgres",//process.env.USER,
    password:"roma"//process.env.PASSWORD      
})

try {
    await pool.query("SELECT NOW()");
    console.log("Base de datos conectada exitosamente");
  } catch (error) {
    console.log("Hay un error en la conexión de la base de datos: " + error.message);
  }