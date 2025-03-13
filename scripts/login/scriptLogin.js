import axios from 'axios';

const api_urlLogin = 'http://localhost:5000/ingresarUsuario';
const api_urlOlvideMiContraseña = 'http://localhost:5000/recuperarContrasena'

export const login = async (dniUsuario, contrasena, navigation, mostrarMensaje) => {
    try {
        const response = await axios.post(api_urlLogin, {
            dni_usuario: dniUsuario,
            contrasena: contrasena
        });

        if (response.status === 200) {
            const { usuario } = response.data;
            const { id_rol } = usuario;
            mostrarMensaje('Éxito', 'Login exitoso');
            navigation.navigate('BottomTab', { 
                id_rol: id_rol,
                dni_usuario: dniUsuario 
            });
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error.message);
        mostrarMensaje('Error', 'Usuario o contraseña incorrectos');
    }
};

export const olvideMiContrasena = async (dni_usuario) => {
    try {
        const response = await fetch(api_urlOlvideMiContraseña, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dni_usuario })
        });

        const data = await response.json();
        return {
            success: response.ok,
            message: data.message
        };
    } catch (error) {
        console.error('Error al recuperar contraseña:', error);
        return {
            success: false,
            message: 'Error al conectar con el servidor'
        };
    }
};