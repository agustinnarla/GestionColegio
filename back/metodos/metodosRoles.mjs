import {pool} from '../dataBase/coneccion.mjs';

export const obtenerRoles = async (req,res) => {
    try {
        const respuesta = await pool.query('SELECT * FROM roles')
        res.status(200).json({roles: respuesta.rows});
        console.log('Roles obtenidos exitosamente');
    }
    catch(error){
        console.log(error.message);
        res.status(500).json({ message: 'Error al obtener roles' });
    }   
}