import { API_BASE_URL } from "../config";
const api_urlAvisosGenerales = `${ API_BASE_URL }/alumno/avisos/general`;
const api_urlAvisosCurso = `${ API_BASE_URL }/alumno/avisos/curso`
const api_urlAvisosVisita = `${ API_BASE_URL }/alumno/avisos/ultima_visita`
const api_urlAvisosVisitaActuailizar = `${ API_BASE_URL}/alumno/avisos/ultima_visita/actualizar`



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


export const obtenerUltimaVisitaAvisos = async (dni_usuario) => {
    try {
        const respuesta = await fetch(`${api_urlAvisosVisita}/${dni_usuario}`);
        if (!respuesta.ok) return null;
        const data = await respuesta.json();
        // data.ultima_visita es un array
        if (!data || !data.ultima_visita || data.ultima_visita.length === 0) {
            return null;
        }
        
        return data.ultima_visita[0].ultima_visita;
    } catch (error) {
        console.error('Error al obtener última visita:', error.message);
        return null;
    }
};

export const actualizarUltimaVisitaAvisos = async (dni_usuario, ultima_visita) => {
    try {
        const respuesta = await fetch(api_urlAvisosVisitaActuailizar, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dni_usuario, ultima_visita }),
        });
        const data = await respuesta.json();
        console.log('Se actualizo la fecha' + JSON.stringify(data))
        return { ok: respuesta.ok, ...data };
    } catch (error) {
        console.error('Error al actualizar última visita:', error.message);
        return { ok: false };
    }
};