import {pool} from '../dataBase/coneccion.mjs'


export const obtenerSexo = async (req,res) => {
    try{

        const respuesta = await pool.query("SELECT idsexo,detalle FROM sexo ")
        res.json({sexo: respuesta.rows})
    }
    catch{
        console.log("Error a traer los sexos")
    }
}

