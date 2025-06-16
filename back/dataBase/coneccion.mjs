import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

export const pool = new pg.Pool({
  host: process.env.HOST || 'localhost', // Usa 'localhost' si la variable de entorno no está definida
  port: process.env.PORT || 5432,       // Usa 5432 como valor por defecto
  database: process.env.DATABASE || 'gestion-colegio',
  user: process.env.USER || 'postgres',
  password: process.env.PASSWORD || 'roma'

  //connectionString: process.env.DATA_BASE_URL,
  //ssl:true
});
try {
    await pool.query("SELECT NOW()");
    console.log("Base de datos conectada exitosamente");
  } catch (error) {
    console.log("Hay un error en la conexión de la base de datos: " + error.message);
  }