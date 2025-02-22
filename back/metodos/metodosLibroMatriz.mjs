import {pool} from '../dataBase/coneccion.mjs'

export const cargarGrilla = async (req, res) => {
    const { dni_alumno } = req.params;
    try {
        const respuesta = await pool.query(
            // Ver curso actual 
            "SELECT DISTINCT am.dni_alumno, m.detalle AS materia_detalle, ev.detalle AS estado_detalle, am.promedio, c.detalle AS curso_detalle, c.id_curso " +
            "FROM alumnomateria AS am " +
            "INNER JOIN materia AS m ON m.id_materia = am.id_materia " +
            "INNER JOIN estadoevaluativo AS ev ON ev.id_estadoevaluativo = am.id_estadoevaluativo " +
            "INNER JOIN curso AS c ON c.id_curso = am.id_curso " +
            "INNER JOIN alumnocurso AS ac ON ac.id_curso = c.id_curso " +
            "WHERE am.dni_alumno = $1 AND am.id_curso = ac.id_curso " +
            "ORDER BY c.id_curso DESC", 
            [dni_alumno]
        );
        res.status(200).json({ grilla: respuesta.rows });
    } catch (error) {
        console.error("Error al cargar la grilla:", error.message);
        res.status(500).json({ error: 'Error al cargar la grilla' });
    }
}