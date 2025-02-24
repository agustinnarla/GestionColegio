import {pool} from '../dataBase/coneccion.mjs';
import bcrypt from 'bcrypt';


export const ingresarUsuario = async (req, res) => {
    const { dni_usuario, contrasena } = req.body;
    try {
        const respuesta = await pool.query('SELECT * FROM usuario WHERE dni_usuario = $1 AND id_estadoalumno = 1', [dni_usuario]);
        if (respuesta.rows.length === 0) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }
        const usuario = respuesta.rows[0];
        const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!contrasenaValida) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
        console.log('Usuario ingresado exitosamente');
        res.status(200).json({ usuario });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Error al ingresar usuario' });
    }
}