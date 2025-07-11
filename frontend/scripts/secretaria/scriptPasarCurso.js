const api_urlPasarAno = 'http://localhost:5000/alumno/pasarAno'
const api_urlPasarAnoAlta = 'http://localhost:5000/alumno/pasarAno/alta' 

//🟢
export const obtenerAlumnoFinal = async(id_curso) => {
    try {
        const respuesta = await fetch(`${api_urlPasarAno}/${id_curso}`);
        const data = await respuesta.json();
        
        if (respuesta.ok) {
            return data.alumnos; 
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.log(error);
        throw new Error("Error al traer los alumnos");
    }
}

//🟢
export const registrarCursoNuevo = async (alumnosData) => {
    try {
        const response = await fetch(`${api_urlPasarAnoAlta}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(alumnosData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en la respuesta del servidor');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en pasar de curso:', error);
        throw error;
    }
};