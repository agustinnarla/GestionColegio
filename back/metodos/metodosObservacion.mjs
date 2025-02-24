import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
import {pool} from '../dataBase/coneccion.mjs'
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

//Alta
export const registrarObservacion = async (req, res) => {
    //Datos q le vamos a pasar
    const { dni_alumno, fecha, id_solicitante, motivo } = req.body; 
    try {
        

        const respuesta = await pool.query(
            'INSERT INTO observacion (dni_alumno, fecha, id_solicitante, motivo) VALUES ($1, $2, $3, $4)',
            [dni_alumno, fecha, id_solicitante, motivo]
        );

        // Enviar email de notificación
        await enviarEmail(dni_alumno, fecha, motivo);


        //Registramos la observación
        //console.log("Observación registrada exitosamente");
        res.status(200).json({ observacion: respuesta.rows});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Algo salió mal al cargar la observación' });
    }
};


const enviarEmail = async (dni_alumno, fecha, motivo) => {
    try {
        const emailsQuery = await pool.query(
            'SELECT email_familiar FROM alumno WHERE dni_alumno = $1',
            [dni_alumno]
        );

        if (emailsQuery.rows.length > 0) {
            const { email_familiar } = emailsQuery.rows[0];
            
            // Configurar el email
            const mailOptions = {
                from: 'arlaagustin1@gmail.com',
                to: [email_familiar].filter(Boolean).join(', '),
                subject: 'Nueva Observación Registrada',
                html: `
                    <h2>Nueva Observación Registrada</h2>
                    <p><strong>Alumno:</strong> ${dni_alumno}</p>
                    <p><strong>Fecha:</strong> ${fecha}</p>
                    <p><strong>Motivo:</strong> ${motivo}</p>
                    <p>Por favor, revise la observación en el sistema.</p>
                `
            };

            await transporter.sendMail(mailOptions);
        }
    } catch (error) {
        console.error("Error al enviar el email de notificación", error);
    }
};
