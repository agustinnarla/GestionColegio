import {pool} from '../dataBase/coneccion.mjs'


export const obtenerCertificado = async (req,res) => {
    try{

        const respuesta = await pool.query("SELECT idcertificado,detalle FROM certificado ")
        res.json({sexo: respuesta.rows})
    }
    catch{
        console.log("Error a traer el estado del certificado")
    }
}