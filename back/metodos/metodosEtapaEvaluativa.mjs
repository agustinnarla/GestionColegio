import {pool} from '../dataBase/coneccion.mjs'


//Luego se tendria q traer materias de acuerdo al profesor 
export const obtenerEtapaEvaluativa = async (req,res) => {
    try{
        const respuesta = await pool.query("SELECT idetapas,detalle FROM estapas")
        res.json({materia: respuesta.rows})
    }
    catch{
        console.log("Error al traer las materia")
    }
}