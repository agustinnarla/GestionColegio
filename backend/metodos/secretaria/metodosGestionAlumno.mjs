import {pool} from '../../dataBase/coneccion.mjs'
import { encriptarContrasena } from '../navegacion/metodosLogin.mjs';

export const obtenerAlumno = async (req,res) => {
    const {dni_alumno} = req.params
    try{    
        const respuesta = await pool.query('SELECT * FROM alumno WHERE dni_alumno = $1', [dni_alumno]);
        res.json({alumnos: respuesta.rows})
    }catch{
        console.log('Error al traer los alumnos')
    }
}

export const obtenerLegajoAlumno = async (req, res) => {
    
    try {
        const { dni_alumno } = req.params;
        // Consulta para obtener los metadatos del legajo, incluidos los campos binarios como BLOB o BYTEA
        const respuesta = await pool.query(`
            SELECT 
                dni_alumno,
                fecha_subida,
                LENGTH(dni_foto) AS tamaño_dni,
                LENGTH(ficha_medica) AS tamaño_ficha_medica,
                LENGTH(partida_nacimiento) AS tamaño_partida_nacimiento
            FROM alumno_legajo
            WHERE dni_alumno = $1
        `, [dni_alumno]);
        // Mapear los resultados para enviar solo los metadatos
        const legajos = respuesta.rows.map(row => ({
            id: row.id,
            dni_alumno: row.dni_alumno,
            fechaSubida: row.fecha_subida,
            tamañoDni: row.tamaño_dni,  // Tamaño en bytes del archivo de DNI
            tamañoFichaMedica: row.tamaño_ficha_medica,  // Tamaño en bytes del archivo de ficha médica
            tamañoPartidaNacimiento: row.tamaño_partida_nacimiento  // Tamaño en bytes del archivo de partida de nacimiento
        }));
        // Enviar los metadatos al cliente
        res.json({ alumnos: legajos });
    } catch (error) {
        console.log("Error al traer el legajo del alumno", error);
        res.status(500).json({ error: 'Error al traer los datos del legajo' });
    }
};

export const obtenerLegajoAlumnoFiltrado = async (req, res) => {
    try {
        const { dni_alumno, imagen_Tipo } = req.params; // Capturamos el dnialumno y el tipo de imagen
        const respuesta = await pool.query(
            'SELECT * FROM alumno_legajo WHERE dni_alumno = $1',
            [dni_alumno]
        );

        if (respuesta.rows.length > 0) {
            let archivo; // Variable para almacenar el archivo que se enviará

            // Dependiendo de la ruta (imagenTipo), seleccionamos el archivo correcto
            switch (imagen_Tipo) {
                case '1': // DNI Foto
                    archivo = respuesta.rows[0].dni_foto;
                    break;
                case '2': // Ficha médica
                    archivo = respuesta.rows[0].ficha_medica;
                    break;
                case '3': // Partida de nacimiento
                    archivo = respuesta.rows[0].partida_nacimiento;
                    break;
                default:
                    return res.status(400).send({ error: 'Tipo de archivo no válido' });
            }

            // Configurar el encabezado de respuesta como PDF
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline'); // Mostrar el archivo en el navegador
            res.setHeader('Cache-Control', 'no-store');
            res.send(archivo); // Enviar el archivo PDF al cliente
        } else {
            res.status(404).send({ error: 'No se encontró el legajo' });
        }
    } catch (error) {
        console.error('Error al obtener archivo de la base de datos:', error);
        res.status(500).send({ error: 'Error al obtener archivo' });
    }
};

// VER
export const obtenerAlumnoFiltrado = async (req, res) => {
    try {
        const { dni_alumno } = req.params;
        const respuesta = await pool.query(
            `SELECT a.*, ac.id_curso, ac.dni_alumno 
            FROM alumno a 
            INNER JOIN alumno_curso ac ON ac.dni_alumno = a.dni_alumno  
            WHERE a.dni_alumno = $1`, 
            [dni_alumno]
        );

        if (respuesta.rows.length === 0) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }

        res.json({ alumno: respuesta.rows });
        console.log("Alumno filtrado encontrado");
    } catch (error) {
        console.log('Error al traer el alumno:', error);
        res.status(500).json({ error: 'Error al traer el alumno' });
    }
}

//registrar Alumno
export const registrarAlumno = async (req, res) => {
    try {
        const { dni_alumno, nombre, apellido, domicilio, departamento, piso, id_sexo, cuil, 
            fecha_nacimiento, id_localidad, id_estado_general, telefono_personal, telefono_madre,
            telefono_padre, email_personal, email_familiar, id_curso,edificio } = req.body;

        const respuesta = await pool.query(
            'INSERT INTO alumno (dni_alumno, nombre, apellido, domicilio, departamento, piso, id_sexo, cuil,'
            + 'fecha_nacimiento, id_localidad, id_estado_general, telefono_personal,telefono_madre, telefono_padre, email_personal, email_familiar,edificio)'
            + 'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,$16,$17) RETURNING *',
            [dni_alumno, nombre, apellido, domicilio, departamento, piso, id_sexo, cuil, fecha_nacimiento, id_localidad, id_estado_general, telefono_personal, 
                telefono_madre, telefono_padre, email_personal, email_familiar,edificio]
        );

        const nuevoDni = respuesta.rows[0].dni_alumno;

        await pool.query(
            'INSERT INTO alumno_curso (dni_alumno, id_curso) VALUES ($1, $2)',
            [nuevoDni, id_curso]
        );

    

        res.status(210).json(respuesta.rows[0]);
        console.log('Alumno registrado correctamente y curso asignado');
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error al cargar un alumno nuevo' });
        console.log('Error al cargar un alumno');
    }
};

//Registrar Legajo
export const registrarLegajo = async (req, res) => {
    try {
        const { dni_alumno, fecha_subida } = req.body;

        // Verificar si los archivos están presentes
        const dni_foto = req.files.dni_foto ? req.files.dni_foto[0].buffer : null;
        const ficha_medica = req.files.ficha_medica ? req.files.ficha_medica[0].buffer : null;
        const partida_nacimiento = req.files.partida_nacimiento ? req.files.partida_nacimiento[0].buffer : null;

        if (!dni_alumno || !fecha_subida) {
            return res.status(400).json({ error: 'Faltan datos obligatorios (dnialumno, fecha_subida).' });
        }

        // Realizar la consulta para insertar los datos
        const respuesta = await pool.query(
            `INSERT INTO alumno_legajo (dni_alumno, dni_foto, ficha_medica, partida_nacimiento, fecha_subida)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [dni_alumno, dni_foto, ficha_medica, partida_nacimiento, fecha_subida]
        );

        // Responder con los datos del nuevo registro
        res.status(201).json(respuesta.rows[0]);
        console.log('Legajo registrado correctamente:', respuesta.rows[0]);
    } catch (err) {
        console.error('Error al registrar legajo:', err.message);
        res.status(500).json({ error: 'Error al agregar el legajo del alumno.' });
    }
};


export const deshabilitarAlumno = async (req,res) =>{
    try{
        const {dni_alumno} = req.params;
        const respuesta = await pool.query('UPDATE alumno SET id_estado_general = 2 WHERE dni_alumno = $1', [dni_alumno]);
        
        if (respuesta.rowCount === 0) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        console.log("Alumno deshabilitado exitosamente");
        res.status(200).json({ message: 'Alumno deshabilitado exitosamente' }); 
    }catch{
        console.log('Error al deshabilitar el alumno');
        res.status(500).json({ error: 'Error al deshabilitar el alumno' });
    }
}

export const modificarAlumno = async (req, res) => {
    try {
        const { dni_alumno } = req.params;
        const { nombre, apellido, domicilio, departamento, piso, id_sexo, cuil, fecha_nacimiento, 
            id_localidad, id_estado_general, telefono_personal, telefono_madre, telefono_padre, email_personal, email_familiar, id_curso, edificio } = req.body; 
        const valores = [];
        const columnas = [];
        // Crear un objeto con los campos que se pueden actualizar
        const camposActualizables = {
            nombre,
            apellido,
            domicilio,
            departamento,
            piso,
            id_sexo,
            cuil,
            fecha_nacimiento,
            id_localidad,
            id_estado_general,
            telefono_personal,
            telefono_madre,
            telefono_padre,
            email_personal,
            email_familiar,
            edificio
        };
        // Iterar sobre el objeto y construir las columnas y valores
        for (const [campo, valor] of Object.entries(camposActualizables)) {
            if (valor) {
                columnas.push(`${campo} = $${valores.length + 1}`);
                valores.push(valor);
            }
        }

        if (valores.length === 0) {
            return res.status(400).json({ error: 'No se proporcionaron datos para actualizar' });
        }

        // Actualizar la tabla alumno
        valores.push(dni_alumno);
        const respuestaAlumno = await pool.query('UPDATE alumno SET ' + columnas.join(', ') + ' WHERE dni_alumno = $' + (valores.length), valores);
        
        if (respuestaAlumno.rowCount === 0) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }

        // Si se proporciona un nuevo idcurso, actualizar la tabla alumnocurso
        if (id_curso) {
            const respuestaCurso = await pool.query('UPDATE alumno_curso SET id_curso = $1 WHERE dni_alumno = $2', [id_curso, dni_alumno]);
            if (respuestaCurso.rowCount === 0) {
                return res.status(404).json({ error: 'Curso no encontrado para el alumno' });
            }
        }

        // Registrar el alumno como usuario
        const contrasenaHaseada = await encriptarContrasena(dni_alumno.toString());
        const id_rol = 4; 

        await pool.query(
            'UPDATE usuario SET contrasena = $1, email = $2, id_rol = $3 WHERE dni_usuario = $4',
            [contrasenaHaseada, email_personal, id_rol, dni_alumno]
        );


        console.log("Alumno actualizado exitosamente");
        res.status(200).json({ message: 'Alumno actualizado exitosamente' }); 
    } catch (error) {
        console.log('Error al actualizar el alumno:', error);
        res.status(500).json({ error: 'Error al actualizar el alumno' });
    }
}

export const modificarAdjuntoLegajo = async (req, res) => {
    try {
        const { dni_alumno, fecha_subida } = req.body;

        // Verificar si los archivos están presentes
        const dni_foto = req.files.dni_foto ? req.files.dni_foto[0].buffer : null;
        const ficha_medica = req.files.ficha_medica ? req.files.ficha_medica[0].buffer : null;
        const partida_nacimiento = req.files.partida_nacimiento ? req.files.partida_nacimiento[0].buffer : null;

        if (!dni_alumno || !fecha_subida) {
            return res.status(400).json({ error: 'Faltan datos obligatorios (dni_alumno, fecha_subida).' });
        }

        // Realizar la consulta para insertar los datos
        const respuesta = await pool.query(
            `UPDATE alumno_legajo
            SET dni_foto = $1, ficha_medica = $2, partida_nacimiento = $3, fecha_subida = $4
            WHERE dni_alumno = $5
            RETURNING *`,
            [dni_foto, ficha_medica, partida_nacimiento, fecha_subida, dni_alumno]
        );
        

        // Responder con los datos del nuevo registro
        res.status(201).json(respuesta.rows[0]);
        console.log('Legajo cambiado correctamente:', respuesta.rows[0]);
    } catch (err) {
        console.error('Error al registrar legajo:', err.message);
        res.status(500).json({ error: 'Error al agregar el legajo del alumno.' });
    }
};

export const obtenerAlumnoNombreApellido = async (req,res) => {
    try{
        const respuesta = await pool.query("SELECT CONCAT(nombre, ' ', apellido) AS nombrecompleto FROM alumno")
        res.status(200).json({alumnos: respuesta.rows})
    }catch(error){
        console.log(error)
    }
}

//VER
export const obtenerAlumnoCurso = async (req,res) => {
    const {id_curso} = req.params
    try{
        const respuesta = await pool.query("SELECT a.dni_alumno,CONCAT(nombre,' ',apellido)  as nombrecompleto FROM alumno a INNER JOIN alumno_curso ac ON a.dni_alumno = ac.dni_alumno WHERE id_curso=$1 AND a.id_estado_general=1",
            [id_curso])
        res.status(200).json({alumnos: respuesta.rows})
    }catch(error){
        console.log(error)
    }
}