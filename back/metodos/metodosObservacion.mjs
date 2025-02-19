//import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
import {pool} from '../dataBase/coneccion.mjs'
dotenv.config();



//Alta
export const registrarObservacion = async (req, res) => {
    //Datos q le vamos a pasar
    const { dnialumno, fecha, idsolicitante, motivo } = req.body; 
    try {
        

        const respuesta = await pool.query(
            'INSERT INTO observacion (dni_alumno, fecha, id_solicitante, motivo) VALUES ($1, $2, $3, $4)',
            [dnialumno, fecha, idsolicitante, motivo]
        );

        // Obtener emails de los padres
        const emailsQuery = await pool.query(
            'SELECT email_familiar FROM alumno WHERE dni_alumno = $1',
            [dnialumno]
        );

        if (emailsQuery.rows.length > 0) {
            const { emailfamiliar } = emailsQuery.rows[0];
            
            // Configurar el email
            const mailOptions = {
                from: 'arlaagustin1@gmail.com',
                to: [emailfamiliar].filter(Boolean).join(', '),
                subject: 'Nueva Observación Registrada',
                html: `
                    <h2>Nueva Observación Registrada</h2>
                    <p><strong>Fecha:</strong> ${fecha}</p>
                    <p><strong>Motivo:</strong> ${motivo}</p>
                    <p>Por favor, revise la observación en el sistema.</p>
                `
            };

                await transporter.sendMail(mailOptions);
            
            }   
        //Registramos la observación
        //console.log("Observación registrada exitosamente");
        res.status(200).json({ observacion: respuesta.rows});
    } catch (error) {
        //console.log(error);
        res.status(500).json({ error: 'Algo salió mal al cargar la observación' });
    }
};


