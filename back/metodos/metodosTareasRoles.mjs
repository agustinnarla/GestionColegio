import {pool} from '../dataBase/coneccion.mjs';

export const obtenerRoles = async (req,res) => {
    try {
        const respuesta = await pool.query('SELECT * FROM roles where id_estado_general = 1');
        res.status(200).json({roles: respuesta.rows});
        console.log('Roles obtenidos exitosamente');
    }
    catch(error){
        console.log(error.message);
        res.status(500).json({ message: 'Error al obtener roles' });
    }   
}

export const obtenerTareas = async (req,res) => {
    try {
        const respuesta = await pool.query('SELECT * FROM tarea WHERE id_estado_general != 2')
        res.status(200).json({tareas: respuesta.rows});
        console.log('Tareas obtenidas exitosamente');
    }
    catch(error){
        console.log(error.message);
        res.status(500).json({ message: 'Error al obtener las tareas' });
    }   
}

export const registrarTareaRol = async (req, res) => {
    const relaciones = req.body; // Recibe un arreglo de relaciones

    // Validar que los datos requeridos estén presentes
    if (!Array.isArray(relaciones) || relaciones.length === 0) {
        return res.status(400).json({ error: 'Se requiere un arreglo de relaciones con id_tarea e id_rol' });
    }

    try {
        console.log('Verificando y registrando relaciones...');

        // Arreglo para almacenar las relaciones registradas
        const relacionesRegistradas = [];

        // Recorrer cada relación en el arreglo
        for (const relacion of relaciones) {
            const { id_tarea, id_rol, id_estado_general } = relacion;

            // Validar que cada relación tenga los datos requeridos
            if (!id_tarea || !id_rol || !id_estado_general) {
                console.error('Relación inválida:', relacion);
                continue; // Saltar esta relación y continuar con la siguiente
            }

            // Verificar si la relación ya existe
            const existe = await verificarExistencia(id_tarea, id_rol);
            if (existe) {
                console.log('La relación ya existe:', relacion);
                continue; // Saltar esta relación y continuar con la siguiente
            }

            // Insertar la nueva relación
            const resultado = await pool.query(
                'INSERT INTO tarea_rol (id_tarea, id_rol, id_estado_general) VALUES ($1, $2, $3) RETURNING *',
                [id_tarea, id_rol, id_estado_general]
            );
            console.log('Relación registrada exitosamente:', resultado.rows[0]);

            // Agregar la relación registrada al arreglo
            relacionesRegistradas.push(resultado.rows[0]);
        }

        // Devolver la respuesta con las relaciones registradas
        return res.status(201).json({
            mensaje: 'Relaciones registradas exitosamente',
            data: relacionesRegistradas,
        });
    } catch (error) {
        console.error('Error al registrar las relaciones Tarea-Rol:', error);
        return res.status(500).json({
            error: 'Error al registrar las relaciones Tarea-Rol',
            detalles: error.message,
        });
    }
};

export const verificarExistencia = async (id_tarea, id_rol) => {
    try {
        const resultado = await pool.query(
            'SELECT * FROM tarea_rol WHERE id_tarea = $1 AND id_rol = $2', // Asegúrate de que el orden sea correcto
            [id_tarea, id_rol] // Asegúrate de que el orden sea correcto
        );
        return resultado.rows.length > 0; // Retorna true si la relación ya existe
    } catch (error) {
        console.error('Error al verificar existencia:', error);
        throw error; // Lanza el error para manejarlo en la función que llama
    }
};

export const obtenerTareasDeRoles = async (req, res) => {
    const { id_rol } = req.params;
    if (!id_rol) {
        return res.status(400).json({ error: 'ID de tarea no proporcionado' });
    }
    try {
        // Obtener las tareas asociadas al rol
        const result = await pool.query(
            `SELECT tr.id_tarea 
             FROM tarea_rol tr
             JOIN tarea t ON tr.id_tarea = t.id_tarea
             WHERE tr.id_rol = $1 AND t.id_estado_general = 1`,
            [id_rol]
        );

        // Si no hay tareas asociadas, devolver un array vacío
        if (result.rows.length === 0) {
            return res.status(200).json({ tareas: [] });
        }
        // Si hay tareas asociadas, devolverlas
        return res.status(200).json({ tareas: result.rows });
    } catch (error) {
        console.error('Error al obtener las tareas de los roles:', error);
        return res.status(500).json({ error: 'Error al obtener las tareas de los roles' });
    }
};

export const obtenerRolesDeTarea = async (req, res) => {
    const { id_tarea } = req.params;
    if (!id_tarea) {
        return res.status(400).json({ error: 'ID de tarea no proporcionado' });
    }
    try {
        // Obtener las tareas asociadas al rol
        const result = await pool.query(
            `SELECT tr.id_rol 
             FROM tarea_rol tr
             JOIN roles r ON tr.id_rol = r.id_rol
             WHERE tr.id_tarea = $1 AND r.id_estado_general = 1`,
            [id_tarea]
        );

        // Si no hay tareas asociadas, devolver un array vacío
        if (result.rows.length === 0) {
            return res.status(200).json({ roles: [] });
        }

        // Si hay tareas asociadas, devolverlas
        return res.status(200).json({ roles: result.rows });
    } catch (error) {
        console.error('Error al obtener las tareas del rol:', error);
        return res.status(500).json({ error: 'Error al obtener las tareas del rol' });
    }
};

//Deshabilitar 
export const deshabilitarTareaRol = async (req, res) => {
    const { id_tarea } = req.body;
    try {
        await pool.query('UPDATE tarea_rol SET id_estado_general = 2 WHERE id_tarea = $1', [id_tarea]);
        res.status(200).json({ mensaje: 'Relaciones deshabilitadas exitosamente' });
    } catch (error) {
        console.error('Error al deshabilitar relaciones:', error);
        res.status(500).json({ error: 'Error al deshabilitar relaciones' });
    }
};

//Deshabilitar 
export const deshabilitarRolTarea = async (req, res) => {
    const { id_rol } = req.body;
    try {
        await pool.query('UPDATE tarea_rol SET id_estado_general = 2 WHERE id_rol = $1', [id_rol]);
        res.status(200).json({ mensaje: 'Relaciones deshabilitadas exitosamente' });
    } catch (error) {
        console.error('Error al deshabilitar relaciones:', error);
        res.status(500).json({ error: 'Error al deshabilitar relaciones' });
    }
};