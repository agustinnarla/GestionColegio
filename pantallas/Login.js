import { Text, StyleSheet, View, Image, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { ingresarUsuario, olvideMiContrasena } from '../scripts/login/scriptLogin.js';
import bg from '../assets/bg1.jpg';
import logo from '../assets/logo_huerto.png';
import CustomAlert from '../componente/CustomAlerts.js';
import ScrollContainer from '../componente/ScrollContainer.jsx';

export default function Login(props) {
    const [dniUsuario, setDniUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [intentosFallidos, setIntentosFallidos] = useState(0);
    const [bloqueado, setBloqueado] = useState(false);

    const mostrarMensaje = (titulo, mensaje) => {
        setAlertTitle(titulo);
        setAlertMessage(mensaje);
        setAlertVisible(true);
    };

    const capturarIntentos = () => {
        setIntentosFallidos((prev) => {
            const nuevosIntentos = prev + 1;
    
            if (nuevosIntentos >= 3) {
                setBloqueado(true);
                mostrarMensaje('Error', 'Cuenta bloqueada por múltiples intentos fallidos. Espere 5 segundos.');
                setTimeout(() => {
                    setBloqueado(false);
                    setIntentosFallidos(0); // Reiniciar intentos después del bloqueo
                }, 5000); // 5 segundos
            }
            return nuevosIntentos;
        });
    };

    const handleLogin = async () => {
        if (bloqueado) {
            mostrarMensaje('Error', 'Cuenta bloqueada. Intente nuevamente en unos segundos.');
            return;
        }
        try {
            const response = await ingresarUsuario(dniUsuario, contrasena, props.navigation, mostrarMensaje);
            if (response?.success) {  
                setIntentosFallidos(0);  
            } else {
                capturarIntentos();
                mostrarMensaje('Error', response?.message || 'Usuario o Contraseña incorrectos.');
            }
        } catch (error) {
            mostrarMensaje('Error', 'Error al intentar iniciar sesión.');
        }
    };
    
    const handleOlvideMiContrasena = async () => {
        if (!dniUsuario) {
            mostrarMensaje('Error', 'Por favor ingrese su DNI para recuperar la contraseña.');
            return;
        }
        try {
            const response = await olvideMiContrasena(dniUsuario);
            if (response.success) {
                mostrarMensaje('Éxito', 'Se ha enviado un correo con su nueva contraseña, por favor modifíquela desde el perfil.');
            } else {
                mostrarMensaje('Error', response.message || 'No se pudo enviar el correo de recuperación de contraseña.');
            }
        } catch (error) {
            mostrarMensaje('Error', 'No se pudo enviar el correo de recuperación de contraseña.');
        }
    };

    const validarCampos = () => {
        return dniUsuario.trim().length > 0 && contrasena.trim().length > 0;
    };

    const isButtonDisabled = !validarCampos() || bloqueado;

    return (
        <View style={styles.padre}>
            <ScrollContainer/>
            <ImageBackground source={bg} style={styles.bg} resizeMode='cover'>
                <View>
                    <Image source={logo} style={styles.logo} />
                </View>
                <View style={styles.tarjeta}>
                    <View style={styles.cajaTexto}>
                        <FontAwesome5 name="user" size={15} color="black" style={styles.icon} />
                        <TextInput
                            placeholder="Usuario"
                            style={styles.textInput}
                            onChangeText={(text) => setDniUsuario(text)}
                            value={dniUsuario}
                        />
                    </View>
                    <View style={styles.cajaTexto}>
                        <FontAwesome5 name="lock" size={15} color="black" style={styles.icon} />
                        <TextInput
                            placeholder="Contraseña"
                            secureTextEntry={true}
                            style={styles.textInput}
                            onChangeText={(text) => setContrasena(text)}
                            value={contrasena}
                        />
                    </View>
                    <TouchableOpacity onPress={handleOlvideMiContrasena}>
                        <Text style={styles.textoOlvide}>Olvidé mi contraseña</Text>
                    </TouchableOpacity>
                    <View style={styles.padreBoton}>
                        <TouchableOpacity
                            style={[styles.cajaBoton, isButtonDisabled && styles.botonDeshabilitado]}
                            onPress={handleLogin}
                            disabled={isButtonDisabled}
                        >
                            <Text style={styles.textoBoton}>Ingresar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
            <CustomAlert
                isVisible={alertVisible}
                onClose={() => setAlertVisible(false)}
                title={alertTitle}
                message={alertMessage}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    padre: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f7fa',
    },
    bg: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        marginTop: 10,
        marginBottom: 10,
        width: 180,
        height: 180,
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    tarjeta: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 18,
        width: 350,
        maxWidth: '90%',
        padding: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.10,
        shadowRadius: 24,
        elevation: 8,
        alignItems: 'center',
    },
    cajaTexto: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#b6c6e0',
        borderWidth: 1.2,
        backgroundColor: '#f8fafc',
        borderRadius: 10,
        marginVertical: 12,
        paddingHorizontal: 12,
        paddingVertical: 0,
        height: 48,
        width: '100%',
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#2a3d6c',
        paddingHorizontal: 10,
        backgroundColor: 'transparent',
        outlineStyle: 'none',
        borderWidth: 0,
    },
    icon: {
        marginHorizontal: 6,
        color: '#6366f1',
    },
    padreBoton: {
        alignItems: 'center',
        width: '100%',
    },
    cajaBoton: {
        backgroundColor: '#F0F4FF',
        borderRadius: 10,
        borderColor: '#000AFF',
        borderWidth: 0.5,
        paddingVertical: 15,
        width: '100%',
        marginTop: 24,
        shadowColor: '#6D8FE5',
        shadowOffset: {
            width: 5,
            height: 5
        },
        shadowOpacity: 0.71,
        shadowRadius: 6,
        elevation: 4,
    },
    botonDeshabilitado: {
        backgroundColor: '#cccccc',
        borderColor: '#999999',
    },
    textoBoton: {
        textAlign: 'center',
        color: '#000',
        fontWeight: '400',
        fontSize: 16,
        letterSpacing: 0.5,
    },
    textoOlvide: {
        textAlign: 'right',
        color: '#6366f1',
        fontSize: 13,
        marginTop: 8,
        marginBottom: 0,
        alignSelf: 'flex-end',
        textDecorationLine: 'underline',
    },
});