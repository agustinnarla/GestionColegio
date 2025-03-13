const url_apiRegistrarUsuario = 'http://localhost:5000/registrarUsuario';
const url_apiRoles = 'http://localhost:5000/roles';
const url_apiDeshabilitarUsuario = 'http://localhost:5000/deshabilitarUsuario'
const url_apiConsultarUsuario = 'http://localhost:5000/registrarUsuario/consultarUsuario'
const url_apiModificarUsuario = 'http://localhost:5000/modificarUsuario'

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

export const consultarUsuario = async (dni_usuario) => {
    try {
        const respuesta = await fetch(`${url_apiConsultarUsuario}/${dni_usuario}`);
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

export const deshabilitarUsuario = async (dni_usuario) => {
    try {
        const respuesta = await fetch(`${url_apiDeshabilitarUsuario}/${dni_usuario}`, {
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
export const modificarUsuario = async (dni_usuario,formData) => {
    try{
        const respuesta = await fetch(`${url_apiModificarUsuario}/${dni_usuario}`,{
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