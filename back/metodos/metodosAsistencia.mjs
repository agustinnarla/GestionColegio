import {pool} from '../dataBase/coneccion.mjs'

export const registrarAsistencia = async (req,res) => {

    const {idcurso,dnialumno,idestado,fecha} = req.body;
    try{
        const respuesta = await pool.query("INSERT INTO asistencia (dnialumno,fecha,idcurso,idestado) VALUES ($1,$2,$3,$4)",[dnialumno,fecha,idcurso,idestado])
        console.log(respuesta.rows)
        res.status(200).json({asistencia: respuesta.rows})
    }catch(error){
        console.log(error)
        res.status(500).json({ error: 'Error al registrar la asistencia de los alumnos' })
    }
}

//Modificar
export const modificarAsistencia = async(req,res) => {
    const {idcurso,dnialumno,idestado,fecha} = req.body;
    try{
        const respuesta = await pool.query("UPDATE asistencia SET dnialumno = $1, fecha = $2, idcurso = $3, idestado = $4",[dnialumno,fecha,idcurso,idestado])
        console.log(respuesta.rows)
        res.status(200).json({asistencia: respuesta.rows})
    }catch{
        console.log(error)
        res.status(500).json({ error: 'Error al registrar la asistencia de los alumnos' })
    }
}