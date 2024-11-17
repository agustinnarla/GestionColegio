import {pool} from '../dataBase/coneccion.mjs'

export const registrarAsistencia = async (req,res) => {

    const {idcurso,dnialumno,idestado,fecha} = req.body;
    try{
        const respuesta = await pool.query("INSERT INTO ")
    }catch(error){
        console.log(error)
        res.status(500).json({ error: 'Error al registrar la asistencia de los alumnos' })
    }
}