import {pool} from '../dataBase/coneccion.mjs'

export async function obtenerEstadosFaltaPP(req, res) {
    try {
      const result = await pool.query('SELECT * FROM estado_falta_pp ORDER BY id_estadofalta_pp');
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener estados de falta PP:', error);
      res.status(500).json({ error: 'Error al obtener estados de falta PP' });
    }
  }

  export async function obtenerFaltasPP(req, res) {
    const { fechaInicio, fechaFin } = req.params;
  
    try {
      const query = `
        SELECT * 
        FROM asistencia_pp 
        WHERE fecha BETWEEN $1 AND $2
          AND id_estadoasistencia = 2
        ORDER BY fecha ASC
      `;
  
      const values = [fechaInicio, fechaFin];
  
      const result = await pool.query(query, values);
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener faltas PP por fechas:', error);
      res.status(500).json({ error: 'Error al obtener faltas PP por fechas' });
    }
  }

  export const registrarJustificacionPP = async (req, res) => {
    const { id_estadofalta, dni_profesor, id_certificado, fecha } = req.body;
    
    try {
        // Primero verificamos si ya existe una entrada con el mismo dni_profesor y fecha
        const existe = await pool.query(
            "SELECT * FROM justificarfalta_pp WHERE dni_profesor = $1 AND fecha = $2", 
            [dni_profesor, fecha]
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
            if (estadofaltaActual === registroExistente.id_estadofalta && 
                certificadoActual === registroExistente.id_certificado) {
                console.log("No se realizaron cambios en la justificación PP");
                return res.status(200).json({ justificado: "No se realizaron cambios" });
            }

            // Construimos la consulta de actualización
            const query = `
                UPDATE justificarfalta_pp 
                SET id_estadofalta = $1, id_certificado = $2
                WHERE dni_profesor = $3 AND fecha = $4
            `;

            // Ejecutamos el UPDATE
            const respuesta = await pool.query(query, [
                estadofaltaActual, 
                certificadoActual, 
                dni_profesor, 
                fecha
            ]);

            console.log("Registro PP actualizado");
            res.status(200).json({ justificado: respuesta.rows });
        } else {
            // Si no existe, insertamos un nuevo registro
            const respuesta = await pool.query(
                "INSERT INTO justificarfalta_pp (id_estadofalta, dni_profesor, id_certificado, fecha) " +
                "VALUES ($1, $2, $3, $4) RETURNING *", 
                [id_estadofalta, dni_profesor, id_certificado, fecha]
            );
            console.log("Nuevo registro PP insertado");
            res.status(200).json({ justificado: respuesta.rows[0] });
        }
    } catch (error) {
        console.error("Error al procesar justificación PP:", error);
        res.status(500).json({ 
            error: "Hubo un error al procesar la solicitud de justificación PP.",
            detalle: error.message 
        });
    }
};