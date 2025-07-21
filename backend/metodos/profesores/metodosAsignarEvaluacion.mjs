import {pool} from '../../dataBase/coneccion.mjs'

export const obtenerTipoDeEvaluacion = async  (req, res) => {
    try{
        const respuesta = await pool.query('SELECT id_tipo_de_evaluacion,detalle FROM tipo_de_evaluacion')
        res.status(200).json(respuesta.rows)
    }catch(error){
        console.log(error)
        res.status(500).json({error: 'Error al obtener los tipos de evaluación'})
    }
}

const contarEvaluacionesPorCursoYFecha = async (id_curso, fecha) => {
    const resultado = await pool.query(
        'SELECT COUNT(*) FROM evaluacion WHERE id_curso = $1 AND fecha = $2',
        [id_curso, fecha]
    );
    return parseInt(resultado.rows[0].count); 
};

export const registrarEvaluacion = async (req, res) => {
    const { id_materia, id_tipo_de_evaluacion, fecha, tema_abarcado, id_curso, dni_profesional } = req.body;

    try {
        const cantidad = await contarEvaluacionesPorCursoYFecha(id_curso, fecha);

        if (cantidad >= 3) {
            return res.status(400).json({ error: 'No se pueden registrar más de 3 evaluaciones por curso en la misma fecha' });
        }

        const respuesta = await pool.query(
            'INSERT INTO evaluacion (id_materia, id_tipo_de_evaluacion, fecha, tema_abarcado, id_curso, dni_profesional) ' +
            'VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [id_materia, id_tipo_de_evaluacion, fecha, tema_abarcado, id_curso, dni_profesional]
        );

        if (respuesta.rowCount === 0) {
            return res.status(404).json({ error: 'No se pudo registrar la evaluación' });
        }

        res.status(201).json(respuesta.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar la evaluación' });
    }
};