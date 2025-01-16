import {pool} from '../dataBase/coneccion.mjs'


export const obtenerAlumno = async (req,res) => {
    try{
        const respuesta = await pool.query('SELECT * FROM alumno')
        res.json({alumnos: respuesta.rows})
    }catch{
        console.log('Error al traer los alumnos')
    }
}

export const obtenerLegajoAlumno = async (req, res) => {
    try {
        // Consulta para obtener los metadatos del legajo, incluidos los campos binarios como BLOB o BYTEA
        const respuesta = await pool.query(`
            SELECT 
                dnialumno,
                fecha_subida,
                LENGTH(dnifoto) AS tamaño_dni,
                LENGTH(fichamedica) AS tamaño_ficha_medica,
                LENGTH(partidanacimiento) AS tamaño_partida_nacimiento
            FROM adjuntolegajo
        `);
        // Mapear los resultados para enviar solo los metadatos
        const legajos = respuesta.rows.map(row => ({
            id: row.id,
            dnialumno: row.dnialumno,
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
        const { dnialumno, imagenTipo } = req.params; // Capturamos el dnialumno y el tipo de imagen
        const respuesta = await pool.query(
            'SELECT * FROM adjuntolegajo WHERE dnialumno = $1',
            [dnialumno]
        );

        if (respuesta.rows.length > 0) {
            let archivo; // Variable para almacenar el archivo que se enviará

            // Dependiendo de la ruta (imagenTipo), seleccionamos el archivo correcto
            switch (imagenTipo) {
                case '1': // DNI Foto
                    archivo = respuesta.rows[0].dnifoto;
                    break;
                case '2': // Ficha médica
                    archivo = respuesta.rows[0].fichamedica;
                    break;
                case '3': // Partida de nacimiento
                    archivo = respuesta.rows[0].partidanacimiento;
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

export const obtenerAlumnoFiltrado = async (req, res) => {
    try {
        const { dnialumno } = req.params;
        const respuesta = await pool.query(
            `SELECT a.*, ac.idcurso, ac.dnialumno 
            FROM alumno a 
            INNER JOIN alumnocurso ac ON ac.dnialumno = a.dnialumno  
            WHERE a.dnialumno = $1`, 
            [dnialumno]
        );

        if (respuesta.rows.length === 0) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }

        res.json({ alumnos: respuesta.rows });
        console.log("Alumno filtrado encontrado");
    } catch (error) {
        console.log('Error al traer el alumno:', error);
        res.status(500).json({ error: 'Error al traer el alumno' });
    }
}

export const agregarAlumno = async (req, res) => {
    try {
        const { dnialumno, nombre, apellido, domicilio, departamento, piso, idsexo, cuil, 
            fechanacimiento, idlocalidad, idestadoalumno, telefonopersonal, telefonomadre,
            telefonopadre, emailpersonal, emailfamiliar, idcurso,edificio } = req.body;

        const respuesta = await pool.query(
            'INSERT INTO alumno (dnialumno, nombre, apellido, domicilio, departamento, piso, idsexo, cuil,'
            + 'fechanacimiento, idlocalidad, idestadoalumno, telefonopersonal,telefonomadre, telefonopadre, emailpersonal, emailfamiliar,edificio)'
            + 'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,$16,$17) RETURNING *',
            [dnialumno, nombre, apellido, domicilio, departamento, piso, idsexo, cuil, fechanacimiento, idlocalidad, idestadoalumno, telefonopersonal, 
                telefonomadre, telefonopadre, emailpersonal, emailfamiliar,edificio]
        );

        const nuevoDni = respuesta.rows[0].dnialumno;

        await pool.query(
            'INSERT INTO alumnocurso (dnialumno, idcurso) VALUES ($1, $2)',
            [nuevoDni, idcurso]
        );

    

        res.status(210).json(respuesta.rows[0]);
        console.log('Alumno registrado correctamente y curso asignado');
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error al cargar un alumno nuevo' });
        console.log('Error al cargar un alumno');
    }
};

export const agregarLegajo = async (req, res) => {
    try {
        const { dnialumno, fecha_subida } = req.body;

        // Verificar si los archivos están presentes
        const dnifoto = req.files.dnifoto ? req.files.dnifoto[0].buffer : null;
        const fichamedica = req.files.fichamedica ? req.files.fichamedica[0].buffer : null;
        const partidanacimiento = req.files.partidanacimiento ? req.files.partidanacimiento[0].buffer : null;

        if (!dnialumno || !fecha_subida) {
            return res.status(400).json({ error: 'Faltan datos obligatorios (dnialumno, fecha_subida).' });
        }

        // Realizar la consulta para insertar los datos
        const respuesta = await pool.query(
            `INSERT INTO adjuntolegajo (dnialumno, dnifoto, fichamedica, partidanacimiento, fecha_subida)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [dnialumno, dnifoto, fichamedica, partidanacimiento, fecha_subida]
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
        const {dnialumno} = req.params;
        const respuesta = await pool.query('UPDATE alumno SET idestadoalumno = 2 WHERE dnialumno = $1', [dnialumno]);
        
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
        const { dnialumno } = req.params;
        const { nombre, apellido, domicilio, departamento, piso, idsexo, cuil, fechanacimiento, 
            idlocalidad, idestadoalumno, telefonopersonal, telefonomadre, telefonopadre, emailpersonal, emailfamiliar, idcurso, edificio } = req.body; 
        const valores = [];
        const columnas = [];
        // Crear un objeto con los campos que se pueden actualizar
        const camposActualizables = {
            nombre,
            apellido,
            domicilio,
            departamento,
            piso,
            idsexo,
            cuil,
            fechanacimiento,
            idlocalidad,
            idestadoalumno,
            telefonopersonal,
            telefonomadre,
            telefonopadre,
            emailpersonal,
            emailfamiliar,
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
        valores.push(dnialumno);
        const respuestaAlumno = await pool.query('UPDATE alumno SET ' + columnas.join(', ') + ' WHERE dnialumno = $' + (valores.length), valores);
        
        if (respuestaAlumno.rowCount === 0) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }

        // Si se proporciona un nuevo idcurso, actualizar la tabla alumnocurso
        if (idcurso) {
            const respuestaCurso = await pool.query('UPDATE alumnocurso SET idcurso = $1 WHERE dnialumno = $2', [idcurso, dnialumno]);
            if (respuestaCurso.rowCount === 0) {
                return res.status(404).json({ error: 'Curso no encontrado para el alumno' });
            }
        }

        console.log("Alumno actualizado exitosamente");
        res.status(200).json({ message: 'Alumno actualizado exitosamente' }); 
    } catch (error) {
        console.log('Error al actualizar el alumno:', error);
        res.status(500).json({ error: 'Error al actualizar el alumno' });
    }
}

export const modificarAdjuntoLegajo = async (req, res) => {
    try {
        const { dnialumno, fecha_subida } = req.body;

        // Verificar si los archivos están presentes
        const dnifoto = req.files.dnifoto ? req.files.dnifoto[0].buffer : null;
        const fichamedica = req.files.fichamedica ? req.files.fichamedica[0].buffer : null;
        const partidanacimiento = req.files.partidanacimiento ? req.files.partidanacimiento[0].buffer : null;

        if (!dnialumno || !fecha_subida) {
            return res.status(400).json({ error: 'Faltan datos obligatorios (dnialumno, fecha_subida).' });
        }

        // Realizar la consulta para insertar los datos
        const respuesta = await pool.query(
            `UPDATE adjuntolegajo 
            SET dnifoto = $1, fichamedica = $2, partidanacimiento = $3, fecha_subida = $4
            WHERE dnialumno = $5
            RETURNING *`,
            [dnifoto, fichamedica, partidanacimiento, fecha_subida, dnialumno]
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

export const obtenerAlumnoCurso = async (req,res) => {
    const {idcurso} = req.params
    try{
        const respuesta = await pool.query("SELECT a.dnialumno,CONCAT(nombre,' ',apellido)  as nombrecompleto FROM alumno a INNER JOIN alumnocurso ac ON a.dnialumno = ac.dnialumno WHERE idcurso=$1 AND a.idestadoalumno=1",
            [idcurso])
        res.status(200).json({alumnos: respuesta.rows})
    }catch(error){
        console.log(error)
    }
}