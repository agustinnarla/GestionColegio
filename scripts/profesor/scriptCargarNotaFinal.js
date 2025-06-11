
const api_urlAgregarNota = 'http://localhost:5000/profesor/nota_final/alta';
const api_urlModificarEstado = 'http://localhost:5000/profesor/nota_final/estado_evaluativo';



// 🟢
export const agregarNota = async ({ id_curso, id_materia, dni_profesional, dni_alumno, nota_final }) => {
    try {
        // Validación antes de enviar
        if (!id_curso || !id_materia || !dni_profesional || !dni_alumno || nota_final === undefined) {
            throw new Error('Faltan campos requeridos');
        }

        const respuesta = await fetch(api_urlAgregarNota, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_curso: Number(id_curso), // Convertir a número
                id_materia: Number(id_materia), // Convertir a número
                dni_profesional: String(dni_profesional), // Convertir a cadena
                dni_alumno: String(dni_alumno), // Convertir a cadena
                nota_final: Number(nota_final) // Convertir a número
            })
        });

        if (!respuesta.ok) {
            const errorData = await respuesta.json().catch(() => ({}));
            throw new Error(errorData.error || `Error al agregar nota: ${respuesta.status}`);
        }

        return await respuesta.json();
    } catch (error) {
        console.error('Error en agregarNota:', error);
        throw error;
    }
};

// 🟢
export const modificarEstadoEvaluativo = async ({ dni_alumno, id_materia }) => {
    try {
        const respuesta = await fetch(api_urlModificarEstado, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dni_alumno,
                id_materia
            })
        });

        if (!respuesta.ok) {
            throw new Error(`Error al modificar estado: ${respuesta.status}`);
        }

        const data = await respuesta.json();
        console.log('Estado evaluativo modificado:', data);
        return data;
    } catch (error) {
        console.error('Error en modificarEstadoEvaluativo:', error);
        throw error;
    }
};
