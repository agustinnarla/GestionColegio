
const api_urlHoras = 'http://localhost:5000/secretaria/profesional/horario'
const api_urlHorasAsignadas = 'http://localhost:5000/secretaria/profesional/horas/alta'




// 🟢
export const obtenerHorasProfesor = async (dni_profesor, id_curso) => {
    try {
        const respuesta = await fetch(`${api_urlHoras}/${dni_profesor}/${id_curso}`); 

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
            throw new Error('Error al asignar las horas');
        }
        const data = await respuesta.json();
        return data;
    }catch (error) {
        console.error('Error en asignacionDeHoras:', error);
    }
}