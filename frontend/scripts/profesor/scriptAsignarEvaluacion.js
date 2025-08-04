import { API_BASE_URL } from "../config"

const url_apiAsignarEvaluacion = `${API_BASE_URL}/profesor/asignar_evaluacion/alta`

// 🟢
export const registrarEvaluacion = async (asignarEvaluacionData) => {
    try {
        const respuesta = await fetch(url_apiAsignarEvaluacion, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(asignarEvaluacionData)
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            throw {
                message: data?.error || 'Error desconocido',
                code: data?.code || 'ERROR_DESCONOCIDO',
                status: respuesta.status
            };
        }

        return data;
    } catch (error) {
        console.error('Error en la petición de registrarEvaluacion:', error);
        throw error;
    }
};