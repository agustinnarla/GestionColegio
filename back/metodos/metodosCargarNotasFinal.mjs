import {pool} from '../dataBase/coneccion.mjs'

export const obtenerCursosPorProfesor = async (req, res) => {
    const { dni_profesor } = req.params;

    try {
        const respuesta = await pool.query(`
            SELECT 
                pc.id_curso, 
                pc.dni_profesor,
                c.detalle 
            FROM profesor_curso pc
            LEFT JOIN curso c ON pc.id_curso = c.id_curso
            WHERE pc.dni_profesor = $1
            ORDER BY pc.id_curso
        `, [dni_profesor]);

        res.status(200).json({ cursos: respuesta.rows });
    } catch (error) {
        console.error("Error al obtener los cursos del profesor:", error.message);
        res.status(500).json({ error: 'Error al obtener los cursos del profesor' });
    }
}

export const obtenerMateriasPorProfesor = async (req, res) => {
    const { dni_profesor } = req.params;

    try {
        const respuesta = await pool.query(`
            SELECT 
                pm.id_materia,
                pm.dni_profesor,
                m.detalle
            FROM profesor_materia pm
            LEFT JOIN materia m ON pm.id_materia = m.id_materia
            WHERE pm.dni_profesor = $1
              AND m.id_estado_general = 1
            ORDER BY pm.id_materia
        `, [dni_profesor]);

        res.status(200).json({ materias: respuesta.rows });
    } catch (error) {
        console.error("Error al obtener las materias del profesor:", error.message);
        res.status(500).json({ error: 'Error al obtener las materias del profesor' });
    }
};

// Obtener Alumnos no regulares
export const obtenerAlumnosSinFiltro = async (req, res) => {
    const { dni_profesor } = req.params;

    try {
        const respuesta = await pool.query(`
            SELECT  
                a.Nombre,
                a.Apellido,
                am.dni_alumno,
                am.id_materia,
                m.detalle AS detalle_materia,
                ac.id_curso,
                c.detalle AS detalle_curso
            FROM 
                alumno_materia am
            JOIN 
                alumno a ON am.dni_alumno = a.dni_alumno
            JOIN 
                materia m ON am.id_materia = m.id_materia
            JOIN 
                profesor_materia pm ON am.id_materia = pm.id_materia
            JOIN 
                alumno_curso ac ON am.dni_alumno = ac.dni_alumno
            JOIN 
                curso c ON ac.id_curso = c.id_curso
            JOIN 
                profesor_curso pc ON ac.id_curso = pc.id_curso
            WHERE 
                am.id_estado_evaluativo = 2
                AND m.id_estado_general = 1
                AND pm.dni_profesor = $1
                AND pc.dni_profesor = $1
        `, [dni_profesor]);

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
            `SELECT id_nota FROM nota_final
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

        res.status(201).json({
            mensaje: "Nota registrada con éxito",
            id_nota_final: respuesta.rows[0].id_nota_final
        });
    } catch (error) {
        console.error("Error al registrar la nota:", error.message);
        res.status(500).json({ error: "Error al registrar la nota", detalles: error.message });
    }
};


export const modificarEstadoEvaluativo = async (req, res) => {
    const { dni_alumno, id_materia } = req.body;

    try {
        const resultado = await pool.query(`
            UPDATE alumno_materia
            SET id_estadoevaluativo = 1
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

