import { API_BASE_URL } from "../config.js";

const api_urlMateriaAlta = `${API_BASE_URL}/materia/alta`;
const api_urlMateriaDeshabilitar = `${API_BASE_URL}/materia/deshabilitar`;
const api_urlMateriaHabilitar = `${API_BASE_URL}/materia/habilitar`;
const api_urlMateriaProfesor = `${API_BASE_URL}/profesor/materia/alta`;

// 🟢
export const registrarMateriaProfesor = async (relaciones) => {
    try {
        // Enviar todas las relaciones en un solo POST
        const respuesta = await fetch(`${api_urlMateriaProfesor}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(relaciones),
        });

        if (respuesta.ok) {
            return { mensaje: 'Relación Materia-Profesor registrada exitosamente' };
        } else {
            return { mensaje: 'Hubo un error al registrar la relación' };
        }
    } catch (error) {
        console.error('Error al registrar la relación:', error);
        return { mensaje: 'Error al registrar la relación' };
    }
};

// 🟢
export const deshabilitarMateria = async (id_materia) => {
    try {
        const respuesta = await fetch(`${api_urlMateriaDeshabilitar}/${id_materia}`, {
            method: 'PUT',  // Cambiar a PUT en lugar de DELETE
            headers: { 'Content-Type': 'application/json' },
        });

        if (!respuesta.ok) {
            throw new Error('Error al deshabilitar la materia');
        }

        const data = await respuesta.json();  // Devuelve la respuesta JSON si todo sale bien
        return data;  // Devuelve el objeto JSON completo

    } catch (error) {
        console.error('Error en deshabilitarMateria:', error);
        return null;
    }
};

// 🟢
export const habilitarMateria = async (id_materia) => {
    try {
        const respuesta = await fetch(`${api_urlMateriaHabilitar}/${id_materia}`, {  // Pasa el ID en la URL
            method: 'PUT',  // Cambiar a PUT en lugar de DELETE
            headers: { 'Content-Type': 'application/json' },
        });

        if (!respuesta.ok) {
            throw new Error('Error al habilitar la materia');
        }

        return await respuesta.json();  // Devuelve la respuesta JSON si todo sale bien

    } catch (error) {
        console.error('Error en habilitarMateria:', error);
        return null;
    }
}; 

// 🟢
export const registrarMateria = async (detalle) => {
    try {
        const respuesta = await fetch(api_urlMateriaAlta, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ detalle }) // Enviar detalle en el cuerpo de la solicitud
        });

        if (!respuesta.ok) {
            throw new Error('Error al registrar la materia');
        }
        return await respuesta.json();
    } catch (error) {
        console.error('Error en registrarMateria:', error);
        return null;
    }
};