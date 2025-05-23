import {pool} from '../dataBase/coneccion.mjs'

//Obtener Estado general
export const obtenerEstadoGeneral = async (req,res) => {
    try{
        const respuesta = await pool.query("SELECT id_estado_general,detalle FROM estado_general")
        res.json({estadoGeneral : respuesta.rows})
    }catch{
        console.log("Error al traer el estado general")
    }
}