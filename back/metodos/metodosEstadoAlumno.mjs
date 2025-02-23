import {pool} from '../dataBase/coneccion.mjs'

export const obtenerEstadoAlumno = async (req,res) => {
    try{
        const respuesta = await pool.query("SELECT id_estadoalumno,detalle FROM estadoalumno")
        res.json({estadoAlumno : respuesta.rows})
    }catch{
        console.log("Error al traer el estado del alumno")
    }
}