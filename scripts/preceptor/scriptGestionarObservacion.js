const api_url = 'http://localhost:5000'
const api_urlAlumnoCurso = 'http://localhost:5000/alumnosPorCurso'

export const obtenerSolicitante = async () => {
    try{
        const respuesta = await fetch(`${api_url}/solicitante`)
        const data = await respuesta.json()
        if(respuesta.ok){
            return data.solicitante
        }else{
            console.log('error')
            throw new Error(data.error)

        }
    }catch(error){
        console.log(error)
        throw new Error("Error al obtener los solicitantes")
    }
}

export const obtenerAlumnoCurso = async (idcurso) =>{
    try{
        const respuesta = await fetch(`${api_urlAlumnoCurso}/${idcurso}`)
        const data = await respuesta.json()
        if(respuesta.ok){
            return data.alumnos
        }else{
            console.log('error')
            throw new Error(data.error)

        }
    }catch(error){
        console.log(error)
        throw new Error("Error al obtener los alumnos")
    }
}