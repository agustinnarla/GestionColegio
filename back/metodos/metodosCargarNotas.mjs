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

export const registrarNota = async (req, res) => {
    const { dnialumno, idmateria, idetapas, nota1 = 0, nota2 = 0, nota3 = 0, nota4 = 0, nota5 = 0, nota6 = 0 } = req.body;
    try {
        // Calcular el promedio de las notas directamente
        const notas = [nota1, nota2, nota3, nota4, nota5, nota6];
        const notasValidas = notas.filter(nota => nota > 0); 
        const promedio = notasValidas.length > 0 ? (notasValidas.reduce((a, b) => a + b, 0) / notasValidas.length) : 0;

        // Determinar el estado evaluativo basado en el promedio
        const idestadoevaluativo = promedio >= 6 ? 1 : 2; /

        // Verificar si el registro ya existe
        const existeRespuesta = await pool.query(`
            SELECT * FROM alumnomateria 
            WHERE dnialumno = $1 AND idmateria = $2 AND idetapas = $3`,
            [dnialumno, idmateria, idetapas]);

        if (existeRespuesta.rows.length > 0) {
            // Si existe, actualizar el registro
            const respuesta = await pool.query(`
                UPDATE alumnomateria 
                SET nota1 = $4, nota2 = $5, nota3 = $6, nota4 = $7, nota5 = $8, nota6 = $9, idestadoevaluativo = $10, promedio = $11 
                WHERE dnialumno = $1 AND idmateria = $2 AND idetapas = $3`,
                [dnialumno, idmateria, idetapas, nota1, nota2, nota3, nota4, nota5, nota6, idestadoevaluativo, promedio]);
            console.log("Registro actualizado");
            res.status(200).json({ nota: respuesta.rows });
        } else {
            // Si no existe, insertar el nuevo registro
            const respuesta = await pool.query('INSERT INTO alumnomateria (dnialumno, idmateria, idetapas, nota1, nota2, nota3, nota4, nota5, nota6, idestadoevaluativo, promedio) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
                [dnialumno, idmateria, idetapas, nota1, nota2, nota3, nota4, nota5, nota6, idestadoevaluativo, promedio]);
            console.log("Registro insertado");
            res.status(200).json({ nota: respuesta.rows });
        }
    } catch (error) {
        console.error("Error al cargar la nota:", error.message);
        console.error(error.stack);
        res.status(500).json({ error: 'Algo salió mal en la carga de nota' });
    }
}