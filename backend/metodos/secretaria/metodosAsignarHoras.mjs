import {pool} from '../../dataBase/coneccion.mjs'

export const asignacionDeHoras = async (req, res) => {

    const asignaciones = Array.isArray(req.body) ? req.body : req.body.asignaciones;

    if (!Array.isArray(asignaciones) || asignaciones.length === 0) {
        return res.status(400).json({ message: 'No se recibieron asignaciones.' });
    }

    const resultados = [];
    try {
        for (const asignacion of asignaciones) {
            const { id_materia, id_curso, dia_semana, hora_inicio, hora_final, dni_profesional } = asignacion;

            // Verificar si el horario ya está ocupado
            const horariosOcupados = await verificarHorario(id_curso, dia_semana, hora_inicio, hora_final);
            if (horariosOcupados.length > 0) {
                console.log("Error horas ocupadas")
                return res.status(400).json({ 
                    error: 'El horario ya está ocupado para este curso.' 
                });
            }

            const horasTotales = await obtenerhorasTotales(dni_profesional);
            console.log(horasTotales)
            if (horasTotales > 30) {
                console.log("Error horas totales")
                return res.status(400).json({ 
                    error: 'El profesor ya tiene 30 horas asignadas.' 
                });
            }

            // Insertar el nuevo horario
            const nuevoHorario = await insertarHorario(id_materia, id_curso, dia_semana, hora_inicio, hora_final, dni_profesional);
            resultados.push({ 
                asignacion, 
                success: true, 
                data: nuevoHorario 
            });
        }

        res.status(201).json({ message: 'Proceso de asignación finalizado', resultados });
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
        AND id_estado_general = 1
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



export const insertarHorario = async (id_materia, id_curso, dia_semana, hora_inicio, hora_final, dni_profesional) => {

    const query = `
        INSERT INTO horario (id_materia, id_curso, dia_semana, hora_inicio, hora_final, dni_profesional, id_estado_general)
        VALUES ($1, $2, $3, $4, $5, $6, 1)
        RETURNING *
    `;
    const valores = [id_materia, id_curso, dia_semana, hora_inicio, hora_final, dni_profesional];
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
};

// Función para deshabilitar horarios
export const deshabilitarHorario = async (req, res) => {
    const { id_materia, id_curso, dia_semana, hora_inicio, hora_final, dni_profesional } = req.body;

    try {
        const query = `
            UPDATE horario 
            SET id_estado_general = 2 
            WHERE id_materia = $1 AND id_curso = $2 AND dia_semana = $3
            AND hora_inicio = $4 AND hora_final = $5 AND dni_profesional = $6
            RETURNING *
        `;
        const valores = [id_materia, id_curso, dia_semana, hora_inicio, hora_final, dni_profesional];
        const resultado = await pool.query(query, valores);

        if (resultado.rowCount === 0) {
            return res.status(404).json({ message: 'Horario no encontrado' });
        }

        res.json({ message: 'Horario deshabilitado exitosamente', horario: resultado.rows[0] });
    } catch (error) {
        console.error('Error al deshabilitar horario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Función para habilitar horarios
export const habilitarHorario = async (req, res) => {
    const { id_horario } = req.params;
    
    try {
        const query = `
            UPDATE horario 
            SET id_estado_general = 1 
            WHERE id_horario = $1
            RETURNING *
        `;
        const resultado = await pool.query(query, [id_horario]);
        
        if (resultado.rowCount === 0) {
            return res.status(404).json({ message: 'Horario no encontrado' });
        }
        
        console.log('Horario habilitado exitosamente');
        res.json({ message: 'Horario habilitado exitosamente', horario: resultado.rows[0] });
    } catch (error) {
        console.error('Error al habilitar horario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};



export const obtenerProfesores = async (req, res) => {
    try {
        const respuesta = await pool.query("SELECT CONCAT(nombre, ' ', apellido) AS nombre, dni_profesional FROM profesional WHERE id_rol = 2");

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
    const { dni_profesional } = req.params;
    try {
        
        const respuesta = await pool.query(
            `SELECT pc.id_curso, c.detalle 
            FROM profesor_curso AS pc 
            INNER JOIN curso c ON c.id_curso = pc.id_curso 
            WHERE pc.dni_profesional = $1 AND id_estado_general = 1`, 
            [dni_profesional]
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
    const { dni_profesional, id_curso, id_materia } = req.params;
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
            WHERE h.dni_profesional = $1 AND h.id_curso = $2 AND h.id_materia = $3 AND h.id_estado_general = 1`,
            [dni_profesional, id_curso, id_materia]
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

export const obtenerHorarioProfesional = async (req, res) => {
    const { dni_profesional } = req.params;
    try {
        const respuesta = await pool.query(
            `SELECT h.dia_semana, CONCAT(TO_CHAR(h.hora_inicio, 'HH24:MI'), ' - ', TO_CHAR(h.hora_final, 'HH24:MI')) AS horario
             FROM horario AS h
             WHERE h.dni_profesional = $1 AND h.id_estado_general = 1`,
            [dni_profesional]
        );
        
        
        res.status(200).json({ horas: respuesta.rows });
    } catch (error) {
        console.error('Error al obtener horarios del profesor:', error);
        res.status(500).json({ message: 'Error al obtener los horarios del profesor' });
    }
};

export const obtenerHorarioCurso = async (req, res) => {
    const { id_curso } = req.params;
    try {
        const respuesta = await pool.query(
            `SELECT h.dia_semana, CONCAT(TO_CHAR(h.hora_inicio, 'HH24:MI'), ' - ', TO_CHAR(h.hora_final, 'HH24:MI')) AS horario
             FROM horario h
             JOIN materia_curso mc ON h.id_materia = mc.id_materia AND h.id_curso = mc.id_curso 
             WHERE h.id_curso = $1 AND h.id_estado_general = 1`,
            [id_curso]
        );
        
        
        

        res.status(200).json({ horas: respuesta.rows });
    } catch (error) {
        console.error('Error al obtener horarios del curso:', error);
        res.status(500).json({ message: 'Error al obtener los horarios del curso' });
    }
};

// Función interna para obtener horas totales
const obtenerhorasTotales = async (dni_profesional) => {
    try{
        const respuesta = await pool.query(
            `SELECT SUM(EXTRACT(EPOCH FROM (hora_final - hora_inicio))/3600) AS horas_totales
             FROM horario
             WHERE dni_profesional = $1 AND id_estado_general = 1`,
            [dni_profesional]
        );
        
        if (respuesta.rows.length === 0 || respuesta.rows[0].horas_totales === null) {
            return 0;
        }
        
        return parseFloat(respuesta.rows[0].horas_totales);
    }catch (error) {
        console.error('Error al obtener las horas totales:', error);
        return 0;
    }
}

