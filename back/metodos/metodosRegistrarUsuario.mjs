import { pool } from '../dataBase/coneccion.mjs';

import { encriptarContrasena } from './metodosLogin.mjs';

export const registrarUsuario = async (req, res) => {
    const { dni_usuario, contrasena, email, id_rol, id_estado_general } = req.body;
    try {
        if (!contrasena) {
            return res.status(400).json({ message: 'La contraseña es obligatoria' });
        }
        // Hashear la contraseña
        const contrasenaHaseada = await encriptarContrasena(contrasena);

        const respuesta = await pool.query(
            'INSERT INTO usuario (dni_usuario, contrasena, email, id_rol, id_estado_general) VALUES ($1, $2, $3, $4, $5)',
            [dni_usuario, contrasenaHaseada, email, id_rol, id_estado_general]
        );
        
        res.status(200).json({ usuario: respuesta.rows });
        console.log('Usuario registrado exitosamente');
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
};



export const consultarUsuario = async (req, res) => {
    const { dni_usuario } = req.params;
    try {
        const respuesta = await pool.query('SELECT * FROM usuario WHERE dni_usuario = $1', [dni_usuario]);
        if (respuesta.rows.length > 0) {
            res.status(200).json({ alumnos: respuesta.rows });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Error al obtener usuario' });
    }
};

export const modificarUsuario = async (req, res) => {
    const { dni_usuario } = req.params;
    const { email, id_rol, id_estado_general, contrasena } = req.body;
    try {
     
        let query = 'UPDATE usuario SET';
        const values = [];
        let index = 1;

        if (email) {
            query += ` email = $${index},`;
            values.push(email);
            index++;
        }
        if (id_rol) {
            query += ` id_rol = $${index},`;
            values.push(id_rol);
            index++;
        }
        if (id_estado_general) {
            query += ` id_estado_general = $${index},`;
            values.push(id_estado_general);
            index++;
        }
        if (contrasena) {
            const contrasenaHaseada = await encriptarContrasena(contrasena);
            query += ` contrasena = $${index},`;
            values.push(contrasenaHaseada);
            index++;
        }

        // Eliminar la última coma y agregar la cláusula WHERE
        query = query.slice(0, -1);
        query += ` WHERE dni_usuario = $${index}`;
        values.push(dni_usuario);

        const resultado = await pool.query(query, values);
        if (resultado.rowCount > 0) {
            res.status(200).json({ message: 'Usuario modificado exitosamente' });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al modificar el usuario:', error);
        res.status(500).json({ message: 'Error al modificar el usuario' });
    }
};

export const deshabilitarUsuario = async (req, res) => {
    const { dni_usuario } = req.params;
    try {
        const resultado = await pool.query(
            'UPDATE usuario SET id_estado_general = 2 WHERE dni_usuario = $1',
            [dni_usuario]
        );
        if (resultado.rowCount > 0) {
            res.status(200).json({ message: 'Usuario deshabilitado exitosamente' });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al deshabilitar el usuario:', error);
        res.status(500).json({ message: 'Error al deshabilitar el usuario' });
    }
};

