import { API_BASE_URL } from "../config"
const api_urlAlumno = `${API_BASE_URL}/alumnos`
const api_url = `${API_BASE_URL}`
const api_urlLegajos = `${API_BASE_URL}/alumno/legajo`
const api_urlAlta = `${API_BASE_URL}/alumno/alta`
const api_urlEliminar = `${API_BASE_URL}/alumno/deshabilitar`
const api_urlModificar = `${API_BASE_URL}/alumno/modificar`
const api_urlModificarLegajo = `${API_BASE_URL}/alumnosLegajo/modificar`


// 🔵
export const obtenerAlumnoFiltrado = async (dni_alumno) => {
    try {
        const response = await fetch(`${api_urlAlumno}/${dni_alumno}`);
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        const data = await response.json();
        // Si data.alumno es un array, devolvé el primero; si no, devolvé null
        if (Array.isArray(data.alumno) && data.alumno.length > 0) {
            return data.alumno[0];
        }
        return null;
    } catch (error) {
        console.error('Error al obtener el alumno filtrado:', error);
        return null;
    }
};

// 🔴
//Agregue yo (Roma)
export const obtenerDniPdf = async (dni_alumno) => {
    try {
        const respuesta = await fetch(`${api_urlLegajos}/${dni_alumno}/1`);
        
        if (respuesta.ok) {
            const data = await respuesta.blob();
            console.log('DNI PDF obtenido, tamaño:', data.size);
            return data.size > 0 ? data : null;
        } else {
            console.log('No se encontró DNI PDF para el alumno:', dni_alumno);
            return null;
        }
    } catch (error) {
        console.log('Error al obtener DNI PDF:', error);
        return null;
    }
};
// 🔴
//Agregue yo (Roma)
export const obtenerFichaMedicaPdf = async (dni_alumno) => {
    try {
        const respuesta = await fetch(`${api_urlLegajos}/${dni_alumno}/2`);
        
        if (respuesta.ok) {
            const data = await respuesta.blob();
            console.log('Ficha médica PDF obtenida, tamaño:', data.size);
            return data.size > 0 ? data : null;
        } else {
            console.log('No se encontró ficha médica PDF para el alumno:', dni_alumno);
            return null;
        }
    } catch (error) {
        console.log('Error al obtener ficha médica PDF:', error);
        return null;
    }
};
// 🔴
//Agregue yo (Roma)
export const obtenerPartidaNacimientoPdf = async (dni_alumno) => {
    try {
        const respuesta = await fetch(`${api_urlLegajos}/${dni_alumno}/3`);
        
        if (respuesta.ok) {
            const data = await respuesta.blob();
            console.log('Partida de nacimiento PDF obtenida, tamaño:', data.size);
            return data.size > 0 ? data : null;
        } else {
            console.log('No se encontró partida de nacimiento PDF para el alumno:', dni_alumno);
            return null;
        }
    } catch (error) {
        console.log('Error al obtener partida de nacimiento PDF:', error);
        return null;
    }
};
// 🟢
export const agregarAlumno = async (formData) => {
    try {
        console.log('Datos enviados al servidor:', formData);
        console.log('URL de destino:', api_urlAlta);
        
        const respuesta = await fetch(api_urlAlta, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
        });

        console.log('Status de respuesta:', respuesta.status);
        console.log('Status text:', respuesta.statusText);

        // Verificar si la respuesta tiene contenido antes de parsear JSON
        const contentType = respuesta.headers.get('content-type');
        let data = {};
        
        if (contentType && contentType.includes('application/json')) {
            const text = await respuesta.text();
            console.log('Respuesta del servidor (texto):', text);
            if (text.trim()) {
                data = JSON.parse(text);
            }
        } else {
            console.log('Respuesta no es JSON, content-type:', contentType);
        }

        if (respuesta.ok) {
            console.log("Se agregó el alumno correctamente");
            return data;  
        } else {
            console.error('Error del servidor:', data);
            throw new Error(data.error || data.message || `Error del servidor: ${respuesta.status} ${respuesta.statusText}`);
        }
    } catch (error) {
        console.error('Error en agregarAlumno:', error.message); 
        throw new Error("Error al agregar el alumno: " + error.message);
    }
}
//🔴
//Agregue yo (Roma)
export const agregarLegajo = async (legajoData) => {
    console.log(legajoData)
    try {
        const respuesta = await fetch(api_urlLegajos, {
            method: 'POST',
            body: legajoData,
        });
        const data = await respuesta.json();
        if (respuesta.ok) {
            console.log("Se agregó el legajo del alumno");
            return data;
        } else {
            throw new Error(data.error || 'Error desconocido al agregar el legajo');
        }
    } catch (error) {
        console.error('Error en agregarLegajo:', error.message);
        throw new Error("Error al agregar el legajo: " + error.message);
    }
}
// 🟢
export const deshabilitarAlumno = async(dni_alumno) => {
    try{
        const respuesta = await fetch(`${api_urlEliminar}/${dni_alumno}`,{
            method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
        }) 
        const data = await respuesta.json();
        if (respuesta.ok) {
            console.log("Se deshabilito el alumno")
            return data;  
        } else {
            throw new Error(data.error || 'Error desconocido al deshabilitar el alumno');
        }
    } 
    catch (error) {
        console.error('Error en deshabilitarAlumno:', error.message); 
        throw new Error("Error al deshabilitar el alumno: " + error.message);
    }
}
// 🟢
export const modificarAlumno = async (dni_alumno, formData) => {
    try {
    
        const respuesta = await fetch(`${api_urlModificar}/${dni_alumno}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
        });

        const data = await respuesta.json();

        if (respuesta.ok) {
            console.log("Se modificó el alumno");
            return data;  
        } else {
            throw new Error(data.error || 'Error desconocido al modificar el alumno');
        }
    } catch (error) {
        console.error('Error en modificarAlumno:', error.message); 
        throw new Error("Error al modificar el alumno: " + error.message);
    }
}
//🔴
//Agregue yo Roma
export const modificarLegajo = async (dni_alumno, formData) => {
    
    try {
        const url = `${api_urlModificarLegajo}/${dni_alumno}`;
        console.log('URL a la que se está haciendo la solicitud:', url);
        
        const respuesta = await fetch(url, {
            method: 'PUT',
            body: formData,  // El FormData con los archivos
        });

        if (!respuesta.ok) {
            // Intentar obtener el mensaje de error si existe
            let errorMessage = 'Error desconocido al modificar el legajo';
            try {
                const errorData = await respuesta.json();
                errorMessage = errorData.error || errorMessage;
            } catch (jsonError) {
                // Si no se puede parsear como JSON, usar el status text
                errorMessage = respuesta.statusText || errorMessage;
            }
            throw new Error(errorMessage);
        }

        // Verificar si la respuesta tiene contenido antes de intentar parsear JSON
        const contentType = respuesta.headers.get('content-type');
        let data = {};
        
        if (contentType && contentType.includes('application/json')) {
            const text = await respuesta.text();
            if (text.trim()) {
                data = JSON.parse(text);
            }
        }

        console.log("Se modificó el legajo correctamente");
        return data;

    } catch (error) {
        console.error('Error en modificarLegajo:', error.message);
        throw new Error("Error al modificar el legajo: " + error.message);
    }
}



