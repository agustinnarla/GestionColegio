const api_curso = 'http://192.168.0.18:5000/curso'



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