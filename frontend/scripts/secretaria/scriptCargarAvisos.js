
const api_urlAvisosAlta = 'http://localhost:5000/secretaria/aviso/alta'






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
            id_motivo: idMotivo, 
            fecha_aviso: formData.fecha_aviso, 
            id_estado_general: formData.id_estado_general, 
            profesores: formData.profesores || [],
            cursos: formData.cursos || [] 
        };

        console.log('Enviando datos al servidor:', requestBody);

        const respuesta = await fetch(`${api_urlAvisosAlta}`, {
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
        throw error; 
    }
};

