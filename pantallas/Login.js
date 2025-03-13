import { Text, StyleSheet, View, Image, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { login, olvideMiContrasena } from '../scripts/login/scriptLogin.js';
import bg from '../assets/bg1.jpg';
import logo from '../assets/logo_huerto.png';
import CustomAlert from '../componente/CustomAlerts.js';

export default function Login(props) {
    const [dniUsuario, setDniUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const handleLogin = async () => {
        await login(dniUsuario, contrasena, props.navigation, mostrarMensaje);
    };

    const mostrarMensaje = (titulo, mensaje) => {
        setAlertTitle(titulo);
        setAlertMessage(mensaje);
        setAlertVisible(true);
    };

    const handleOlvideMiContrasena = async () => {
        if (!dniUsuario) {
            mostrarMensaje('Error', 'Por favor ingrese su DNI para recuperar la contraseña.');
            return;
        }
        try {
            const response = await olvideMiContrasena(dniUsuario);
            if (response.success) {
                mostrarMensaje('Éxito', 'Se ha enviado un correo con su nueva contraseña, por favor modifiquela desde el perfil.');
            } else {
                mostrarMensaje('Error', response.message || 'No se pudo enviar el correo de recuperación de contraseña.');
            }
        } catch (error) {
            mostrarMensaje('Error', 'No se pudo enviar el correo de recuperación de contraseña.');
        }
    };

    const isButtonDisabled = !dniUsuario || !contrasena;

    return (
        <View style={styles.padre}>
            <ImageBackground source={bg} style={styles.bg}>
                <View>
                    <Image source={logo} style={styles.logo} />
                </View>
                <View style={styles.tarjeta}>
                    <View style={styles.cajaTexto}>
                        <FontAwesome5 name="user" size={15} color="black" style={styles.icon} />
                        <TextInput
                            placeholder='Usuario'
                            style={styles.textInput}
                            onChangeText={(text) => setDniUsuario(text)}
                            value={dniUsuario}
                        />
                    </View>
                    <View style={styles.cajaTexto}>
                        <FontAwesome5 name="lock" size={15} color="black" style={styles.icon} />
                        <TextInput
                            placeholder='Contraseña'
                            secureTextEntry={true}
                            style={styles.textInput}
                            onChangeText={(text) => setContrasena(text)}
                            value={contrasena}
                        />
                    </View>
                    <TouchableOpacity onPress={handleOlvideMiContrasena}>
                        <Text style={styles.textoOlvide}>
                            Olvidé mi contraseña
                        </Text>
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
        backgroundColor: 'white'
    },
    logo: {
        marginTop: 50,
        width: 170,
        height: 260
    },
    tarjeta: {
        margin: 20,
        borderRadius: 10,
        width: '40%',
        padding: 20,
    },
    cajaTexto: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderColor: '#000AFF',
        borderWidth: 0.5,
        backgroundColor: '#cccccc40',
        borderRadius: 10,
        marginVertical: 10,
    },
    textInput: {
        paddingHorizontal: 15,
    },
    icon: {
        marginHorizontal: 8,
    },
    padreBoton: {
        alignItems: 'center',
    },
    cajaBoton: {
        backgroundColor: '#F0F4FF',
        borderRadius: 10,
        borderColor: '#000AFF',
        borderWidth: 0.5,
        paddingVertical: 15,
        width: 150,
        marginTop: 20,
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
        color: 'black',
    },
    textoOlvide: {
        textAlign: 'center',
        color: '#005FB7'
    },
    bg: {
        alignItems: 'center',
        width: '100%',
        height: '100%',
    }
});