import { StyleSheet, View, Image, TextInput, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import React from "react";
import bg from '../../assets/bg1.jpg';

export default function RegistrarUsuario() { 
    const navegacion = useNavigation();
    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg}></Image>
            <View style={styles.formulario}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Email'
                    keyboardType='email-address'
                />

                <Text style={styles.label}>DNI</Text>
                <TextInput
                    style={styles.input}
                    placeholder='DNI'
                    keyboardType='numeric'
                />

                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Contraseña'
                    secureTextEntry={true}
                />

                <Text style={styles.label}>Confirmar Contraseña</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Confirmar Contraseña'
                    secureTextEntry={true}
                />

                <Text style={styles.label}>Rol</Text>
                <View style={styles.contenidoRol}>
                    <View style={styles.contenidoLista}>
                        <Picker style={styles.lista}>
                            <Picker.Item label='Seleccionar Rol' value='' />
                            <Picker.Item label='Administrador' value='Administrador' />
                            <Picker.Item label='Profesor' value='Profesor' />
                        </Picker>
                    </View>
                    <TouchableOpacity 
                        style={styles.botonAgregarRol}
                        onPress={() => navegacion.navigate('Registrar Rol')} // Redirige a la pantalla para agregar nuevo rol
                    >
                        <Text style={styles.textoBotonAgregarRol}>+</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.contenidoBoton}>
                    <TouchableOpacity style={styles.botonRegistrar}>
                        <Text style={styles.textoBoton}>Registrar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botonCancelar}>
                        <Text style={styles.textoBoton}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    padre: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    bg: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        zIndex: -1,
    },
    formulario: {
        width: '85%',
        padding: 20,
        borderRadius: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2c3e50',
    },
    input: {
        borderWidth: 1,
        borderColor: '#bdc3c7',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#ecf0f1',
    },
    contenidoRol: {
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 15,
    },
    contenidoLista: {
        flex: 1, 
        borderWidth: 1,
        borderColor: '#bdc3c7',
        borderRadius: 5,
    },
    lista: {
        height: 50,
        width: '100%',
    },
    botonAgregarRol: {
        backgroundColor: '#CED9EF',
        borderColor: '#5245D6',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginLeft: 10, 
    },
    textoBotonAgregarRol: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    contenidoBoton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    botonRegistrar: {
        backgroundColor: '#CFEFCE',
        borderColor: '#33FF00',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    botonCancelar: {
        backgroundColor: '#F3B9B9',
        borderColor: '#FF0000',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    textoBoton: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
