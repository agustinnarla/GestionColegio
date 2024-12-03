import {pool} from '../dataBase/coneccion.mjs'

export const obtenerNotas = async (req,res) => {
    const {dnialumno} = req.params
    try{
        const respuesta = await pool.query('SELECT nota1,nota2,nota3,nota4,nota5,nota6 FROM AlumnoMateria WHERE dnialumno = $1',[dnialumno])
        res.status(200).json({nota: respuesta.rows})
    }catch{
        console.log("Error al traer las notas")
    }
}

export const registrarNota = async (req,res) => {
    const {dnialumno,idmateria,idetapa,nota1,nota2,nota3,nota4,nota5,nota6,idestadoevaluativo} = req.body
    try{
    
        const promedioRespuesta = await pool.query('SELECT AVG(nota1,nota2,nota3,nota4,nota5,nota6)'
            + 'as promedio FROM alumnomateria WHERE dnialumno = $1 AND idmateria = $2', [dnialumno, idmateria]);
        const promedio = promedioRespuesta.rows[0].promedio || 0; 

        const respuesta = await pool.query('INSERT INTO alumnomateria (dnialumno,idmateria,idetapas,nota1,nota2,nota3,nota4,nota5,nota6,idestadoevaluativo,promedio)' 
            + 'VALUES ($1,$2,$3,$4,$5,$6)',
            [dnialumno,idmateria,idetapa,nota1,nota2,nota3,nota4,nota5,nota6,idestadoevaluativo,promedio]);
        console.log("Listo")
        res.status(200).json({nota: respuesta.rows})
    }catch{
        console.log("Error al cargar la nota")
        res.status(500).json({error: 'Algo salio mal en la carga de nota'})
    }
}