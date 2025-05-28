const api_urlTareaRolAlta = 'http://localhost:5000/tarea/rol/alta'
const api_urlTareasRol = 'http://localhost:5000/tarearol'


// 🔴
export const registrarTareaRol = async (relaciones) => {
    try {
        // Paso 1: Eliminar todas las relaciones existentes para la tarea
        const id_tarea = relaciones[0].id_tarea; // Asume que todas las relaciones tienen el mismo id_tarea
        const deleteResponse = await fetch(`${api_urlTareaRolAlta}/tarea`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_tarea: id_tarea,
            }),
        });

        if (!deleteResponse.ok) {
            throw new Error('Error al eliminar las relaciones existentes');
        }
        console.log('Relaciones eliminadas exitosamente');

        // Paso 2: Insertar todas las relaciones en una sola operación
        const insertResponse = await fetch(`${api_urlTareasRol}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(relaciones), // Envía el arreglo de relaciones
        });
        //hola
        if (!insertResponse.ok) {
            throw new Error('Hubo un error al registrar las relaciones');
        }

        const result = await insertResponse.json();
        return result; // Retorna la respuesta del backend
    } catch (error) {
        console.error('Error al registrar la relación:', error);
        return { mensaje: 'Error al registrar la relación' };
    }
};
// 🔴
export const registrarRolTarea = async (relaciones) => {
    try {
        // Paso 1: Eliminar todas las relaciones existentes para el rol (si es necesario)
        const id_rol = relaciones[0].id_rol; // Asume que todas las relaciones tienen el mismo id_rol
        const deleteResponse = await fetch(`${api_urlTareasRol}/rol`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_rol: id_rol,
            }),
        });

        if (!deleteResponse.ok) {
            throw new Error('Error al eliminar las relaciones existentes');
        }
        console.log('Relaciones eliminadas exitosamente');

        // Paso 2: Insertar todas las relaciones en una sola operación
        const insertResponse = await fetch(`${api_urlTareasRol}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(relaciones), // Envía el arreglo de relaciones
        });

        if (!insertResponse.ok) {
            throw new Error('Hubo un error al registrar las relaciones');
        }

        const result = await insertResponse.json();
        return result; // Retorna la respuesta del backend
    } catch (error) {
        console.error('Error al registrar la relación:', error);
        return { mensaje: 'Error al registrar la relación' };
    }
};