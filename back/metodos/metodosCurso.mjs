import {pool} from '../dataBase/coneccion.mjs'


export const obtenerCurso = async (req,res) => {
    try{
        const respuesta = await pool.query("SELECT idcurso,detalle FROM curso")
        res.json({curso: respuesta.rows})
    }
    catch{
        console.log("Error al traer los cursos")
    }
}
export const obtenerCursoFiltrado = async (req, res) => {
    const { idcurso } = req.params; // Obtener el idcurso desde los parámetros de la solicitud
    try {
        const respuesta = await pool.query(
            "SELECT idcurso, detalle FROM curso WHERE idcurso = $1",
            [idcurso]
        );
        if (respuesta.rows.length > 0) {
            res.json({ curso: respuesta.rows[0] }); // Enviar solo el curso encontrado
        } else {
            res.status(404).json({ error: 'Curso no encontrado' }); // Respuesta si no se encuentra el curso
        }
    } catch (error) {
        console.error("Error al traer el curso:", error.message);
        res.status(500).json({ error: 'Error al obtener el curso' });
    }
};
