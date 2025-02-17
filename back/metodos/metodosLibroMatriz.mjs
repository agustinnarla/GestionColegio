import {pool} from '../dataBase/coneccion.mjs'

export const cargarGrilla = async (req, res) => {
    const { dnialumno } = req.params;
    try {
        const respuesta = await pool.query(
            "SELECT am.dnialumno, m.detalle AS materia_detalle, ev.detalle AS estado_detalle, am.promedio, c.detalle " +
            "FROM alumnomateria AS am " +
            "INNER JOIN materia AS m ON m.idmateria = am.idmateria " +
            "INNER JOIN estadoevaluativo AS ev ON ev.idestadoevaluativo = am.idestadoevaluativo " +
            "INNER JOIN curso AS c ON c.idcurso = am.idcurso " +
            "WHERE am.dnialumno = $1",
            [ dnialumno]
        );
        res.status(200).json({ grilla: respuesta.rows });
    } catch (error) {
        console.error("Error al cargar la grilla:", error.message);
        res.status(500).json({ error: 'Error al cargar la grilla' });
    }
}