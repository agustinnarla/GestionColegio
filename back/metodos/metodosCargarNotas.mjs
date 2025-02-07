import {pool} from '../dataBase/coneccion.mjs'

export const obtenerNotas = async (req, res) => {
    const {idcurso,idmateria} = req.params;
    try {
        const respuesta = await pool.query(`
            SELECT 
                a.dnialumno, 
                CONCAT(a.nombre,' ',a.apellido) as nombre_completo,
                am.nota1, 
                am.nota2,
                am.nota3,
                am.nota4,
                am.nota5,
                am.nota6
            FROM alumno a
            LEFT JOIN alumnocurso ac 
                ON a.dnialumno = ac.dnialumno
            LEFT JOIN alumnomateria am 
                ON a.dnialumno = am.dnialumno 
                AND am.idmateria = $2
                AND am.idcurso = $1  /* Usamos $1 que corresponde a idcurso */
            WHERE ac.idcurso = $1 
                AND a.idestadoalumno = 1
            ORDER BY a.apellido, a.nombre
        `, [idcurso, idmateria]);
        
        res.status(200).json({notas: respuesta.rows});
    } catch (error) {
        console.error("Error al traer las notas:", error.message);
        res.status(500).json({ error: 'Error al obtener las notas' });
    }
}

export const registrarNota = async (req, res) => {
    try {
        if (!Array.isArray(req.body)) {
            return res.status(400).json({ error: "El formato de datos debe ser un array" });
        }

        const resultados = [];

        for (const registro of req.body) {
            const { 
                dnialumno, 
                idmateria, 
                idcurso,
                nota1 = 0, 
                nota2 = 0, 
                nota3 = 0, 
                nota4 = 0, 
                nota5 = 0, 
                nota6 = 0 
            } = registro;

            // Validar datos obligatorios
            if (!dnialumno || !idmateria || !idcurso) {
                resultados.push({
                    dnialumno,
                    error: "Faltan datos obligatorios"
                });
                continue;
            }

            try {
                // Calcular promedio
                const notas = [nota1, nota2, nota3, nota4, nota5, nota6];
                const notasValidas = notas.filter(nota => nota > 0);
                const promedio = notasValidas.length > 0 ? 
                    (notasValidas.reduce((a, b) => a + b, 0) / notasValidas.length) : 0;
                const idestadoevaluativo = promedio >= 6 ? 1 : 2;

                // Verificar si existe el registro
                const existeRegistro = await pool.query(`
                    SELECT * FROM alumnomateria 
                    WHERE dnialumno = $1 
                    AND idmateria = $2 
                    AND idcurso = $3`,
                    [dnialumno, idmateria, idcurso]
                );

                if (existeRegistro.rows.length > 0) {
                    // Actualizar registro existente
                    await pool.query(`
                        UPDATE alumnomateria 
                        SET nota1 = $4, nota2 = $5, nota3 = $6, nota4 = $7, nota5 = $8, nota6 = $9,
                            idestadoevaluativo = $10, promedio = $11
                        WHERE dnialumno = $1 
                        AND idmateria = $2 
                        AND idcurso = $3`,
                        [dnialumno, idmateria, idcurso, 
                         nota1, nota2, nota3, nota4, nota5, nota6,
                         idestadoevaluativo, promedio]
                    );
                    resultados.push({
                        dnialumno,
                        status: "actualizado"
                    });
                } else {
                    // Insertar nuevo registro
                    await pool.query(`
                        INSERT INTO alumnomateria 
                        (dnialumno, idmateria, idcurso, 
                         nota1, nota2, nota3, nota4, nota5, nota6,
                         idestadoevaluativo, promedio)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                        [dnialumno, idmateria, idcurso, 
                         nota1, nota2, nota3, nota4, nota5, nota6,
                         idestadoevaluativo, promedio]
                    );
                    resultados.push({
                        dnialumno,
                        status: "insertado"
                    });
                }

            } catch (error) {
                console.error("Error específico:", error);
                resultados.push({
                    dnialumno,
                    error: error.message
                });
            }
        }

        return res.status(200).json({ 
            message: "Proceso completado", 
            resultados 
        });

    } catch (error) {
        console.error("Error al cargar las notas:", error.message);
        console.error(error.stack);
        res.status(500).json({ error: "Error al procesar las notas" });
    }
};