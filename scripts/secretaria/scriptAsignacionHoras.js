const api_UrlProfesores = 'http://localhost:5000/profesores'
const api_UrlCurso = 'http://localhost:5000/profesores/cursos'
const api_UrlMateria = 'http://localhost:5000/profesores/materias'
const api_UrlHoras = 'http://localhost:5000/profesores/horario'
const api_UrlHorasAsignadas = 'http://localhost:5000/secretaria/profesor/horas'





export const obtenerHorasProfesor = async (dni_profesor, id_curso) => {
    try {
        const respuesta = await fetch(`${api_UrlHoras}/${dni_profesor}/${id_curso}`); 

        if (!respuesta.ok) {
            throw new Error('Error al obtener las horas del profesor');
        }

        const data = await respuesta.json();
        return data; 
    } catch (error) {
        console.error('Error en obtenerHorasProfesor:', error);
    }
}

export const asignacionDeHoras = async (profeData) => {
    try{
        const respuesta = await fetch(`${api_UrlHorasAsignadas}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profeData)
        });
        if (!respuesta.ok) {
            throw new Error('Error al asignar las horas');
        }
        const data = await respuesta.json();
        return data;
    }catch (error) {
        console.error('Error en asignacionDeHoras:', error);
    }
}