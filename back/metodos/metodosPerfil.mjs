import {pool} from '../dataBase/coneccion.mjs'

export const obtenerUsuario = async (req, res) => {
    const { dni_usuario } = req.params;
    try {
        const respuesta = await pool.query("SELECT dni_usuario, email FROM usuario WHERE dni_usuario = $1", [dni_usuario]);

        if (respuesta.rows.length > 0) {
            res.json(respuesta.rows[0]);  // Enviar solo el primer usuario
        } else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Error en el servidor" });
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