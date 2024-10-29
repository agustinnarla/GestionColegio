import {pool} from '../dataBase/coneccion.mjs'


export const obtenerCurso = async (req,res) => {
    try{
        const respuesta = await pool.query("SELECT idcurso,detalle FROM curso")
        res.json({curso: respuesta.rows})
    }
    catch{
        console.log("Error al traer los cursos")
    }
}