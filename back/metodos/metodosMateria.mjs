import {pool} from '../dataBase/coneccion.mjs'


//Luego se tendria q traer materias de acuerdo al profesor 
export const obtenerMateria = async (req,res) => {
    try{
        const respuesta = await pool.query("SELECT idmateria,detalle FROM materia")
        res.json({materia: respuesta.rows})
    }
    catch{
        console.log("Error al traer las materia")
    }
}