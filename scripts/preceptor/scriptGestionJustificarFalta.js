const api_url = 'http://localhost:5000'
const api_urlAsistencia = 'http://localhost:5000/justificarFalta'

export const obtenerAlumnosAusentes = async (fechadesde, fechahasta) => {
    try {
        // Construimos la URL incluyendo las fechas
        const url = `${api_urlAsistencia}/${fechadesde}/${fechahasta}`; 
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

export const obtenerEstadoAlumnos = async (fechadesde, fechahasta) => {
    try {
        // Construimos la URL incluyendo las fechas
        const url = `${api_urlAsistencia}/estadoalumnos/${fechadesde}/${fechahasta}`; 
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

export const obtenerEstadoFalta = async () => {
    try {
        const url = `${api_urlAsistencia}/estadofalta`

        const respuesta = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await respuesta.json();
        console.log('Respuesta de la API:', data); // Verifica la respuesta de la API
        return data;  // Devuelve la respuesta completa
    } catch (error) {
        console.error("Error al obtener el estado de falta:", error.message);
        throw new Error("Error al obtener el estado de falta");
    }
};

export const obtenerCertificado = async () => {
    try {
        const url = `${api_url}/certificado`

        const respuesta = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await respuesta.json();
        console.log('Respuesta de la API:', data); // Verifica la respuesta de la API
        return data;  // Devuelve la respuesta completa
    } catch (error) {
        console.error("Error al obtener el estado de falta:", error.message);
        throw new Error("Error al obtener el estado de falta");
    }
};

export const obtenerJustificarFalta = async () => {
    try {
        const url = `${api_urlAsistencia}`

        const respuesta = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await respuesta.json();
        console.log('Respuesta de la API:', data); // Verifica la respuesta de la API
        return data;  // Devuelve la respuesta completa
    } catch (error) {
        console.error("Error al obtener el estado de falta:", error.message);
        throw new Error("Error al obtener el estado de falta");
    }
};

export const actualizarJustificarFalta = async (formData) => {
    try {
        const url = `${api_urlAsistencia}`; // Usa la URL que corresponde
        // Aquí recibimos los valores del 'formData' que se envían desde el componente
        const { idestadofalta, dnialumno, idcertificado, fecha } = formData;

        const respuesta = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idestadofalta, // Usamos los valores directamente
                dnialumno, // Usamos los valores directamente
                idcertificado, // Usamos los valores directamente
                fecha, // Usamos los valores directamente
            }),
        });

        const result = await respuesta.json();
        console.log('Justificación de falta insertada:', result);
        // Aquí podrías hacer algo con la respuesta, como mostrar un mensaje de éxito
    } catch (error) {
        console.error('Error al insertar la justificación de falta:', error);
    }
};




