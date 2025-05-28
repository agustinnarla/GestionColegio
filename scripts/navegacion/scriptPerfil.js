const api_urlPerfil = 'http://localhost:5000/usuario/perfil'
const api_urlRestablecerContrasena = 'http://localhost:5000/usuario/perfil/restablecerContrasena'

// 🟢
export const obtenerUsuario = async (dni_usuario) => {
    try {
        const respuesta = await fetch(`${api_urlPerfil}/${dni_usuario}`);
        
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        
        const data = await respuesta.json();
        
        if (!data) {
            throw new Error('No se recibieron datos del servidor');
        }
        
        return data;
    } catch (error) {
        console.error('Error en la petición de obtenerUsuario:', error);
        throw error;
    }
};

// 🟢
export const restablecerContrasena = async (dni_usuario, nuevaContrasena) => {
    try {
        const respuesta = await fetch(`${api_urlRestablecerContrasena}/${dni_usuario}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nuevaContrasena })
        });

        const data = await respuesta.json();

        if (respuesta.ok) {
            console.log("Contraseña restablecida exitosamente");
            return data;
        } else {
            throw new Error(data.error || 'Error desconocido al restablecer la contraseña');
        }
    } catch (error) {
        console.error('Error en la petición de restablecerContrasena:', error);
        throw new Error('Error al restablecer la contraseña');
    }
};