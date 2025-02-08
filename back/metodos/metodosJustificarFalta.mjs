import {pool} from '../dataBase/coneccion.mjs'

export const obtenerAlumnosAusentes = async (req, res) => {
    const { fechadesde, fechahasta } = req.params; // Obtenemos fechadesde y fechahasta de los parámetros
    try {
        const respuesta = await pool.query(
            "SELECT a.dnialumno, CONCAT(a.nombre, ' ', a.apellido) AS nombreapellido, asi.fecha " +
            "FROM alumno AS a " +
            "INNER JOIN asistencia AS asi ON asi.dnialumno = a.dnialumno " +
            "WHERE asi.fecha BETWEEN $1 AND $2",
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
    const { idestadofalta, dnialumno, idcertificado, fecha } = req.body;
    try {
        // Primero verificamos si ya existe una entrada con el mismo dnialumno y fecha
        const existe = await pool.query(
            "SELECT * FROM justificarfalta WHERE dnialumno = $1 AND fecha = $2", 
            [dnialumno, fecha]
        );

        if (existe.rows.length > 0) {
            // Si existe, obtenemos los datos actuales y los almacenamos en variables
            const registroExistente = existe.rows[0];
            let estadofaltaActual = registroExistente.idestadofalta;
            let certificadoActual = registroExistente.idcertificado;

            // Verificamos si idestadofalta ha cambiado
            if (idestadofalta !== estadofaltaActual && idestadofalta != null) {
                estadofaltaActual = idestadofalta;
            }

            // Verificamos si idcertificado ha cambiado
            if (idcertificado !== certificadoActual && idcertificado != null) {
                certificadoActual = idcertificado;
            }

            // Si no se realizaron cambios, devolvemos un mensaje sin actualizar
            if (estadofaltaActual === registroExistente.idestadofalta && certificadoActual === registroExistente.idcertificado) {
                console.log("No se realizaron cambios");
                return res.status(200).json({ justificado: "No se realizaron cambios" });
            }

            console.log("Este es el estado falta actual" + estadofaltaActual)
            console.log("Este es el estado certificado actual" + certificadoActual)

            // Construimos la consulta de actualización con los valores modificados
            const query = `
                UPDATE justificarfalta 
                SET idestadofalta = $1, idcertificado = $2
                WHERE dnialumno = $3 AND fecha = $4
            `;

            // Ejecutamos el UPDATE con los valores nuevos
            const respuesta = await pool.query(query, [
                estadofaltaActual, 
                certificadoActual, 
                dnialumno, 
                fecha
            ]);

            console.log("Registro actualizado");
            res.status(200).json({ justificado: respuesta.rows });
        } else {
            // Si no existe, insertamos un nuevo registro
            const respuesta = await pool.query(
                "INSERT INTO justificarfalta (idestadofalta, dnialumno, idcertificado, fecha) VALUES ($1, $2, $3, $4)", 
                [idestadofalta, dnialumno, idcertificado, fecha]
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
        const respuesta = await pool.query("SELECT * FROM estadofalta");
        console.log("Datos obtenidos:", respuesta.rows);
        res.status(200).json({ estadofalta: respuesta.rows });
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).json({ error: "Error al obtener los datos de estadofalta" });
    }
    
}

export const obtenerJustificarFalta = async (req, res) => {
    try {
        const { fechadesde, fechahasta } = req.params; // Cambiado de req.query a req.params

        if (!fechadesde || !fechahasta) {
            return res.status(400).json({ error: "Debe proporcionar fechadesde y fechahasta" });
        }

        const respuesta = await pool.query(
            "SELECT * FROM justificarfalta WHERE fecha BETWEEN $1 AND $2",
            [fechadesde, fechahasta]
        );

        console.log("Datos obtenidos:", respuesta.rows);
        res.status(200).json({ estadofalta: respuesta.rows });
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).json({ error: "Error al obtener los datos de estadofalta" });
    }
};



