const api_urlAlumno = 'http://localhost:5000/alumnos'
const api_url = 'http://localhost:5000'
const api_urlEliminar = 'http://localhost:5000/alumnos/deshabilitar'
const api_urlModificar = 'http://localhost:5000/alumnos/modificar'

export const obtenerAlumnoFiltrado = async (dni) => {
    try {
        const respuesta = await fetch(`${api_urlAlumno}/${dni}`);
        const data = await respuesta.json();
        
        if (respuesta.ok) {
            return data.alumnos[0]; 
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.log(error);
        throw new Error("Error al traer el alumno");
    }
}

export const agregarAlumno = async (formData, files) => {
    try {
        const dataToSend = new FormData();

        // Agregar los datos del alumno al FormData
        for (const key in formData) {
            dataToSend.append(key, formData[key]);
        }

        // Agregar los archivos al FormData
        if (files.dniFoto) {
            dataToSend.append('dniFoto', {
                uri: files.dniFoto.uri,
                name: files.dniFoto.name,
                type: files.dniFoto.type,
            });
        }

        if (files.fichaMedica) {
            dataToSend.append('fichaMedica', {
                uri: files.fichaMedica.uri,
                name: files.fichaMedica.name,
                type: files.fichaMedica.type,
            });
        }

        if (files.partidaNacimiento) {
            dataToSend.append('partidaNacimiento', {
                uri: files.partidaNacimiento.uri,
                name: files.partidaNacimiento.name,
                type: files.partidaNacimiento.type,
            });
        }

        const respuesta = await fetch(api_urlAlumno, {
            method: 'POST',
            body: dataToSend,
        });

        const text = await respuesta.text(); // Obtén la respuesta como texto
        console.log('Respuesta del servidor:', text); // Imprime la respuesta

        const data = JSON.parse(text);

        if (respuesta.ok) {
            console.log("Se agregó el alumno");
            return data;  
        } else {
            throw new Error(data.error || 'Error desconocido al agregar el alumno');
        }
    } catch (error) {
        console.error('Error en agregarAlumno:', error.message); 
        throw new Error("Error al agregar el alumno: " + error.message);
    }
}

export const deshabilitarAlumno = async(dni) => {
    try{
        const respuesta = await fetch(`${api_urlEliminar}/${dni}`,{
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

export const modificarAlumno = async (dni, formData) => {
    try {
        const url = `${api_urlModificar}/${dni}`; // Verifica la URL
        console.log('URL a la que se está haciendo la solicitud:', url);
        
        const respuesta = await fetch(url, {
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

export const obtenerSexo = async () => {
    try{
        const respuesta = await fetch(`${api_url}/sexo`)
        const data = await respuesta.json()
        if(respuesta.ok){
            return data.sexo
        }else{
            console.log('error')
            throw new Error(data.error)

        }
    }catch(error){
        console.log(error)
        throw new Error("Error al obtener los sexos")
    }
}

export const obtenerCurso = async () => {
    try {
        const respuesta = await fetch(`${api_url}/curso`);
        const data = await respuesta.json();
        if (respuesta.ok) {
            return data.curso
        } else {
            console.log('error');
            throw new Error(data.error);
        }
    } catch (error) {
        console.log(error);
        throw new Error("Error al obtener los cursos");
    }
}

export const obtenerLocalidad = async () => {
    try{
        const respuesta = await fetch(`${api_url}/localidad`)
        const data = await respuesta.json()
        console.log("Obtenemos las localidades")
        if(respuesta.ok){
            return data.localidad
        }else{
            console.log('error')
            throw new Error(data.error)

        }
    }catch(error){
        console.log(error)
        throw new Error("Error al obtener las localidad")
    }
}


export const obtenerEstadoAlumno = async () => {
    try{
        const respuesta = await fetch(`${api_url}/estadoAlumno`)
        const data = await respuesta.json()
        console.log("Obtenemos los estados")
        if(respuesta.ok){
            return data.estadoAlumno
        }else{
            console.log('error')
            throw new Error(data.error)

        }
    }catch(error){
        console.log(error)
        throw new Error("Error al obtener los estados")
    }
}