
import {pool} from "../dataBase/coneccion.mjs"

export const obtenerMateriaPorProfesor = async (req,res) => {
    const {dni_usuario} = req.params
    try{
        const respuesta = await pool.query("SELECT mp.id_materia,m.detalle FROM materia_profesor AS mp " + 
            "INNER JOIN materia m ON m.id_materia = mp.id_materia " +
            "WHERE dni_usuario = $1", 
            [dni_usuario])
        if(respuesta.rowCount === 0){
            return res.status(404).json({error: "No se encontraron materias para el profesor especificado"})
        }
        res.status(200).json(respuesta.rows)
    }catch(error){
        console.log(error)
        res.status(500).json({error: "Error al obtener la materia por profesor"})
    }
}

export const obtenerCaracteristicasUnidas = async (req,res) => {
    try{
        const respuesta = await pool.query("SELECT detalle FROM caracteristicas_unidad")
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
        const respuesta = await pool.query("SELECT c.detalle FROM materia_curso AS mc " + 
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
    const {dni_profesor} = req.params
    const {id_materia, fecha, numero_clase, unidad, id_caracteristicas_unidad, tema} = req.body
    try{
        const respuesta = await pool.query("INSERT INTO libro_aula (id_materia, fecha, numero_clase, unidad, id_caracteristicas_unidad, tema, dni_profesor) " +
            "VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", 
            [id_materia, fecha, numero_clase, unidad, id_caracteristicas_unidad, tema, dni_profesor])
            res.status(201).json(respuesta.rows[0])
            if(respuesta.rowCount === 0){
                return res.status(404).json({error: "No se pudo registrar el libro de aula"})
            }
    }catch(error){
        console.log(error)
        res.status(500).json({error: "Error al registrar el libro de aula"})
    }
}