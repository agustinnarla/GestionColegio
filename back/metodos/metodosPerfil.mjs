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
