const api_urlProfesional = 'http://localhost:5000/profesional'
const api_urlProfesionalAlta = 'http://localhost:5000/profesional/alta'
const api_urlProfesionalDeshabilitar = 'http://localhost:5000/profesional/deshabilitar'
const api_urlProfesionalModificar = 'http://localhost:5000/profesional/modificar'

//🟢
export const obtenerProfesional = async (dni) => {
    try{
        const respuesta = await fetch(`${api_urlProfesional}/${dni}`)
        if (respuesta.ok) {
            const data = await respuesta.json();
            return data.data; 
        } else {
            throw new Error(data.error);
        }
    }catch(error){
        console.log(error)
    }

}
//🟢
export const registrarProfesional = async (profesionalData) => {
    try{
        const respuesta = await fetch(`${api_urlProfesionalAlta}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profesionalData)
        })
        const data = await respuesta.json()
        if (respuesta.ok) {
            return data
        } else {
            throw new Error(data.error)
        }

    }catch(error){
        console.log(error)
    }
}
//🟢
export const deshabilitarProfesional = async (dni_alumno) => {
    try{
        const respuesta = await fetch(`${api_urlProfesionalDeshabilitar}/${dni_alumno}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await respuesta.json()
        if (respuesta.ok) {
            return data
        } else {
            throw new Error(data.error)
        }

    }catch(error){
        console.log(error)
    }
}
//🟢
export const modificarProfesional = async (dni_alumno, profesionalData) => {
    try {
        const url = `${api_urlProfesionalModificar}/${dni_alumno}`; 
        console.log('URL a la que se está haciendo la solicitud:', url);
        
        const respuesta = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profesionalData),
        });

        const data = await respuesta.json();

        if (respuesta.ok) {
            console.log("Se modificó el profesional");
            return data;  
        } else {
            throw new Error(data.error || 'Error desconocido al modificar el profesional');
        }
    } catch (error) {
        console.error('Error en modificarProfesional:', error.message); 
        throw new Error("Error al modificar el profesional: " + error.message);
    }
}