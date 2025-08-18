import {pool} from '../../dataBase/coneccion.mjs'

//obtenerEstadoFaltaProfesionales
export async function obtenerEstadosFaltaProfesionales(req, res) {
    try {
      const respuesta  = await pool.query('SELECT id_estado_falta_profesionales, detalle FROM estado_falta_profesionales ORDER BY id_estado_falta_profesionales');
      res.status(200).json({estado: respuesta.rows})
    } catch (error) {
      console.error('Error al obtener estados de falta profesionales:', error);
      res.status(500).json({ error: 'Error al obtener estados de falta profesionales' });
    }
  }

  //obtenerProfesionalesAusentes
  export async function obtenerProfesionalesAusentes(req, res) {
    const { fecha_desde, fecha_hasta } = req.params;

    try {
      const query = `
        SELECT p.dni_profesional, p.nombre, p.apellido, ap.fecha, ap.id_estado_asistencia, jfp.id_estado_general
        FROM profesional AS p
        INNER JOIN asistencia_profesional AS ap ON ap.dni_profesional = p.dni_profesional
        LEFT JOIN justificar_falta_profesionales AS jfp ON jfp.dni_profesional = p.dni_profesional AND jfp.fecha = ap.fecha
        WHERE ap.fecha BETWEEN $1 AND $2
        AND ap.id_estado_asistencia = 2
        AND (jfp.id_estado_general IS NULL OR jfp.id_estado_general = 0)
        ORDER BY hora_entrada ASC
      `;

      const values = [fecha_desde, fecha_hasta];

      const result = await pool.query(query, values);
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener faltas profesionales por fechas:', error);
      res.status(500).json({ error: 'Error al obtener faltas profesionales por fechas' });
    }
  }

 
  export const registrarJustificacionProfesionales = async (req, res) => {
    const { id_estado_falta_profesionales, dni_profesional, id_certificado, fecha } = req.body;
    
    try {
        // Primero verificamos si ya existe una entrada con el mismo dni_profesional y fecha
        const existe = await pool.query(
            "SELECT * FROM justificar_falta_profesionales WHERE dni_profesional = $1 AND fecha = $2",
            [dni_profesional, fecha]
        );

        if (existe.rows.length > 0) {
            // Si existe, obtenemos los datos actuales
            const registroExistente = existe.rows[0];
            let estadofaltaActual = registroExistente.id_estado_falta_profesionales;
            let certificadoActual = registroExistente.id_certificado;

            // Verificamos si id_estado_falta ha cambiado
            if (id_estado_falta_profesionales !== estadofaltaActual && id_estado_falta_profesionales != null) {
                estadofaltaActual = id_estado_falta_profesionales;
            }

            // Verificamos si id_certificado ha cambiado
            if (id_certificado !== certificadoActual && id_certificado != null) {
                certificadoActual = id_certificado;
            }

            // Si no se realizaron cambios, devolvemos un mensaje sin actualizar
            if (estadofaltaActual === registroExistente.id_estado_falta_profesionales && 
                certificadoActual === registroExistente.id_certificado) {
                console.log("No se realizaron cambios en la justificación profesionales");
                return res.status(200).json({ justificado: "No se realizaron cambios" });
            }

            // Construimos la consulta de actualización
            const query = `
                UPDATE justificar_falta_profesionales
                SET id_estado_falta_profesionales = $1, id_certificado = $2, id_estado_general = 1
                WHERE dni_profesional = $3 AND fecha = $4
            `;

            // Ejecutamos el UPDATE
            const respuesta = await pool.query(query, [
                estadofaltaActual, 
                certificadoActual, 
                dni_profesional, 
                fecha
            ]);

            console.log("Registro PP actualizado");
            res.status(200).json({ justificado: respuesta.rows });
        } else {
            // Si no existe, insertamos un nuevo registro
            const respuesta = await pool.query(
                "INSERT INTO justificar_falta_profesionales (id_estado_falta_profesionales, dni_profesional, id_certificado, fecha, id_estado_general) " +
                "VALUES ($1, $2, $3, $4, 1) RETURNING *", 
                [id_estado_falta_profesionales, dni_profesional, id_certificado, fecha]
            );
            console.log("Nuevo registro profesionales insertado");
            res.status(200).json({ justificado: respuesta.rows[0] });
        }
    } catch (error) {
        console.error("Error al procesar justificación profesionales:", error);
        res.status(500).json({ 
            error: "Hubo un error al procesar la solicitud de justificación profesionales.",
            detalle: error.message 
        });
    }
};