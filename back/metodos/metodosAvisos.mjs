import { pool } from "../dataBase/coneccion.mjs";


export const obtenerAvisosGenerales = async (req, res) => {
  try {
      const respuesta = await pool.query(
        `SELECT a.informacion, m.detalle, a.fecha, p.nombre, c.nombre_curso as curso
         FROM avisos a
         INNER JOIN motivos m ON m.id_motivo = a.id_motivo
         LEFT JOIN profesional p ON p.dni_profesional = a.dni_profesional
         LEFT JOIN curso c ON c.id_curso = a.id_curso
         WHERE a.id_estado_general = 1
         ORDER BY a.fecha DESC`
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
    const { id_curso } = req.params;
    try {
        const repuesta = await pool.query(
            "SELECT av.id_aviso, av.informacion, av.id_motivo, av.fecha, " +
            "c.detalle AS curso " +
            "FROM aviso_curso AS ac " +
            "INNER JOIN curso c ON c.id_curso = ac.id_curso " +
            "INNER JOIN avisos av ON av.id_aviso = ac.id_aviso " +
            "WHERE av.id_estado_general = 1 AND ac.id_curso = $1 " +
            "ORDER BY av.fecha DESC",
            [id_curso]
        );
        res.status(200).json({ avisos: repuesta.rows });
    } catch (error) {
        console.error("Error al traer los avisos:", error.message);
        res.status(500).json({ error: "Error al obtener los avisos" });
    }
};
