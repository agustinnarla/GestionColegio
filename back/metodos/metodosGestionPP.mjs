import {pool} from '../dataBase/coneccion.mjs'
import { encriptarContrasena } from './metodosRegistrarUsuario.mjs'

export const habilitarProfesional = async (req, res) => {
    const { dni, nombre, apellido, email, fecha_nacimiento, cuit, id_rol, id_sexo, domicilio, departamento,
        piso, id_localidad, telefono_personal, telefono_alternativo, id_estadoalumno, numero, edificio} = req.body
    try{
        const respuesta = await pool.query("INSERT INTO profesional (dni, nombre, apellido, email, fecha_nacimiento, cuit, id_rol, id_sexo, domicilio, departamento, piso, id_localidad, telefono_personal, telefono_alternativo, id_estadoalumno, numero, edificio)" + 
            " VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *",
            [dni, nombre, apellido, email, fecha_nacimiento, cuit, id_rol, id_sexo, domicilio, departamento, piso, id_localidad, telefono_personal, telefono_alternativo, id_estadoalumno, numero, edificio]
        )

        const contrasenaHaseada = await encriptarContrasena(dni.toString());

        await pool.query(
            'INSERT INTO usuario (dni_usuario, contrasena, email, id_rol, id_estadoalumno) VALUES ($1, $2, $3, $4)',
            [dni, contrasenaHaseada, email, id_rol, id_estadoalumno]
        );

        res.status(200).json({message: 'Profesor preceptor habilitado correctamente', data: respuesta.rows[0]})
        console.log("Todo ok")
    }catch(error){
        console.log(error)
        res.status(500).json({message: 'Error al habilitar el profesor preceptor'})
    }
}

export const deshabilitarProfesional = async (req, res) => {
    const {dni} = req.params
    try{
        const respuesta = await pool.query("UPDATE profesional SET id_estadoalumno = 2 WHERE dni = $1 RETURNING *", [dni])
        if(respuesta.rowCount === 0){
            return res.status(404).json({message: 'No se encontró el profesor preceptor'})
        }
        await pool.query("UPDATE usuario SET id_estadoalumno = 2 WHERE dni_usuario = $1", [dni])
        res.status(200).json({message: 'Profesor preceptor deshabilitado correctamente', data: respuesta.rows[0]})
        console.log("Todo ok")
    }catch(error){
        console.log(error)
        res.status(500).json({message: 'Error al deshabilitar el profesor preceptor'})
    }
}

export const obtenerProfesional = async (req, res) => {
    const { dni } = req.params
    try{
        const respuesta = await pool.query("SELECT * FROM profesional WHERE dni = $1", [dni])
        if(respuesta.rowCount === 0){
            return res.status(404).json({message: 'No se encontró el profesor preceptor'})
        }
        res.status(200).json({message: 'Profesor preceptor encontrado correctamente', data: respuesta.rows[0]})
        console.log("Todo ok")
    }catch(error)
    {
        console.log(error)
        res.status(500).json({message: 'Error al obtener el profesor preceptor'})
    }
}

export const modificarProfesional = async (req, res) => {   
    const { dni } = req.params;
    const campos = [
        "nombre", "apellido", "email", "fecha_nacimiento", "cuit", "id_rol", "id_sexo",
        "domicilio", "departamento", "piso", "id_localidad", "telefono_personal", "telefono_alternativo"
    ];
    const valores = [];
    const sets = [];

    campos.forEach((campo, idx) => {
        if (req.body[campo] !== undefined) {
            sets.push(`${campo} = $${sets.length + 1}`);
            valores.push(req.body[campo]);
        }
    });

    if (sets.length === 0) {
        return res.status(400).json({ message: 'No se enviaron campos para actualizar' });
    }

    valores.push(dni); // Para el WHERE

    const query = `UPDATE profesional SET ${sets.join(', ')} WHERE dni = $${valores.length} RETURNING *`;

    try {
        const respuesta = await pool.query(query, valores);
        if (respuesta.rowCount === 0) {
            return res.status(404).json({ message: 'No se encontró el profesor preceptor' });
        }
        res.status(200).json({ message: 'Profesor preceptor modificado correctamente', data: respuesta.rows[0] });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al modificar el profesor preceptor' });
    }
};