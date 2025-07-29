import { API_BASE_URL } from '../config.js';

const api_urlRol = `${API_BASE_URL}/rol`
const api_urlRolesAlta = `${API_BASE_URL}/rol/alta`
const api_urlRolModificar = `${API_BASE_URL}/rol/modificar`
const api_urlTareas = `${API_BASE_URL}/tareas`
const api_urlTareasRol = `${API_BASE_URL}/tarearol`



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
        return { mensaje: `Error al registrar el rol: ${error.message}` };
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
        return { mensaje: `Error al deshabilitar el rol: ${error.message} `}; // Mensaje de error más detallado
    }
};

export const modificarRol = async (detalle, rolData) => {
    try {
        const respuesta = await fetch(`${api_urlRolModificar}/${encodeURIComponent(detalle)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rolData) 
        });

        if (!respuesta.ok) {
            throw new Error('Error al modificar el rol');
        }
        return await respuesta.json();
    }catch(error){
        console.log("Error en el script", error);
    }
}

