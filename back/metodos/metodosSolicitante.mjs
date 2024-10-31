import {pool} from '../dataBase/coneccion.mjs'


export const obtenerSolicitante = async (req,res) => {
    try{
        const respuesta = await pool.query('SELECT nombre_apellido FROM solicitante')
        console.log(respuesta.rows)
        res.status(200).json({solicitante: respuesta.rows})
    }catch(error){
        console.log(error)
        res.status(500).json({error: 'Algo salio mal al obtener los solicitantes'})
    }
}