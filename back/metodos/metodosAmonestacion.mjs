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


export const registrarAmonestacion = async (req,res) => {
    const {dnialumno,fecha,idsolicitante,cantidad,motivo} = req.body;
    try{

    
        const totalActualQuery = await pool.query(
            'SELECT COALESCE(SUM(cantidad), 0) as total FROM amonestacion WHERE dnialumno = $1',
            [dnialumno]
        );
        
        const totalActual = totalActualQuery.rows[0].total;
        const nuevoTotal = parseInt(totalActual) + parseInt(cantidad);

        
        const respuesta = await pool.query(
            'INSERT INTO amonestacion (dnialumno, fecha, total, idsolicitante, cantidad, motivo) VALUES ($1, $2, $3, $4, $5, $6)',
            [dnialumno, fecha, nuevoTotal, idsolicitante, cantidad, motivo]
        );


        
        const emailsQuery = await pool.query(
            'SELECT emailfamiliar FROM alumno WHERE dnialumno = $1',
            [dnialumno]
        );

        if (emailsQuery.rows.length > 0) {
            const { emailfamiliar } = emailsQuery.rows[0];
            
            // Configurar el email
            const mailOptions = {
                from: 'arlaagustin1@gmail.com',
                to: [emailfamiliar].filter(Boolean).join(', '),
                subject: 'Nueva Amonestación Registrada',
                html: `
                    <h2>Nueva Amonestación Registrada</h2>
                    <p><strong>Alumno:</strong> ${dnialumno}</p>
                    <p><strong>Fecha:</strong> ${fecha}</p>
                    <p><strong>Motivo:</strong> ${motivo}</p>
                    <p>Por favor, revise la amonestación en el sistema.</p>
                `
            };

                await transporter.sendMail(mailOptions);
            
            }   
        console.log("Amonestación registrada exitosamente");
        res.status(200).json({ amonestacion: respuesta.rows});
    }catch(error){
        console.log("Alogo salio mal",error)
        res.status(500).json({error: 'Algo salio mal en la carga de la amonestación'})
    }
}

export const obtenerCantidadAmonestaciones = async (req,res) => {
    const {dnialumno} = req.params;
    try{

        const respuesta = await pool.query("SELECT COALESCE(MAX(total), 0) as total FROM amonestacion WHERE dnialumno = $1",[dnialumno]);
        res.status(200).json({ total: respuesta.rows[0].total });

    }catch(error){
        console.log(error)
        res.status(500).json({ error: 'Algo salió mal al obtener la cantidad de amonestaciones' });
    }
}