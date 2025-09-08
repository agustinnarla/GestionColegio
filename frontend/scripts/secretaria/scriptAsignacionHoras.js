const api_urlHoras = 'http://localhost:5000/secretaria/profesional/horario'
const api_urlHorasAsignadas = 'http://localhost:5000/secretaria/profesional/horas/alta'
const api_urlHorasProfesional = 'http://localhost:5000/secretaria/profesional/horario'
const api_urlHorasCurso = 'http://localhost:5000/secretaria/curso/horario'
const api_urlHorasDeshabilitadas = 'http://localhost:5000/secretaria/profesional/horario/deshabilitar'

// 🟢
export const obtenerHorasProfesor = async (dni_profesor, id_curso, id_materia) => {
    try {
        const respuesta = await fetch(`${api_urlHoras}/${dni_profesor}/${id_curso}/${id_materia}`); 

        if (!respuesta.ok) {
            throw new Error('Error al obtener las horas del profesor');
        }

        const data = await respuesta.json();
        return data; 
    } catch (error) {
        console.error('Error en obtenerHorasProfesor:', error);
    }
}

// 🟢
export const asignacionDeHoras = async (profeData) => {
    try{
        const respuesta = await fetch(`${api_urlHorasAsignadas}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profeData)
        });
        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            const error = new Error(errorData.error || 'Error al asignar las horas');
            error.response = { data: errorData };
            throw error;
        }
        const data = await respuesta.json();
        return data;
    }catch (error) {
        console.error('Error en asignacionDeHoras:', error);
        throw error; // Re-lanzar el error para que lo capture el frontend
    }
}

export const obtenerHorariosProfesional = async (dni_profesional) => {
    try {
        const respuesta = await fetch(`${api_urlHorasProfesional}/${dni_profesional}`);
        if (!respuesta.ok) {
            throw new Error('Error al obtener las horas del profesor');
        }
        const data = await respuesta.json();
        return data; 
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};



export const obtenerHorariosCurso = async (id_curso) => {
    try {
        const respuesta = await fetch(`${api_urlHorasCurso}/${id_curso}`);
        if (!respuesta.ok) {
            throw new Error('Error al obtener las horas del profesor');
        }
        const data = await respuesta.json();
        return data; 
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const deshabilitarHorario = async (profeData) => {
    try {
        const respuesta = await fetch(`${api_urlHorasDeshabilitadas}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profeData)
        });
        if (!respuesta.ok) {
            throw new Error('Error al deshabilitar el horario');
        }
        const data = await respuesta.json();
        return data;
    } catch (error) {
        console.error('Error en deshabilitarHorario:', error);
    }
}