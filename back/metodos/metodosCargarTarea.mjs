import {pool} from '../dataBase/coneccion.mjs'

export const obtenerTareasDeshabilitadas = async (req,res) => {
    try {
        const respuesta = await pool.query('SELECT * FROM tarea WHERE id_estadoalumno = 2')
        res.status(200).json({tareas: respuesta.rows});
        console.log('Tareas Deshabilitadas obtenidas exitosamente');
    }
    catch(error){
        console.log(error.message);
        res.status(500).json({ message: 'Error al obtener las tareas' });
    }   
}

export const agregarTarea = async (req, res) => {
    const { detalle } = req.body; // Obtener el nombre de la tarea desde el cuerpo de la solicitud
    if (!detalle) {
        return res.status(400).json({ error: 'El campo "detalle" es requerido' });
    }
    try {
        // Insertar la nueva tarea en la base de datos
        const result = await pool.query(
            'INSERT INTO tarea (detalle, id_estadoalumno) VALUES ($1, $2) RETURNING id_tarea',
            [detalle, 1]
        );
        // Devolver el ID de la nueva tarea y un mensaje de éxito
        res.status(201).json({
            id_tarea: result.rows[0].id_tarea,
            mensaje: 'Tarea agregada exitosamente',
        });
    } catch (error) {
        console.error('Error al agregar la tarea:', error);
        res.status(500).json({ error: 'Error al agregar la tarea' });
    }
};

export const deshabilitarTarea = async (req, res) => {
    const { id_tarea } = req.params; 
    if (!id_tarea) {
        return res.status(400).json({ error: 'ID de tarea no proporcionado' });
    }
    try {
        // Actualizar el estado de la materia a deshabilitada (id_estadoalumno = 2)
        await pool.query('UPDATE tarea SET id_estadoalumno = 2 WHERE id_tarea = $1', [id_tarea]);

        res.status(200).json({ mensaje: 'Tarea deshabilitada exitosamente' });
    } catch (error) {
        console.error('Error al deshabilitar la Tarea:', error);
        res.status(500).json({ error: 'Error al deshabilitar la tarea' });
    }
};

export const habilitarTarea = async (req, res) => {
    const { id_tarea } = req.params; 
    if (!id_tarea) {
        return res.status(400).json({ error: 'ID de tarea no proporcionado' });
    }
    try {
        // Actualizar el estado de la materia a deshabilitada (id_estadoalumno = 2)
        await pool.query('UPDATE tarea SET id_estadoalumno = 1 WHERE id_tarea = $1', [id_tarea]);

        res.status(200).json({ mensaje: 'Tarea deshabilitada exitosamente' });
    } catch (error) {
        console.error('Error al deshabilitar la Tarea:', error);
        res.status(500).json({ error: 'Error al deshabilitar la tarea' });
    }
};





