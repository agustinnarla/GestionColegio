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



// CrearAviso
export const registrarAviso = async (req, res) => {
    let { informacion, id_motivo, fecha_aviso, profesores = [], cursos = [], general, id_estado_general } = req.body;
   

    // Determinar si el aviso es general
    if ((!cursos || cursos.length === 0) && (!profesores || profesores.length === 0)) {
        general = true;
    } else {
        general = false;
    }

    // Validar campos obligatorios
    if (!informacion || !id_motivo || !fecha_aviso || !id_estado_general) {
        return res.status(400).json({ 
            error: `Campos obligatorios faltantes: ${!informacion ? 'informacion' : ''} ${!id_motivo ? 'id_motivo' : ''} ${!fecha_aviso ? 'fecha' : ''} ${!id_estado_general ? 'id_estado_general' : ''}`
        });
    }

    try {
        // Validar y formatear la fecha
        // Validar formato AAAA/MM/DD con regex simple
            if (!/^\d{4}\/\d{2}\/\d{2}(T|\s)?\d{0,2}:?\d{0,2}:?\d{0,2}(\.\d+)?(Z|([+-]\d{2}:?\d{2}))?$/.test(fecha_aviso)) {
            return res.status(400).json({ 
                error: 'El formato de fecha es inválido. Use AAAA/MM/DD o AAAA/MM/DDTHH:MM:SSZ' 
    });
}
     // Si la fecha NO tiene hora, usa la hora actual en UTC
    let fechaValida = fecha_aviso;
    // Si solo viene YYYY/MM/DD, agrega la hora actual en UTC
    if (/^\d{4}\/\d{2}\/\d{2}$/.test(fecha_aviso)) {
        const ahoraUTC = new Date().toISOString().slice(11, 19); // HH:MM:SS
        fechaValida = `${fecha_aviso}T${ahoraUTC}Z`;
    }

    // Validar formato final
    if (!/^\d{4}\/\d{2}\/\d{2}(T|\s)?\d{2}:\d{2}:\d{2}(\.\d+)?(Z|([+-]\d{2}:?\d{2}))?$/.test(fechaValida)) {
        return res.status(400).json({ 
            error: 'El formato de fecha es inválido. Use AAAA/MM/DDTHH:MM:SSZ' 
        });
    }

        // Iniciar transacción
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // 1. Insertar el aviso principal
            const avisoResult = await client.query(
    `INSERT INTO avisos 
     (informacion, id_motivo, fecha_aviso, general, id_estado_general, fecha_registro) 
     VALUES ($1, $2, $3, $4, $5, NOW()) 
     RETURNING id_aviso`,
    [informacion, id_motivo, fechaValida, general, id_estado_general] // <-- usá fechaValida
);

            const idAviso = avisoResult.rows[0].id_aviso;

            // 2. Insertar relaciones con profesores (convertir strings a integers)
            if (profesores && profesores.length > 0) {
                const profesoresInt = profesores.map(p => parseInt(p, 10));
                await client.query(
                    `INSERT INTO aviso_profesionales
                     (id_aviso, dni_profesional) 
                     SELECT $1, unnest($2::int[])`,
                    [idAviso, profesoresInt]
                );
            }

            // 3. Insertar relaciones con cursos (convertir strings a integers)
            if (cursos && cursos.length > 0) {
                const cursosInt = cursos.map(c => parseInt(c, 10));
                await client.query(
                    `INSERT INTO aviso_curso 
                     (id_aviso, id_curso) 
                     SELECT $1, unnest($2::int[])`,
                    [idAviso, cursosInt]
                );
            }

            // Si hay cursos afectados, solo a esos cursos
            let alumnos;
            if (cursos && cursos.length > 0) {
                const cursosInt = cursos.map(c => parseInt(c, 10));
                alumnos = await pool.query(
                    `SELECT a.dni_alumno, a.email_personal
                    FROM alumno AS a
                    INNER JOIN alumno_curso ac ON a.dni_alumno = ac.dni_alumno
                    INNER JOIN curso AS c ON ac.id_curso = c.id_curso
                    WHERE c.id_curso = ANY($1::int[])`,
                    [cursosInt]
                );
            } else {
                // Si es aviso general, a todos los alumnos
                alumnos = await pool.query(
                    `SELECT dni_alumno, email_personal FROM alumno`
                );
            }

            // Enviar email a cada alumno
            for (const alumno of alumnos.rows) {
                await enviarEmailAviso(alumno.dni_alumno, alumno.email_personal, informacion);
            }

            await client.query('COMMIT');

            res.status(201).json({
                id_aviso: idAviso,
                mensaje: 'Aviso creado exitosamente',
                detalles: {
                    profesores_asignados: profesores.length,
                    cursos_asignados: cursos.length
                }
            });
        } catch (error) {
            console.error('Error al crear el aviso:', error);
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error al crear el aviso:', error);
        res.status(500).json({ 
            error: 'Error al crear el aviso',
            detalle: process.env.NODE_ENV === 'development' ? error.message : 'Consulte al administrador'
        });
    }
};


export const obtenerMotivos = async (req, res) => {
    try {
        const query = `
            SELECT 
                id_motivo,
                detalle
            FROM motivos
            ORDER BY id_motivo ASC
        `;
        const result = await pool.query(query);
        res.status(200).json({
            motivos: result.rows,
        });
    } catch (error) {
        console.error('Error al obtener motivos:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al obtener los motivos',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
            code: 'MOTIVOS_FETCH_ERROR'
        });
    }
};


const enviarEmailAviso = async (dni_alumno, email_personal, informacion) => {
    try {
        // Configurar el email
        const mailOptions = {
            from: 'arlaagustin1@gmail.com',
            to: [email_personal].filter(Boolean).join(', '),
            subject: 'Nuevo Aviso Registrados',
            html: `
                <h2>Nuevo Aviso Registrado</h2>
                <p><strong>Alumno:</strong> ${dni_alumno}</p>
                <p><strong>Información:</strong> ${informacion}</p>
                <p>Por favor, revise los avisos en el sistema.</p>
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error al enviar el email de notificación", error);
    }
};

