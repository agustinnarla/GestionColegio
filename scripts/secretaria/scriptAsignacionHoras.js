const api_UrlProfesores = 'http://localhost:5000/profesores'
const api_UrlCurso = 'http://localhost:5000/profesores/cursos'
const api_UrlMateria = 'http://localhost:5000/profesores/materias'
const api_UrlHoras = 'http://localhost:5000/profesores/horario'

export const obtenerProfesores = async () => {
    try {
        const respuesta = await fetch(`${api_UrlProfesores}`); 

        if (!respuesta.ok) {
            throw new Error('Error al obtener los profesores');
        }

        const data = await respuesta.json();
        return data; 
    } catch (error) {
        console.error('Error en obtenerProfesores:', error);
    }
}

export const obtenerCursosPorProfesor = async (dni_profesor) => {
    try {
        const respuesta = await fetch(`${api_UrlCurso}/${dni_profesor}`); 

        if (!respuesta.ok) {
            throw new Error('Error al obtener los cursos');
        }

        const data = await respuesta.json();
        return data; 
    } catch (error) {
        console.error('Error en obtenerCursoPorProfesor:', error);
        return [];
    }
}

export const obtenerMateriaPorCurso = async (id_curso) => {
    try {
        const respuesta = await fetch(`${api_UrlMateria}/${id_curso}`); 

        if (!respuesta.ok) {
            throw new Error('Error al obtener las materias');
        }

        const data = await respuesta.json();
        return data; 
    } catch (error) {
        console.error('Error en obtenerMateriaPorCurso:', error);
        return [];
    }
}

export const obtenerHorasProfesor = async (dni_profesor) => {
    try {
        const respuesta = await fetch(`${api_UrlHoras}/${dni_profesor}`); 

        if (!respuesta.ok) {
            throw new Error('Error al obtener las horas del profesor');
        }

        const data = await respuesta.json();
        return data; 
    } catch (error) {
        console.error('Error en obtenerHorasProfesor:', error);
    }
}