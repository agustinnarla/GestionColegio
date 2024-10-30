import {pool} from '../dataBase/coneccion.mjs'


export const obtenerAlumno = async (req,res) => {
    try{
        const respuesta = await pool.query('SELECT * FROM alumno')
        res.json({alumnos: respuesta.rows})
    }catch{
        console.log('Error al traer los alumnos')
    }
}

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
        const { dnialumno, nombre, apellido, domicilio, departamento, piso, idsexo, cuil, fechanacimiento, idlocalidad, idestadoalumno, telefonopersonal, telefonomadre, telefonopadre, emailpersonal, emailfamiliar, idcurso,edificio } = req.body;

        const respuesta = await pool.query(
            'INSERT INTO alumno (dnialumno, nombre, apellido, domicilio, departamento, piso, idsexo, cuil, fechanacimiento, idlocalidad, idestadoalumno, telefonopersonal,telefonomadre, telefonopadre, emailpersonal, emailfamiliar,edificio) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,$16,$17) RETURNING *',
            [dnialumno, nombre, apellido, domicilio, departamento, piso, idsexo, cuil, fechanacimiento, idlocalidad, idestadoalumno, telefonopersonal, telefonomadre, telefonopadre, emailpersonal, emailfamiliar,edificio]
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
