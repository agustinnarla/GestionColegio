import {pool} from '../../dataBase/coneccion.mjs'


export const obtenerCurso = async (req,res) => {
    try{
        const respuesta = await pool.query("SELECT id_curso,detalle FROM curso")
        res.json({curso: respuesta.rows})
    }
    catch{
        console.log("Error al traer los cursos")
    }
}

// VER
export const obtenerCursoFiltrado = async (req, res) => {
    // Obtener el id_curso desde los parámetros de la solicitud
    const { id_curso } = req.params; // Cambiar de req.body a req.params
    try {
        const respuesta = await pool.query(
            "SELECT id_curso, detalle FROM curso WHERE id_curso = $1",
            [id_curso]
        );
        if (respuesta.rows.length > 0) {
            // Enviar solo el curso encontrado
            res.json({ curso: respuesta.rows[0] }); 
        } else {
            // Respuesta si no se encuentra el curso
            res.status(404).json({ error: 'Curso no encontrado' }); 
        }
    } catch (error) {
        console.error("Error al traer el curso:", error.message);
        res.status(500).json({ error: 'Error al obtener el curso' });
    }
};

export const registrarCursoPorMateria = async (req, res) => {
    const { detalle, id_materia, id_especialidad } = req.body; 
    console.log('Datos recibidos:', { detalle, id_materia, id_especialidad });
    try {
        // Insertar el curso en la tabla curso
        const cursoRespuesta = await pool.query(
            "INSERT INTO curso (detalle, id_especialidad) VALUES ($1, $2) RETURNING id_curso",
            [detalle, id_especialidad]
        );

        const id_curso = cursoRespuesta.rows[0].id_curso;

        // Insertar la relación curso-materia en la tabla materia_curso
        const cursomateriaRespuestas = [];
        for (const idMat of id_materia) {
            const cursomateriaRespuesta = await pool.query(
                "INSERT INTO materia_curso (id_curso, id_materia) VALUES ($1, $2) RETURNING *",
                [id_curso, idMat]
            );
            cursomateriaRespuestas.push(cursomateriaRespuesta.rows[0]);
        }

        res.status(200).json({
            curso: cursoRespuesta.rows[0],
            cursomaterias: cursomateriaRespuestas
        });
        console.log('Curso y materias registrados exitosamente');
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Error al registrar el curso y las materias' });
    }
};

export const registrarCurso = async (req, res) => {
    const { detalle, id_especialidad } = req.body; // Datos enviados en el cuerpo de la solicitud

    try {
        // Insertar el curso en la tabla curso
        const cursoRespuesta = await pool.query(
            "INSERT INTO curso (detalle, id_especialidad) VALUES ($1, $2) RETURNING *",
            [detalle, id_especialidad]
        );

        // Obtener el curso registrado
        const cursoRegistrado = cursoRespuesta.rows[0];

        // Responder con el curso registrado
        res.status(200).json({
            message: 'Curso registrado exitosamente',
            curso: cursoRegistrado,
        });

        console.log('Curso registrado exitosamente:', cursoRegistrado);
    } catch (error) {
        console.error("Error al registrar el curso:", error.message);
        res.status(500).json({ error: 'Error al registrar el curso' });
    }
};