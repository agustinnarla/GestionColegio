const api_urlCalendarioAlumno = 'http://localhost:5000/alumno/evaluaciones'
const api_urlCalendarioProfesional = 'http://localhost:5000/profesional/evaluaciones/registradas'

export const obtenerEvaluaciones = async (dni_alumno) => {
    try {
        const respuesta = await fetch(`${api_urlCalendarioAlumno}/${dni_alumno}`);
        
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        
        const data = await respuesta.json();
        
        console.log('Respuesta de la API:', data); 
        
        if (!data) {
            throw new Error('No se recibieron datos del servidor');
        }
        
        return data;
    } catch (error) {
        console.error('Error en la petición de obtenerEvaluaciones:', error);
        throw error;
    }
};

export const obtenerEvaluacionesProfesor = async (dni_profesional) => {
    try {
        const respuesta = await fetch(`${api_urlCalendarioProfesional}/${dni_profesional}`);
        
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        
        const data = await respuesta.json();
        
        console.log('Respuesta de la API:', data); 
        
        if (!data) {
            throw new Error('No se recibieron datos del servidor');
        }
        
        return data;
    } catch (error) {
        console.error('Error en la petición de obtenerEvaluacionesProfesor:', error);
        throw error;
    }
};
