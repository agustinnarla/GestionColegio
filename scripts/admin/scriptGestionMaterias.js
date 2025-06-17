
const api_urlMateriaAlta = 'http://localhost:5000/materia/alta'
const api_urlMateriaDeshabilitar = 'http://localhost:5000/materia/deshabilitar'
const api_urlMateriaHabilitar = 'http://localhost:5000/materia/habilitar'
const api_urlMateriaProfesor = 'http://localhost:5000/profesor/materia/alta'



// 🟢
export const registrarMateriaProfesor = async (dniProfesores, idMateria) => {
    try {
        
        // Paso 1: Eliminar todas las relaciones existentes para la materia
        const deleteResponse = await fetch(`${api_urlMateriaDeshabilitar}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_materia: idMateria,
            }),
        });

        // Verificar si la eliminación fue exitosa
        if (!deleteResponse.ok) {
            throw new Error('Error al eliminar las relaciones existentes');
        }

        // Paso 2: Insertar las nuevas relaciones
        const insertResponses = await Promise.all(
            dniProfesores.map((dni) => {
                return fetch(`${api_urlMateriaProfesor}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        dni_profesor: dni,
                        id_materia: idMateria,
                    }),
                });
            })
        );

        // Verificar si todas las inserciones fueron exitosas
        const allSuccess = insertResponses.every((response) => response.ok);

        // Si todas las respuestas son exitosas, retornamos el mensaje de éxito
        if (allSuccess) {
            return { mensaje: 'Relación Materia-Profesor actualizada exitosamente' };
        } else {
            return { mensaje: 'Hubo un error al registrar la relación' };  // Mensaje de error si no todas las respuestas fueron OK
        }
    } catch (error) {
        console.error('Error al registrar la relación:', error);
        return { mensaje: 'Error al registrar la relación' };  // Mensaje de error general
    }
};


// 🟢
export const deshabilitarMateria = async (id_materia) => {
    try {
        const respuesta = await fetch(`${api_urlMateriaDeshabilitar}/${id_materia}`, {
            method: 'PUT',  // Cambiar a PUT en lugar de DELETE
            headers: { 'Content-Type': 'application/json' },
        });

        if (!respuesta.ok) {
            throw new Error('Error al deshabilitar la materia');
        }

        const data = await respuesta.json();  // Devuelve la respuesta JSON si todo sale bien
        return data;  // Devuelve el objeto JSON completo

    } catch (error) {
        console.error('Error en deshabilitarMateria:', error);
        return null;
    }
};

// 🟢
export const habilitarMateria = async (id_materia) => {
    try {
        const respuesta = await fetch(`${api_urlMateriaHabilitar}/${id_materia}`, {  // Pasa el ID en la URL
            method: 'PUT',  // Cambiar a PUT en lugar de DELETE
            headers: { 'Content-Type': 'application/json' },
        });

        if (!respuesta.ok) {
            throw new Error('Error al habilitar la materia');
        }

        return await respuesta.json();  // Devuelve la respuesta JSON si todo sale bien

    } catch (error) {
        console.error('Error en habilitarMateria:', error);
        return null;
    }
}; 

// 🟢
export const registrarMateria = async (detalle) => {
    try {
        const respuesta = await fetch(api_urlMateriaAlta, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ detalle }) // Enviar detalle en el cuerpo de la solicitud
        });

        if (!respuesta.ok) {
            throw new Error('Error al registrar la materia');
        }
        return await respuesta.json();  
    } catch (error) {
        console.error('Error en registrarMateria:', error);
        return null;
    }
};







