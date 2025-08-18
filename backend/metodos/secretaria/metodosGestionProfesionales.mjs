import {pool} from '../../dataBase/coneccion.mjs'
import { encriptarContrasena } from '../navegacion/metodosLogin.mjs'

//Registrar 
export const registrarProfesional = async (req, res) => {
    const { dni_profesional, nombre, apellido, email, fecha_nacimiento, cuit, id_rol, id_sexo, domicilio, departamento,
        piso, id_localidad, telefono_personal, telefono_alternativo, id_estado_general, edificio} = req.body
    try{
        const existente = await pool.query("SELECT 1 FROM profesional WHERE dni_profesional = $1", [dni_profesional]);
        if (existente.rowCount > 0) {
            return res.status(409).json({ 
                message: 'El profesional ya está registrado.',
                code: 'DNI_INVALIDO'
            });
        }
        
        const edad = calcularEdad(fecha_nacimiento);
        if (edad <= 21) {
            return res.status(400).json({
                message: 'El profesional debe tener más de 21 años.',
                code: 'EDAD_INVALIDA'
            });
        }
        
        const respuesta = await pool.query("INSERT INTO profesional (dni_profesional, nombre, apellido, email, fecha_nacimiento, cuit, id_rol, id_sexo, domicilio, departamento, piso, id_localidad, telefono_personal, telefono_alternativo, id_estado_general, edificio)" + 
            " VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *",
            [dni_profesional, nombre, apellido, email, fecha_nacimiento, cuit, id_rol, id_sexo, domicilio, departamento, piso, id_localidad, telefono_personal, telefono_alternativo, id_estado_general, edificio]
        )

        const contrasenaHaseada = await encriptarContrasena(dni_profesional.toString());

        await pool.query(
            'INSERT INTO usuario (dni_usuario, contrasena, email, id_rol, id_estado_general) VALUES ($1, $2, $3, $4, $5)',
            [dni_profesional, contrasenaHaseada, email, id_rol, id_estado_general]
        );

        res.status(200).json({message: 'Profesor preceptor habilitado correctamente', data: respuesta.rows[0]})
        console.log("Todo ok")
    }catch(error){
        console.log(error)
        if (error.status) {
            return res.status(error.status).json({message: error.error});
        }
        res.status(500).json({message: 'Error al habilitar el profesor preceptor'})
    }
}

export const deshabilitarProfesional = async (req, res) => {
    const {dni_profesional} = req.params
    try{
        if (!dni_profesional || isNaN(dni_profesional)) {
            return res.status(400).json({ message: 'DNI no valido, verifique' });
        }
        const respuesta = await pool.query("UPDATE profesional SET id_estado_general = 2 WHERE dni_profesional = $1 RETURNING *", [dni_profesional])
        if(respuesta.rowCount === 0){
            return res.status(404).json({message: 'No se encontró el profesional'})
        }
        await pool.query("UPDATE usuario SET id_estado_general = 2 WHERE dni_usuario = $1", [dni_profesional])
        res.status(200).json({message: 'Profesional deshabilitado correctamente', data: respuesta.rows[0]})
        console.log("Todo ok")
    }catch(error){
        console.log(error)
        res.status(500).json({message: 'Error al deshabilitar el profesional'})
    }
}

export const consultarProfesional = async (req, res) => {
    const { dni_profesional } = req.params
    try{
        if (!dni_profesional || isNaN(dni_profesional)) {
            return res.status(400).json({ message: 'DNI no valido, verifique' });
        }
        const respuesta = await pool.query(`SELECT dni_profesional, nombre, apellido, 
            email, TO_CHAR(fecha_nacimiento, 'DD/MM/YYYY') as fecha_nacimiento, cuit, 
            id_rol, id_sexo, domicilio, departamento, piso, id_localidad, telefono_personal, 
            telefono_alternativo, id_estado_general, edificio 
            FROM profesional WHERE dni_profesional = $1`, [dni_profesional])
        if(respuesta.rowCount === 0){
            return res.status(404).json({message: 'No se encontró el profesor preceptor'})
        }
        res.status(200).json({message: 'Profesor preceptor encontrado correctamente', data: respuesta.rows[0]})
    }catch(error)
    {
        res.status(500).json({message: 'Error al obtener el profesor preceptor'})
    }
}

export const modificarProfesional = async (req, res) => {   
    const { dni_profesional } = req.params;
    const campos = [
        "nombre", "apellido", "email", "fecha_nacimiento", "cuit", "id_rol", "id_sexo",
        "domicilio", "departamento", "piso", "id_localidad", "telefono_personal", "telefono_alternativo", "id_estado_general", "edificio"
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

    valores.push(dni_profesional); // Para el WHERE

    const query = `UPDATE profesional SET ${sets.join(', ')} WHERE dni_profesional = $${valores.length} RETURNING *`;
    
    try {
        const respuesta = await pool.query(query, valores);
        if (respuesta.rowCount === 0) {
            return res.status(404).json({ message: 'No se encontró el profesor preceptor' });
        }

        // Si se modificó el estado general, actualizar también en la tabla usuario
        if (req.body.id_estado_general !== undefined) {
            await pool.query(
                "UPDATE usuario SET id_estado_general = $1 WHERE dni_usuario = $2",
                [req.body.id_estado_general, dni_profesional]
            );
        }

        res.status(200).json({ message: 'Profesor preceptor modificado correctamente', data: respuesta.rows[0] });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al modificar el profesor preceptor' });
    }
};

const calcularEdad = (fecha_nacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fecha_nacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
};

