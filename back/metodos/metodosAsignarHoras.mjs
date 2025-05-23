import {pool} from '../dataBase/coneccion.mjs'

export const asignacionDeHoras = async (req, res) => {
    const { id_materia, id_curso, dia_semana, hora_inicio, hora_final, dni_profesor } = req.body;

    try {
        // Verificar si el horario ya está ocupado
        const horariosOcupados = await verificarHorario(id_curso, dia_semana, hora_inicio, hora_final);
        if (horariosOcupados.length > 0) {
            return res.status(400).json({ message: 'El horario ya está ocupado para este curso.' });
        }

        // Insertar el nuevo horario
        const nuevoHorario = await insertarHorario(id_materia, id_curso, dia_semana, hora_inicio, hora_final, dni_profesor);
        res.status(201).json({ message: 'Horas asignadas exitosamente', data: nuevoHorario });
    } catch (error) {
        console.error('Error al asignar horas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};


export const verificarHorario = async (id_curso, dia_semana, hora_inicio, hora_final) => {
    const query = `
        SELECT * FROM horario
        WHERE id_curso = $1
        AND dia_semana = $2
        AND (
            (hora_inicio <= $3 AND hora_final > $3) OR
            (hora_inicio < $4 AND hora_final >= $4) OR
            (hora_inicio >= $3 AND hora_final <= $4)
        )
    `;
    const valores = [id_curso, dia_semana, hora_inicio, hora_final];
    const resultado = await pool.query(query, valores);
    return resultado.rows;
};

export const insertarHorario = async (id_materia, id_curso, dia_semana, hora_inicio, hora_final, dni_profesor) => {
    const query = `
        INSERT INTO horario (id_materia, id_curso, dia_semana, hora_inicio, hora_final, dni_profesor)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;
    const valores = [id_materia, id_curso, dia_semana, hora_inicio, hora_final, dni_profesor];
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
};

export const obtenerProfesores = async (req, res) => {
    try{
        // Tabla profesionales traer nombre y apellido y de acuerdo al id_rol del profesor 
        const respuesta = await pool.query("SELECT CONCAT(nombre, ' ', apellido) AS nombre, dni_profesional FROM profesionales WHERE id_rol = 2");

        if (respuesta.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron profesores' });
        }
        console.log('Profesores traídos exitosamente');
        res.json({ profesores: respuesta.rows });
    }catch (error) {
        console.error('Error al obtener el profesor:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const obtenerCursoPorProfesor = async (req, res) => {
    const { dni_profesor } = req.params;
    try {
        // Cambiar dni_profesor por dni_profesional
        const respuesta = await pool.query(
            `SELECT pc.id_curso, c.detalle 
            FROM profesor_curso AS pc 
            INNER JOIN curso c ON c.id_curso = pc.id_curso 
            WHERE pc.profesional = $1`, 
            [dni_profesor]
        );

        if (respuesta.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron cursos para el profesor' });
        }

        console.log('Cursos traídos exitosamente');
        res.json({ cursos: respuesta.rows });
    } catch (error) {
        console.error('Error al obtener el curso por profesor:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const obtenerMateriaPorCurso = async (req, res) => {
    const { id_curso } = req.params;
    try{
        const repuesta = await pool.query(
            "SELECT mc.id_materia, m.detalle "
            + "FROM materia_curso mc "
            + "INNER JOIN materia m ON m.id_materia = mc.id_materia "
            + "INNER JOIN curso c ON c.id_curso = mc.id_curso "
            + "WHERE mc.id_curso = $1 ",
            [id_curso]
        )
        if (repuesta.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron materias para el curso' });
        }
        console.log('Materias traídas exitosamente');
        res.json({ materias: repuesta.rows });
    }catch (error) {
        console.error('Error al obtener la materia por curso:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const obtenerHorasProfesor = async (req, res) => {
    const { dni_profesor, id_curso } = req.params;
    try {
        // Cambiar dni_profesor por dni_profesional
        const respuesta = await pool.query(
            `SELECT DISTINCT 
                h.dia_semana, 
                CONCAT(TO_CHAR(h.hora_inicio, 'HH24:MI'), ' - ', TO_CHAR(h.hora_final, 'HH24:MI')) AS horario, 
                c.detalle AS curso, 
                m.detalle AS materia
            FROM horario AS h
            INNER JOIN curso AS c ON c.id_curso = h.id_curso
            INNER JOIN materia AS m ON m.id_materia = h.id_materia
            WHERE h.dni_profesional = $1 AND h.id_curso = $2`,
            [dni_profesor, id_curso]
        );

        if (respuesta.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron horas para el profesor' });
        }
        console.log('Horas traídas exitosamente');
        res.json({ horas: respuesta.rows });
    } catch (error) {
        console.error('Error al obtener las horas del profesor:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};