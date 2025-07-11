import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { pool } from '../../dataBase/coneccion.mjs';
dotenv.config();

/* 
        OBTENCIÓN DE MAIL
*/
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/* 
        REGISTRAR AMONESTACIÓN
*/

export const registrarAmonestacion = async (req, res) => {
    const { dni_alumno, fecha, dni_profesional, cantidad, motivo } = req.body;
    try {
        // Obtener el total de amonestaciones actuales
        const totalActualAmonestaciones = await pool.query(
            'SELECT COALESCE(SUM(cantidad), 0) as total FROM amonestacion WHERE dni_alumno = $1',
            [dni_alumno]
        );
        
        const totalActual = totalActualAmonestaciones.rows[0].total;
        const nuevoTotal = parseInt(totalActual) + parseInt(cantidad);

        // Insertar la nueva amonestación
        const respuesta = await pool.query(
            'INSERT INTO amonestacion (dni_alumno, fecha, total, dni_profesional, cantidad, motivo) VALUES ($1, $2, $3, $4, $5, $6)',
            [dni_alumno, fecha, nuevoTotal, dni_profesional, cantidad, motivo]
        );

        // Enviar email de notificación
        await enviarEmail(dni_alumno, fecha, motivo);

        console.log("Amonestación registrada exitosamente");
        res.status(200).json({ amonestacion: respuesta.rows });
    } catch (error) {
        console.error("Algo salió mal", error);
        res.status(500).json({ error: 'Algo salió mal en la carga de la amonestación' });
    }
};

/*
    FUNCION PARA ENVIAR EMAIL 
*/
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
                subject: 'Nueva Amonestación Registrada',
                html: `
                    <h2>Nueva Amonestación Registrada</h2>
                    <p><strong>Alumno:</strong> ${dni_alumno}</p>
                    <p><strong>Fecha:</strong> ${fecha}</p>
                    <p><strong>Motivo:</strong> ${motivo}</p>
                    <p>Por favor, revise la amonestación en el sistema.</p>
                `
            };

            await transporter.sendMail(mailOptions);
        }
    } catch (error) {
        console.error("Error al enviar el email de notificación", error);
    }
};

/*
    OBTENER CANTIDAD DE AMONESTACIONES
*/

export const obtenerCantidadAmonestaciones = async (req, res) => {
    const { dni_alumno } = req.params;
    try {
        const respuesta = await pool.query(
            "SELECT COALESCE(MAX(total), 0) as total FROM amonestacion WHERE dni_alumno = $1",
            [dni_alumno]
        );
        res.status(200).json({ total: respuesta.rows[0].total });
    } catch (error) {
        console.error("Error al obtener la cantidad de amonestaciones", error);
        res.status(500).json({ error: 'Algo salió mal al obtener la cantidad de amonestaciones' });
    }
};

export const obtenerProfesionales = async (req,res) => {
    try{
        const respuesta = await pool.query("SELECT DISTINCT CONCAT(nombre, ' ', apellido) AS nombre_apellido, dni_profesional FROM profesional WHERE id_estado_general = 1")
        res.status(200).json({profesionales: respuesta.rows})
    }catch(erro){
        console.log(erro)
    }
}