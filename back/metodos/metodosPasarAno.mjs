import {pool} from '../dataBase/coneccion.mjs'


export const obtenerAlumnoFinal = async (req, res) => {
    const { id_curso } = req.params;
    try {
        // Traer alumnos del curso y contar cuántas materias tienen promedio < 6 (finales)
        const respuesta = await pool.query(
            `SELECT 
                a.dni_alumno, 
                CONCAT(a.nombre, ' ', a.apellido) AS nombrecompleto,
                COUNT(CASE WHEN am.promedio < 6 THEN 1 END) AS finales,
                AVG(am.promedio) AS promedio
            FROM alumno a
            INNER JOIN alumno_curso ac ON a.dni_alumno = ac.dni_alumno
            INNER JOIN alumno_materia am ON a.dni_alumno = am.dni_alumno
            WHERE ac.id_curso = $1 
              AND a.id_estado_general = 1 
              AND am.id_estado_evaluativo = 1
            GROUP BY a.dni_alumno, a.nombre, a.apellido`,
            [id_curso]
        );

        // Solo alumnos con menos de 3 finales
        const alumnosConInfo = respuesta.rows
            .filter(alumno => Number(alumno.finales) < 3)
            .map(alumno => ({
                dni_alumno: alumno.dni_alumno,
                nombrecompleto: alumno.nombrecompleto,
                promedio: Number(alumno.promedio),
                finales: Number(alumno.finales),
                tieneFinal: Number(alumno.finales) > 0 // true si tiene al menos un final
            }));

        res.status(200).json({ alumnos: alumnosConInfo });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener alumnos' });
    }
};

export const registrarCursoNuevo = async (req, res) => {
    try {
        const alumnos = req.body; // Espera un array de alumnos

        if (!Array.isArray(alumnos) || alumnos.length === 0) {
            return res.status(400).json({
                message: "Se esperaba un array de alumnos"
            });
        }

        // Obtener el curso actual del primer alumno para referencia
        const cursoActual = await pool.query(
            `SELECT c.detalle 
            FROM alumno_curso ac 
            JOIN curso c ON ac.id_curso = c.id_curso 
            WHERE ac.dni_alumno = $1`,
            [alumnos[0].dni_alumno]
        );

        if (!cursoActual.rows[0]) {
            return res.status(404).json({
                message: 'No se encontró el curso actual'
            });
        }

        // Extraer el número del curso actual (ej: "1a" => 1)
        const detalle = cursoActual.rows[0].detalle;
        const match = detalle.match(/^(\d+)/);
        if (!match) {
            return res.status(400).json({
                message: 'El detalle del curso actual no tiene un número válido'
            });
        }
        const añoActual = parseInt(match[1]);
        const añoSiguiente = añoActual + 1;

        // Buscar el primer curso del año siguiente (por ejemplo, "2a")
        const cursoSiguiente = await pool.query(
            `SELECT id_curso 
            FROM curso 
            WHERE detalle LIKE $1
            ORDER BY detalle ASC
            LIMIT 1`,
            [`${añoSiguiente}%`]
        );

        if (!cursoSiguiente.rows[0]) {
            return res.status(404).json({
                message: `No existe un curso siguiente (${añoSiguiente}°) para este grupo.`
            });
        }

        const idcursonuevo = cursoSiguiente.rows[0].id_curso;

        // Actualizar todos los alumnos en una sola transacción
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            for (const alumno of alumnos) {
                await client.query(
                    'UPDATE alumno_curso SET id_curso = $1 WHERE dni_alumno = $2',
                    [idcursonuevo, alumno.dni_alumno]
                );
            }

            await client.query('COMMIT');

            res.status(200).json({
                success: true,
                message: "Alumnos actualizados correctamente"
            });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

    } catch (error) {
        console.log('Error:', error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}