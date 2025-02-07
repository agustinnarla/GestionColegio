const api_url = 'http://192.168.0.22:5000'
const api_urlCargarNotas = 'http://192.168.0.22:5000/notas'
const api_urlObtenerMateria = 'http://192.168.0.22:5000/materia'
const api_urlObtenerEtapasEvaluativas = 'http://192.168.0.22:5000/etapas'
const api_urlObtenerAlumnoPorCurso = 'http://192.168.0.22:5000/alumnosPorCurso'



export const obtenerNotas = async (idcurso,idmateria) => {
    try{
        const respuesta = await fetch(`${api_urlCargarNotas}/${idcurso}/${idmateria}`)

        if (!respuesta.ok) {
            throw new Error('Error al obtener las notas de los alumnos');
        }
        
        const data = await respuesta.json();
        return data.notas 
    }catch(error){
        console.error('Error en obtenerNotas:', error);
    }
}

export const obtenerMateria = async () => {
    try {
        const respuesta = await fetch(`${api_urlObtenerMateria}`); 

        if (!respuesta.ok) {
            throw new Error('Error al obtener las materias');
        }

        const data = await respuesta.json();
        console.log(data);
        return data.materia; 
    } catch (error) {
        console.error('Error en obtenerMaterias:', error);
    }
};

export const obtenerEtapasEvaluativas= async () => {
    try{
        const respuesta = await fetch(`${api_urlObtenerEtapasEvaluativas}`)

        if(!respuesta.ok){
            throw new Error('Error al obtener las etapas escolares')
        }

        const data = await respuesta.json()
        console.log(data);
        return data.etapa; 
    }catch(error){
        console.error('Error en obtenerEtapasEscolares:', error);
    }
}

export const obtenerAlumnoPorCurso = async (idcurso) => {
    try{
        const respuesta = await fetch(`${api_urlObtenerAlumnoPorCurso}/${idcurso}`)

        if(!respuesta.ok){
            throw new Error('Error al obtener los alumnos')
        }

        const data = await respuesta.json()
        console.log(data);
        return data.alumnos; 
    }catch(error){
        console.error('Error en obtenerAlumnoPorCurso:', error);
    }
}

export const registrarNotas= async(formData) => {
    try{
        const respuesta = await fetch(api_urlCargarNotas, {
            method: 'POST',
            headers: {'Content-Type' : 
            'application/json'},
            body: JSON.stringify(formData)
        })
        const data =  await respuesta.json()

        if(respuesta.ok){
            console.log("Se registro las notas nuevas")
            return data;  
        } else {
            throw new Error(data.error || 'Error desconocido al registrar las notas');
        }
    }catch(error){
        console.log(error)
        throw new Error("Error al cargar las notas")
    }
}