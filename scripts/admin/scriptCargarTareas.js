const api_urlTareaAlta = 'http://localhost:5000/tarea/alta'
const api_urlTareaDeshabilitar = 'http://localhost:5000/tarea/deshabilitar'
const api_urlTareaHabilitar = 'http://localhost:5000/tarea/habilitar'


// 🟢
export const agregarTarea = async (detalle) => {
    try {
        const response = await fetch(api_urlTareaAlta, {
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

// 🟢
export const deshabilitarTarea = async (id_tarea) => {
    try {
        const respuesta = await fetch(`${api_urlTareaDeshabilitar}/${id_tarea}`, {  // Pasa el ID en la URL
            method: 'PUT',  
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

// 🟢
export const habilitarTarea = async (id_tarea) => {
    try {
        const respuesta = await fetch(`${api_urlTareaHabilitar}/${id_tarea}`, {  // Pasa el ID en la URL
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' },
        });

        if (!respuesta.ok) {
            throw new Error('Error al habilitar la tarea');
        }

        return await respuesta.json();  // Devuelve la respuesta JSON si todo sale bien

    } catch (error) {
        console.error('Error en habilitarTarea:', error);
        return null;
    }
};


