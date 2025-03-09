import { Alert, Platform } from 'react-native';
const api_url = 'http://192.168.0.18:5000'
const api_urlMaterias = 'http://192.168.0.18:5000/materia' 
const api_urlProfesor = 'http://192.168.0.18:5000/profesor'
const api_urlMateriaProfesor = 'http://192.168.0.18:5000/materiaprofesor'

export const obtenerMaterias = async () => {
    try {
        const respuesta = await fetch(`${api_urlMaterias}`);
        
        if (!respuesta.ok) {
            throw new Error('Error al obtener las materias');
        }
        const data = await respuesta.json();
        return data; 
        
    } catch (error) {
        console.error('Error en obtenerMaterias:', error);
        return null;
    }
};

export const obtenerProfesor = async () => {
    try {
        const respuesta = await fetch(`${api_urlProfesor}`);
        
        if (!respuesta.ok) {
            throw new Error('Error al obtener las materias');
        }
        const data = await respuesta.json();
        return data; 
        
    } catch (error) {
        console.error('Error en obtener profesor:', error);
        return null;
    }
};

export const registrarMateriaProfesor = async (dniProfesores, idMateria) => {
    try {
        // Paso 1: Eliminar todas las relaciones existentes para la materia
        const deleteResponse = await fetch(`${api_urlMateriaProfesor}`, {
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

export const obtenerProfesorXMateria = async (idMateria) => {
    try {
        const respuesta = await fetch(`${api_urlMateriaProfesor}/${idMateria}`);

        if (!respuesta.ok) {
            throw new Error('Error al obtener los profesores de la materia');
        }

        const data = await respuesta.json();
        return data; // Devuelve los profesores asignados a la materia
        
    } catch (error) {
        console.error('Error en obtenerProfesorXMateria:', error);
        return null;
    }
};

export const deshabilitarMateria = async (id_materia) => {
    try {
        const respuesta = await fetch(`${api_urlMaterias}/${id_materia}`, {  // Pasa el ID en la URL
            method: 'PUT',  // Cambiar a PUT en lugar de DELETE
            headers: { 'Content-Type': 'application/json' },
        });

        if (!respuesta.ok) {
            throw new Error('Error al deshabilitar la materia');
        }

        return await respuesta.json();  // Devuelve la respuesta JSON si todo sale bien

    } catch (error) {
        console.error('Error en deshabilitarMateria:', error);
        return null;
    }
};

export const registrarMateria = async (detalle) => {
    try {
        const respuesta = await fetch(api_urlMaterias, {
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







