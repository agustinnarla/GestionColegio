const api_url = 'http://localhost:5000'
const api_urlRol = 'http://localhost:5000/rol'
const api_urlRolesAlta = 'http://localhost:5000/rol/alta'
const api_urlTareas = 'http://localhost:5000/tareas'
const api_urlTareasRol = 'http://localhost:5000/tarearol'



export const registrarRol = async (nombreRol) => {
    try {
        const response = await fetch(`${api_urlRolesAlta}`, {
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
        const response = await fetch(`${api_urlRol}/deshabilitar/${id_rol}`, {
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
        const response = await fetch(`${api_urlRol}/habilitar/${id_rol}`, {
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





