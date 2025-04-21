import { pool } from "../dataBase/coneccion.mjs";

export const obtenerAvisosGenerales = async (req, res) => {
  try {
      const repuesta = await pool.query(
          "SELECT av.id_aviso, av.informacion, av.motivo, av.fecha, " +
          "COALESCE(c.detalle, 'General') AS curso, p.nombre " + 
          "FROM avisos AS av " +
          "LEFT JOIN curso c ON c.id_curso = av.id_curso " + 
          "INNER JOIN profesores p ON p.id_profesor = av.id_profesor " +
          "WHERE av.id_estado_general = 1 " +
          "ORDER BY av.fecha DESC;"
      );
      res.status(200).json({ avisos: repuesta.rows });
  } catch (error) {
      console.error("Error al traer los avisos:", error.message);
      res.status(500).json({ error: "Error al obtener los avisos" });
  }
};


//Ver
export const obtenerAvisosCurso = async (req, res) => {
    const { id_curso } = req.params;
    try {
        const repuesta = await pool.query(
            "SELECT av.id_aviso, av.informacion, av.motivo, av.fecha, " +
            "c.detalle AS curso, p.nombre " +
            "FROM avisos AS av " +
            "INNER JOIN curso c ON c.id_curso = av.id_curso " +
            "INNER JOIN profesores p ON p.id_profesor = av.id_profesor " +
            "WHERE av.id_estado_general = 1 AND av.id_curso = $1 " + 
            "ORDER BY av.fecha DESC", 
            [id_curso]
        );
        res.status(200).json({ avisos: repuesta.rows });
    } catch (error) {
        console.error("Error al traer los avisos:", error.message);
        res.status(500).json({ error: "Error al obtener los avisos" });
    }
};
