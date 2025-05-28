const api_UrlProfesor = 'http://localhost:5000/profesor'
const api_UrlCurso = 'http://localhost:5000/curso'
const api_UrlAvisos = 'http://localhost:5000/avisos'
const api_UrlMotivos = 'http://localhost:5000/motivos'





export const crearAvisos = async (formData) => {
    try {
        // Convertir id_motivo a número
        const idMotivo = parseInt(formData.id_motivo, 10);
        if (isNaN(idMotivo)) {
            throw new Error('El ID del motivo debe ser un número');
        }

        // Preparar el cuerpo de la solicitud
        const requestBody = {
            informacion: formData.informacion,
            id_motivo: idMotivo, // Asegurar que es número
            fecha: formData.fecha, // Ya viene formateada desde agregarAviso
            profesores: formData.profesores || [], // Cambiado a "profesores" (coherente con backend)
            cursos: formData.cursos || [] // Cambiado a "cursos" (coherente con backend)
        };

        console.log('Enviando datos al servidor:', requestBody);

        const respuesta = await fetch(`${api_UrlAvisos}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(data.error || 'Error al crear el aviso');
        }

        console.log("Aviso creado exitosamente:", data);
        return data;

    } catch (error) {
        console.error("Error al crear el aviso:", error);
        throw error; // Reenviar el error original
    }
};

export const obtenerAvisos = async () => {
    try {
        const respuesta = await fetch(`${api_UrlAvisos}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!respuesta.ok) {
            throw new Error('Error al obtener los avisos');
        }
        const data = await respuesta.json();
        return data;
    } catch (error) {
        console.error('Error en obtenerAvisos:', error);
        throw error; // Re-lanzamos el error para manejo superior
    }
};

