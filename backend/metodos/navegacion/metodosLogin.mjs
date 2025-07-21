
import { pool } from '../../dataBase/coneccion.mjs';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


export const ingresarUsuario = async (req, res) => {
    const { dni_usuario, contrasena } = req.body;
    try {
        const respuesta = await pool.query('SELECT * FROM usuario WHERE dni_usuario = $1 AND id_estado_general = 1', [dni_usuario]);
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
};

export const generarContrasena = async () => {
    // Generar contraseña temporal aleatoria de 8 caracteres
    const caracteresPermitidos = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let contrasenaTemporal = '';
    for (let i = 0; i < 8; i++) {
        contrasenaTemporal += caracteresPermitidos.charAt(Math.floor(Math.random() * caracteresPermitidos.length));
    }

    // Encriptar la contraseña temporal
    const contrasenaEncriptada = await encriptarContrasena(contrasenaTemporal);

    return { contrasenaTemporal, contrasenaEncriptada };
};

export const encriptarContrasena = async (contrasena) => {
    try {
        const salto = await bcrypt.genSalt(10);
        return await bcrypt.hash(contrasena, salto);
    } catch (error) {
        console.error('Error al encriptar la contraseña:', error);
        throw new Error('Error al encriptar la contraseña');
    }
};

//enviarNuevaContrasena
export const enviarNuevaContrasena = async (req, res) => {
    const { dni_usuario } = req.body;

    // Validar entrada
    if (!dni_usuario) {
        return res.status(400).json({ message: 'DNI es obligatorio para enviar el correo' });
    }

    try {
        // Generar contraseña temporal
        const { contrasenaTemporal, contrasenaEncriptada } = await generarContrasena();

        // Actualizar la contraseña
        const resultado = await actualizarContrasena(contrasenaEncriptada, dni_usuario);

        if (resultado.success) {
            // Configurar el email
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: resultado.email,
                subject: 'Nueva contraseña temporal',
                html: `
                    <h2>Datos de acceso temporales</h2>
                    <p><strong>DNI:</strong> ${dni_usuario}</p>
                    <p><strong>Contraseña temporal:</strong> ${contrasenaTemporal}</p>
                    <p>Por favor, cambie su contraseña después de iniciar sesión.</p>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log('Correo enviado exitosamente');
            res.status(200).json({ message: 'Correo enviado exitosamente con la nueva contraseña' });
        } else {
            res.status(404).json({ message: resultado.message });
        }
    } catch (error) {
        console.error('Error al enviar el email de notificación:', error.message);
        res.status(500).json({ message: 'Error al enviar el email de notificación' });
    }
};

// Actualizar contraseña
export const actualizarContrasena = async (contrasenaEncriptada, dni_usuario) => {
    try {
        const resultado = await pool.query(
            'UPDATE usuario SET contrasena = $1 WHERE dni_usuario = $2 RETURNING email',
            [contrasenaEncriptada, dni_usuario]
        );

        if (resultado.rows.length > 0) {
            return {
                success: true,
                email: resultado.rows[0].email
            };
        } else {
            return {
                success: false,
                message: 'Usuario no encontrado o no se pudo actualizar la contraseña'
            };
        }
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error.message);
        return {
            success: false,
            message: 'Error al actualizar la contraseña'
        };
    }
};

export const obtenerTareasPorRol = async (req, res) => {
    const { id_rol } = req.params
    try{
        const respuesta = await pool.query(
            `SELECT t.id_tarea, t.detalle, t.ruta 
             FROM tarea t 
             JOIN tarea_rol rt ON t.id_tarea = rt.id_tarea 
             WHERE rt.id_rol = $1 AND rt.id_estado_general = 1`, [id_rol]
        );

        if (respuesta.rows.length > 0) {
            res.json({ tareas: respuesta.rows });
        } else {
            res.status(404).json({ message: 'No se encontraron tareas para este rol' });
        }
    }catch (error) {
        console.error('Error al obtener las tareas por rol:', error.message);
        res.status(500).json({ message: 'Error al obtener las tareas por rol' });
    }
}