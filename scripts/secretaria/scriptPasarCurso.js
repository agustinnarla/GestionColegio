
const api_urlCurso = 'http://localhost:5000/pasajeCurso'


export const obtenerAlumnoPorCurso = async(idcurso) => {
    try {
        const respuesta = await fetch(`${api_urlCurso}/${idcurso}`);
        const data = await respuesta.json();
        
        if (respuesta.ok) {
            return data.alumnos[0]; 
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.log(error);
        throw new Error("Error al traer los alumnos");
    }
}

export const registrarCursoNuevo = async(formData) => {
    try {
        
        const respuesta = await fetch(api_urlCurso, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
        });

        const data = await respuesta.json();

        if (respuesta.ok) {
            console.log("Se actualizo el curso de los alumnos")
            return data;  
        } else {
            throw new Error(data.error || 'Error desconocido al actualizar los alumnos');
        }
    } catch (error) {
        console.error('Error en pasar de curso:', error.message); 
        throw new Error("Error al pasar de curso al alumno: " + error.message);
    }
}