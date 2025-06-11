import {pool} from '../dataBase/coneccion.mjs'

export const obtenerMaterias = async (req, res) => {
    try {
        const respuesta = await pool.query('SELECT * FROM materia WHERE id_estado_general = 1');
        res.json({ materias: respuesta.rows });
    } catch (error) {
        console.log('Error al traer las materias', error);
        res.status(500).json({ error: 'Error al obtener las materias' });
    }
};

export const obtenerMateriasDeshabilitadas = async (req, res) => {
    try {
        const respuesta = await pool.query('SELECT * FROM materia WHERE id_estado_general = 2');
        res.json({ materias: respuesta.rows });
    } catch (error) {
        console.log('Error al traer las materias', error);
        res.status(500).json({ error: 'Error al obtener las materias' });
    }
};

export const habilitarMateria = async (req, res) => {
    const { id_materia } = req.params; 
    if (!id_materia) {
        return res.status(400).json({ error: 'ID de materia no proporcionado' });
    }
    try {
        // Actualizar el estado de la materia a deshabilitada (id_estado_general = 2)
        await pool.query('UPDATE materia SET id_estado_general = 1 WHERE id_materia = $1', [id_materia]);

        res.status(200).json({ mensaje: 'Materia habilitada exitosamente' });
    } catch (error) {
        console.error('Error al habilitar la materia:', error);
        res.status(500).json({ error: 'Error al habilitar la materia' });
    }
};

//Trae todos los datos 
export const obtenerProfesor = async (req,res) => {
    try{
        const respuesta = await pool.query('SELECT * FROM profesional WHERE id_rol = 1 AND id_estado_general = 1')
        res.json({profesor: respuesta.rows})
    }catch{
        console.log('Error al traer las materias')
    }
}

export const verificarExistencia = async (dni_profesional, id_materia) => {
    const resultado = await pool.query(
        'SELECT * FROM materia_profesor WHERE dni_profesional = $1 AND id_materia = $2',
        [dni_profesional, id_materia]
    );
    return resultado.rows.length > 0;
};


//VER SI ES PROESIONAL O USUARIO
export const registrarMateriaProfesor = async (req, res) => {
    const { dni_profesional, id_materia, id_estado_general } = req.body;
    if (!dni_profesional || !id_materia || !id_estado_general) {
        return res.status(400).json({ error: 'Se requiere dni_profesional, id_materia e id_estado_general' });
    }
    try {
        const dni_usuario = dni_profesional
        const existe = await verificarExistencia(dni_profesional, id_materia);
        if (existe) {
            return res.status(200).json({ mensaje: 'La relación Materia-Profesor ya estaba registrada' });
        }
        const resultado = await pool.query(
            'INSERT INTO materia_profesor (dni_profesional, id_materia, id_estado_general) VALUES ($1, $2, $3) RETURNING *',
            [dni_usuario, id_materia, id_estado_general]
        );
        return res.status(201).json({ mensaje: 'Relación Materia-Profesor registrada exitosamente', data: resultado.rows[0] });
    } catch (error) {
        console.error('Error al registrar la relación:', error);
        return res.status(500).json({ error: 'Error al registrar la relación Materia-Profesor' });
    }
};


export const deshabilitarMateriaProfesor = async (req, res) => {
    const { id_materia } = req.params;
    try {
        await pool.query('UPDATE materia_profesor SET id_estado_general = 2 WHERE id_materia = $1', [id_materia]);
        res.status(200).json({ mensaje: 'Relaciones deshabilitada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar relaciones:', error);
        res.status(500).json({ error: 'Error al eliminar relaciones' });
    }
};

export const deshabilitarMateria = async (req, res) => {
    const { id_materia } = req.params; 
    if (!id_materia) {
        return res.status(400).json({ error: 'ID de materia no proporcionado' });
    }

    try {
        // Actualizar el estado de la materia a deshabilitada (id_estado_general = 2)
        await pool.query('UPDATE materia SET id_estado_general = 2 WHERE id_materia = $1', [id_materia]);

        res.status(200).json({ mensaje: 'Materia deshabilitada exitosamente' });
    } catch (error) {
        console.error('Error al deshabilitar la materia:', error);
        res.status(500).json({ error: 'Error al deshabilitar la materia' });
    }
};

//obtener Profesor Por Materia
export const obtenerProfesorPorMateria = async (req, res) => {
    const { id_materia } = req.params; // Obtener el id de la materia desde los parámetros de la URL

    try {
        const respuesta = await pool.query(
            'SELECT dni_profesional FROM materia_profesor WHERE id_materia = $1',
            [id_materia]
        );

        res.json({ profesor: respuesta.rows });
    } catch (error) {
        console.error('Error al traer los profesores por materia:', error);
        res.status(500).json({ error: 'Error al obtener los profesores' });
    }
};

// agregarMateria
export const agregarMateria = async (req, res) => {
    const { detalle } = req.body; // Recibe el nombre de la materia desde el frontend
    if (!detalle) {
        return res.status(400).json({ error: "El detalle de la materia es obligatorio" });
    }
    try {
        const respuesta = await pool.query(
            "INSERT INTO materia (detalle, id_estado_general) VALUES ($1, 1) RETURNING *",
            [detalle]
        );
        res.status(201).json({ mensaje: "Materia registrada con éxito", materia: respuesta.rows[0] });
    } catch (error) {
        console.error("Error al insertar la materia:", error);
        res.status(500).json({ error: "Error al registrar la materia" });
    }
};




