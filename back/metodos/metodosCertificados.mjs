import {pool} from '../dataBase/coneccion.mjs'


export const obtenerEstadoCertificado = async (req,res) => {
    try{

        const respuesta = await pool.query("SELECT id_certificado,detalle FROM certificado ")
        res.json({sexo: respuesta.rows})
    }
    catch{
        console.log("Error a traer el estado del certificado")
    }
}