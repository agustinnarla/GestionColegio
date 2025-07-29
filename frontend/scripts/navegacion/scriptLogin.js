import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { API_BASE_URL } from '../config.js';


const api_urlLogin = `${API_BASE_URL}/usuario/ingresar`;
const api_urlOlvideMiContraseña = `${API_BASE_URL}/usuario/recuperarContrasena`;
const api_urlTareaPorRol = `${API_BASE_URL}/usuario/tareas`;

//🟢
export const ingresarUsuario = async (dniUsuario, contrasena, navigation, mostrarMensaje) => {
    if (!dniUsuario || !contrasena) {
        mostrarMensaje('Error', 'Por favor, ingrese su DNI y contraseña');
        return { success: false };
    }

    try {
        const response = await axios.post(api_urlLogin, {
            dni_usuario: dniUsuario,
            contrasena: contrasena
        });

        if (response.status === 200) {
            const { usuario, token } = response.data; // <-- Obtén el token
            const { id_rol, detalle } = usuario;

            // Guarda el token en AsyncStorage
            await AsyncStorage.setItem('token', token);

            mostrarMensaje(`Éxito', 'Login exitoso --> Bienvenido ${detalle}'`);
            navigation.navigate('BottomTab', { 
                id_rol: id_rol,
                dni_usuario: dniUsuario 
            });

            return { success: true, token };  
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error.message);
        mostrarMensaje('Error', 'Usuario o contraseña incorrectos');
        return { success: false };  
    }
};

//🟢
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

//🟢
export const obtenerTareasPorRol = async (id_rol) => {
    try {
        const response = await fetch(`${api_urlTareaPorRol}/${id_rol}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener las tareas');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener tareas por rol:', error);
        return [];
    }
};

