const api_curso = 'http://localhost:5000/curso/alta'


// 🟢
export const registrarCurso = async (formData) => {
    try {
        const respuesta = await fetch(`${api_curso}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await respuesta.json();

        if (respuesta.ok) {
            return data;
        } else {
            throw new Error(data.error || 'Error desconocido al registrar el curso');
        }
    } catch (error) {
        console.error('Error en registrarCurso:', error.message);
        throw new Error('Error al registrar el curso');
    }
};