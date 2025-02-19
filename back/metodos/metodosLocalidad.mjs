import {pool} from '../dataBase/coneccion.mjs'


export const obtenerLocalidad = async (req,res) => {
    try{
        const respuesta = await pool.query("SELECT id_localidad,detalle FROM localidad")
        res.json({localidad: respuesta.rows})
    }catch{
        console.log("Error al traer la localidad")
    }
}