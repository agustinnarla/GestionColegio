import {pool} from '../../dataBase/coneccion.mjs';

export const obtenerRoles = async (req,res) => {
    try {
        const respuesta = await pool.query('SELECT * FROM roles');
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
        const respuesta = await pool.query('SELECT * FROM roles where id_estado_general = 2');
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
        const existente = await pool.query(`SELECT detalle FROM roles WHERE detalle = $1`, [detalle])
         if (existente.rowCount > 0) {
            return res.status(409).json({ message: 'El rol ya está registrada' });
        }
        const respuesta = await pool.query('INSERT INTO roles (detalle, id_estado_general) VALUES ($1,1)',[detalle]);
        console.log('Rol registrado exitosamente');
        res.status(200).json({ roles: respuesta.rows});
    }catch(error){
        console.log(error.message);
        res.status(500).json({ message: 'Error al registrar rol' });    
    }
}

export const deshabilitarRol = async (req, res) => {
    const { id_rol } = req.params; 
    if (!id_rol) {
        return res.status(400).json({ message: 'El id_rol es obligatorio' });
    }
    try {
        const respuesta = await pool.query(
            'UPDATE roles SET id_estado_general = 2 WHERE id_rol = $1',
            [id_rol]
        );
        await pool.query('UPDATE tarea_rol SET id_estado_general = 2 WHERE id_rol = $1', [id_rol]);
    
        if (respuesta.rowCount > 0) {
            console.log('Estado del rol actualizado correctamente');
            res.status(200).json({ message: 'Estado del rol actualizado correctamente' });
        } else {
            res.status(404).json({ message: 'No se encontró un rol con ese id_rol' });
        }
    } catch (error) {
        console.error('Error al actualizar el estado del rol:', error.message);
        res.status(500).json({ message: 'Error al actualizar el estado del rol' });
    }
};

export const habilitarRol = async (req, res) => {
    const { id_rol } = req.params; // Recibe el id_rol desde el frontend

    if (!id_rol) {
        return res.status(400).json({ message: 'El id_rol es obligatorio' });
    }

    try {
        const respuesta = await pool.query(
            'UPDATE roles SET id_estado_general = 1 WHERE id_rol = $1',
            [id_rol]
        );
        await pool.query('UPDATE tarea_rol SET id_estado_general = 1 WHERE id_rol = $1', [id_rol]);

        if (respuesta.rowCount > 0) {
            console.log('Estado del rol actualizado correctamente');
            res.status(200).json({ message: 'Estado del rol actualizado correctamente' });
        } else {
            res.status(404).json({ message: 'No se encontró un rol con ese id_rol' });
        }
    } catch (error) {
        console.error('Error al actualizar el estado del rol:', error.message);
        res.status(500).json({ message: 'Error al actualizar el estado del rol' });
    }
};

export const consultarRol = async (req, res) => {
    const { detalle } = req.params; // Recibe el detalle del rol desde el frontend
    if (!detalle) {
        return res.status(400).json({ error: 'El detalle del rol es obligatorio' });
    }
    try {
        const respuesta = await pool.query(
            'SELECT * FROM roles WHERE detalle = $1',
            [detalle]
        );
        if (respuesta.rows.length > 0) {
            res.status(200).json({ roles: respuesta.rows });
        } else {
            res.status(404).json({ message: 'Rol no encontrado' });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Error al consultar el rol' });
    }
}

export const modificarRol = async (req, res) => {   
    const { detalle } = req.params;
    const campos = [
        "detalle"
    ];
    const valores = [];
    const sets = [];

    campos.forEach((campo, idx) => {
        if (req.body[campo] !== undefined) {
            sets.push(`${campo} = $${sets.length + 1}`);
            valores.push(req.body[campo]);
        }
    });

    if (sets.length === 0) {
        return res.status(400).json({ message: 'No se enviaron campos para actualizar' });
    }

    valores.push(detalle); // Para el WHERE

    const query = `UPDATE roles SET ${sets.join(', ')} WHERE detalle = $${valores.length} RETURNING *`;

    try {
        const respuesta = await pool.query(query, valores);
        if (respuesta.rowCount === 0) {
            return res.status(404).json({ message: 'No se encontró el rol' });
        }

        res.status(200).json({ message: 'Rol modificado correctamente', data: respuesta.rows[0] });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al modificar el rol' });
    }
};