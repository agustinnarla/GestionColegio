//Rutas que utilizamos
const api_url = 'http://localhost:5000'
const api_urlAsistencia = 'http://localhost:5000/alumno/asistencia'
const api_urlCurso = 'http://localhost:5000/listaDesplegable/curso'

// Esta es la función del frontend que hace la solicitud HTTP al backend.
export const registrarAsistenciaFrontend = async (formData) => {
    try {
        console.log("Datos que se van a enviar al backend:", formData); // Verifica los datos antes de enviarlos

        const respuesta = await fetch(`${api_urlAsistencia}/alta`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // Enviamos solo un objeto
        });
        

        const data = await respuesta.json();
        console.log('Respuesta del servidor:', data); // Verifica la respuesta del backend

        if (respuesta.ok) {
            console.log("Se agregó la asistencia");
            return data;
        } else {
            throw new Error(data.error || 'Error desconocido al registrar la asistencia');
        }
    } catch (error) {
        console.log(error);
        throw new Error("Error al cargar la asistencia");
    }
};

export const obtenerCursoFrontend = async (idcurso) => {
    try {
        const url = `${api_urlCurso}/${idcurso}`; // Construye la URL con el idcurso
        console.log("URL que se va a consumir:", url); // Verifica la URL antes de consumirla

        const respuesta = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await respuesta.json();
        console.log('Respuesta del servidor:', data); // Verifica la respuesta del backend

        if (respuesta.ok) {
            console.log("Curso obtenido correctamente");
            return data;
        } else {
            throw new Error(data.error || 'Error desconocido al obtener el curso');
        }
    } catch (error) {
        console.log("Error al obtener el curso:", error.message);
        throw new Error("Error al obtener el curso");
    }
};

export const validarFechaAsistencia = async (idcurso, fecha) => {
    try {
        const url = `${api_urlAsistencia}/curso/${idcurso}/fecha/${fecha}`; // Construye la URL con el idcurso
        console.log("URL que se va a consumir:", url); // Verifica la URL antes de consumirla
        const respuesta = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await respuesta.json();
        console.log('Respuesta del servidor:', data); // Verifica la respuesta del backend
        return data.tieneAsistencia;
    } catch (error) {
        console.log("Error al validar", error.message);
        throw new Error("Error al validar");
    }
}

export const obtenerAlumnosAusentes = async (idcurso, fecha) => {
    try {
        const url = `${api_urlAsistencia}/curso/${idcurso}/fecha/${fecha}/ausentes`;  // Asegúrate de que esta URL sea correcta
        console.log("URL que se va a consumir:", url); // Verifica que la URL esté correcta
        const respuesta = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await respuesta.json();
        console.log('Respuesta de la API:', data); // Verifica la respuesta de la API
        return data;  // Aquí aseguramos que se devuelve la respuesta completa
    } catch (error) {
        console.log("Error al obtener los alumnos ausentes", error.message);
        throw new Error("Error al obtener los alumnos ausentes");
    }
};






