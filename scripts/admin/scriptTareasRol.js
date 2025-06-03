// 🔴
const api_urlTareaRolAlta = 'http://localhost:5000/tarea/rol/alta';
const api_urlRolTareaAlta = 'http://localhost:5000/rol/tarea/alta';
const api_urlTareasRol = 'http://localhost:5000/rol/tarea';

export const registrarTareaRol = async (relaciones) => {
    try {
        const response = await fetch(api_urlTareaRolAlta, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(relaciones),
        });

        if (!response.ok) {
            throw new Error('Error al registrar las relaciones Tarea-Rol');
        }

        const data = await response.json();
        console.log('Relaciones procesadas exitosamente:', data);
        return { mensaje: 'Relaciones procesadas exitosamente' };
    } catch (error) {
        console.error('Error al registrar las relaciones Tarea-Rol:', error);
        return { mensaje: 'Error al registrar las relaciones Tarea-Rol', detalles: error.message };
    }
};

export const registrarRolTarea = async (relaciones) => {
    try {
        const response = await fetch(api_urlRolTareaAlta, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(relaciones),
        });

        if (!response.ok) {
            throw new Error('Error al registrar las relaciones Tarea-Rol');
        }

        const data = await response.json();
        console.log('Relaciones procesadas exitosamente:', data);
        return { mensaje: 'Relaciones procesadas exitosamente' };
    } catch (error) {
        console.error('Error al registrar las relaciones Tarea-Rol:', error);
        return { mensaje: 'Error al registrar las relaciones Tarea-Rol', detalles: error.message };
    }
};