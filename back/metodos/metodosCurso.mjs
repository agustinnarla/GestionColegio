import {pool} from '../dataBase/coneccion.mjs'


export const obtenerCurso = async (req,res) => {
    try{
        const respuesta = await pool.query("SELECT id_curso,detalle FROM curso")
        res.json({curso: respuesta.rows})
    }
    catch{
        console.log("Error al traer los cursos")
    }
}
export const obtenerCursoFiltrado = async (req, res) => {
     // Obtener el idcurso desde los parámetros de la solicitud
    const { idcurso } = req.params;
    try {
        const respuesta = await pool.query(
            "SELECT id_curso, detalle FROM curso WHERE id_curso = $1",
            [idcurso]
        );
        if (respuesta.rows.length > 0) {
            // Enviar solo el curso encontrado
            res.json({ curso: respuesta.rows[0] }); 
        } else {
            // Respuesta si no se encuentra el curso
            res.status(404).json({ error: 'Curso no encontrado' }); 
        }
    } catch (error) {
        console.error("Error al traer el curso:", error.message);
        res.status(500).json({ error: 'Error al obtener el curso' });
    }
};
