import {pool} from '../../dataBase/coneccion.mjs'


export const registrarCursoPorMateria = async (req, res) => {
    const { detalle, id_materia, id_especialidad, id_estado_general } = req.body;
    console.log('Datos recibidos:', { detalle, id_materia, id_especialidad });

    if (!detalle || !Array.isArray(id_materia) || id_materia.length === 0) {
        return res.status(400).json({ error: 'Se requiere detalle del curso y al menos una materia' });
    }

    try {
        // Paso 1: Insertar el curso en la tabla curso
        const cursoRespuesta = await pool.query(
            "INSERT INTO curso (detalle, id_especialidad, id_estado_general) VALUES ($1, $2, $3) RETURNING id_curso",
            [detalle, id_especialidad, id_estado_general || 1]
        );
        const id_curso = cursoRespuesta.rows[0].id_curso;

        // Paso 2: Insertar o actualizar relaciones curso-materia
        const relacionesProcesadas = [];
        for (const idMat of id_materia) {
            // Verificar si ya existe la relación
            const existe = await pool.query(
                "SELECT * FROM materia_curso WHERE id_curso = $1 AND id_materia = $2",
                [id_curso, idMat]
            );

            if (existe.rows.length > 0) {
                // Si existe, actualizar a activo
                const actualizada = await pool.query(
                    "UPDATE materia_curso SET id_estado_general = 1 WHERE id_curso = $1 AND id_materia = $2 RETURNING *",
                    [id_curso, idMat]
                );
                console.log('Relación curso-materia actualizada (activada):', actualizada.rows[0]);
                relacionesProcesadas.push(actualizada.rows[0]);
            } else {
                // Si no existe, insertar nueva
                const insertada = await pool.query(
                    "INSERT INTO materia_curso (id_curso, id_materia, id_estado_general) VALUES ($1, $2, 1) RETURNING *",
                    [id_curso, idMat]
                );
                console.log('Relación curso-materia registrada:', insertada.rows[0]);
                relacionesProcesadas.push(insertada.rows[0]);
            }
        }

        return res.status(201).json({
            mensaje: 'Curso y materias procesados exitosamente',
            curso: cursoRespuesta.rows[0],
            cursomaterias: relacionesProcesadas
        });

    } catch (error) {
        console.error('Error al registrar curso y materias:', error.message);
        return res.status(500).json({ error: 'Error al registrar el curso y las materias', detalles: error.message });
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
      WHERE c.detalle = $1 AND mc.id_estado_general = 1
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
    const { detalle, id_especialidad, id_estado_general, id_materia } = req.body; // <-- id_materia es array

    const campos = ["detalle", "id_especialidad", "id_estado_general"];
    const valores = [];
    const sets = [];

    campos.forEach((campo) => {
        if (req.body[campo] !== undefined) {
            sets.push(`${campo} = $${sets.length + 1}`);
            valores.push(req.body[campo]);
        }
    });

    if (sets.length === 0 && (!id_materia || id_materia.length === 0)) {
        return res.status(400).json({ message: 'No se enviaron campos ni materias para actualizar' });
    }

    try {
        // 1️⃣ Actualizar la tabla curso
        if (sets.length > 0) {
            valores.push(id_curso);
            const query = `UPDATE curso SET ${sets.join(', ')} WHERE id_curso = $${valores.length} RETURNING *`;
            const respuestaCurso = await pool.query(query, valores);
            if (respuestaCurso.rowCount === 0) {
                return res.status(404).json({ message: 'No se encontró el curso' });
            }
        }

        // 2️⃣ Actualizar las materias si se enviaron
        const relacionesProcesadas = [];
        if (id_materia && Array.isArray(id_materia)) {
            // Obtener materias actuales
            const actuales = await pool.query(
                'SELECT id_materia FROM materia_curso WHERE id_curso = $1',
                [id_curso]
            );
            const actualesIds = actuales.rows.map(r => r.id_materia);
            
            // Materias a desactivar
            const aDesactivar = actualesIds.filter(m => !id_materia.includes(m));
            for (const idMat of aDesactivar) {
                const resDesactivar = await pool.query(
                    'UPDATE materia_curso SET id_estado_general = 2 WHERE id_curso = $1 AND id_materia = $2 RETURNING *',
                    [id_curso, idMat]
                );
                relacionesProcesadas.push(resDesactivar.rows[0]);
            }

            // Insertar o reactivar materias nuevas
            for (const idMat of id_materia) {
                const existe = await pool.query(
                    'SELECT * FROM materia_curso WHERE id_curso = $1 AND id_materia = $2',
                    [id_curso, idMat]
                );

                if (existe.rows.length > 0) {
                    const resActualizar = await pool.query(
                        'UPDATE materia_curso SET id_estado_general = 1 WHERE id_curso = $1 AND id_materia = $2 RETURNING *',
                        [id_curso, idMat]
                    );
                    relacionesProcesadas.push(resActualizar.rows[0]);
                } else {
                    const resInsertar = await pool.query(
                        'INSERT INTO materia_curso (id_curso, id_materia, id_estado_general) VALUES ($1, $2, 1) RETURNING *',
                        [id_curso, idMat]
                    );
                    relacionesProcesadas.push(resInsertar.rows[0]);
                }
            }
        }

        return res.status(200).json({
            message: 'Curso modificado correctamente',
            data: { id_curso, materias: relacionesProcesadas }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al modificar el curso', detalles: error.message });
    }
};