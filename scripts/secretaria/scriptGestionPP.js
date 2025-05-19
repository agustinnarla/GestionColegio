const api_UrlProfesional = 'http://localhost:5000/profesional'

export const obtenerProfesional = async (dni) => {
    try{
        const respuesta = await fetch(`${api_UrlProfesional}/${dni}`)
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

export const habilitarProfesional = async (profesionalData) => {
    try{
        const respuesta = await fetch(`${api_UrlProfesional}/alta`, {
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

export const deshabilitarProfesional = async (dni) => {
    try{
        const respuesta = await fetch(`${api_UrlProfesional}/deshabilitar/${dni}`, {
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

export const modificarProfesional = async (dni, profesionalData) => {
    try {
        const url = `${api_UrlProfesional}/modificar/${dni}`; 
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