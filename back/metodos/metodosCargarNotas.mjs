import {pool} from '../dataBase/coneccion.mjs'

export const obtenerNotas = async (req, res) => {
    const {idcurso} = req.params;
    try {
        const respuesta = await pool.query(`
            SELECT 
                a.dnialumno, 
                CONCAT(nombre,' ',apellido) as nombre_completo,
                COALESCE(am.nota1, NULL) AS nota1, 
                COALESCE(am.nota2, NULL) AS nota2,
                COALESCE(am.nota3, NULL) AS nota3,
                COALESCE(am.nota4, NULL) AS nota4,
                COALESCE(am.nota5, NULL) AS nota5,
                COALESCE(am.nota6, NULL) AS nota6
            FROM alumno a
            LEFT JOIN alumnomateria am 
                ON a.dnialumno = am.dnialumno
            INNER JOIN alumnocurso ac 
                ON a.dnialumno = ac.dnialumno
            WHERE ac.idcurso = $1 AND a.idestadoalumno = 1
        `, [idcurso]);
        
        res.status(200).json({notas: respuesta.rows});
    } catch (error) {
        console.error("Error al traer las notas:", error.message);
        res.status(500).json({ error: 'Error al obtener las notas' });
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
        const idestadoevaluativo = promedio >= 6 ? 1 : 2; 

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