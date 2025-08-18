import { pool } from "../../dataBase/coneccion.mjs";


export const obtenerAvisosGenerales = async (req, res) => {
  try {
      const respuesta = await pool.query(
        `SELECT a.informacion, m.detalle,  a.fecha_aviso, a.fecha_registro
        FROM avisos a
        INNER JOIN motivos m ON m.id_motivo = a.id_motivo
        WHERE a.id_estado_general = 1 AND a.general = true 
        ORDER BY a.fecha_aviso ASC`
      );

      if (!respuesta.rows || respuesta.rows.length === 0) {
          return res.status(200).json({ avisos: [] });
      }

      res.status(200).json({ avisos: respuesta.rows });
  } catch (error) {
      console.error("Error al traer los avisos:", error.message);
      res.status(500).json({ error: "Error al obtener los avisos" });
  }
};


export const obtenerAvisosCurso = async (req, res) => {
    const { dni_alumno } = req.params;
    try {
        const repuesta = await pool.query(
            `
            SELECT a.informacion, m.detalle, a.fecha_aviso, a.fecha_registro, c.detalle AS curso, c.id_curso, CONCAT(p.nombre, ' ', p.apellido) AS profesional
            FROM avisos a
            INNER JOIN motivos m ON m.id_motivo = a.id_motivo
            INNER JOIN aviso_curso ac ON ac.id_aviso = a.id_aviso
            INNER JOIN curso c ON c.id_curso = ac.id_curso
            INNER JOIN aviso_profesionales ap ON ap.id_aviso = a.id_aviso
            INNER JOIN profesional p ON p.dni_profesional = ap.dni_profesional
            INNER JOIN alumno_curso al ON al.id_curso = ac.id_curso
            INNER JOIN alumno am ON am.dni_alumno = al.dni_alumno
            WHERE a.id_estado_general = 1 AND am.dni_alumno = $1 AND ac.id_curso = al.id_curso 
            ORDER BY a.fecha_aviso ASC
            `,
            [dni_alumno]
        );
        res.status(200).json({ avisos: repuesta.rows });
    } catch (error) {
        console.error("Error al traer los avisos:", error.message);
        res.status(500).json({ error: "Error al obtener los avisos" });
    }
};


export const obtenerUltimaVisitaAvisos = async (req, res) => {
    const { dni_usuario } = req.params;
    try {
        const result = await pool.query(
            'SELECT ultima_visita FROM ultima_visita_avisos WHERE dni_usuario = $1',
            [dni_usuario]
        );
        if (result.rows.length > 0) {
            res.json({ ultima_visita: result.rows});
        } else {
            res.json({ ultima_visita: null });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la última visita' });
    }
};


export const actualizarUltimaVisitaAvisos = async (req, res) => {
    const { dni_usuario, ultima_visita } = req.body;
    try {
        await pool.query(`
             INSERT INTO ultima_visita_avisos (dni_usuario, ultima_visita)
             VALUES ($1, $2)
             ON CONFLICT (dni_usuario)
             DO UPDATE SET ultima_visita = EXCLUDED.ultima_visita`,
            [dni_usuario, ultima_visita]
        );
        res.status(200).json({ ultima_visita });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la última visita' });
    }
};