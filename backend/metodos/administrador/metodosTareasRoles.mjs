import {pool} from '../../dataBase/coneccion.mjs';

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
    const relaciones = req.body;
    if (!Array.isArray(relaciones) || relaciones.length === 0) {
        return res.status(400).json({ error: 'Se requiere un arreglo de relaciones con id_tarea e id_rol' });
    }

    const id_rol = relaciones[0].id_rol;

    try {
        console.log('Relaciones recibidas:', relaciones);

        // Paso 1: Obtener todas las tareas activas actuales para el rol
        const tareasExistentes = await pool.query(
            'SELECT id_tarea FROM tarea_rol WHERE id_rol = $1 AND id_estado_general = 1',
            [id_rol]
        );
        const tareasActuales = tareasExistentes.rows.map(row => row.id_tarea);
        const nuevasTareas = relaciones.map(r => r.id_tarea);

        // Paso 2: Desactivar tareas que ya no vienen
        const tareasParaDesactivar = tareasActuales.filter(id_tarea => !nuevasTareas.includes(id_tarea));
        for (const id_tarea of tareasParaDesactivar) {
            await pool.query(
                'UPDATE tarea_rol SET id_estado_general = 2 WHERE id_rol = $1 AND id_tarea = $2',
                [id_rol, id_tarea]
            );
            console.log(`Tarea ${id_tarea} desactivada para el rol ${id_rol}`);
        }

        const relacionesProcesadas = [];

        // Paso 3: Insertar o actualizar tareas nuevas
        for (const relacion of relaciones) {
            const { id_tarea, id_estado_general = 1 } = relacion;

            if (!id_tarea || !id_rol) {
                console.error('Relación inválida:', relacion);
                continue;
            }

            const resultadoExistencia = await pool.query(
                'SELECT * FROM tarea_rol WHERE id_tarea = $1 AND id_rol = $2',
                [id_tarea, id_rol]
            );

            if (resultadoExistencia.rows.length > 0) {
                // Ya existe: actualizar a estado 1 (activo)
                const resultado = await pool.query(
                    'UPDATE tarea_rol SET id_estado_general = 1 WHERE id_tarea = $1 AND id_rol = $2 RETURNING *',
                    [id_tarea, id_rol]
                );
                console.log('Relación actualizada (activada):', resultado.rows[0]);
                relacionesProcesadas.push(resultado.rows[0]);
            } else {
                // No existe: insertar
                const resultado = await pool.query(
                    'INSERT INTO tarea_rol (id_tarea, id_rol, id_estado_general) VALUES ($1, $2, $3) RETURNING *',
                    [id_tarea, id_rol, id_estado_general]
                );
                console.log('Relación registrada:', resultado.rows[0]);
                relacionesProcesadas.push(resultado.rows[0]);
            }
        }

        return res.status(201).json({
            mensaje: 'Relaciones procesadas exitosamente',
            data: relacionesProcesadas,
        });
    } catch (error) {
        console.error('Error al procesar las relaciones Tarea-Rol:', error);
        return res.status(500).json({
            error: 'Error al procesar las relaciones Tarea-Rol',
            detalles: error.message,
        });
    }
};

export const registrarRolTarea = async (req, res) => {
    const relaciones = req.body;
    if (!Array.isArray(relaciones) || relaciones.length === 0) {
        return res.status(400).json({ error: 'Se requiere un arreglo de relaciones con id_tarea e id_rol' });
    }

    const id_tarea = relaciones[0].id_tarea;

    try {
        console.log('Relaciones recibidas:', relaciones);

        // Paso 1: Obtener todos los roles activos actuales para la tarea
        const rolesExistentes = await pool.query(
            'SELECT id_rol FROM tarea_rol WHERE id_tarea = $1 AND id_estado_general = 1',
            [id_tarea]
        );
        const rolesActuales = rolesExistentes.rows.map(row => row.id_rol);
        const nuevosRoles = relaciones.map(r => r.id_rol);

        // Paso 2: Desactivar roles que ya no vienen
        const rolesParaDesactivar = rolesActuales.filter(id_rol => !nuevosRoles.includes(id_rol));
        for (const id_rol of rolesParaDesactivar) {
            await pool.query(
                'UPDATE tarea_rol SET id_estado_general = 2 WHERE id_tarea = $1 AND id_rol = $2',
                [id_tarea, id_rol]
            );
            console.log(`Rol ${id_rol} desactivado para la tarea ${id_tarea}`);
        }

        const relacionesProcesadas = [];

        // Paso 3: Insertar o actualizar roles nuevos
        for (const relacion of relaciones) {
            const { id_rol, id_estado_general = 1 } = relacion;

            if (!id_tarea || !id_rol) {
                console.error('Relación inválida:', relacion);
                continue;
            }

            const resultadoExistencia = await pool.query(
                'SELECT * FROM tarea_rol WHERE id_tarea = $1 AND id_rol = $2',
                [id_tarea, id_rol]
            );

            if (resultadoExistencia.rows.length > 0) {
                // Ya existe: actualizar a estado 1 (activo)
                const resultado = await pool.query(
                    'UPDATE tarea_rol SET id_estado_general = 1 WHERE id_tarea = $1 AND id_rol = $2 RETURNING *',
                    [id_tarea, id_rol]
                );
                console.log('Relación actualizada (activada):', resultado.rows[0]);
                relacionesProcesadas.push(resultado.rows[0]);
            } else {
                // No existe: insertar
                const resultado = await pool.query(
                    'INSERT INTO tarea_rol (id_tarea, id_rol, id_estado_general) VALUES ($1, $2, $3) RETURNING *',
                    [id_tarea, id_rol, id_estado_general]
                );
                console.log('Relación registrada:', resultado.rows[0]);
                relacionesProcesadas.push(resultado.rows[0]);
            }
        }

        return res.status(201).json({
            mensaje: 'Relaciones procesadas exitosamente',
            data: relacionesProcesadas,
        });
    } catch (error) {
        console.error('Error al procesar las relaciones Rol-Tarea:', error);
        return res.status(500).json({
            error: 'Error al procesar las relaciones Rol-Tarea',
            detalles: error.message,
        });
    }
};





export const verificarExistencia = async (id_tarea, id_rol) => {
    try {
        console.log(`Verificando existencia: id_tarea=${id_tarea}, id_rol=${id_rol}`);
        const resultado = await pool.query(
            'SELECT * FROM tarea_rol WHERE id_tarea = $1 AND id_rol = $2',
            [id_tarea, id_rol]
        );
        console.log('Resultado de la verificación:', resultado.rows);
        return resultado.rows.length > 0;
    } catch (error) {
        console.error('Error al verificar existencia:', error);
        throw error;
    }
};

export const obtenerTareasDeRoles = async (req, res) => {
    const { id_rol } = req.params;
    if (!id_rol) {
        return res.status(400).json({ error: 'ID de rol no proporcionado' });
    }
    try {
        // Obtener las tareas asociadas al rol
        const result = await pool.query(
            `SELECT tr.id_tarea 
             FROM tarea_rol tr
             JOIN tarea t ON tr.id_tarea = t.id_tarea
             WHERE tr.id_rol = $1 AND tr.id_estado_general = 1
             AND t.id_estado_general = 1`,
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
        // Obtener los roles asociados a la tarea
        const result = await pool.query(
            `SELECT tr.id_rol 
             FROM tarea_rol tr
             JOIN roles r ON tr.id_rol = r.id_rol
             WHERE tr.id_tarea = $1 AND r.id_estado_general = 1
            AND tr.id_estado_general = 1`,
            [id_tarea]
        );

        // Si no hay roles asociados, devolver un array vacío
        if (result.rows.length === 0) {
            return res.status(200).json({ roles: [] });
        }
        // Devolver los id_rol
        return res.status(200).json({ roles: result.rows });
    } catch (error) {
        console.error('Error al obtener los roles de la tarea:', error);
        return res.status(500).json({ error: 'Error al obtener los roles de la tarea' });
    }
};

//Deshabilitar 
export const deshabilitarTareaRol = async (req, res) => {
    const { id_tarea } = req.body;

    if (!id_tarea) {
        return res.status(400).json({ error: 'ID de tarea no proporcionado' });
    }

    try {
        const resultado = await pool.query(
            'UPDATE tarea_rol SET id_estado_general = 2 WHERE id_tarea = $1 RETURNING *',
            [id_tarea]
        );
        console.log('Relaciones deshabilitadas:', resultado.rows);

        res.status(200).json({
            mensaje: 'Relaciones deshabilitadas exitosamente',
            data: resultado.rows,
        });
    } catch (error) {
        console.error('Error al deshabilitar relaciones:', error);
        res.status(500).json({ error: 'Error al deshabilitar relaciones' });
    }
};

//Deshabilitar 
export const deshabilitarRolTarea = async (req, res) => {
    const { id_rol } = req.body;

    if (!id_rol) {
        return res.status(400).json({ error: 'ID de rol no proporcionado' });
    }

    try {
        const resultado = await pool.query(
            'UPDATE tarea_rol SET id_estado_general = 2 WHERE id_rol = $1 RETURNING *',
            [id_rol]
        );
        console.log('Relaciones deshabilitadas:', resultado.rows);

        res.status(200).json({
            mensaje: 'Relaciones deshabilitadas exitosamente',
            data: resultado.rows,
        });
    } catch (error) {
        console.error('Error al deshabilitar relaciones:', error);
        res.status(500).json({ error: 'Error al deshabilitar relaciones' });
    }
};