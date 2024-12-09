import {pool} from '../dataBase/coneccion.mjs'

export const obtenerAlumnosAusentes = async (req,res) => {
    const {idcurso} = req.params;
    try{
        const respuesta = await pool.query("SELECT a.dnialumno, CONCAT(nombre,' ',apellido) as nombreapellido "
            + 'FROM alumno AS a INNER JOIN  asistencia AS asi ON asi.dnialumno = a.dnialumno'
            + ' WHERE asi.idcurso = $1 AND asi.idestado = 2',[idcurso]) 
        console.log('Todo ok')
        res.status(200).json({alumnos: respuesta.rows})
    }catch(error){
        console.log(error)
    }
}

export const registrarJustificacion = async (req,res) => {
    const {idestadofalta,dnialumno,idcertificado,fecha} = req.body
    try{
        const respuesta = await pool.query("INSERT INTO justificarfalta (idestadofalta,dnialumno,idcertificado,fecha)"
            +"VALUES ($1,$2,$3,$4)",[idestadofalta,dnialumno,idcertificado,fecha])
        console.log("Todo ok")
        res.status(200).json({justificado: respuesta.rows})
    }catch(error){
        console.log(error)
    }
}

