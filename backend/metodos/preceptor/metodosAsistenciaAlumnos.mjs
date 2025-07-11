import {pool} from '../../dataBase/coneccion.mjs'

// Esta es la función del backend que maneja la inserción en la base de datos.
export const registrarAsistencia = async (req, res) => {
    const { dni_alumno, fecha, id_curso, id_estado_asistencia } = req.body;
    console.log('Datos recibidos en backend:', req.body); // Verifica que los datos llegan correctamente

    try {
        // Verificar si ya existe un registro con la fecha actual y el curso
        const consultaExistente = await pool.query(
            "SELECT * FROM asistencia_alumno WHERE fecha = $1 AND id_curso = $2 AND dni_alumno = $3",
            [fecha, id_curso, dni_alumno]
        );
        if (consultaExistente.rows.length > 0) {
            // Si ya existe, actualiza el registro
            const respuesta = await pool.query(
                "UPDATE asistencia_alumno SET id_estado_asistencia = $1 WHERE fecha = $2 AND id_curso = $3 AND dni_alumno = $4",
                [id_estado_asistencia, fecha, id_curso, dni_alumno]
            );
            console.log('Registro actualizado:', respuesta.rowCount);
            res.status(200).json({ mensaje: 'Asistencia actualizada correctamente' });
        } else {
            // Si no existe, realiza el INSERT
            const respuesta = await pool.query(
                "INSERT INTO asistencia_alumno (dni_alumno, fecha, id_curso, id_estado_asistencia) VALUES ($1, $2, $3, $4)",
                [dni_alumno, fecha, id_curso, id_estado_asistencia]
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
export const modificarAsistencia = async (req, res) => {
    const { id_curso, dni_alumno, id_estado_asistencia, fecha } = req.body;
    try {
        const respuesta = await pool.query(
            "UPDATE asistencia_alumno SET id_estado_asistencia = $1 WHERE dni_alumno = $2 AND fecha = $3 AND id_curso = $4",
            [id_estado_asistencia, dni_alumno, fecha, id_curso]
        );
        console.log('Registro actualizado:', respuesta.rowCount);
        res.status(200).json({ mensaje: 'Asistencia actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar la asistencia:', error);
        res.status(500).json({ error: 'Error al actualizar la asistencia de los alumnos' });
    }
};

// Ver q hace SI TIENE ASISTENCIA ESE CURSO, SE MARCA CON UN ✅ EN LA LISTA DESPLEGABLE
export const validarFechaAsistencia = async(req, res) =>{
    const { id_curso, fecha } = req.params;
    try {
        const resultado = await pool.query(
            'SELECT COUNT(*) as total FROM asistencia_alumno WHERE id_curso = $1 AND fecha = $2',
            [id_curso, fecha]
        );
        const tieneAsistencia = resultado.rows[0].total > 0;
        res.status(200).json({ tieneAsistencia });
    } catch (error) {
        console.error('Error al verificar asistencia:', error);
        res.status(500).json({ error: 'Error al verificar asistencia' });
    }
}

export const obtenerModificacionAlumnosAusentes = async (req, res) => {
    const { id_curso, fecha } = req.params; // Extraemos los parámetros de la URL
    console.log("ID Curso:", id_curso);   // Verificar el idcurso
    console.log("Fecha recibida:", fecha); // Verificar la fecha

    try {
        // Aseguramos que la fecha se compara correctamente en la base de datos
        const respuesta = await pool.query(
            "SELECT a.dni_alumno, CONCAT(a.nombre, ' ', a.apellido) as nombreapellido, asi.fecha, asi.id_estado_asistencia "
            + "FROM alumno AS a "
            + "INNER JOIN asistencia_alumno AS asi ON asi.dni_alumno = a.dni_alumno "
            + "WHERE asi.id_curso = $1 AND asi.id_estado_asistencia = 2 AND DATE(asi.fecha) = $2",
            [id_curso, fecha]
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

// VER 
export const obtenerFaltasSuperadas = async (req, res) => {
    try {
        const query = `
            SELECT a.dni_alumno
            FROM public.asistencia_alumno a
            JOIN public.alumno al ON a.dni_alumno = al.dni_alumno
            WHERE a.id_estado_asistencia IN (2, 3)
            AND al.id_estado_general <> 2
            GROUP BY a.dni_alumno
            HAVING SUM(CASE
                        WHEN a.id_estado_asistencia = 2 THEN 1
                        WHEN a.id_estado_asistencia = 3 THEN 0.5
                        ELSE 0
                    END) >= 20;
        `;

        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener las faltas superadas:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};



