import { API_BASE_URL } from '../config.js'
const api_urlLibroAulaAlta = `${API_BASE_URL}/profesor/libroAula/alta`
const api_urlLibroAula = `${API_BASE_URL}/profesor/libroAula`
const api_urlLibroAulaNumClase = `${API_BASE_URL}/profesor/libroAula/numero_clase`                
// 🟢
export const registrarLibroAula = async (formData) => {
    try{
        const respuesta = await fetch(api_urlLibroAulaAlta,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),

        })
        if(!respuesta.ok){
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        const data = await respuesta.json();
        if(!data){
            throw new Error('No se recibieron datos del servidor');
        }
        return data;
    }catch(error){
        console.log('Error en la petición de registrarLibroAula:', error);
        throw error;
    }
}

export const obtenerLibroAula = async (dni_profesional, id_curso, id_materia) => {
    try{
        const respuesta = await fetch(`${api_urlLibroAula}/${dni_profesional}/${id_curso}/${id_materia}`)
        if (!respuesta.ok) {
            throw new Error(`Error en la API: ${respuesta.status} ${respuesta.statusText}`);
        }
        const data = await respuesta.json();
        if (data.length === 0) {
            throw new Error('No se encontro el libro de aula');
        }
        console.log('Libro de aula traídos exitosamente');
        return data; 
    }catch(error){
        console.error('Error al obtener los profesores:', error);
        throw error; 
    }
}

export const obtenerNumeroDeClase = async (dni_profesional, id_curso, id_materia) => {
  try {
    const respuesta = await fetch(`${api_urlLibroAulaNumClase}/${dni_profesional}/${id_curso}/${id_materia}`);

    if (!respuesta.ok) {
      throw new Error(`Error en la API: ${respuesta.status} ${respuesta.statusText}`);
    }

    const data = await respuesta.json();

    if (!data || typeof data.numero_clase !== 'number') {
      throw new Error('No se pudo obtener el número de clase');
    }

    console.log('Número de clase traído exitosamente:', data.numero_clase);
    return data.numero_clase; 

  } catch (error) {
    console.error('Error al obtener el número de clase:', error);
    throw error;
  }
};