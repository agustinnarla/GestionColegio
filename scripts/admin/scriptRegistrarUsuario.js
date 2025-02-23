const url_apiRegistrarUsuario = 'http://192.168.0.23:5000/registrarUsuario';
const url_apiRoles = 'http://192.168.0.23:5000/roles';

export const registrarUsuario = async (formData) => {
    try{
        const respuesta = await fetch(url_apiRegistrarUsuario, {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(formData)
        })
        const data =  await respuesta.json()
        if(respuesta.ok){
            console.log("Se registro el usuario exitosamente")
            return data;  
        } else {
            throw new Error(data.error || 'Error desconocido al registrar el usuario');
        }
    }catch(error){
        console.log(error.message)
        throw new Error("Error al cargar el usuario")
    }
}

export const obtenerRoles = async () => {
    try {
        const respuesta = await fetch(url_apiRoles);
        const data = await respuesta.json();
        if (respuesta.ok) {
            console.log("Se cargaron los roles");
            return data.roles;
        } else {
            throw new Error(data.error || 'Error desconocido al cargar los roles');
        }
    } catch (error) {
        console.log(error.message);
        throw new Error("Error al cargar los roles");
    }
};