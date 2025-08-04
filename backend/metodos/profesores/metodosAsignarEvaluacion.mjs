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

export const obtenerTipoDeEvaluacion = async  (req, res) => {
    try{
        const respuesta = await pool.query('SELECT id_tipo_de_evaluacion,detalle FROM tipo_de_evaluacion')
        res.status(200).json(respuesta.rows)
    }catch(error){
        console.log(error)
        res.status(500).json({error: 'Error al obtener los tipos de evaluación'})
    }
}

const contarEvaluacionesPorCursoYFecha = async (id_curso, fecha) => {
    const resultado = await pool.query(
        'SELECT COUNT(*) FROM evaluacion WHERE id_curso = $1 AND fecha = $2',
        [id_curso, fecha]
    );
    return parseInt(resultado.rows[0].count); 
};

export const registrarEvaluacion = async (req, res) => {
  const { id_materia, id_tipo_de_evaluacion, fecha, tema_abarcado, id_curso, dni_profesional } = req.body;

  try {
    // Validar fecha
    validarFecha(fecha);

    // Limitar a 3 evaluaciones por curso en la misma fecha
    const cantidad = await contarEvaluacionesPorCursoYFecha(id_curso, fecha);
    if (cantidad >= 3) {
        throw {
            status: 400,
            error: 'No se pueden registrar más de 3 evaluaciones por curso en la misma fecha',
            code: 'LIMITE_EVALUACIONES',
        };
        }

    // Insertar evaluación
    const respuesta = await pool.query(
      `INSERT INTO evaluacion 
       (id_materia, id_tipo_de_evaluacion, fecha, tema_abarcado, id_curso, dni_profesional) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [id_materia, id_tipo_de_evaluacion, fecha, tema_abarcado, id_curso, dni_profesional]
    );

    if (respuesta.rowCount === 0) {
      return res.status(404).json({ error: 'No se pudo registrar la evaluación' });
    }

    // Obtener alumnos del curso
    const alumnos = await pool.query(
      `SELECT a.dni_alumno, a.email_personal
       FROM alumno AS a
       INNER JOIN alumno_curso ac ON a.dni_alumno = ac.dni_alumno
       WHERE ac.id_curso = $1`,
      [id_curso]
    );

    // Enviar emails
    for (const alumno of alumnos.rows) {
      await enviarEmailEvaluacion(alumno.dni_alumno, alumno.email_personal);
    }

    res.status(201).json(respuesta.rows[0]);

  } catch (error) {
    console.error(error);
    // Detectar error personalizado de validarFecha
    if (error.code === 'FECHA_INVALIDA' && error.status) {
      return res.status(error.status).json({ error: error.error, code: error.code });
    }
    if(error.code === 'LIMITE_EVALUACIONES' && error.status){
        return res.status(error.status).json({ error: error.error, code: error.code });
    }


    res.status(500).json({ error: 'Error al registrar la evaluación' });
  }
};

const validarFecha = (fecha) => {
  // Fecha esperada: dd/mm/yyyy
  const [dia, mes, año] = fecha.split('/').map(Number);
  if (!dia || !mes || !año) {
    throw {
      status: 400,
      error: 'Formato de fecha inválido. Debe ser DD/MM/AAAA',
      code: 'FECHA_INVALIDA'
    };
  }

  const fechaEvaluacion = new Date(año, mes - 1, dia);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const hoyMasDosDias = new Date(hoy);
  hoyMasDosDias.setDate(hoy.getDate() + 2);

  if (fechaEvaluacion < hoyMasDosDias) {
    throw {
      status: 400,
      error: 'La fecha de la evaluación debe ser al menos 2 días posterior a la fecha actual.',
      code: 'FECHA_INVALIDA'
    };
  }
};

const enviarEmailEvaluacion = async (dni_alumno, email_personal, ) => {
    try {
        // Configurar el email
        const mailOptions = {
            from: 'arlaagustin1@gmail.com',
            to: [email_personal].filter(Boolean).join(', '),
            subject: 'Nuevo Evaluación Registrados',
            html: `
                <h2>Nueva Evaluación Registrado</h2>
                <p><strong>Alumno:</strong> ${dni_alumno}</p>
                <p>Por favor, revise las evaluaciónes en el calendario.</p>
                <p>Por favor, revise la amonestación en el sistema.</p>
                <p>Ante cualquier consulta, no dude en contactarnos.</p>
                <p><em>Colegio Nuestra Señora del Huerto</em><br>Tel: 12345-21234</p>
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error al enviar el email de notificación", error);
    }
};
