import { pool } from '../../dataBase/coneccion.mjs'



export const obtenerProfesionalesAsistencia = async (req, res) => {
    try {
        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const diaActual = diasSemana[new Date().getDay()];
        const fechaActual = new Date().toISOString().split('T')[0];

        const respuesta = await pool.query(
            `SELECT DISTINCT CONCAT(p.nombre, ' ', p.apellido) as nombre_apellido, p.dni_profesional
            FROM horario h
            INNER JOIN profesional p ON p.dni_profesional = h.dni_profesional
            LEFT JOIN asistencia_profesional a ON a.dni_profesional = p.dni_profesional AND a.fecha = $1
            WHERE h.dia_semana = $2
            AND (a.dni_profesional IS NULL OR a.hora_salida IS NULL)`,
            [fechaActual, diaActual]
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
  const profesionales = req.body;

  if (!Array.isArray(profesionales) || profesionales.length === 0) {
    return res.status(400).json({ message: 'Se esperaba un array de profesionales' });
  }

  try {
    for (const profesional of profesionales) {
      const { dni_profesional, hora_entrada, fecha } = profesional;

      const respuesta = await pool.query(
        "INSERT INTO asistencia_profesional (dni_profesional, fecha, hora_entrada, hora_salida, id_estado_asistencia) " +
        "VALUES ($1, $2, $3, NULL, 1)",
        [dni_profesional, fecha, hora_entrada]
      );

      if (respuesta.rowCount === 0) {
        console.warn(`No se pudo registrar la entrada para el profesional ${dni_profesional}`);
      }
    }

    console.log('Entradas de profesionales registradas exitosamente');
    res.json({ message: 'Entradas de profesionales registradas exitosamente' });

  } catch (error) {
    console.error('Error al registrar entradas de los profesionales:', error);
    res.status(500).json({ error: 'Error al registrar entradas de los profesionales' });
  }
};

export const registrarSalidaProfesional = async (req, res) => {
  const profesionales = req.body;

  if (!Array.isArray(profesionales) || profesionales.length === 0) {
    return res.status(400).json({ message: 'Se esperaba un array de profesionales' });
  }

  try {
    for (const profesional of profesionales) {
      const { dni_profesional, hora_salida, fecha } = profesional;

      const respuesta = await pool.query(
        "UPDATE asistencia_profesional " +
        "SET hora_salida = $1 " +
        "WHERE dni_profesional = $2 AND fecha = $3 AND hora_salida IS NULL",
        [hora_salida, dni_profesional, fecha]
      );

      if (respuesta.rowCount === 0) {
        console.warn(`No se pudo registrar la salida o ya fue registrada para el profesional ${dni_profesional}`);
      }
    }

    console.log('Salidas de profesionales registradas exitosamente');
    res.json({ message: 'Salidas de profesionales registradas exitosamente' });

  } catch (error) {
    console.error('Error al registrar salidas de los profesionales:', error);
    res.status(500).json({ error: 'Error al registrar salidas de los profesionales' });
  }
};

export const marcarAusentes = async (req, res) => {
    try {
        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const diaActual = diasSemana[new Date().getDay()];
        const fechaActual = new Date().toISOString().split('T')[0]; 

        
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