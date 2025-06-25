import { API_BASE_URL } from "../config"
const api_urlCargarNotas = `${API_BASE_URL}/alumno/notas`
const api_urlRegistrarNotas = `${API_BASE_URL}/alumno/notas/alta`

/*
    CONSULTA A LA API PARA OBTENER NOTAS 
*/
// 🟢
export const obtenerNotas = async (id_curso,id_materia) => {
    try{
        const respuesta = await fetch(`${api_urlCargarNotas}/${id_curso}/${id_materia}`)

        if (!respuesta.ok) {
            throw new Error('Error al obtener las notas de los alumnos');
        }
        
        const data = await respuesta.json();
        return data.notas 
    }catch(error){
        console.error('Error en obtenerNotas:', error);
    }
}


/*
    CONSULTA A LA API PARA REGISTRAR NOTAS 
*/
// 🟢
export const registrarNotas= async(formData) => {
    try{
        const respuesta = await fetch(api_urlRegistrarNotas, {
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