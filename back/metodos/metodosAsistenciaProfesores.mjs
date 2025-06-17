import { pool } from '../dataBase/coneccion.mjs'



export const obtenerProfesionalesAsistencia = async (req, res) => {
    try {
        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const diaActual = diasSemana[new Date().getDay()];

        // Consulta corregida
        const respuesta = await pool.query(
            `SELECT DISTINCT CONCAT(p.nombre, ' ', p.apellido) as nombre_apellido, p.dni_profesional
            FROM horario h
            INNER JOIN profesional p ON p.dni_profesional = h.dni_profesional
            LEFT JOIN asistencia_profesional a ON a.dni_profesional = p.dni_profesional AND a.fecha = CURRENT_DATE
            WHERE h.dia_semana = $1
            AND (a.hora_entrada IS NULL OR a.hora_salida IS NULL)`,
            [diaActual]
        );

        if (respuesta.rows.length === 0) {
            console.log('No hay profesores para registrar asistencia hoy');
            return res.json({ profesor: [], message: 'No hay profesores para registrar asistencia hoy' });
        }

        console.log('Profesores traídos exitosamente');
        res.json({ profesor: respuesta.rows });

    } catch (error) {
        console.error('Error al obtener los profesores:', error);
        res.status(500).json({ error: 'Error al obtener los profesores' });
    }
};


export const registrarEntradaProfesional = async (req, res) => {
    const { dni_profesional, hora_entrada, fecha } = req.body;
    try {
        const respuesta = await pool.query(
            "INSERT INTO asistencia_profesional (dni_profesional, fecha, hora_entrada, hora_salida, id_estado_asistencia) " +
            "VALUES ($1, $2, $3, NULL, 1)", // La salida se deja como NULL
            [dni_profesional, fecha, hora_entrada]
        );
        if (respuesta.rowCount === 0) {
            return res.status(404).json({ message: 'No se pudo registrar la entrada del profesional' });
        }
        console.log('Entrada del profesional registrada exitosamente');
        res.json({ message: 'Entrada del profesional registrada exitosamente' });

    } catch (error) {
        console.error('Error al registrar la entrada del profesional:', error);
        res.status(500).json({ error: 'Error al registrar la entrada del profesional' });
    }
};

export const registrarSalidaProfesional = async (req, res) => {
    const { dni_profesional, hora_salida, fecha } = req.body;
    try {
        const respuesta = await pool.query(
            "UPDATE asistencia_profesional " +
            "SET hora_salida = $1 " +
            "WHERE dni_profesional = $2 AND fecha = $3 AND hora_salida IS NULL", // Asegura que no se sobrescriba una salida ya registrada
            [hora_salida, dni_profesional, fecha]
        );
        if (respuesta.rowCount === 0) {
            return res.status(404).json({ message: 'No se pudo registrar la salida del profesional o ya fue registrada' });
        }
        console.log('Salida del profesional registrada exitosamente');
        res.json({ message: 'Salida del profesional registrada exitosamente' });

    } catch (error) {
        console.error('Error al registrar la salida del profesional:', error);
        res.status(500).json({ error: 'Error al registrar la salida del profesional' });
    }
};

export const marcarAusentes = async (req, res) => {
    try {
        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const diaActual = diasSemana[new Date().getDay()];
        const fechaActual = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Insertar ausentes: los que tenían clases hoy y no tienen asistencia cargada
        const resultado = await pool.query(`
            INSERT INTO asistencia_profesional (dni_profesional, fecha, hora_entrada, hora_salida, id_estado_asistencia)
            SELECT h.dni_profesional, $1, NULL, NULL, 2
            FROM horario h
            WHERE h.dia_semana = $2
            AND NOT EXISTS (
                SELECT 1 FROM asistencia_profesional a
                WHERE a.dni_profesional = h.dni_profesional AND a.fecha = $1
            )
        `, [fechaActual, diaActual]);

        console.log('Ausentes marcados correctamente');
        res.json({ message: 'Ausentes marcados correctamente', total: resultado.rowCount });

    } catch (error) {
        console.error('Error al marcar ausentes:', error);
        res.status(500).json({ error: 'Error al marcar ausentes' });
    }
};