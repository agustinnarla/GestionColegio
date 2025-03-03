import { pool } from '../dataBase/coneccion.mjs';
//import bcrypt from 'bcrypt';

export const registrarUsuario = async (req, res) => {
    //Se tendria q cambiar el nombre por estadoUsuario y hacerlo global
    const { dni_usuario, contrasena, email, id_rol, id_estadoalumno } = req.body;
    try {
        // Hashear la contraseña
        const contrasenaHaseada = await encriptarContrasena(contrasena);

        const respuesta = await pool.query(
            'INSERT INTO usuario (dni_usuario, contrasena, email, id_rol,id_estadoalumno) VALUES ($1, $2, $3, $4,$5)',
            [dni_usuario, contrasenaHaseada, email, id_rol, id_estadoalumno]
        );
        res.status(200).json({ usuario: respuesta.rows });
        console.log('Usuario registrado exitosamente');
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
};

// const encriptarContrasena = async (contrasena) => {
//     try {
//         const salto = await bcrypt.genSalt(10);
//         return await bcrypt.hash(contrasena, salto);
//     } catch (error) {
//         console.error('Error al encriptar la contraseña:', error);
//         throw new Error('Error al encriptar la contraseña');
//     }
// };

export const encriptarContrasena = async (contrasena) => {
    const saltRounds = 10;
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(contrasena, salt);
        return hash;
    } catch (error) {
        console.error('Error al encriptar la contraseña:', error);
        throw new Error('Error al encriptar la contraseña');
    }
};

export const restablecerContrasena = async (req, res) => {
    const { dni_usuario} = req.params;
    const { nuevaContrasena } = req.body;
    try {
        if (!dni_usuario || !nuevaContrasena) {
            return res.status(400).json({ message: 'Faltan parámetros' });
        }

        const contrasenaEncriptada = await encriptarContrasena(nuevaContrasena);
        const resultado = await pool.query(
            'UPDATE usuario SET contrasena = $1 WHERE dni_usuario = $2',
            [contrasenaEncriptada, dni_usuario]
        );
        if (resultado.rowCount > 0) {
            res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        res.status(500).json({ message: 'Error al restablecer la contraseña' });
    }
};
