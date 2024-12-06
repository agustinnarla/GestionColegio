import {pool} from '../dataBase/coneccion.mjs'


export const obtenerEstadoInasistencia = async (req,res) => {
    try{

        const respuesta = await pool.query("SELECT idestado,detalle FROM estado ")
        res.json({sexo: respuesta.rows})
    }
    catch{
        console.log("Error a traer los estados de inasistencia")
    }
}

