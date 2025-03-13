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

export const obtenerTareasDeRoles = async (id_rol) => {
    try {
        const response = await fetch(`${api_urlTareasRol}/obtenerTareasDeRoles/${id_rol}`);
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

export const obtenerRolesDeTarea = async (id_tarea) => {
    try {
        const response = await fetch(`${api_urlTareasRol}/obtenerRolesDeTarea/${id_tarea}`);
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

export const registrarTareaRol = async (relaciones) => {
    try {
        // Paso 1: Eliminar todas las relaciones existentes para la tarea
        const id_tarea = relaciones[0].id_tarea; // Asume que todas las relaciones tienen el mismo id_tarea
        const deleteResponse = await fetch(`${api_urlTareasRol}/tarea`, {
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