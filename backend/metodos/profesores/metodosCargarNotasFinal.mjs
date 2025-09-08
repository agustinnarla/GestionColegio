import {pool} from '../../dataBase/coneccion.mjs'

export const obtenerCursosPorProfesor = async (req, res) => {
    const { dni_profesional } = req.params;

    try {
        const respuesta = await pool.query(`
            SELECT 
                c.id_curso, 
                c.detalle 
            FROM profesor_curso pc
            INNER JOIN curso c ON pc.id_curso = c.id_curso
            WHERE pc.dni_profesional = $1
            ORDER BY c.id_curso
        `, [dni_profesional]);

        console.log("Cursos obtenidos:", respuesta.rows);
        res.status(200).json({ cursos: respuesta.rows });
    } catch (error) {
        console.error("Error al obtener los cursos del profesor:", error.message);
        res.status(500).json({ error: 'Error al obtener los cursos del profesor' });
    }
}

export const obtenerMateriasPorProfesor = async (req, res) => {
    const { dni_profesional } = req.params;

    try {
        const respuesta = await pool.query(`
            SELECT 
                mp.id_materia,
                mp.dni_profesional,
                m.detalle
            FROM materia_profesor mp
            LEFT JOIN materia m ON mp.id_materia = m.id_materia
            WHERE mp.dni_profesional = $1
              AND m.id_estado_general = 1
            ORDER BY mp.id_materia
        `, [dni_profesional]);

        res.status(200).json({ materias: respuesta.rows });
    } catch (error) {
        console.error("Error al obtener las materias del profesor:", error.message);
        res.status(500).json({ error: 'Error al obtener las materias del profesor' });
    }
};

// Obtener Alumnos no regulares 
export const obtenerAlumnosNoRegulares = async (req, res) => {
    let { id_curso, id_materia } = req.params;

    // Si no vienen, setear a null
    id_curso = id_curso && id_curso !== 'undefined' ? Number(id_curso) : null;
    id_materia = id_materia && id_materia !== 'undefined' ? Number(id_materia) : null;

    try {
        const respuesta = await pool.query(`
            SELECT  
                a.nombre,
                a.apellido,
                am.dni_alumno,
                am.id_materia,
                ac.id_curso,
                m.detalle AS detalle_materia,
                c.detalle AS detalle_curso
            FROM 
                alumno_materia am
            JOIN alumno a ON am.dni_alumno = a.dni_alumno
            JOIN materia m ON am.id_materia = m.id_materia
            LEFT JOIN alumno_curso ac ON am.dni_alumno = ac.dni_alumno
            LEFT JOIN curso c ON ac.id_curso = c.id_curso
            WHERE 
                ($1::int IS NULL OR am.id_curso = $1)
                AND ($2::int IS NULL OR am.id_materia = $2)
                AND am.id_estado_evaluativo = 2
        `, [id_curso, id_materia]);

        res.status(200).json({ alumnos: respuesta.rows });
    } catch (error) {
        console.error("Error al obtener alumnos evaluados por el profesor:", error.message);
        res.status(500).json({ error: 'Error al obtener alumnos' });
    }
};

// RegistrarNotaFinal
export const registrarNotaFinal = async (req, res) => {
    const { id_curso, id_materia, dni_profesional, dni_alumno, nota_final } = req.body;

    // Validaciones
    if (!id_curso || !id_materia || !dni_profesional || !dni_alumno || nota_final === undefined) {
        return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    if (isNaN(nota_final) || nota_final < 1 || nota_final > 10) {
        return res.status(400).json({ error: "La nota debe ser un número entre 1 y 10" });
    }

    try {
        // Verificar si ya existe una nota para evitar duplicados
        const notaExistente = await pool.query(
            `SELECT id_nota_final FROM nota_final
                WHERE id_curso = $1 AND id_materia = $2 AND dni_alumno = $3`,
            [id_curso, id_materia, dni_alumno]
        );

        if (notaExistente.rows.length > 0) {
            return res.status(400).json({ error: "Ya existe una nota para este alumno en esta materia" });
        }

        // Insertar nueva nota
        const respuesta = await pool.query(`
            INSERT INTO nota_final (id_curso, id_materia, dni_profesional, dni_alumno, nota_final)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_nota_final
        `, [id_curso, id_materia, dni_profesional, dni_alumno, nota_final]);

        if (nota_final >= 6 ){
            const respuesta = await pool.query(`UPDATE alumno_materia SET id_estado_evaluativo = 1
                WHERE dni_alumno = $1 AND id_materia = $2 AND id_curso = $3`, 
                [dni_alumno, id_materia, id_curso]);
            const promedio = await pool.query(`UPDATE alumno_materia SET promedio = $1 WHERE dni_alumno = $2 AND id_materia = $3 AND id_curso = $4`, [nota_final, dni_alumno, id_materia, id_curso])
            if (respuesta.rowCount > 0) {
                console.log("Estado evaluativo actualizado a 1");
            }
            if (promedio.rowCount > 0) {
                console.log("Promedio actualizado");
            }
        } else {
           console.log("Estado evaluativo mantenido en 2");
        }
        res.status(201).json({
            mensaje: 'Nota registrada con éxito',
            id_nota_final: respuesta.rows[0].id_nota_final
        });
    } catch (error) {
        console.error("Error al registrar la nota:", error.message);
        res.status(500).json({ error: "Error al registrar la nota", detalles: error.message });
    }
};


export const actualizarEstadoEvaluativo = async (req, res) => {
    const { dni_alumno, id_materia } = req.body;

    try {
        const resultado = await pool.query(`
            UPDATE alumno_materia
            SET id_estado_evaluativo = 1
            WHERE dni_alumno = $1 AND id_materia = $2
        `, [dni_alumno, id_materia]);

        if (resultado.rowCount === 0) {
            return res.status(404).json({ mensaje: "No se encontró la combinación de alumno y materia" });
        }

        res.status(200).json({ mensaje: "Estado evaluativo modificado con éxito" });
    } catch (error) {
        console.error("Error al modificar el estado evaluativo:", error.message);
        res.status(500).json({ error: "Error al modificar el estado evaluativo" });
    }
};

