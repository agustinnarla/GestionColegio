import {pool} from '../dataBase/coneccion.mjs'


export const obtenerEspecialidad = async (req,res) => {
    try{
        const respuesta = await pool.query("SELECT id_especialidad, detalle FROM especialidad")
        res.json({especialidad: respuesta.rows})
    }catch(error){
        res.status(500).json({error: "Error al traer las especial"})
        console.log("Error al traer las especialidades")
    }
}

const Prubea3 = async() => {
    console.log("hola")
}