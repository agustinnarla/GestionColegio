import axios from 'axios';
import { Alert } from 'react-native';
const api_urlLogin = 'http://192.168.0.23:5000/ingresarUsuario'
export const login = async (dniUsuario, contrasena, navigation) => {
    try {
        const response = await axios.post(api_urlLogin, {
            dni_usuario: dniUsuario,
            contrasena: contrasena
        });

        if (response.status === 200) {
            const { usuario } = response.data;
            const { id_rol } = usuario;

            Alert.alert('Éxito', 'Login exitoso');
            
            navigation.navigate('BottomTab', { id_rol });
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error.message);
        Alert.alert('Error', 'Usuario o contraseña incorrectos');
    }
};