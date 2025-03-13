import { StyleSheet, View, Image, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ListasDesplegables from '../../componente/ListasDesplegables';
import React, { useState, useEffect } from "react";
import bg from '../../assets/bg1.jpg';
import { consultarUsuario, obtenerRoles, registrarUsuario, modificarUsuario, deshabilitarUsuario } from '../../scripts/admin/scriptRegistrarUsuario';
import CustomAlert from '../../componente/CustomAlerts';

export default function RegistrarUsuario() { 
    const navegacion = useNavigation();

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const mostrarMensaje = (titulo, mensaje) => {
        setAlertTitle(titulo);
        setAlertMessage(mensaje);
        setAlertVisible(true);
    };

    const [formData, setFormData] = useState({
        email: '',
        dni_usuario: '',
        contrasena: '',
        confirmarContrasena: '',
        id_rol: '',
        id_estadoalumno: 1,
    });

    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const rolesData = await obtenerRoles();
                setRoles(Array.isArray(rolesData) ? rolesData : []);
            } catch (error) {
                Alert.alert('Error', error.message);
            }
        };
        cargarDatos();
    }, []);

    // Manejar cambios en el formulario
    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const limpiarInterfaz = () => {
        setFormData({
            dni_usuario: '',
            email: '',  
            contrasena: '',
            confirmarContrasena: '',
            id_rol: '',
            id_estadoalumno: 1,
        });
    };

    const handleConsultar = async () => {
        try {
            const usuario = await consultarUsuario(formData.dni_usuario);
            if (usuario) {
                setFormData({
                    ...formData,
                    dni_usuario: usuario.dni_usuario,
                    email: usuario.email,
                    id_rol: usuario.id_rol
                });
            } else {
                mostrarMensaje('Advertencia', 'Usuario no encontrado, verifique su dni');
            }
        } catch (error) {
            console.log(error.message);
            mostrarMensaje('Advertencia', 'Usuario no encontrado, verifique su dni')
        }
    };

    // Validar formato de email
    const validarEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    // Validar que las contraseñas coincidan
    const validarContrasenas = () => {
        return formData.contrasena === formData.confirmarContrasena;
    };

    const handleRegistrar = async () => {
        if (!validarEmail(formData.email)) {
            mostrarMensaje('Error', 'Por favor ingrese un correo valido.');
            return;
        }

        if (!validarContrasenas()) {
            mostrarMensaje('Error', 'Las contraseñas no coinciden');
            return;
        }

        try {
            const usuarioData = {
                email: formData.email,
                dni_usuario: parseInt(formData.dni_usuario),
                contrasena: formData.contrasena,
                id_rol: parseInt(formData.id_rol),
                id_estadoalumno: formData.id_estadoalumno,
            };

            const respuesta = await registrarUsuario(usuarioData);
            console.log('Usuario Registrado:', respuesta);
            
            mostrarMensaje('Éxito', 'Usuario registrado exitosamente');
            limpiarInterfaz();
        } catch (error) {
            console.error('Error al registrar el usuario:', error.message);
            mostrarMensaje('Error', 'No se pudo registrar el usuario');
        }
    };

    const handleModificar = async () => {
        try {
            const { dni_usuario, email, id_rol, id_estadoalumno, contrasena } = formData;
            const formDataToSend = {};
            if (email) formDataToSend.email = email;
            if (id_rol) formDataToSend.id_rol = id_rol;
            if (id_estadoalumno) formDataToSend.id_estadoalumno = id_estadoalumno;
            if (contrasena) formDataToSend.contrasena = contrasena;

            const respuesta = await modificarUsuario(dni_usuario, formDataToSend);
            limpiarInterfaz();
            console.log('Usuario modificado', respuesta);
            mostrarMensaje('Éxito', 'Usuario modificado exitosamente');
        } catch (error) {
            console.log('Error al modificar el usuario:', error.message);
            mostrarMensaje('Error', 'No se pudo modificar el usuario');
        }
    };

    const handleDeshabilitar = async () => {
        try {
            const { dni_usuario } = formData;
            const respuesta = await deshabilitarUsuario(dni_usuario);
            limpiarInterfaz();
            console.log('Usuario deshabilitado', respuesta);
            mostrarMensaje('Éxito', 'Usuario deshabilitado exitosamente');
        } catch (error) {
            console.log('Error al deshabilitar el usuario:', error.message);
            mostrarMensaje('Error', 'No se pudo deshabilitar el usuario');
        }
    };

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg}></Image>
            <View style={styles.formulario}>
            <Text style={styles.label}>Dni</Text> 
                <View style={styles.dniContainer}>
                    <TextInput
                        style={[styles.input, styles.inputDNI]}
                        placeholder='DNI'
                        keyboardType='numeric'
                        onChangeText={(text) => handleChange('dni_usuario', text)}
                        value={formData.dni_usuario}
                    />
                    <TouchableOpacity style={styles.botonConsultar} onPress={handleConsultar}>
                        <Text>Consultar</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Email'
                    keyboardType='email-address'
                    onChangeText={(text) => handleChange('email', text)}
                    value={formData.email}
                />

                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Contraseña'
                    secureTextEntry={true}
                    onChangeText={(text) => handleChange('contrasena', text)}
                    value={formData.contrasena}
                />

                <Text style={styles.label}>Confirmar Contraseña</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Confirmar Contraseña'
                    secureTextEntry={true}
                    onChangeText={(text) => handleChange('confirmarContrasena', text)}
                    value={formData.confirmarContrasena}
                />

                <View style={styles.contenidoRol}>
                    <View style={styles.contenidoLista}>
                        <ListasDesplegables 
                            formData={formData} 
                            handleChange={handleChange} 
                            roles={roles} 
                            styles={styles}
                        />
                    </View>
                    <TouchableOpacity 
                        style={styles.botonAgregarRol}
                        onPress={() => navegacion.navigate('Registrar Rol')} 
                    >
                        <Text style={styles.textoBotonAgregarRol}>+</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.contenidoBoton}>
                    <TouchableOpacity style={styles.botonRegistrar} onPress={handleRegistrar}>
                        <Text style={styles.textoBoton}>Registrar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botonModificar} onPress={handleModificar}>
                        <Text style={styles.textoBoton}>Modificar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botonDeshabilitar} onPress={handleDeshabilitar}>
                        <Text style={styles.textoBoton}>Eliminar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botonCancelar}>
                        <Text style={styles.textoBoton} onPress={limpiarInterfaz}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
                <CustomAlert
                    isVisible={alertVisible}
                    onClose={() => setAlertVisible(false)}
                    title={alertTitle}
                    message={alertMessage}
                />
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
        width: '50%',
        padding: 20,
        borderRadius: 10,
    },
    dniContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    inputDNI: {
        flex: 1,
        marginRight: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2c3e50',
    },
    botonConsultar: {
        backgroundColor: '#CED9EF',
        borderColor: '#746BC8',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
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
        backgroundColor: '#f9e0e0',
        borderColor: 'pink',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    botonDeshabilitar: {
        backgroundColor: '#F3B9B9',
        borderColor: '#FF0000',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    botonModificar: {
        backgroundColor: '#CED9EF',
        borderColor: '#746BC8',
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