import {pool} from '../../dataBase/coneccion.mjs'

export const obtenerMaterias = async (req, res) => {
    try {
        const respuesta = await pool.query('SELECT * FROM materia WHERE id_estado_general = 1');
        res.json({ materias: respuesta.rows });
    } catch (error) {
        console.log('Error al traer las materias', error);
        res.status(500).json({ error: 'Error al obtener las materias' });
    }
};

export const obtenerMateriasDeshabilitadas = async (req, res) => {
    try {
        const respuesta = await pool.query('SELECT * FROM materia WHERE id_estado_general = 2');
        res.json({ materias: respuesta.rows });
    } catch (error) {
        console.log('Error al traer las materias', error);
        res.status(500).json({ error: 'Error al obtener las materias' });
    }
};

export const obtenerProfesor = async (req,res) => {
    try{
        const respuesta = await pool.query('SELECT * FROM profesional WHERE id_rol = 2 AND id_estado_general = 1')
        res.json({profesor: respuesta.rows})
    }catch{
        console.log('Error al traer las materias')
    }
}

export const verificarExistencia = async (dni_profesional, id_materia) => {
    const resultado = await pool.query(
        'SELECT * FROM materia_profesor WHERE dni_profesional = $1 AND id_materia = $2',
        [dni_profesional, id_materia]
    );
    return resultado.rows.length > 0;
};

export const obtenerProfesorPorMateria = async (req, res) => {
    const { id_materia } = req.params; // Obtener el id de la materia desde los parámetros de la URL
    
    try {
        const respuesta = await pool.query(
            'SELECT dni_profesional FROM materia_profesor WHERE id_materia = $1',
            [id_materia]
        );
        
        res.json({ profesor: respuesta.rows });
    } catch (error) {
        console.error('Error al traer los profesores por materia:', error);
        res.status(500).json({ error: 'Error al obtener los profesores' });
    }
};

export const registrarMateriaProfesor = async (req, res) => {
    const relaciones = req.body;
    console.log("Relaciones recibidas:", relaciones);
    
    if (!Array.isArray(relaciones) || relaciones.length === 0) {
        return res.status(400).json({ error: 'Se requiere un arreglo con dni_profesional e id_materia' });
    }
    
    const id_materia = relaciones[0].id_materia;
    
    try {
        // Paso 1: Obtener todos los profesores activos actuales para la materia
        const profesoresExistentes = await pool.query(
            'SELECT dni_profesional FROM materia_profesor WHERE id_materia = $1 AND id_estado_general = 1',
            [id_materia]
        );
        const dniActuales = profesoresExistentes.rows.map(row => row.dni_profesional);
        const nuevosDni = relaciones.map(r => r.dni_profesional);
        
        // Paso 2: Desactivar los que ya no vienen
        const dniParaDesactivar = dniActuales.filter(dni => !nuevosDni.includes(dni));
        for (const dni_profesional of dniParaDesactivar) {
            await pool.query(
                'UPDATE materia_profesor SET id_estado_general = 2 WHERE id_materia = $1 AND dni_profesional = $2',
                [id_materia, dni_profesional]
            );
            console.log(`Profesor ${dni_profesional} desactivado para la materia ${id_materia}`);
        }
        
        const relacionesProcesadas = [];
        
        // Paso 3: Insertar o actualizar los nuevos
        for (const relacion of relaciones) {
            const { dni_profesional } = relacion;
            const id_estado_general = 1; // Activo
            
            if (!dni_profesional || !id_materia) {
                console.error('Relación inválida:', relacion);
                continue;
            }
            
            const existe = await pool.query(
                'SELECT * FROM materia_profesor WHERE dni_profesional = $1 AND id_materia = $2',
                [dni_profesional, id_materia]
            );
            
            if (existe.rows.length > 0) {
                // Actualizar a activo
                const actualizada = await pool.query(
                    'UPDATE materia_profesor SET id_estado_general = 1 WHERE dni_profesional = $1 AND id_materia = $2 RETURNING *',
                    [dni_profesional, id_materia]
                );
                console.log('Relación actualizada (activada):', actualizada.rows[0]);
                relacionesProcesadas.push(actualizada.rows[0]);
            } else {
                // Insertar nueva
                const insertada = await pool.query(
                    'INSERT INTO materia_profesor (dni_profesional, id_materia, id_estado_general) VALUES ($1, $2, $3) RETURNING *',
                    [dni_profesional, id_materia, id_estado_general]
                );
                console.log('Relación registrada:', insertada.rows[0]);
                relacionesProcesadas.push(insertada.rows[0]);
            }
        }
        
        return res.status(201).json({
            mensaje: 'Relaciones procesadas exitosamente',
            data: relacionesProcesadas
        });
        
    } catch (error) {
        console.error('Error al registrar materia-profesor:', error);
        return res.status(500).json({ error: 'Error interno del servidor', detalles: error.message });
    }
};

export const deshabilitarMateriaProfesor = async (req, res) => {
    const { id_materia } = req.params;
    try {
        await pool.query('UPDATE materia_profesor SET id_estado_general = 2 WHERE id_materia = $1', [id_materia]);
        res.status(200).json({ mensaje: 'Relaciones deshabilitada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar relaciones:', error);
        res.status(500).json({ error: 'Error al eliminar relaciones' });
    }
};

export const deshabilitarMateria = async (req, res) => {
    const { id_materia } = req.params; 
    if (!id_materia) {
        return res.status(400).json({ error: 'ID de materia no proporcionado' });
    }
    
    try {
        // Actualizar el estado de la materia a deshabilitada (id_estado_general = 2)
        await pool.query('UPDATE materia SET id_estado_general = 2 WHERE id_materia = $1', [id_materia]);
        
        res.status(200).json({ mensaje: 'Materia deshabilitada exitosamente' });
    } catch (error) {
        console.error('Error al deshabilitar la materia:', error);
        res.status(500).json({ error: 'Error al deshabilitar la materia' });
    }
};

export const agregarMateria = async (req, res) => {
    const { detalle } = req.body; // Recibe el nombre de la materia desde el frontend
    if (!detalle) {
        return res.status(400).json({ error: "El detalle de la materia es obligatorio" });
    }
    try {
        const respuesta = await pool.query(
            "INSERT INTO materia (detalle, id_estado_general) VALUES ($1, 1) RETURNING *",
            [detalle]
        );
        res.status(201).json({ mensaje: "Materia registrada con éxito", materia: respuesta.rows[0] });
    } catch (error) {
        console.error("Error al insertar la materia:", error);
        res.status(500).json({ error: "Error al registrar la materia" });
    }
};

export const habilitarMateria = async (req, res) => {
    const { id_materia } = req.params; 
    if (!id_materia) {
        return res.status(400).json({ error: 'ID de materia no proporcionado' });
    }
    try {
        // Actualizar el estado de la materia a deshabilitada (id_estado_general = 2)
        await pool.query('UPDATE materia SET id_estado_general = 1 WHERE id_materia = $1', [id_materia]);

        res.status(200).json({ mensaje: 'Materia habilitada exitosamente' });
    } catch (error) {
        console.error('Error al habilitar la materia:', error);
        res.status(500).json({ error: 'Error al habilitar la materia' });
    }
};

export const consultarMateria = async (req, res) => {
    const { detalle } = req.params; // Recibe el detalle de la materia desde el frontend
    if (!detalle) {
        return res.status(400).json({ error: 'El detalle de la materia es obligatorio' });
    }
    try {
        const respuesta = await pool.query(
            'SELECT * FROM materia WHERE detalle = $1',
            [detalle]
        );
        if (respuesta.rows.length > 0) {
            res.status(200).json({ materias: respuesta.rows });
        } else {
            res.status(404).json({ message: 'Materia no encontrada' });
        }
    } catch (error) {
        console.error('Error al consultar la materia:', error);
        res.status(500).json({ error: 'Error al consultar la materia' });
    }
};

export const modificarMateria = async (req, res) => {   
    const { id_materia } = req.params;
    const campos = [
        "detalle", "id_estado_general"
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

    valores.push(id_materia); // Para el WHERE

    const query = `UPDATE materia SET ${sets.join(', ')} WHERE id_materia = $${valores.length} RETURNING *`;

    try {
        const respuesta = await pool.query(query, valores);
        if (respuesta.rowCount === 0) {
            return res.status(404).json({ message: 'No se encontró la materia' });
        }

        res.status(200).json({ message: 'Materia modificada correctamente', data: respuesta.rows[0] });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al modificar la materia' });
    }
};