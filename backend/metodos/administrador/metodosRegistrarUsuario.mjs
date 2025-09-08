import { pool } from '../../dataBase/coneccion.mjs';
import { encriptarContrasena } from '../navegacion/metodosLogin.mjs';

export const registrarUsuario = async (req, res) => {
    const { dni_usuario, contrasena, email, id_rol, id_estado_general } = req.body;
    try {
        const existe = await pool.query('SELECT * FROM usuario WHERE dni_usuario = $1', [dni_usuario]);
        if (existe.rows.length > 0) {
            return res.status(400).json({ message: 'El DNI ya existe' });
        }
        
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

    // Solo intentar encriptar si se envió la contraseña
    if (req.body.contrasena !== undefined) {
        req.body.contrasena = await encriptarContrasena(req.body.contrasena);
    }

    const campos = ["dni_usuario", "id_rol", "id_estado_general", "email", "contrasena"];
    const valores = [];
    const sets = [];

    campos.forEach((campo) => {
        if (req.body[campo] !== undefined) {
            sets.push(`${campo} = $${valores.length + 1}`);
            valores.push(req.body[campo]);
        }
    });

    if (sets.length === 0) {
        return res.status(400).json({ message: 'No se enviaron campos para actualizar' });
    }

    valores.push(dni_usuario);
    const query = `UPDATE usuario SET ${sets.join(', ')} WHERE dni_usuario = $${valores.length} RETURNING *`;

    try {
        const respuesta = await pool.query(query, valores);
        if (respuesta.rowCount === 0) {
            return res.status(404).json({ message: 'No se encontró el usuario' });
        }
        res.status(200).json({ message: 'Usuario modificado correctamente', data: respuesta.rows[0] });
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

