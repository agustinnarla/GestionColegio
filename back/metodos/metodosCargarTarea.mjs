import {pool} from '../dataBase/coneccion.mjs'

export const obtenerTareas = async (req,res) => {
    try {
        const respuesta = await pool.query('SELECT * FROM tarea WHERE id_estadoalumno != 2')
        res.status(200).json({roles: respuesta.rows});
        console.log('Tareas obtenidas exitosamente');
    }
    catch(error){
        console.log(error.message);
        res.status(500).json({ message: 'Error al obtener las tareas' });
    }   
}

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



export const verificarExistencia = async (id_tarea, id_rol) => {
    const resultado = await pool.query(
        'SELECT * FROM tarearol WHERE id_tarea = $1 AND id_rol = $2',
        [id_rol, id_tarea]
    );
    return resultado.rows.length > 0;
};

export const registrarTareaRol = async (req, res) => {
    const { id_tarea, id_rol } = req.body;

    // Validar que los datos requeridos estén presentes
    if (!id_tarea || !id_rol) {
        return res.status(400).json({ error: 'Se requiere id_tarea e id_rol' });
    }

    try {
        // Verificar si la relación ya existe
        const existe = await verificarExistencia(id_tarea, id_rol);
        if (existe) {
            return res.status(200).json({ mensaje: 'La relación Tarea-Rol ya estaba registrada' });
        }

        // Insertar la nueva relación en la tabla tarearol
        const resultado = await pool.query(
            'INSERT INTO tarearol (id_tarea, id_rol) VALUES ($1, $2) RETURNING *',
            [id_tarea, id_rol]
        );

        // Respuesta exitosa
        return res.status(201).json({ mensaje: 'Relación Tarea-Rol registrada exitosamente', data: resultado.rows[0] });
    } catch (error) {
        console.error('Error al registrar la relación Tarea-Rol:', error);
        return res.status(500).json({ error: 'Error al registrar la relación Tarea-Rol' });
    }
};

export const eliminarTareaRol = async (req, res) => {
    const { id_tarea } = req.body;
    try {
        await pool.query('DELETE FROM tarearol WHERE id_tarea = $1', [id_tarea]);
        res.status(200).json({ mensaje: 'Relaciones eliminadas exitosamente' });
    } catch (error) {
        console.error('Error al eliminar relaciones:', error);
        res.status(500).json({ error: 'Error al eliminar relaciones' });
    }
};

export const eliminaRolTarea = async (req, res) => {
    const { id_rol } = req.body;
    try {
        await pool.query('DELETE FROM tarearol WHERE id_rol = $1', [id_rol]);
        res.status(200).json({ mensaje: 'Relaciones eliminadas exitosamente' });
    } catch (error) {
        console.error('Error al eliminar relaciones:', error);
        res.status(500).json({ error: 'Error al eliminar relaciones' });
    }
};

export const obtenerTareasRol = async (req, res) => {
    const { id_tarea } = req.params;  // Cambiar a req.params
    console.log(id_tarea);
    try {
        const result = await pool.query('SELECT id_rol FROM tarearol WHERE id_tarea = $1', [id_tarea]);
        res.json({rol: result.rows});
    } catch (error) {
        console.error('Error al obtener relaciones:', error);
        res.status(500).json({ error: 'Error al obtener relaciones' });
    }
};

export const agregarTarea = async (req, res) => {
    const { detalle } = req.body; // Obtener el nombre de la tarea desde el cuerpo de la solicitud
    if (!detalle) {
        return res.status(400).json({ error: 'El campo "detalle" es requerido' });
    }
    try {
        // Insertar la nueva tarea en la base de datos
        const result = await pool.query(
            'INSERT INTO tarea (detalle) VALUES ($1) RETURNING id_tarea',
            [detalle]
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





