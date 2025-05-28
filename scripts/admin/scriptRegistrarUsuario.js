const api_urlRegistrarUsuario = 'http://localhost:5000/usuario/registrar';
const api_urlDeshabilitarUsuario = 'http://localhost:5000/usuario/deshabilitar'
const api_urlConsultarUsuario = 'http://localhost:5000/registrar/usuario/consultar'
const api_urlModificarUsuario = 'http://localhost:5000/usuario/modificar'

// 🟢
export const registrarUsuario = async (formData) => {
    try{
        const respuesta = await fetch(api_urlRegistrarUsuario, {
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

// 🟢
export const consultarUsuario = async (dni_usuario) => {
    try {
        const respuesta = await fetch(`${api_urlConsultarUsuario}/${dni_usuario}`);
        const data = await respuesta.json();
        
        if (respuesta.ok) {
            if (data.alumnos && data.alumnos.length > 0) {
                return data.alumnos[0];
            } else {
                throw new Error('Usuario no encontrado');
            }
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.log(error);
        throw new Error("Error al traer el usuario");
    }
};

// 🟢
export const deshabilitarUsuario = async (dni_usuario) => {
    try {
        const respuesta = await fetch(`${api_urlDeshabilitarUsuario}/${dni_usuario}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await respuesta.json();
        if (respuesta.ok) {
            console.log("Se deshabilitó el usuario");
            return data;
        } else {
            throw new Error(data.error || 'Error desconocido al deshabilitar el usuario');
        }
    } catch (error) {
        console.log(error.message);
        throw new Error("Error al deshabilitar el usuario");
    }
};

// 🟢
export const modificarUsuario = async (dni_usuario,formData) => {
    try{
        const respuesta = await fetch(`${api_urlModificarUsuario}/${dni_usuario}`,{
            method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
            body: JSON.stringify(formData),
        })
        const data = await respuesta.json();

        if (respuesta.ok) {
            console.log("Se modificó el usuario");
            return data;  
        } else {
            throw new Error(data.error || 'Error desconocido al modificar el usuario');
        }
    }catch(error){
        console.log(error.message)
        throw new Error("Error al modificar el usuario");
        
    }
}

