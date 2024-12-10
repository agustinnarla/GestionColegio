const api_url = 'http://localhost:5000'
const api_urlCargarNotas = 'http://localhost:5000/notas'
const api_urlObtenerMateria = 'http://localhost:5000/materia'
const api_urlObtenerEtapasEvaluativas = 'http://localhost:5000/etapas'



export const obtenerNotas = async (idcurso) => {
    try{
        const respuesta = await fetch(`${api_urlCargarNotas}/${idcurso}`)

        if (!respuesta.ok) {
            throw new Error('Error al obtener las notas de los alumnos');
        }
        
        const data = await respuesta.json();

        return data.curso 
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
