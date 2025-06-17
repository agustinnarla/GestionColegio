import { pool } from '../dataBase/coneccion.mjs'

export const obtenerEvaluacionesPorAlumno = async (req, res) => {
    const { dni_alumno } = req.params;
    try {
        const resultado = await pool.query(
            `SELECT 
                e.id_evaluacion, 
                m.detalle AS materia_detalle, 
                te.detalle, 
                TO_CHAR(e.fecha, 'DD-MM-YYYY') AS fecha, 
                e.tema_abarcado, 
                c.detalle AS curso_detalle, 
                e.dni_profesional
             FROM evaluacion e
             JOIN alumno_curso ac 
                ON e.id_curso = ac.id_curso 
             JOIN materia m
                ON m.id_materia = e.id_materia
             JOIN curso c 
                ON c.id_curso = e.id_curso
             JOIN tipo_de_evaluacion te
                ON te.id_tipo_de_evaluacion = e.id_tipo_de_evaluacion
             WHERE ac.dni_alumno = $1
             ORDER BY e.fecha ASC`,
            [dni_alumno]
        );
        res.json({ evaluaciones: resultado.rows });
    } catch (error) {
        console.error('Error al obtener evaluaciones:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const obtenerEvaluacionesCargadas= async (req, res) => {
    const { dni_profesional } = req.params;
    try {
        const resultado = await pool.query(
            `SELECT 
                e.id_evaluacion, 
                m.detalle AS materia_detalle, 
                te.detalle, 
                TO_CHAR(e.fecha, 'DD-MM-YYYY') AS fecha, 
                e.tema_abarcado, 
                c.detalle AS curso_detalle
             FROM evaluacion e
             JOIN profesional p
                ON p.dni_profesional = e.dni_profesional
             JOIN materia m
                ON m.id_materia = e.id_materia
             JOIN curso c 
                ON c.id_curso = e.id_curso
             JOIN tipo_de_evaluacion te
                ON te.id_tipo_de_evaluacion = e.id_tipo_de_evaluacion
             WHERE p.dni_profesional = $1
             ORDER BY e.fecha ASC`,
            [dni_profesional]
        );
        res.json({ evaluaciones: resultado.rows });
    } catch (error) {
        console.error('Error al obtener evaluaciones:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

