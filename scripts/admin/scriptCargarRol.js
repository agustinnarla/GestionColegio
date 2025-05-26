const api_url = 'http://localhost:5000'
const api_urlRoles = 'http://localhost:5000/roles'
const api_urlTareas = 'http://localhost:5000/tareas'
const api_urlTareasRol = 'http://localhost:5000/tarearol'
//const response = await fetch(`${api_urlTareasRol}/rol/${id_rol}`);

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





