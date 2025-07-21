import { API_BASE_URL } from '../config.js';

const api_urlTareaAlta = `${API_BASE_URL}/tarea/alta`;
const api_urlTareaDeshabilitar = `${API_BASE_URL}/tarea/deshabilitar`;
const api_urlTareaHabilitar = `${API_BASE_URL}/tarea/habilitar`;
const api_urlTareaConsultar = `${API_BASE_URL}/tarea/consultar`;
const api_urlTareaModificar = `${API_BASE_URL}/tarea/modificar`;

// 🟢
export const agregarTarea = async (detalle) => {
    try {
        const response = await fetch(api_urlTareaAlta, {
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

// 🟢
export const deshabilitarTarea = async (id_tarea) => {
    try {
        const respuesta = await fetch(`${api_urlTareaDeshabilitar}/${id_tarea}`, {  // Pasa el ID en la URL
            method: 'PUT',  
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

// 🟢
export const habilitarTarea = async (id_tarea) => {
    try {
        const respuesta = await fetch(`${api_urlTareaHabilitar}/${id_tarea}`, {  // Pasa el ID en la URL
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' },
        });

        if (!respuesta.ok) {
            throw new Error('Error al habilitar la tarea');
        }

        return await respuesta.json();  // Devuelve la respuesta JSON si todo sale bien

    } catch (error) {
        console.error('Error en habilitarTarea:', error);
        return null;
    }
};

// 🟢
export const consultarTarea = async (detalle) => {
    try{
        const respuesta = await fetch(`${api_urlTareaConsultar}/${encodeURIComponent(detalle)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!respuesta.ok) {
            throw new Error('Error al consultar la tarea');
        }

        const data = await respuesta.json();
        return data;
    }catch (error) {
        console.error('Error al consultar la tarea:', error);
        throw new Error('Error al consultar la tarea');
    }
}

// 🟢
export const modificarTarea = async (detalle, tareaData) => {
    try{
        const respuesta = await fetch(`${api_urlTareaModificar}/${encodeURIComponent(detalle)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tareaData)
        });

        if (!respuesta.ok) {
            throw new Error('Error al modificar la tarea');
        }

        const data = await respuesta.json();
        return data;
    }catch (error) {
        console.error('Error al modificar la tarea:', error);
        throw new Error('Error al modificar la tarea');
    }
}