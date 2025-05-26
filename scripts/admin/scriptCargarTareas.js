
const api_urlTareas = 'http://localhost:5000/tareas'



export const agregarTarea = async (detalle) => {
    try {
        const response = await fetch(api_urlTareas, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ detalle }),
        });
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al agregar la tarea:', error);
        return null;
    }
};

export const deshabilitarTarea = async (id_tarea) => {
    try {
        const respuesta = await fetch(`${api_urlTareas}/deshabilitartarea/${id_tarea}`, {  // Pasa el ID en la URL
            method: 'PUT',  // Cambiar a PUT en lugar de DELETE
            headers: { 'Content-Type': 'application/json' },
        });

        if (!respuesta.ok) {
            throw new Error('Error al deshabilitar la tarea');
        }

        return await respuesta.json();  // Devuelve la respuesta JSON si todo sale bien

    } catch (error) {
        console.error('Error en deshabilitarTarea:', error);
        return null;
    }
};

export const habilitarTarea = async (id_tarea) => {
    try {
        const respuesta = await fetch(`${api_urlTareas}/habilitartarea/${id_tarea}`, {  // Pasa el ID en la URL
            method: 'PUT',  // Cambiar a PUT en lugar de DELETE
            headers: { 'Content-Type': 'application/json' },
        });

        if (!respuesta.ok) {
            throw new Error('Error al deshabilitar la tarea');
        }

        return await respuesta.json();  // Devuelve la respuesta JSON si todo sale bien

    } catch (error) {
        console.error('Error en deshabilitarTarea:', error);
        return null;
    }
};


