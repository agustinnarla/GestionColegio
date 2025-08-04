import {pool} from '../../dataBase/coneccion.mjs'

//obtener libro matriz
export const obtenerLibroMatriz = async (req, res) => {
    const { dni_alumno } = req.params;
    try {
        const respuesta = await pool.query(
            `SELECT 
                am.dni_alumno, 
                m.detalle AS materia_detalle, 
                ev.detalle AS estado_detalle, 
                ROUND(am.promedio::numeric, 0) AS promedio, 
                c.detalle AS curso_detalle, 
                c.id_curso
            FROM alumno_materia AS am
            INNER JOIN materia AS m ON m.id_materia = am.id_materia
            INNER JOIN estado_evaluativo AS ev ON ev.id_estado_evaluativo = am.id_estado_evaluativo
            INNER JOIN curso AS c ON c.id_curso = am.id_curso
            WHERE am.dni_alumno = $1 AND am.id_estado_evaluativo  = 1
            ORDER BY c.id_curso DESC`,
            [dni_alumno]
        );
        res.status(200).json({ libroMatriz: respuesta.rows });
    } catch (error) {
        console.error("Error al cargar la grilla:", error.message);
        res.status(500).json({ error: 'Error al cargar la grilla' });
    }
}