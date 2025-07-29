import {pool} from '../../dataBase/coneccion.mjs'


//VER
export const obtenerMateria = async (req, res) => {
    try {
        const respuesta = await pool.query("SELECT id_materia, detalle FROM materia");
        console.log('Materias traídas exitosamente');

        if (respuesta.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron materias' });
        }
        console.log('Materias traídas exitosamente');
        res.json({ materia: respuesta.rows });
    } catch (error) {
        console.error( 'error al traer las materias');
    }
}

//OBTENGO LAS MATERIAS DEL ALUMNO CON LAS RESPECTIVAS NOTAS 
export const obtenerMateriaPorDni = async (req, res) => {
    const { dni_alumno } = req.params;
    try {
        const respuesta = await pool.query(`
            SELECT 
    CONCAT(p.nombre, ' ', p.apellido) AS profesor, 
    c.id_curso,
    c.detalle AS curso, 
    m.id_materia,
    m.detalle AS materia, 
    (
      SELECT array_agg(dia ORDER BY orden)
      FROM (
        SELECT DISTINCT h2.dia_semana AS dia,
          CASE h2.dia_semana
            WHEN 'Lunes' THEN 1
            WHEN 'Martes' THEN 2
            WHEN 'Miercoles' THEN 3
            WHEN 'Miércoles' THEN 3
            WHEN 'Jueves' THEN 4
            WHEN 'Viernes' THEN 5
            WHEN 'Sábado' THEN 6
            WHEN 'Domingo' THEN 7
            ELSE 8
          END AS orden
        FROM horario h2
        WHERE h2.id_materia = m.id_materia AND h2.id_curso = c.id_curso
      ) sub
    ) AS dias_semana,
    am.nota1,
    am.nota2,
    am.nota3,
    am.nota4,
    am.nota5,
    am.nota6,
    am.tp1,
    am.tp2,
    am.tp3,
    am.aulico,
    ROUND(am.promedio::numeric, 2) AS promedio
FROM alumno_curso ac
INNER JOIN curso c ON c.id_curso = ac.id_curso 
INNER JOIN alumno a ON a.dni_alumno = ac.dni_alumno
INNER JOIN materia_curso mc ON mc.id_curso = c.id_curso
INNER JOIN materia m ON m.id_materia = mc.id_materia
LEFT JOIN materia_profesor mp ON mp.id_materia = m.id_materia
LEFT JOIN profesional p ON p.dni_profesional = mp.dni_profesional
LEFT JOIN horario h ON mc.id_materia = h.id_materia AND mc.id_curso = h.id_curso
INNER JOIN alumno_materia am ON am.id_materia = m.id_materia AND a.dni_alumno = am.dni_alumno
WHERE a.dni_alumno = $1 AND ac.id_curso = am.id_curso AND mp.id_estado_general = 1
GROUP BY p.nombre, p.apellido, c.id_curso, c.detalle, m.id_materia, m.detalle, am.nota1, am.nota2, am.nota3, am.nota4, am.nota5, am.nota6, am.tp1, am.tp2, am.tp3, am.aulico, am.promedio
        `, [dni_alumno]);

        console.log('Materias por curso traídas exitosamente:', respuesta.rows);

        if (respuesta.rows.length === 0) {
            return res.status(200).json({ materias: [] }); 
        }

        res.json({ materias: respuesta.rows });
    } catch (error) {
        console.error('Error al traer las materias por curso:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};