import {pool} from '../../dataBase/coneccion.mjs'

export const obtenerAlumnosAusentes = async (req, res) => {
    const { fechadesde, fechahasta } = req.params; // Obtenemos fechadesde y fechahasta de los parámetros
    try {
        const respuesta = await pool.query(
            "SELECT a.dni_alumno, CONCAT(a.nombre, ' ', a.apellido) AS nombreapellido, asi.fecha " +
            "FROM alumno AS a " +
            "INNER JOIN asistencia_alumno AS asi ON asi.dni_alumno = a.dni_alumno " +
            "WHERE asi.fecha BETWEEN $1 AND $2 AND id_estado_asistencia = 2",
            [fechadesde, fechahasta]
        );
        console.log('Consulta ejecutada con éxito');
        res.status(200).json({ alumnos: respuesta.rows });
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).json({ error: 'Error al obtener los alumnos ausentes' });
    }
};

export const registrarJustificacion = async (req, res) => {
    const { id_estado_falta_alumno, dni_alumno, id_certificado, fecha } = req.body;
    try {
        // Primero verificamos si ya existe una entrada con el mismo dnialumno y fecha
        const existe = await pool.query(
            "SELECT * FROM justificar_falta_alumno WHERE dni_alumno = $1 AND fecha = $2", 
            [dni_alumno, fecha]
        );

        if (existe.rows.length > 0) {
            // Si existe, obtenemos los datos actuales y los almacenamos en variables
            const registroExistente = existe.rows[0];
            let estadofaltaActual = registroExistente.id_estado_falta_alumno;
            let certificadoActual = registroExistente.id_certificado;

            // Verificamos si id_estado_falta ha cambiado
            if (id_estado_falta_alumno !== estadofaltaActual && id_estado_falta_alumno != null) {
                estadofaltaActual = id_estado_falta_alumno;
            }

            // Verificamos si idcertificado ha cambiado
            if (id_certificado !== certificadoActual && id_certificado != null) {
                certificadoActual = id_certificado;
            }

            // Si no se realizaron cambios, devolvemos un mensaje sin actualizar
            if (estadofaltaActual === registroExistente.id_estado_falta_alumno && certificadoActual === registroExistente.id_certificado) {
                console.log("No se realizaron cambios");
                return res.status(200).json({ justificado: "No se realizaron cambios" });
            }

            console.log("Este es el estado falta actual " + estadofaltaActual)
            console.log("Este es el estado certificado actual " + certificadoActual)

            // Construimos la consulta de actualización con los valores modificados
            const query = `
                UPDATE justificar_falta_alumno
                SET id_estado_falta_alumno = $1, id_certificado = $2
                WHERE dni_alumno = $3 AND fecha = $4
            `;

            // Ejecutamos el UPDATE con los valores nuevos
            const respuesta = await pool.query(query, [
                estadofaltaActual, 
                certificadoActual, 
                dni_alumno, 
                fecha
            ]);

            console.log("Registro actualizado");
            res.status(200).json({ justificado: respuesta.rows });
        } else {
            // Si no existe, insertamos un nuevo registro
            const respuesta = await pool.query(
                "INSERT INTO justificar_falta_alumno (id_estado_falta_alumno, dni_alumno, id_certificado, fecha) VALUES ($1, $2, $3, $4)", 
                [id_estado_falta_alumno, dni_alumno, id_certificado, fecha]
            );
            console.log("Nuevo registro insertado");
            res.status(200).json({ justificado: respuesta.rows });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Hubo un error al procesar la solicitud." });
    }
};


export const obtenerEstadosFalta = async (req,res) => {
    try {
        const respuesta = await pool.query("SELECT id_estado_falta_alumno, detalle FROM estado_falta_alumnos");
        console.log("Datos obtenidos:", respuesta.rows);
        res.status(200).json({estado_falta: respuesta.rows});
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).json({ error: "Error al obtener los datos de estadofalta" });
    }
    
}
export const obtenerJustificarFalta = async (req, res) => {
    try {
        const { fechadesde, fechahasta } = req.params; 

        if (!fechadesde || !fechahasta) {
            return res.status(400).json({ error: "Debe proporcionar fechadesde y fechahasta" });
        }

        const respuesta = await pool.query(
            "SELECT * FROM justificar_falta_alumno WHERE fecha BETWEEN $1 AND $2",
            [fechadesde, fechahasta]
        );

        console.log("Datos obtenidos:", respuesta.rows);
        res.status(200).json({ estadofalta: respuesta.rows });
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).json({ error: "Error al obtener los datos de estadofalta" });
    }
};


export const actualizarEstadoAlumno = async (req, res) => {
    const { dni_alumno } = req.body;  

    try {
        // Verificamos que se reciba el dni_alumno
        if (!dni_alumno) {
            return res.status(400).json({ error: "Falta el parámetro dni_alumno" });
        }

        // Realizamos el UPDATE en la tabla alumno, estableciendo id_estado_general a 2
        const query = `
            UPDATE alumno
            SET id_estado_general = 2
            WHERE dni_alumno = $1
        `;
        
        // Ejecutamos la consulta
        const resultado = await pool.query(query, [dni_alumno]);

        if (resultado.rowCount === 0) {
            return res.status(404).json({ error: "Alumno no encontrado" });
        }

        console.log("Estado actualizado correctamente:", resultado);
        res.status(200).json({ message: "Estado actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar el estado:", error);
        res.status(500).json({ error: "Error al actualizar el estado del alumno" });
    }
};




