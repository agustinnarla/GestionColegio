const api_url = 'http://localhost:5000'
const api_urlRoles = 'http://localhost:5000/roles'
const api_urlTareas = 'http://localhost:5000/tareas'
const api_urlTareasRol = 'http://localhost:5000/tarearol'

export const obtenerRoles = async () => {
    try {
        const response = await fetch(api_urlRoles);
        const data = await response.json();
        console.log('Respuesta de la API:', data);
        return data;
    } catch (error) {
        console.error('Error al obtener roles:', error);
        return { roles: [] }; // Devuelve un array vacío en caso de error
    }
};

export const obtenerTareas = async () => {
    try {
        const response = await fetch(api_urlTareas);
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        return { tareas: [] };
    }
};

export const registrarTareaRol = async (id_rol, id_tarea) => {
    try {
        // Paso 1: Eliminar todas las relaciones existentes para la tarea
        const deleteResponse = await fetch(`${api_urlTareasRol}`, {
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
        } else {
            console.log("Relaciones eliminadas exitosamente");
        }


        // Paso 2: Insertar las nuevas relaciones con id_rol e id_tarea
        const insertResponse = await fetch(`${api_urlTareasRol}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_rol: id_rol,
                id_tarea: id_tarea,
            }),
        });
        // Verificar si la inserción fue exitosa
        if (insertResponse.ok) {
            return { mensaje: 'Relación Tarea-Rol actualizada exitosamente' };
        } else {
            return { mensaje: 'Hubo un error al registrar la relación' };
        }
    } catch (error) {
        console.error('Error al registrar la relación:', error);
        return { mensaje: 'Error al registrar la relación' };
    }
};

export const obtenerTareasRol = async (id_tarea) => {
    try {
        const response = await fetch(`${api_urlTareasRol}/${id_tarea}`);
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener las relaciones de la tarea:', error);
        return null;
    }
};

export const agregarTarea = async (detalle) => {
    try {
        const response = await fetch(api_urlTareas, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ detalle }),
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al agregar la tarea:', error);
        return null;
    }
};

export const deshabilitarTarea = async (id_tarea) => {
    try {
        const respuesta = await fetch(`${api_urlTareas}/${id_tarea}`, {  // Pasa el ID en la URL
            method: 'PUT',  // Cambiar a PUT en lugar de DELETE
            headers: { 'Content-Type': 'application/json' },
        });

        if (!respuesta.ok) {
            throw new Error('Error al deshabilitar la tarea');
        }

        return await respuesta.json();  // Devuelve la respuesta JSON si todo sale bien

    } catch (error) {
        console.error('Error en deshabilitarTarea:', error);
        return null;
    }
};


