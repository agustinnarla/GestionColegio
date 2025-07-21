import { StyleSheet, View, Image, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ListasDesplegables from '../../componente/ListasDesplegables.jsx';
import React, { useState, useEffect, useMemo } from "react";
import bg from '../../assets/bg1.jpg';
import { obtenerRoles } from '../../scripts/listasDesplegables/listaDesplegable.js'
import { consultarUsuario, registrarUsuario, modificarUsuario, deshabilitarUsuario } from '../../scripts/admin/scriptRegistrarUsuario.js';
import CustomAlert from '../../componente/CustomAlerts.js';

export default function RegistrarUsuario() { 
    const navegacion = useNavigation();

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [habilitarBotones, setHabilitarBotones] = useState(false);
    
    const mostrarMensaje = (titulo, mensaje) => {
        setAlertTitle(titulo);
        setAlertMessage(mensaje);
        setAlertVisible(true);
    };

    //🟢 Formulario
    const [formData, setFormData] = useState({
        email: '',
        dni_usuario: '',
        contrasena: '',
        confirmarContrasena: '',
        id_rol: '',
        id_estado_general: 1,
    });

    //🟢  Estado y Lista Desplegable
    const [roles, setRoles] = useState([]);

    //🟢 Lista desplegable
    useEffect(() => {
        const cargarListaDesplegable = async () => {
            try {
                const rolesData = await obtenerRoles();
                setRoles(Array.isArray(rolesData) ? rolesData : []);
            } catch (error) {
                Alert.alert('Error', error.message);
            }
        };
        cargarListaDesplegable();
    }, []);

    //🟢 Manejar cambios en el formulario
    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: name === 'dni_usuario' || name === 'id_rol' ? String(value) : value });
    };

    //🟢 Limpiar la interfaz
    const limpiarInterfaz = () => {
        setFormData({
            dni_usuario: '',
            email: '',  
            contrasena: '',
            confirmarContrasena: '',
            id_rol: '',
            id_estado_general: 1,
        });
        setHabilitarBotones(false); // Deshabilitar los botones después de limpiar la interfaz
    };

    //🟢 Validar cantidad de caracteres dni
    const validarNumeroDni = (dni) => {
        return /^\d{8}$/.test(dni); 
    };
 
    //🟢 Consultar Usuario
    const handleConsultar = async () => {
        if (!validarNumeroDni(formData.dni_usuario)) {
            mostrarMensaje('Error', 'El DNI debe contener exactamente 8 números.');
            return;
        }
    
        try {
            const usuario = await consultarUsuario(formData.dni_usuario.trim());
            if (usuario) {
                setFormData({
                    ...formData,
                    dni_usuario: String(usuario.dni_usuario),
                    email: usuario.email || '',
                    id_rol: usuario.id_rol ? String(usuario.id_rol) : '',
                    contrasena: '',
                    confirmarContrasena: ''
                });
                setHabilitarBotones(true); // Habilitar los botones después de una consulta exitosa
                mostrarMensaje('Éxito', 'Usuario encontrado y datos cargados.');
            } else {
                mostrarMensaje('Advertencia', 'Usuario no encontrado, verifique su DNI.');
            }
        } catch (error) {
            console.error('Error al consultar el usuario:', error.message);
            mostrarMensaje('Error', 'No se pudo consultar el usuario.');
        }
    };


    //🟢 Validar formato de email
    const validarEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    //🟢 Validar que las contraseñas coincidan
    const validarContrasenas = () => {
        return formData.contrasena === formData.confirmarContrasena;
    };

    
    //🟢 Validar campos
    const validarCampos = () => {
        return(
            formData.dni_usuario &&
            formData.email &&
            formData.contrasena &&
            formData.confirmarContrasena &&
            formData.id_rol &&
            formData.id_estado_general 
        )
    }

    //🟢 Validar DNI
    const validarDni = () => {
        return (
            formData.dni_usuario
        )
    };
        

    //🟢 Registrar usuario
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
                id_estado_general: formData.id_estado_general,
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

    //🟢 Modificar usuario
    const handleModificar = async () => {
        try {
            const { dni_usuario, email, id_rol, id_estado_general, contrasena } = formData;
            const formDataToSend = {};
            if (email) formDataToSend.email = email;
            if (id_rol) formDataToSend.id_rol = id_rol;
            if (id_estado_general) formDataToSend.id_estado_general = id_estado_general;
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

    //🟢 Deshabilitar usuario
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

    //🟢 Vista
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
                <TouchableOpacity style={[styles.botonConsultar, styles.botonBase, !validarDni() && styles.botonDeshabilitado]} onPress={handleConsultar} disabled={!validarDni()}>
                    <Text style={styles.textoBoton}>Consultar</Text>
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

                <View style={styles.rolRow}>
                    <View style={{ flex: 1 }}>
                        <ListasDesplegables 
                            formData={formData} 
                            handleChange={handleChange} 
                            roles={roles} 
                            styles={styles}
                        />
                    </View>
                    <TouchableOpacity 
                        style={[styles.botonAgregarRol, styles.botonBase]}
                        onPress={() => navegacion.navigate('Registrar Rol')} 
                    >
                        <Text style={styles.textoBotonAgregarRol}>+</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.contenidoBoton}>
                <TouchableOpacity
                    style={[styles.botonRegistrar, !validarCampos() && styles.botonDeshabilitado]}
                    onPress={handleRegistrar}
                    disabled={!validarCampos()}
                >
                    <Text style={styles.textoBoton}>Registrar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.botonModificar, !validarCampos() && styles.botonDeshabilitado]}
                    onPress={handleModificar}
                    disabled={!validarCampos()}
                >
                    <Text style={styles.textoBoton}>Modificar</Text>
                </TouchableOpacity>

                    <TouchableOpacity
                    style={[styles.botonDeshabilitar, !validarCampos() && styles.botonDeshabilitado]}
                    onPress={handleDeshabilitar}
                    disabled={!validarCampos()}
                    >
                    <Text style={styles.textoBoton}>Eliminar</Text>
                </TouchableOpacity>

                    <TouchableOpacity
                    style={styles.botonCancelar}
                    onPress={limpiarInterfaz}
                    
                    >
                    <Text style={styles.textoBoton}>Cancelar</Text>
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
     botonDeshabilitado: {
        opacity: 0.5,
        backgroundColor: '#cccccc',
        borderColor: '#999999',
    },
    formulario: {
        width: '100%',
        maxWidth: 800, 
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
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
    deshabilitarBoton: {
        backgroundColor: '#cccccc',
        borderColor: '#999999',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2c3e50',
    },
    botonBase: {
    height: 48, // igual que los inputs
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    },
    rolRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        gap: 10, // si usas React Native Web, si no, usa marginLeft en el botón
    },
    botonAgregarRol: {
        backgroundColor: '#CED9EF',
        borderColor: '#5245D6',
        borderWidth: 1,
        width: 48,
        marginLeft: 10,
    },
    botonConsultar: {
        backgroundColor: '#CED9EF',
        borderColor: '#746BC8',
        borderWidth: 1,
        width: 120,
        marginLeft: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#bdc3c7',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#ecf0f1',
        fontSize: 16,
        width: '100%',
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
        marginTop: 30,
        gap: 10,
    },
    botonRegistrar: {
        backgroundColor: '#CFEFCE',
        borderColor: '#33FF00',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        flex: 1,
    },
    botonCancelar: {
        backgroundColor: '#f9e0e0',
        borderColor: 'pink',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        flex: 1,
    },
    botonDeshabilitar: {
        backgroundColor: '#F3B9B9',
        borderColor: '#FF0000',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        flex: 1,
    },
    botonModificar: {
        backgroundColor: '#CED9EF',
        borderColor: '#746BC8',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        flex: 1,
    },
    textoBoton: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});