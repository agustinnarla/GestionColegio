import { pool } from '../dataBase/coneccion.mjs'

export const obtenerProfesoresAsistencia = async (req, res) => {
    try {
        // Obtener el día actual del sistema
        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const diaActual = diasSemana[new Date().getDay()]; // Obtiene el día de la semana en texto

        // Consulta a la base de datos usando el día actual
        const respuesta = await pool.query(
            "SELECT DISTINCT CONCAT(p.nombre, ' ', p.apellido) as nombre_apellido, p.dni_profesor " + // Espacio agregado al final
            "FROM horario as h INNER JOIN profesores p ON p.dni_profesor = h.dni_profesor WHERE h.dia_semana = $1",
            [diaActual]
        );
        // Verificar si hay resultados
        if (respuesta.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron profesores para el día de hoy' });
        }

        console.log('Profesores traídos exitosamente');
        res.json({ profesor: respuesta.rows });

    } catch (error) {
        console.error('Error al obtener los profesores:', error);
        res.status(500).json({ error: 'Error al obtener los profesores' });
    }
};

export const registrarEntradaProfesor = async (req, res) => {
    const { dni_profesor, hora_entrada, fecha } = req.body;
    try {
        const respuesta = await pool.query(
            "INSERT INTO asistencia_profesor (dni_profesor, fecha, hora_entrada, hora_salida) " +
            "VALUES ($1, $2, $3, NULL)", // La salida se deja como NULL
            [dni_profesor, fecha, hora_entrada]
        );
        if (respuesta.rowCount === 0) {
            return res.status(404).json({ message: 'No se pudo registrar la entrada del profesor' });
        }
        console.log('Entrada del profesor registrada exitosamente');
        res.json({ message: 'Entrada del profesor registrada exitosamente' });

    } catch (error) {
        console.error('Error al registrar la entrada del profesor:', error);
        res.status(500).json({ error: 'Error al registrar la entrada del profesor' });
    }
};

export const registrarSalidaProfesor = async (req, res) => {
    const { dni_profesor, hora_salida, fecha } = req.body;
    try {
        const respuesta = await pool.query(
            "UPDATE asistencia_profesor " +
            "SET hora_salida = $1 " +
            "WHERE dni_profesor = $2 AND fecha = $3 AND hora_salida IS NULL", // Asegura que no se sobrescriba una salida ya registrada
            [hora_salida, dni_profesor, fecha]
        );
        if (respuesta.rowCount === 0) {
            return res.status(404).json({ message: 'No se pudo registrar la salida del profesor o ya fue registrada' });
        }
        console.log('Salida del profesor registrada exitosamente');
        res.json({ message: 'Salida del profesor registrada exitosamente' });

    } catch (error) {
        console.error('Error al registrar la salida del profesor:', error);
        res.status(500).json({ error: 'Error al registrar la salida del profesor' });
    }
};