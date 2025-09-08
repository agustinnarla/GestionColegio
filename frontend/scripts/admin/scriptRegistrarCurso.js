import { API_BASE_URL } from "../config.js";

const api_urlCursoConsultar = `${API_BASE_URL}/curso`;
const api_urlCursoAlta = `${API_BASE_URL}/curso/materia/alta`;
const api_urlCursoDeshabilitar = `${API_BASE_URL}/curso/deshabilitar`;
const api_urlCursoModificar = `${API_BASE_URL}/curso/modificar`;



// 🟢
export const registrarCursoPorMateria = async (formData) => {
    try {
        const respuesta = await fetch(`${API_BASE_URL}/curso/materia/alta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
        });
        const data = await respuesta.json();
        if (!respuesta.ok) {
            throw new Error(data.message || 'Error al registrar el curso');
        }
        return data;
    } catch (error) {
        console.error('Error en registrarCurso:', error.message);
        throw new Error('Error al registrar el curso');
    }
};

// 🟢
export const consultarCurso = async (detalle) => {
    try {
        const respuesta = await fetch(`${api_urlCursoConsultar}/${encodeURIComponent(detalle)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!respuesta.ok) {
            throw new Error('Error al consultar el curso');
        }

        const data = await respuesta.json();
        return data;
    } catch (error) {
        console.error('Error en consultarCurso:', error.message);
        throw new Error('Error al consultar el curso');
    }
}

// 🟢
export const deshabilitarCurso = async (id_curso) => {
    try {
        const respuesta = await fetch(`${api_urlCursoDeshabilitar}/${id_curso}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!respuesta.ok) {
            throw new Error('Error al deshabilitar el curso');
        }

        const data = await respuesta.json();
        return data;
    } catch (error) {
        console.error('Error en deshabilitarCurso:', error.message);
        throw new Error('Error al deshabilitar el curso');
    }
}

// 🟢
export const modificarCurso = async (id_curso, cursoData) => {
    try {
        const respuesta = await fetch(`${api_urlCursoModificar}/${id_curso}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cursoData),
        });

        const data = await respuesta.json();

        if (respuesta.ok) {
            return data;
        } else {
            throw new Error(data.error || 'Error desconocido al modificar el curso');
        }
    } catch (error) {
        console.error('Error en modificarCurso:', error.message);
        throw new Error('Error al modificar el curso');
    }
}

