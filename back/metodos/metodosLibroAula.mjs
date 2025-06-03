
import {pool} from "../dataBase/coneccion.mjs"

//Ver si es usuario --> Error de usuario
export const obtenerMateriaPorProfesor = async (req, res) => {
    const { dni_profesional } = req.params;
    try {
        const respuesta = await pool.query(
            "SELECT mp.id_materia, m.detalle FROM materia_profesor AS mp " +
            "INNER JOIN materia m ON m.id_materia = mp.id_materia " +
            "WHERE mp.dni_profesional = $1",
            [dni_profesional]
        );
        if (respuesta.rowCount === 0) {
            return res.status(404).json({ error: "No se encontraron materias para el profesor especificado" });
        }
        res.status(200).json({ materia: respuesta.rows }); 
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al obtener la materia por profesor" });
    }
};

export const obtenerCaracteristicasUnidad = async (req,res) => {
    try{
        const respuesta = await pool.query("SELECT id_caracteristica_unidad,detalle FROM caracteristicas_unidad")
        res.status(200).json(respuesta.rows)
    }catch(error){
        console.log(error)
        res.status(500).json({error: "Error al obtener las caracteristicas unidas"})
    }
}

export const obtenerCursoPorMateria = async (req,res) => {
    const {id_materia} = req.params
    try{
        //Capaz comparar tambien con el id del profesor
        const respuesta = await pool.query("SELECT c.id_curso, c.detalle FROM materia_curso AS mc " + 
            " INNER JOIN curso c ON c.id_curso = mc.id_curso " + 
            " WHERE id_materia = $1", [id_materia])
        res.status(200).json(respuesta.rows)
        if(respuesta.rowCount === 0){
            return res.status(404).json({error: "No se encontraron cursos para la materia especificada"})
        }
    }catch(error){
        console.log(error)
        res.status(500).json({error: "Error al obtener el curso por materia"})
    }
}

export const registrarLibroAula = async (req,res) => {
 
    const {id_materia, fecha, numero_clase, unidad, id_caracteristica_unidad, tema_abarcado, dni_profesional, id_curso} = req.body
    try{
        const respuesta = await pool.query("INSERT INTO libro_aula (id_materia, fecha, numero_clase, unidad, id_caracteristica_unidad, tema_abarcado, dni_profesional, id_curso) " +
            "VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", 
            [id_materia, fecha, numero_clase, unidad, id_caracteristica_unidad, tema_abarcado, dni_profesional, id_curso])
            res.status(201).json(respuesta.rows[0])
            if(respuesta.rowCount === 0){
                return res.status(404).json({error: "No se pudo registrar el libro de aula"})
            }
    }catch(error){
        console.log(error)
        res.status(500).json({error: "Error al registrar el libro de aula"})
    }
}

export const obtenerLibroAula = async (req, res) => {
    const { dni_profesional, id_curso, id_materia } = req.params;
    try {
        const respuesta = await pool.query(
            `SELECT 
                TO_CHAR(l.fecha, 'DD-MM-YYYY') AS fecha, 
                l.numero_clase, 
                l.unidad, 
                cu.detalle AS caracteristica_unidad, 
                l.tema_abarcado
            FROM libro_aula AS l
            INNER JOIN caracteristicas_unidad AS cu ON cu.id_caracteristica_unidad = l.id_caracteristica_unidad
            WHERE l.dni_profesional = $1 AND l.id_curso = $2 AND l.id_materia = $3
            ORDER BY l.fecha ASC, l.numero_clase ASC`,
            [dni_profesional, id_curso, id_materia]
        );
        res.status(200).json({ libro_aula: respuesta.rows });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al traer el libro de aula" });
    }
}