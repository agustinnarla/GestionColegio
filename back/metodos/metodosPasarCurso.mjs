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
            "WHERE idcurso=$1 AND a.idestadoalumno=1",
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

export const registrarCursoNuevo = async(req,res) => {
    const {idcurso,dnialumno} = req.body
    try{
        const respuesta = await pool.query('UPDATE alumnocurso SET idcurso = $1 WHERE dnialumno = $2', [idcurso, dnialumno])
        console.log('Todo ok')
        res.status(200).json({curso: respuesta.rows})
    }catch{
        console.log('Error')
    }
}