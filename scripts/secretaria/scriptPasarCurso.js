const api_urlCurso = 'http://192.168.0.22:5000/pasajeCurso'


export const obtenerAlumnoFinal = async(idcurso) => {
    try {
        const respuesta = await fetch(`${api_urlCurso}/${idcurso}`);
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

export const registrarCursoNuevo = async (alumnosData) => {
    try {
        const response = await fetch('http://192.168.0.22:5000/pasajeCurso', {
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