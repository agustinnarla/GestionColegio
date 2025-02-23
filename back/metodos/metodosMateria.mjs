import {pool} from '../dataBase/coneccion.mjs'


//Luego se tendria q traer materias de acuerdo al profesor 
export const obtenerMateria = async (req, res) => {
    try {
        const respuesta = await pool.query("SELECT id_materia, detalle FROM materia");
        console.log('Materias traídas exitosamente');

        if (respuesta.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron materias' });
        }

        res.json({ materia: respuesta.rows });
    } catch (error) {
        console.error( 'error al traer las materias');
    }
}