const api_urlAvisosGenerales = "http://localhost:5000/alumno/avisos/general";
const api_urlAvisosCurso = "http://localhost:5000/alumno/avisos/curso"

// 🟢
export const obtenerAvisosGenerales = async () => {
    try {
        const respuesta = await fetch(api_urlAvisosGenerales, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!respuesta.ok) {
            console.error(`Error en la solicitud: ${respuesta.status}`);
            return [];
        }

        const data = await respuesta.json();
        return data.avisos || [];
    } catch (error) {
        console.error('Error al obtener avisos generales:', error.message);
        return [];
    }
};

// 🟢
export const obtenerAvisosCurso = async (dni_alumno) => {
    try{
        const respuesta = await fetch(`${api_urlAvisosCurso}/${dni_alumno}`)

        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        
        const data = await respuesta.json();
        
        console.log('Respuesta de la API:', data); 
        
        if (!data) {
            throw new Error('No se recibieron datos del servidor');
        }
        
        return data.avisos || [];

    }catch{
        console.error('Error al obtener avisos del curso:', error.message);
        return [];        
    }
}