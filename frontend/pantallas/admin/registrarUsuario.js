import { StyleSheet, View, Image, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ListasDesplegables from '../../componente/ListasDesplegables.jsx';
import React, { useState, useEffect, useMemo } from "react";
import bg from '../../assets/bg1.jpg';
import { FontAwesome5 } from '@expo/vector-icons';
import { obtenerRoles } from '../../scripts/listasDesplegables/listaDesplegable.js'
import { consultarUsuario, registrarUsuario, modificarUsuario, deshabilitarUsuario } from '../../scripts/admin/scriptRegistrarUsuario.js';
import CustomAlert from '../../componente/CustomAlerts.js';

export default function RegistrarUsuario() { 
    const navegacion = useNavigation();

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [habilitarBotones, setHabilitarBotones] = useState(false);
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [mostrarConfirmarContrasena, setMostrarConfirmarContrasena] = useState(false);

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
            <Image source={bg} style={styles.bg} />
            <View style={styles.formulario}>
                <View style={styles.fila}>
                    {/* Columna izquierda: Formulario */}
                    <View style={styles.columna}>
                        <Text style={styles.label}>DNI:</Text>
                        <View style={styles.dniContainer}>
                            <TextInput
                                style={[styles.input, styles.inputDNI]}
                                placeholder='Ingrese DNI'
                                maxLength={8}
                                placeholderTextColor="#888"
                                keyboardType='numeric'
                                onChangeText={(text) => handleChange('dni_usuario', text)}
                                value={formData.dni_usuario}
                                autoComplete="off"
                                autoCorrect={false}
                                autoCapitalize="none"
                                spellCheck={false}
                                textContentType="none"
                            />
                            <TouchableOpacity 
                                style={[styles.botonConsultar, !validarDni() && styles.botonDeshabilitado]} 
                                onPress={handleConsultar} 
                                disabled={!validarDni()}
                            >
                                <Text style={styles.textoBoton}>Consultar</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Email:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='Ingrese email'
                            placeholderTextColor="#888"
                            keyboardType='email-address'
                            onChangeText={(text) => handleChange('email', text)}
                            value={formData.email}
                            autoComplete="off"
                            autoCorrect={false}
                            autoCapitalize="none"
                            spellCheck={false}
                            textContentType="none"
                        />

                        <Text style={styles.label}>Contraseña:</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.inputConIcono}
                                placeholder='Ingrese contraseña'
                                placeholderTextColor="#888"
                                secureTextEntry={!mostrarContrasena}
                                onChangeText={(text) => handleChange('contrasena', text)}
                                value={formData.contrasena}
                                autoComplete="off"
                                autoCorrect={false}
                                autoCapitalize="none"
                                spellCheck={false}
                                textContentType="none"
                            />
                            <TouchableOpacity
                                style={styles.iconoOjo}
                                onPress={() => setMostrarContrasena(!mostrarContrasena)}
                            >
                                <FontAwesome5 
                                    name={mostrarContrasena ? "eye-slash" : "eye"} 
                                    size={16} 
                                    color="#6366f1" 
                                />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Confirmar Contraseña:</Text>
                         <View style={styles.inputContainer}>
                            <TextInput
                                style={[
                                    styles.inputConIcono,
                                    formData.confirmarContrasena !== '' && !validarContrasenas() && { borderColor: 'red', borderWidth: 1 }
                                ]}
                                placeholder='Confirme contraseña'
                                placeholderTextColor="#888"
                                secureTextEntry={!mostrarConfirmarContrasena}
                                onChangeText={(text) => handleChange('confirmarContrasena', text)}
                                value={formData.confirmarContrasena}
                                autoComplete="off"
                                autoCorrect={false}
                                autoCapitalize="none"
                                spellCheck={false}
                                textContentType="none"
                            />
                            <TouchableOpacity
                                style={styles.iconoOjo}
                                onPress={() => setMostrarConfirmarContrasena(!mostrarConfirmarContrasena)}
                            >
                                <FontAwesome5 
                                    name={mostrarConfirmarContrasena ? "eye-slash" : "eye"} 
                                    size={16} 
                                    color="#6366f1" 
                                />
                            </TouchableOpacity>
                            
                        </View>
                        {formData.confirmarContrasena !== '' && !validarContrasenas() && (
                                <Text style={{ color: 'red', marginBottom: 10 }}>
                                    Las contraseñas no coinciden
                                </Text>
                                )}

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
                                style={styles.botonAgregarRol}
                                onPress={() => navegacion.navigate('Gestionar Rol')} 
                            >
                                <Text style={styles.textoBotonAgregarRol}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* Columna derecha: Acciones */}
                    <View style={styles.columnaDerecha}>
                        <TouchableOpacity
                            style={[styles.botonAlta, !validarCampos() && styles.botonDeshabilitado]}
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
                            style={[styles.botonBaja, !validarCampos() && styles.botonDeshabilitado]}
                            onPress={handleDeshabilitar}
                            disabled={!validarCampos()}
                        >
                            <Text style={styles.textoBoton}>Eliminar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.botonLimpiar}
                            onPress={limpiarInterfaz}
                        >
                            <Text style={styles.textoBoton}>Limpiar</Text>
                        </TouchableOpacity>
                    </View>
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
        backgroundColor: '#f6f8fa',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 7,
        backgroundColor: '#f3f4f6',
        marginBottom: 13,
        height: 44,
    },
    inputConIcono: {
        flex: 1,
        padding: 10,
        fontSize: 15,
        backgroundColor: 'transparent',
    },
    iconoOjo: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bg: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    formulario: {
        width: '100%',
        maxWidth: 900,
        alignSelf: 'center',
        marginTop: 32,
        marginBottom: 24,
        padding: 30,
        backgroundColor: '#fff',
        borderRadius: 14,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
    },
    fila: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 24,
    },
    columna: {
        width: '48%',
        minWidth: 260,
    },
    columnaDerecha: {
        width: '48%',
        minWidth: 260,
        marginTop: 25,
    },
    label: {
        fontSize: 15,
        marginBottom: 6,
        fontWeight: '500',
        color: '#2a3d6c',
    },
    input: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        padding: 10,
        borderRadius: 7,
        marginBottom: 13,
        backgroundColor: '#f3f4f6',
        height: 44,
        fontSize: 15,
    },
    dniContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 13,
        gap: 8,
    },
    inputDNI: {
        flex: 1,
        marginRight: 0,
        marginBottom: 0,
    },
    rolRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        gap: 8,
    },
    botonConsultar: {
        backgroundColor: '#e3f2fd',
        borderColor: '#746BC8',
        borderWidth: 1,
        paddingVertical: 10,
        borderRadius: 7,
        alignItems: 'center',
        width: 100,
        height: 44,
    },
    botonAgregarRol: {
        backgroundColor: '#6c7ae0',
        padding: 10,
        borderRadius: 7,
        width: 38,
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoBotonAgregarRol: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    botonAlta: {
        backgroundColor: '#e8f5e9',
        borderColor: '#4caf50',
        borderWidth: 1,
        paddingVertical: 10,
        borderRadius: 7,
        alignItems: 'center',
        marginBottom: 10,
    },
    botonBaja: {
        backgroundColor: '#ffebee',
        borderColor: '#f44336',
        borderWidth: 1,
        paddingVertical: 10,
        borderRadius: 7,
        alignItems: 'center',
        marginBottom: 10,
    },
    botonModificar: {
        backgroundColor: '#e3f2fd',
        borderColor: '#746BC8',
        borderWidth: 1,
        paddingVertical: 10,
        borderRadius: 7,
        alignItems: 'center',
        marginBottom: 10,
    },
    botonLimpiar: {
        backgroundColor: '#f5f5f5',
        borderColor: '#9e9e9e',
        borderWidth: 1,
        paddingVertical: 10,
        borderRadius: 7,
        alignItems: 'center',
        marginBottom: 10,
    },
    botonDeshabilitado: {
        opacity: 0.5,
    },
    textoBoton: {
        color: '#2c3e50',
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
    },
});