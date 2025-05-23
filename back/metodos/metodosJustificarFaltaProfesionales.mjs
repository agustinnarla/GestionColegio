import {pool} from '../dataBase/coneccion.mjs'

//obtenerEstadoFaltaProfesionales
export async function obtenerEstadosFaltaProfesionales(req, res) {
    try {
      const result = await pool.query('SELECT * FROM estado_falta_profesionales ORDER BY id_estado_falta_profesional');
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener estados de falta profesionales:', error);
      res.status(500).json({ error: 'Error al obtener estados de falta profesionales' });
    }
  }

  //obtenerProfesionalesAusentes
  export async function obtenerFaltasProfesionales(req, res) {
    const { hora_entrada, hora_salida } = req.params;
  
    try {
      const query = `
        SELECT * 
        FROM asistencia_profesional 
        WHERE hora_entrada BETWEEN $1 AND $2
          AND id_estado_asistencia = 2
        ORDER BY hora_entrada ASC
      `;

      const values = [hora_entrada, hora_salida];

      const result = await pool.query(query, values);
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener faltas profesionales por fechas:', error);
      res.status(500).json({ error: 'Error al obtener faltas profesionales por fechas' });
    }
  }

 
  export const registrarJustificacionProfesionales = async (req, res) => {
    const { id_estado_falta, dni_profesional, id_certificado, fecha } = req.body;
    
    try {
        // Primero verificamos si ya existe una entrada con el mismo dni_profesional y fecha
        const existe = await pool.query(
            "SELECT * FROM justificar_falta_profesionales WHERE dni_profesional = $1 AND fecha = $2",
            [dni_profesional, fecha]
        );

        if (existe.rows.length > 0) {
            // Si existe, obtenemos los datos actuales
            const registroExistente = existe.rows[0];
            let estadofaltaActual = registroExistente.id_estadofalta;
            let certificadoActual = registroExistente.id_certificado;

            // Verificamos si id_estadofalta ha cambiado
            if (id_estadofalta !== estadofaltaActual && id_estadofalta != null) {
                estadofaltaActual = id_estadofalta;
            }

            // Verificamos si id_certificado ha cambiado
            if (id_certificado !== certificadoActual && id_certificado != null) {
                certificadoActual = id_certificado;
            }

            // Si no se realizaron cambios, devolvemos un mensaje sin actualizar
            if (estadofaltaActual === registroExistente.id_estado_falta && 
                certificadoActual === registroExistente.id_certificado) {
                console.log("No se realizaron cambios en la justificación profesionales");
                return res.status(200).json({ justificado: "No se realizaron cambios" });
            }

            // Construimos la consulta de actualización
            const query = `
                UPDATE justificar_falta_profesionales
                SET id_estado_falta = $1, id_certificado = $2
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
                "INSERT INTO justificar_falta_profesionales (id_estado_falta, dni_profesional, id_certificado, fecha) " +
                "VALUES ($1, $2, $3, $4) RETURNING *", 
                [id_estado_falta, dni_profesional, id_certificado, fecha]
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