import { pool } from "../dataBase/coneccion.mjs";


export const obtenerAvisosGenerales = async (req, res) => {
  try {
      const repuesta = await pool.query(
        "SELECT * " + 
        "FROM avisos " +
        "WHERE id_estado_general = 1 " +
        "ORDER BY fecha DESC;"
      );
      res.status(200).json({ avisos: repuesta.rows });
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
