const url_apiTipoDeEvaluacion = "http://localhost:5000/profesor/tipo_de_evaluacion"
const url_apiAsignarEvaluacion = "http://localhost:5000/profesor/asignar_evaluacion"

export const obtenerTipoDeEvaluacion = async () => {
    try{
        const respuesta = await fetch(url_apiTipoDeEvaluacion)
        if(!respuesta.ok){
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        const data = await respuesta.json();
        if(!data){
            throw new Error('No se recibieron datos del servidor');
        }
        return data;
    }catch(error){
        console.error('Error en la petición de obtenerTipoDeEvaluacion:', error);
        throw error;    
    }

}

export const registrarEvaluacion = async (formData) => {
    try{
        const repuesta = await fetch(url_apiAsignarEvaluacion, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        if(!repuesta.ok){
            throw new Error(`HTTP error! status: ${repuesta.status}`);
        }
        const data = await repuesta.json();
        if(!data){
            throw new Error('No se recibieron datos del servidor');
        }
        return data;
    }catch(error){
        console.error('Error en la petición de registrarEvaluacion:', error);
        throw error;    
    }
}