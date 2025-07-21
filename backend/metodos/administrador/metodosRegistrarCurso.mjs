import {pool} from '../../dataBase/coneccion.mjs'


export const registrarCursoPorMateria = async (req, res) => {
    const { detalle, id_materia, id_especialidad, id_estado_general } = req.body; 
    console.log('Datos recibidos:', { detalle, id_materia, id_especialidad });
    try {
        // Insertar el curso en la tabla curso
        const cursoRespuesta = await pool.query(
            "INSERT INTO curso (detalle, id_especialidad, id_estado_general) VALUES ($1, $2, $3) RETURNING id_curso",
            [detalle, id_especialidad, id_estado_general]
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
    const { detalle, id_especialidad, id_estado_general } = req.body; 
    if (!detalle || !id_especialidad || id_estado_general === undefined) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }
    try {
        
        const existente = await pool.query("SELECT 1 FROM curso WHERE detalle = $1", [detalle]);
        if (existente.rowCount > 0) {
            return res.status(409).json({ message: 'El curso ya está registrado' });
        }

        // Insertar el curso en la tabla curso
        const cursoRespuesta = await pool.query(
            "INSERT INTO curso (detalle, id_especialidad, id_estado_general) VALUES ($1, $2, $3) RETURNING *",
            [detalle, id_especialidad, id_estado_general]
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

export const consultarCurso = async (req, res) => {
  const { detalle } = req.params;

  try {
    const resultado = await pool.query(`
      SELECT 
        c.id_curso, 
        c.detalle AS curso, 
        e.detalle AS especialidad,
        e.id_especialidad AS id_especialidad,
        eg.id_estado_general AS id_estado_general,
        eg.detalle AS estado_general,
        m.id_materia AS id_materia,
        m.detalle AS materia
      FROM curso c
      INNER JOIN especialidad e ON e.id_especialidad = c.id_especialidad
      INNER JOIN estado_general eg ON eg.id_estado_general = c.id_estado_general
      LEFT JOIN materia_curso mc ON mc.id_curso = c.id_curso
      LEFT JOIN materia m ON m.id_materia = mc.id_materia
      WHERE c.detalle = $1
    `, [detalle]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }

    const cursoBase = {
      id_curso: resultado.rows[0].id_curso,
      id_estado_general: resultado.rows[0].id_estado_general,
      id_especialidad: resultado.rows[0].id_especialidad,
      id_materia: resultado.rows.map(r => r.id_materia).filter(Boolean),
      curso: resultado.rows[0].curso,
      especialidad: resultado.rows[0].especialidad,
      materias: resultado.rows.map(r => r.materia).filter(Boolean)
    };

    return res.json({ curso: cursoBase });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const deshabilitarCurso = async (req, res) => {
    const { id_curso } = req.params; 

    try {
        if(!id_curso) {
            return res.status(400).json({ error: 'ID del curso es requerido' });
        }
        await pool.query('UPDATE curso SET id_estado_general = 2 WHERE id_curso = $1', [id_curso]);

        res.status(200).json({ mensaje: 'Curso deshabilitado exitosamente' });
    } catch (error) {
        console.error('Error al deshabilitar el curso:', error);
        res.status(500).json({ error: 'Error al deshabilitar el curso' });
    }
}

export const modificarCurso = async (req, res) => {   
    const { id_curso } = req.params;
    const campos = [
        "detalle", "id_especialidad", "id_estado_general"
    ];
    const valores = [];
    const sets = [];

    campos.forEach((campo, idx) => {
        if (req.body[campo] !== undefined) {
            sets.push(`${campo} = $${sets.length + 1}`);
            valores.push(req.body[campo]);
        }
    });

    if (sets.length === 0) {
        return res.status(400).json({ message: 'No se enviaron campos para actualizar' });
    }

    valores.push(id_curso); // Para el WHERE

    const query = `UPDATE curso SET ${sets.join(', ')} WHERE id_curso = $${valores.length} RETURNING *`;

    try {
        const respuesta = await pool.query(query, valores);
        if (respuesta.rowCount === 0) {
            return res.status(404).json({ message: 'No se encontró el curso' });
        }
        
        res.status(200).json({ message: 'Curso modificado correctamente', data: respuesta.rows[0] });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al modificar el curso' });
    }
};

