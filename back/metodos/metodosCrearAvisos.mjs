import {pool} from '../dataBase/coneccion.mjs'

// CrearAviso
export const crearAviso = async (req, res) => {
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
                    `INSERT INTO aviso_profesionales
                     (id_aviso_profesional, dni_profesional) 
                     SELECT $1, unnest($2::int[])`,
                    [idAviso, profesoresInt]
                );
            }

            // 3. Insertar relaciones con cursos (convertir strings a integers)
            if (cursos && cursos.length > 0) {
                const cursosInt = cursos.map(c => parseInt(c, 10));
                await client.query(
                    `INSERT INTO aviso_curso 
                     (id_aviso_curso, id_cursos) 
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