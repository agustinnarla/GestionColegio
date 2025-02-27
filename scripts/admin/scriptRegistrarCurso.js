const api_curso = 'http://192.168.0.18:5000/curso'
const api_materia = 'http://192.168.0.18:5000/materia'
const api_especialidad = 'http://192.168.0.18:5000/especialidad'

export const obtenerMaterias = async () => {
    try {
        const respuesta = await fetch(`${api_materia}`);
        const data = await respuesta.json();
        if (respuesta.ok) {
            return data.materias; // Asegúrate de que la clave sea correcta
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.log(error.message);
        throw new Error("Error al obtener las materias");
    }
};

export const obtenerEspecialidad = async () => {
    try{
        const respuesta = await fetch(`${api_especialidad}`)
        const data = await respuesta.json()
        if(respuesta.ok){
            return data.especialidad
        }else{
            //console.log('error')
            throw new Error(data.error)
        }
    }catch(error){
        console.log(error.mensagge)
        throw new Error("Error al obtener las especialidades")
    }
}

export const regsitrarCurso = async (formData) => {
    try{
        const respuesta = fetch(`${api_curso}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        const data = await respuesta.json()
        if(respuesta.ok){
            return data
        }
        else{
            throw new Error(data.error)
        }

    }catch(error){
        console.log(error.mensagge)
        throw new Error("Error al registrar el curso")
    }
}