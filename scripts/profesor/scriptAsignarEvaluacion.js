
const url_apiAsignarEvaluacion = "http://localhost:5000/profesor/asignar_evaluacion/alta"

// 🟢
export const registrarEvaluacion = async (asignarEvaluacionData) => {
    try{
        const repuesta = await fetch(url_apiAsignarEvaluacion, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(asignarEvaluacionData)
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