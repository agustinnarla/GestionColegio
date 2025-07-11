import { API_BASE_URL } from "../config"
const api_urlAlumno = `${API_BASE_URL}/alumnos`
const api_url = `${API_BASE_URL}`
const api_urlLegajos = `${API_BASE_URL}/alumno/legajo`
const api_urlAlta = `${API_BASE_URL}/alumno/alta`
const api_urlEliminar = `${API_BASE_URL}/alumno/deshabilitar`
const api_urlModificar = `${API_BASE_URL}alumno/modificar`
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
        const data = await respuesta.blob(); // Si es un archivo PDF
        if (respuesta.ok) {
            return data; // Devuelve el contenido del archivo
        } else {
            return null
            throw new Error("Error al obtener el PDF del DNI");
        }
    } catch (error) {
        console.log(error);
        throw new Error("Error al obtener el PDF del DNI");
    }
};
// 🔴
//Agregue yo (Roma)
export const obtenerFichaMedicaPdf = async (dni_alumno) => {
    try {
        const respuesta = await fetch(`${api_urlLegajos}/${dni_alumno}/2`);
        const data = await respuesta.blob();
        if (respuesta.ok) {
            return data;
        } else {
            return null
            throw new Error("Error al obtener el PDF de la ficha médica");
        }
    } catch (error) {
        console.log(error);
        throw new Error("Error al obtener el PDF de la ficha médica");
    }
};
// 🔴
//Agregue yo (Roma)
export const obtenerPartidaNacimientoPdf = async (dni_alumno) => {
    try {
        const respuesta = await fetch(`${api_urlLegajos}/${dni_alumno}/3`);
        const data = await respuesta.blob();
        if (respuesta.ok) {
            return data;
        } else {
            return null
            throw new Error("Error al obtener el PDF de la partida de nacimiento");
        }
    } catch (error) {
        console.log(error);
        throw new Error("Error al obtener el PDF de la partida de nacimiento");
    }
};
// 🟢
export const agregarAlumno = async (formData) => {
    try {
        
        const respuesta = await fetch(api_urlAlta, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
        });

        const data = await respuesta.json();

        if (respuesta.ok) {
            console.log("Se agrego el alumno")
            return data;  
        } else {
            throw new Error(data.error || 'Error desconocido al agregar el alumno');
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

        const data = await respuesta.json();

        if (!respuesta.ok) {
            console.error('Error en la respuesta del servidor:', data.error);
            throw new Error(data.error || 'Error desconocido al modificar el legajo');
        }

        console.log("Se modificó el legajo", data);
        return data;

    } catch (error) {
        console.error('Error en modificarLegajo:', error.message);
        throw new Error("Error al modificar el legajo: " + error.message);
    }
}



