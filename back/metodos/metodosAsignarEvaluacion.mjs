import {pool} from '../dataBase/coneccion.mjs'

export const obtenerTipoDeEvaluacion = async  (req, res) => {
    try{
        const respuesta = await pool.query('SELECT id_tipo_de_evaluacion,detalle FROM tipo_de_evaluacion')
        res.status(200).json(respuesta.rows)
    }catch(error){
        console.log(error)
        res.status(500).json({error: 'Error al obtener los tipos de evaluación'})
    }
}

export const registrarEvaluacion = async (req, res) => {

    const {id_materia, id_tipo_de_evaluacion, fecha, tema_abarcado, id_curso, dni_profesional} = req.body
    try{
        const respuesta = await pool.query('INSERT INTO evaluacion (id_materia, id_tipo_de_evaluacion, fecha, tema_abarcado, id_curso, dni_profesional) ' +
            'VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', 
            [id_materia, id_tipo_de_evaluacion, fecha, tema_abarcado, id_curso, dni_profesional])
        res.status(201).json(respuesta.rows[0])
        if(respuesta.rowCount === 0){
            return res.status(404).json({error: 'No se pudo registrar la evaluación'})
        }
    }catch(error){
        console.log(error)
        res.status(500).json({error: 'Error al registrar la evaluación'})
    }
}