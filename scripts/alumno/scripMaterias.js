const api_urlMateriasAlumno = 'http://localhost:5000/alumno/materia/dni_alumno'


export const obtenerMateriasPorDni = async (dni_alumno) => {
    try {
        const respuesta = await fetch(`${api_urlMateriasAlumno}/${dni_alumno}`);
        
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
        console.error('Error en la petición de obtenerMateriasPorDni:', error);
        throw error;
    }
};
