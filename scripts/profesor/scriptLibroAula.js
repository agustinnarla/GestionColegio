const api_urlLibroAula = 'http://localhost:5000/profesor/libroaula/registrar_libro_aula'
const api_urlCursoMateria = 'http://localhost:5000/profesor/libroaula/curso_materia'
const api_urlCaracteristicas = 'http://localhost:5000/profesor/libroaula/caracteristicas'
const api_urlMateriaPorProfesor = 'http://localhost:5000/profesor/libroaula/materia'

export const obtenerCursoPorMateria = async (id_materia) => {
    try{
        const respuesta = await fetch(`${api_urlCursoMateria}/${id_materia}`)
        if(!respuesta.ok){
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        const data = await respuesta.json();
        if(!data){
            throw new Error('No se recibieron datos del servidor');
        }
        return data;
    }catch(error){
        console.error('Error en la petición de obtenerCursoPorMateria:', error);
        throw error;
    }
}

export const obtenerCaracteristicasUnidad = async () => {
    try{
        const respuesta = await fetch(api_urlCaracteristicas)
        if(!respuesta.ok){
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        const data = await respuesta.json();
        if(!data){
            throw new Error('No se recibieron datos del servidor');
        }
        return data;
    }catch(error){
        console.error('Error en la petición de obtenerCaracteristicasUnidas:', error);
        throw error;
    }
}

export const obtenerMateriaPorProfesor = async (dni_usuario) => {
    try{
        const respuesta = await fetch(`${api_urlMateriaPorProfesor}/${dni_usuario}`)
        if(!respuesta.ok){
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        const data = await respuesta.json();
        if(!data){
            throw new Error('No se recibieron datos del servidor');
        }
        return data;
    }catch(error){
        console.error('Error en la petición de obtenerMateriaPorProfesor:', error);
        throw error;
    }
}

export const registrarLibroAula = async (formData) => {
    try{
        const respuesta = await fetch(api_urlLibroAula,{
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