import {pool} from '../dataBase/coneccion.mjs';

export const obtenerRoles = async (req,res) => {
    try {
        const respuesta = await pool.query('SELECT * FROM roles where id_estadoalumno = 1');
        res.status(200).json({roles: respuesta.rows});
        console.log('Roles obtenidos exitosamente');
    }
    catch(error){
        console.log(error.message);
        res.status(500).json({ message: 'Error al obtener roles' });
    }   
}

export const obtenerRolesDeshabilitados = async (req,res) => {
    try {
        const respuesta = await pool.query('SELECT * FROM roles where id_estadoalumno = 2');
        res.status(200).json({roles: respuesta.rows});
        console.log('Roles obtenidos exitosamente');
    }
    catch(error){
        console.log(error.message);
        res.status(500).json({ message: 'Error al obtener roles' });
    }   
}

export const registrarRol = async (req,res) => {
    const {detalle} = req.body;
    try{
        const respuesta = await pool.query('INSERT INTO roles (detalle, id_estadoalumno) VALUES ($1,1)',[detalle]);
        console.log('Rol registrado exitosamente');
        res.status(200).json({ roles: respuesta.rows});
    }catch(error){
        console.log(error.message);
        res.status(500).json({ message: 'Error al registrar rol' });    
    }
}

export const obtenerTareasPorRol = async (req, res) => {
    try {
        const { id_rol } = req.params; // O req.body si lo envías en el cuerpo
        if (!id_rol) {
            return res.status(400).json({ message: 'El id_rol es requerido' });
        }
        const respuesta = await pool.query('SELECT * FROM tarearol WHERE id_rol = $1', [id_rol]);
        res.status(200).json({ tareas: respuesta.rows });
        console.log('Tareas obtenidas exitosamente para el rol:', id_rol);
    } catch (error) {
        console.error('Error al obtener tareas por rol:', error.message);
        res.status(500).json({ message: 'Error al obtener tareas por rol' });
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

export const deshabilitarRol = async (req, res) => {
    const { id_rol } = req.params; // Recibe el id_rol desde el frontend

    if (!id_rol) {
        return res.status(400).json({ message: 'El id_rol es obligatorio' });
    }

    try {
        const respuesta = await pool.query(
            'UPDATE roles SET id_estadoalumno = 2 WHERE id_rol = $1',
            [id_rol]
        );

        if (respuesta.rowCount > 0) {
            console.log('Estado del alumno actualizado correctamente');
            res.status(200).json({ message: 'Estado del alumno actualizado correctamente' });
        } else {
            res.status(404).json({ message: 'No se encontró un alumno con ese id_rol' });
        }
    } catch (error) {
        console.error('Error al actualizar el estado del alumno:', error.message);
        res.status(500).json({ message: 'Error al actualizar el estado del alumno' });
    }
};

export const habilitarRol = async (req, res) => {
    const { id_rol } = req.params; // Recibe el id_rol desde el frontend

    if (!id_rol) {
        return res.status(400).json({ message: 'El id_rol es obligatorio' });
    }

    try {
        const respuesta = await pool.query(
            'UPDATE roles SET id_estadoalumno = 1 WHERE id_rol = $1',
            [id_rol]
        );

        if (respuesta.rowCount > 0) {
            console.log('Estado del alumno actualizado correctamente');
            res.status(200).json({ message: 'Estado del alumno actualizado correctamente' });
        } else {
            res.status(404).json({ message: 'No se encontró un alumno con ese id_rol' });
        }
    } catch (error) {
        console.error('Error al actualizar el estado del alumno:', error.message);
        res.status(500).json({ message: 'Error al actualizar el estado del alumno' });
    }
};

