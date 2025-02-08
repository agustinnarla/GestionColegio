import {pool} from '../dataBase/coneccion.mjs'

// Esta es la función del backend que maneja la inserción en la base de datos.
export const registrarAsistenciaBackend = async (req, res) => {
    const { dnialumno, fecha, idcurso, idestado } = req.body;
    console.log('Datos recibidos en backend:', req.body); // Verifica que los datos llegan correctamente

    try {
        // Verificar si ya existe un registro con la fecha actual y el curso
        const consultaExistente = await pool.query(
            "SELECT * FROM asistencia WHERE fecha = $1 AND idcurso = $2 AND dnialumno = $3",
            [fecha, idcurso, dnialumno]
        );
        console.log("Estamos revisando", consultaExistente)
        if (consultaExistente.rows.length > 0) {
            // Si ya existe, actualiza el registro
            const respuesta = await pool.query(
                "UPDATE asistencia SET idestado = $1 WHERE fecha = $2 AND idcurso = $3 AND dnialumno = $4",
                [idestado, fecha, idcurso, dnialumno]
            );
            console.log('Registro actualizado:', respuesta.rowCount);
            res.status(200).json({ mensaje: 'Asistencia actualizada correctamente' });
        } else {
            // Si no existe, realiza el INSERT
            const respuesta = await pool.query(
                "INSERT INTO asistencia (dnialumno, fecha, idcurso, idestado) VALUES ($1, $2, $3, $4)",
                [dnialumno, fecha, idcurso, idestado]
            );
            console.log('Nuevo registro insertado:', respuesta.rowCount);
            res.status(201).json({ mensaje: 'Asistencia registrada correctamente' });
        }
    } catch (error) {
        console.log('Error en el backend:', error);
        res.status(500).json({ error: 'Error al registrar o actualizar la asistencia de los alumnos' });
    }
};



//Modificar
export const modificarAsistencia = async(req,res) => {
    const {idcurso,dnialumno,idestado,fecha} = req.body;
    try{
        const respuesta = await pool.query("UPDATE asistencia SET dnialumno = $1, fecha = $2, idcurso = $3, idestado = $4",[dnialumno,fecha,idcurso,idestado])
        console.log(respuesta.rows)
        res.status(200).json({asistencia: respuesta.rows})
    }catch{
        console.log(error)
        res.status(500).json({ error: 'Error al registrar la asistencia de los alumnos' })
    }
}

export const validarFechaAsistencia = async(req, res) =>{
    const { idcurso, fecha } = req.params;
    try {
        const resultado = await pool.query(
            'SELECT COUNT(*) as total FROM asistencia WHERE idcurso = $1 AND fecha = $2',
            [idcurso, fecha]
        );
        const tieneAsistencia = resultado.rows[0].total > 0;
        res.status(200).json({ tieneAsistencia });
    } catch (error) {
        console.error('Error al verificar asistencia:', error);
        res.status(500).json({ error: 'Error al verificar asistencia' });
    }
}

export const obtenerModificacionAlumnosAusentes = async (req, res) => {
    const { idcurso, fecha } = req.params; // Extraemos los parámetros de la URL
    console.log("ID Curso:", idcurso);   // Verificar el idcurso
    console.log("Fecha recibida:", fecha); // Verificar la fecha

    try {
        // Aseguramos que la fecha se compara correctamente en la base de datos
        const respuesta = await pool.query(
            "SELECT a.dnialumno, CONCAT(a.nombre, ' ', a.apellido) as nombreapellido, asi.fecha, asi.idestado "
            + "FROM alumno AS a "
            + "INNER JOIN asistencia AS asi ON asi.dnialumno = a.dnialumno "
            + "WHERE asi.idcurso = $1 AND asi.idestado = 2 AND DATE(asi.fecha) = $2",
            [idcurso, fecha]
        );

        if (respuesta.rows.length > 0) {
            console.log('Todo ok');
            res.status(200).json({ alumnos: respuesta.rows });
        } else {
            console.log('No se encontraron alumnos ausentes');
            res.status(404).json({ mensaje: 'No se encontraron alumnos ausentes para esta fecha y curso' });
        }

    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ mensaje: 'Hubo un error al obtener los datos', error: error.message });
    }
};

export const obtenerFaltasSuperadas = async (req, res) => {
    try {
        const query = `
            SELECT dnialumno
            FROM public.asistencia
            WHERE idestado IN (2, 3)
            GROUP BY dnialumno
            HAVING SUM(CASE 
                        WHEN idestado = 2 THEN 1
                        WHEN idestado = 3 THEN 0.5
                        ELSE 0 
                      END) >= 9
        `;

        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener las faltas superadas:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};



