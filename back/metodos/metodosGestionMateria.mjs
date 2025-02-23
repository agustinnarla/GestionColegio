import {pool} from '../dataBase/coneccion.mjs'

export const obtenerMaterias = async (req, res) => {
    try {
        const respuesta = await pool.query('SELECT * FROM materia WHERE id_estadoalumno != 2');
        res.json({ materias: respuesta.rows });
    } catch (error) {
        console.log('Error al traer las materias', error);
        res.status(500).json({ error: 'Error al obtener las materias' });
    }
};


export const obtenerProfesor = async (req,res) => {
    try{
        const respuesta = await pool.query('SELECT * FROM profesor')
        res.json({profesor: respuesta.rows})
    }catch{
        console.log('Error al traer las materias')
    }
}

export const verificarExistencia = async (dni_profesor, id_materia) => {
    const resultado = await pool.query(
        'SELECT * FROM materiaprofesor WHERE dni_profesor = $1 AND id_materia = $2',
        [dni_profesor, id_materia]
    );
    return resultado.rows.length > 0; // Si ya existe, retorna true
};

export const registrarMateriaProfesor = async (req, res) => {
    const { dni_profesor, id_materia } = req.body;
    if (!dni_profesor || !id_materia) {
        return res.status(400).json({ error: 'Se requiere dni_profesor e id_materia' });
    }
    try {
        // Verificar si la relación ya existe
        const existe = await verificarExistencia(dni_profesor, id_materia);
        if (existe) {
            // Si existe, no lanzamos un error, solo indicamos que ya está registrada
            return res.status(200).json({ mensaje: 'La relación Materia-Profesor ya estaba registrada' });
        }
        // Ejecutar la consulta para insertar la relación en la tabla materiaprofesor
        const resultado = await pool.query(
            'INSERT INTO materiaprofesor (dni_profesor, id_materia) VALUES ($1, $2) RETURNING *',
            [dni_profesor, id_materia]
        );
        // Responde con el resultado de la inserción
        return res.status(201).json({ mensaje: 'Relación Materia-Profesor registrada exitosamente', data: resultado.rows[0] });
    } catch (error) {
        console.error('Error al registrar la relación:', error);
        return res.status(500).json({ error: 'Error al registrar la relación Materia-Profesor' });
    }
};

export const eliminarMateriaProfesor = async (req, res) => {
    const { id_materia } = req.body;

    try {
        // Eliminar todas las relaciones para la materia
        await pool.query('DELETE FROM materiaprofesor WHERE id_materia = $1', [id_materia]);
        res.status(200).json({ mensaje: 'Relaciones eliminadas exitosamente' });
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
        // Actualizar el estado de la materia a deshabilitada (id_estadoalumno = 2)
        await pool.query('UPDATE materia SET id_estadoalumno = 2 WHERE id_materia = $1', [id_materia]);

        res.status(200).json({ mensaje: 'Materia deshabilitada exitosamente' });
    } catch (error) {
        console.error('Error al deshabilitar la materia:', error);
        res.status(500).json({ error: 'Error al deshabilitar la materia' });
    }
};


export const obtenerProfesorXMateria = async (req, res) => {
    const { id_materia } = req.params; // Obtener el id de la materia desde los parámetros de la URL

    try {
        const respuesta = await pool.query(
            'SELECT dni_profesor FROM materiaprofesor WHERE id_materia = $1',
            [id_materia]
        );

        res.json({ profesor: respuesta.rows });
    } catch (error) {
        console.error('Error al traer los profesores por materia:', error);
        res.status(500).json({ error: 'Error al obtener los profesores' });
    }
};





