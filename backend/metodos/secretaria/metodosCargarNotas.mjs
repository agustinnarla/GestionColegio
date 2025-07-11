import {pool} from '../../dataBase/coneccion.mjs'
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
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
    OBTENEMOS NOTAS DE LOS ALUMNOS DE UN CURSO Y MATERIA ESPECÍFICA
*/
export const obtenerNotas = async (req, res) => {
    const {id_curso,id_materia} = req.params;
    try {
        const respuesta = await pool.query(`
            SELECT 
                a.dni_alumno, 
                CONCAT(a.nombre,' ',a.apellido) as nombre_completo,
                am.nota1, 
                am.nota2,
                am.nota3,
                am.nota4,
                am.nota5,
                am.nota6,
                am.tp1,
                am.tp2,
                am.tp3,
                am.aulico,
                am.promedio,
                am.id_estado_evaluativo
            FROM alumno a
            LEFT JOIN alumno_curso ac 
                ON a.dni_alumno = ac.dni_alumno
            LEFT JOIN alumno_materia am 
                ON a.dni_alumno = am.dni_alumno 
                AND am.id_curso = $1  
                AND am.id_materia = $2
            WHERE ac.id_curso = $1 
            AND a.id_estado_general = 1
            ORDER BY a.apellido, a.nombre
        `, [id_curso, id_materia]);
        
        res.status(200).json({notas: respuesta.rows});
    } catch (error) {
        console.error("Error al traer las notas:", error.message);
        res.status(500).json({ error: 'Error al obtener las notas' });
    }
}

/*
    REGISTRAMOS NUEVA NOTA/NOTAS  --> Modificar A notas VER PROMEDIOSSSS
*/

export const registrarNota = async (req, res) => {
    try {
        if (!Array.isArray(req.body)) {
            return res.status(400).json({ error: "El formato de datos debe ser un array" });
        }

        const resultados = [];

        for (const registro of req.body) {
            const { 
                dni_alumno, 
                id_materia, 
                id_curso,
                nota1 = 0, 
                nota2 = 0, 
                nota3 = 0, 
                nota4 = 0, 
                nota5 = 0, 
                nota6 = 0,
                tp1 = 0,
                tp2 = 0,
                tp3 = 0,
                aulico = 0
            } = registro;

            // Validar datos obligatorios
            if (!dni_alumno || !id_materia || !id_curso) {
                resultados.push({
                    dni_alumno,
                    error: "Faltan datos obligatorios"
                });
                continue;
            }

            try { 
                // Promedio de notas escritas
                const notas = [nota1, nota2, nota3, nota4, nota5, nota6];
                const notasValidas = notas.filter(nota => nota > 0);
                const promedioNotas = notasValidas.length > 0
                    ? notasValidas.reduce((a, b) => a + b, 0) / notasValidas.length
                    : 0;

                // Promedio de TP y aulico
                const tpsAulico = [tp1, tp2, tp3, aulico];
                const tpsValidos = tpsAulico.filter(tp => tp > 0);
                const promedioTP = tpsValidos.length > 0
                    ? tpsValidos.reduce((a, b) => a + b, 0) / tpsValidos.length
                    : 0;

                // Promedio final: promedio de ambos promedios
                const promedio = (promedioNotas + promedioTP) / 2;
                const idestadoevaluativo = promedio >= 6 ? 1 : 2;

                // Verificar si existe el registro
                const existeRegistro = await pool.query(`
                    SELECT * FROM alumno_materia 
                    WHERE dni_alumno = $1 
                    AND id_materia = $2 
                    AND id_curso = $3`,
                    [dni_alumno, id_materia, id_curso]
                );

                if (existeRegistro.rows.length > 0) {
                    // Actualizar registro existente
                    await pool.query(`
                        UPDATE alumno_materia
                        SET nota1 = $4, nota2 = $5, nota3 = $6, nota4 = $7, nota5 = $8, nota6 = $9,
                            tp1 = $10, tp2 = $11, tp3 = $12, aulico = $13,
                            id_estado_evaluativo = $14, promedio = $15
                        WHERE dni_alumno = $1 
                        AND id_materia = $2 
                        AND id_curso = $3`,
                        [dni_alumno, id_materia, id_curso, 
                        nota1, nota2, nota3, nota4, nota5, nota6,
                        tp1, tp2, tp3, aulico, idestadoevaluativo, promedio]
                        
                    );
                    
                    resultados.push({
                        dni_alumno,
                        status: "actualizado"
                    });
                } else {
                    // Insertar nuevo registro
                    await pool.query(`
                        INSERT INTO alumno_materia
                        (dni_alumno, id_materia, id_curso,
                        nota1, nota2, nota3, nota4, nota5, nota6,
                        tp1, tp2, tp3, aulico, id_estado_evaluativo, promedio)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
                    [dni_alumno, id_materia, id_curso,
                        nota1, nota2, nota3, nota4, nota5, nota6,
                        tp1, tp2, tp3, aulico, idestadoevaluativo, promedio]
                );
                
                    resultados.push({
                        dni_alumno,
                        status: "insertado"
                    });
                }

                // Enviar email a este alumno
                const materiaQuery = await pool.query(
                    'SELECT detalle FROM materia WHERE id_materia = $1',
                    [id_materia]
                );
                
                const detalle = materiaQuery.rows[0]?.detalle || 'Materia';
                await enviarEmailNota(dni_alumno, detalle);

                

            } catch (error) {
                console.error("Error específico:", error);
                resultados.push({
                    dni_alumno,
                    error: error.message
                });
            }
        }

        return res.status(200).json({ 
            message: "Proceso completado", 
            resultados 
        });

    } catch (error) {
        console.error("Error al cargar las notas:", error.message);
        console.error(error.stack);
        res.status(500).json({ error: "Error al procesar las notas" });
    }
};



const enviarEmailNota = async (dni_alumno, detalle) => {
    try {
        const emailsQuery = await pool.query(
            'SELECT email_personal FROM alumno WHERE dni_alumno = $1',
            [dni_alumno]
        );

        if (emailsQuery.rows.length > 0) {
            const { email_personal } = emailsQuery.rows[0];
            
            // Configurar el email
            const mailOptions = {
                from: 'arlaagustin1@gmail.com',
                to: [email_personal].filter(Boolean).join(', '),
                subject: 'Nuevas Notas Registradas',
                html: `
                    <h2>Nuevas Notas Registradas</h2>
                    <p><strong>Alumno:</strong> ${dni_alumno}</p>
                    <p><strong>Materia:</strong> ${detalle}</p>
                    <p>Por favor, revise las notas en el sistema.</p>
                `
            };

            await transporter.sendMail(mailOptions);
        }
    } catch (error) {
        console.error("Error al enviar el email de notificación", error);
    }
};


