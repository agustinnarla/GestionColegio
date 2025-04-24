import {pool} from '../dataBase/coneccion.mjs'

export const crearAvisos = async (req, res) => {
    const { informacion, id_motivo, fecha, profesores = [], cursos = [] } = req.body;
    
    // Validar campos obligatorios
    if (!informacion || !id_motivo || !fecha) {
        return res.status(400).json({ 
            error: 'Los campos "informacion", "id_motivo" y "fecha" son requeridos' 
        });
    }

    try {
        // Validar y formatear la fecha
        let fechaValida;
        try {
            fechaValida = new Date(fecha);
            if (isNaN(fechaValida.getTime())) {
                throw new Error('Fecha inválida');
            }
        } catch (error) {
            return res.status(400).json({ 
                error: 'El formato de fecha es inválido. Use un formato ISO válido (YYYY-MM-DDTHH:MM:SS)' 
            });
        }

        // Iniciar transacción
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // 1. Insertar el aviso principal
            const avisoResult = await client.query(
                `INSERT INTO avisos 
                 (informacion, id_motivo, fecha) 
                 VALUES ($1, $2, $3) 
                 RETURNING id_avisos`,
                [informacion, id_motivo, fechaValida]
            );

            const idAviso = avisoResult.rows[0].id_avisos;

            // 2. Insertar relaciones con profesores (convertir strings a integers)
            if (profesores && profesores.length > 0) {
                const profesoresInt = profesores.map(p => parseInt(p, 10));
                await client.query(
                    `INSERT INTO avisos_profesores 
                     (id_avisos, dni_profesor) 
                     SELECT $1, unnest($2::int[])`,
                    [idAviso, profesoresInt]
                );
            }

            // 3. Insertar relaciones con cursos (convertir strings a integers)
            if (cursos && cursos.length > 0) {
                const cursosInt = cursos.map(c => parseInt(c, 10));
                await client.query(
                    `INSERT INTO avisos_cursos 
                     (id_avisos, id_curso) 
                     SELECT $1, unnest($2::int[])`,
                    [idAviso, cursosInt]
                );
            }

            await client.query('COMMIT');

            res.status(201).json({
                id_avisos: idAviso,
                mensaje: 'Aviso creado exitosamente',
                detalles: {
                    profesores_asignados: profesores.length,
                    cursos_asignados: cursos.length
                }
            });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error al crear el aviso:', error);
        res.status(500).json({ 
            error: 'Error al crear el aviso',
            detalle: process.env.NODE_ENV === 'development' ? error.message : 'Consulte al administrador'
        });
    }
};

export const obtenerAvisos = async (req, res) => {
    try {
        const query = `
            SELECT 
                a.id_avisos,
                a.informacion,
                m.detalle as motivo,
                TO_CHAR(a.fecha, 'DD/MM/YYYY HH24:MI') as fecha_formateada,
                
                -- Profesores como string concatenado
                (
                    SELECT STRING_AGG(p.nombre || ' ' || p.apellido, ', ')
                    FROM avisos_profesores ap
                    JOIN profesor p ON ap.dni_profesor = p.dni_profesor
                    WHERE ap.id_avisos = a.id_avisos
                ) AS profesores,
                
                -- Cursos como string concatenado
                (
                    SELECT STRING_AGG(c.detalle, ', ')
                    FROM avisos_cursos ac
                    JOIN curso c ON ac.id_curso = c.id_curso
                    WHERE ac.id_avisos = a.id_avisos
                ) AS cursos
                
            FROM avisos a
            LEFT JOIN motivos m ON a.id_motivo = m.id_motivo
            ORDER BY a.fecha DESC
        `;
        
        const result = await pool.query(query);
        
        // Formatear los datos simplificados
        const avisosSimplificados = result.rows.map(aviso => ({
            informacion: aviso.informacion,
            motivo: aviso.motivo || 'Motivo no especificado',
            profesores: aviso.profesores || 'Sin profesores asignados',
            cursos: aviso.cursos || 'Sin cursos asignados',
            fecha: aviso.fecha_formateada
        }));
        
        res.status(200).json(avisosSimplificados);
    } catch (error) {
        console.error('Error al obtener avisos:', error);
        res.status(500).json({ 
            error: 'Error al obtener avisos',
            detalle: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const obtenerMotivos = async (req, res) => {
    try {
        const query = `
            SELECT 
                id_motivo,
                detalle
            FROM motivos
            ORDER BY id_motivo ASC
        `;
        const result = await pool.query(query);
        res.status(200).json({
            motivos: result.rows,
        });
    } catch (error) {
        console.error('Error al obtener motivos:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al obtener los motivos',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
            code: 'MOTIVOS_FETCH_ERROR'
        });
    }
};