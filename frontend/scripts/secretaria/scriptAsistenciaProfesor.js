const api_urlAsistencia = "http://localhost:5000/listaDesplegable/profesionales/asistencia"
const api_urlAsistenciaEntrada = "http://localhost:5000/secretaria/profesional/asistencia/entrada"
const api_urlAsistenciaSalida = "http://localhost:5000/secretaria/profesional/asistencia/salida"

// 🔵
export const obtenerProfesoresAsistencia = async () => {
    try {
        const respuesta = await fetch(api_urlAsistencia);
        if (!respuesta.ok) {
            throw new Error(`Error en la API: ${respuesta.status} ${respuesta.statusText}`);
        }
        const data = await respuesta.json();
        if (data.length === 0) {
            throw new Error('No se encontraron profesores para el día de hoy');
        }
        console.log('Profesores traídos exitosamente');
        return data; // Devuelve los datos al cliente
    } catch (error) {
        console.error('Error al obtener los profesores:', error);
        throw error; // Lanza el error para que el cliente lo maneje
    }
};

//🟢
export const registrarEntradaProfesores = async (profesorData) => {
    try{
        const respuesta = await fetch(api_urlAsistenciaEntrada, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profesorData)
        });
        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            throw new Error(errorData.message || 'Error en la respuesta del servidor');
        }
        const data = await respuesta.json();
        console.log('Entrada del profesor registrada exitosamente');
        return data; // Devuelve los datos al cliente
    }catch(error){
        console.error('Error al registrar la entrada del profesor:', error);
        throw error; 
    }
}
//🟢
export const registrarSalidaProfesores = async (profesorData) => {
    try{
        const respuesta = await fetch(api_urlAsistenciaSalida, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profesorData)
        });
        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            throw new Error(errorData.message || 'Error en la respuesta del servidor');
        }
        const data = await respuesta.json();
        console.log('Salida del profesor registrada exitosamente');
        return data; // Devuelve los datos al cliente
    }catch(error){
        console.error('Error al registrar la salida del profesor:', error);
        throw error; 
    }
}