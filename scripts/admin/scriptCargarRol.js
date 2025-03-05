const api_url = 'http://localhost:5000'
const api_urlRoles = 'http://localhost:5000/roles'
const api_urlTareas = 'http://localhost:5000/tareas'
const api_urlTareasRol = 'http://localhost:5000/tarearol'

export const obtenerTareasRol = async (id_rol) => {
    try {
        const response = await fetch(`${api_urlTareasRol}/rol/${id_rol}`);
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



export const registrarRolTarea = async (id_rol, id_tarea) => {
    try {
        // Paso 1: Eliminar todas las relaciones existentes para el rol
        const deleteResponse = await fetch(`${api_urlTareasRol}/rol`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_tarea: id_tarea,
                id_rol: id_rol, // Aseguramos que el id_rol también esté incluido
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

export const registrarRol = async (nombreRol) => {
    try {
        const response = await fetch(`${api_urlRoles}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                detalle: nombreRol, // Asegúrate de que el backend espera este campo
            }),
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return { mensaje: 'Rol registrado exitosamente', data };
    } catch (error) {
        console.error('Error al registrar el rol:', error);
        return { mensaje: 'Error al registrar el rol' };
    }
};

export const deshabilitarRol = async (id_rol) => {
    try {
        const response = await fetch(`${api_urlRoles}/deshabilitarol/${id_rol}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return { mensaje: 'Rol deshabilitado exitosamente', data }; // Cambié el mensaje para indicar éxito
    } catch (error) {
        console.error('Error al deshabilitar el rol:', error);
        return { mensaje: `Error al deshabilitar el rol: ${error.message}` }; // Mensaje de error más detallado
    }
};


export const habilitarRol = async (id_rol) => {
    try {
        const response = await fetch(`${api_urlRoles}/habilitarrol/${id_rol}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return { mensaje: 'Rol deshabilitado exitosamente', data }; // Cambié el mensaje para indicar éxito
    } catch (error) {
        console.error('Error al deshabilitar el rol:', error);
        return { mensaje: `Error al deshabilitar el rol: ${error.message}` }; // Mensaje de error más detallado
    }
};
export const obtenerRolesDeshabilitados = async () => {
    try {
        const response = await fetch(`${api_urlRoles}/rolesdeshabilitados`);
        const data = await response.json();
        console.log('Respuesta de la API:', data);
        return data;
    } catch (error) {
        console.error('Error al obtener roles:', error);
        return { roles: [] }; // Devuelve un array vacío en caso de error
    }
};




