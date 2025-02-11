import {pool} from '../dataBase/coneccion.mjs'

//Falta traer los que tengan finales --> Seguir viendo
export const obtenerAlumnoFinal = async (req,res) => {
    const {idcurso} = req.params
    try{
        // Obtener promedios de cada alumno en distintas materias
        const promedios = await pool.query('SELECT dnialumno, AVG(promedio) as promedio FROM alumnomateria GROUP BY dnialumno')
        
        // Comprobar si hay algún promedio menor a 6
        const alumnosConFinales = promedios.rows.map(alumno => ({
            dnialumno: alumno.dnialumno,
            tieneFinal: alumno.promedio < 6 
        }));

        const respuesta = await pool.query(
            "SELECT a.dnialumno, CONCAT(nombre,' ',apellido) as nombrecompleto, promedio as promedio " +
            "FROM alumno a INNER JOIN alumnocurso ac ON a.dnialumno = ac.dnialumno INNER JOIN alumnomateria am ON a.dnialumno = am.dnialumno " +
            "WHERE am.idcurso=$1 AND a.idestadoalumno=1 AND am.idestadoevaluativo=1",
            [idcurso]
        );

        // Agregar información sobre finales pendientes a la respuesta
        const alumnosConInfo = respuesta.rows.map(alumno => {
            const infoFinal = alumnosConFinales.find(a => a.dnialumno === alumno.dnialumno);
            return {
                ...alumno,
                tieneFinal: infoFinal ? infoFinal.tieneFinal : false // Asigna el estado de final
            };
        });

        res.status(200).json({alumnos: alumnosConInfo});
    }catch(error){
        console.log(error)
    }
}

export const registrarCursoNuevo = async(req, res) => {
    try {
        const alumnos = req.body; // Ahora esperamos un array de alumnos
        
        if (!Array.isArray(alumnos)) {
            return res.status(400).json({
                message: "Se esperaba un array de alumnos"
            });
        }

        // Obtener el curso actual del primer alumno para referencia
        const cursoActual = await pool.query(
            `SELECT c.detalle 
            FROM alumnocurso ac 
            JOIN curso c ON ac.idcurso = c.idcurso 
            WHERE ac.dnialumno = $1`,
            [alumnos[0].dnialumno]
        );

        if (!cursoActual.rows[0]) {
            return res.status(404).json({
                message: 'No se encontró el curso actual'
            });
        }

        // Extraer el número del curso actual (1 de "1a" o "1b")
        const añoActual = parseInt(cursoActual.rows[0].detalle);
        const añoSiguiente = añoActual + 1;

        // Buscar el primer curso del año siguiente (por ejemplo, "2a")
        const cursoSiguiente = await pool.query(
            `SELECT idcurso 
            FROM curso 
            WHERE detalle LIKE $1
            ORDER BY detalle ASC
            LIMIT 1`,
            [`${añoSiguiente}%`]
        );

        if (!cursoSiguiente.rows[0]) {
            return res.status(404).json({
                message: `No existe un curso siguiente (${añoSiguiente}°) para este grupo.`
            });
        }

        const idcursonuevo = cursoSiguiente.rows[0].idcurso;

        // Actualizar todos los alumnos en una sola transacción
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            for (const alumno of alumnos) {
                await client.query(
                    'UPDATE alumnocurso SET idcurso = $1 WHERE dnialumno = $2', 
                    [idcursonuevo, alumno.dnialumno]
                );
            }
            
            await client.query('COMMIT');
            
            res.status(200).json({
                success: true,
                message: "Alumnos actualizados correctamente"
            });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

    } catch (error) {
        console.log('Error:', error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}