import {pool} from '../dataBase/coneccion.mjs'


//Ver 
export const obtenerEstadoAsistencia = async (req,res) => {
    try{
        //Estado asistencia
        const respuesta = await pool.query("SELECT id_estado_asistencia,detalle FROM estado_asistencia ")
        res.json({sexo: respuesta.rows})
    }
    catch{
        console.log("Error a traer los estados de asistencia")
    }
}

