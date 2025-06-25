import { pool } from "../dataBase/coneccion.mjs";


export const obtenerAvisosGenerales = async (req, res) => {
  try {
      const respuesta = await pool.query(
        `SELECT a.informacion, m.detalle, TO_CHAR(a.fecha, 'DD-MM-YYYY') AS fecha
        FROM avisos a
        INNER JOIN motivos m ON m.id_motivo = a.id_motivo
        WHERE a.id_estado_general = 1 AND a.general = true AND a.fecha >= CURRENT_DATE
        ORDER BY a.fecha ASC`
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
            SELECT a.informacion, m.detalle, TO_CHAR(a.fecha, 'DD-MM-YYYY') AS fecha, c.detalle AS curso, c.id_curso, CONCAT(p.nombre, ' ', p.apellido) AS profesional
            FROM avisos a
            INNER JOIN motivos m ON m.id_motivo = a.id_motivo
            INNER JOIN aviso_curso ac ON ac.id_aviso = a.id_aviso
            INNER JOIN curso c ON c.id_curso = ac.id_curso
            INNER JOIN aviso_profesionales ap ON ap.id_aviso = a.id_aviso
            INNER JOIN profesional p ON p.dni_profesional = ap.dni_profesional
            INNER JOIN alumno_curso al ON al.id_curso = ac.id_curso
            INNER JOIN alumno am ON am.dni_alumno = al.dni_alumno
            WHERE a.id_estado_general = 1 AND am.dni_alumno = $1 AND ac.id_curso = al.id_curso AND a.fecha >= CURRENT_DATE
            ORDER BY a.fecha ASC
            `,
            [dni_alumno]
        );
        res.status(200).json({ avisos: repuesta.rows });
    } catch (error) {
        console.error("Error al traer los avisos:", error.message);
        res.status(500).json({ error: "Error al obtener los avisos" });
    }
};
