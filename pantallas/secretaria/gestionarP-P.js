import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Picker, CheckBox, Alert, ImageBackground } from 'react-native';
import bg from '../../assets/bg1.jpg';
import { obtenerSexo, obtenerEstadoGeneral, obtenerLocalidad,obtenerRoles} from '../../scripts/listasDesplegables/listaDesplegable.js'
import ListasDesplegables from '../../componente/ListasDesplegables';
import { obtenerProfesional, habilitarProfesional, deshabilitarProfesional, modificarProfesional } from '../../scripts/secretaria/scriptGestionPP.js';
import CustomAlert from '../../componente/CustomAlerts.js';
import ScrollContainer from '../../componente/ScrollContainer.jsx';


export default function GestionarProfesional() {
    const [viveEnDepto, setViveEnDepto] = useState(false); // Estado para la checkbox
    const [piso, setPiso] = useState('');
    const [depto, setDepto] = useState('');

    // Mensajes 
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const mostrarMensaje = (titulo, mensaje) => {
        setAlertTitle(titulo);
        setAlertMessage(mensaje);
        setAlertVisible(true);
    };

    const[rol, setRol] = useState([])
    const[localidad,setLocalidad] = useState([])
    const[sexo,setSexos] = useState([])
    const[estado_general,setEstadoGeneral] = useState([])

    const [formData, setFormData] = useState({
        dni_profesional: '',
        nombre: '',
        apellido: '',
        cuit: '',
        id_sexo: '',
        id_rol: '',
        email: '',
        fecha_nacimiento: '',
        telefono_personal: '',
        telefono_alternativo:'',
        id_estado_general: '',
        id_localidad: '',
        domicilio: '',
        edificio: false,
        numero:'',
        piso: '',
        departamento: ''
    });

        useEffect(() => {
            const cargarDatos = async () => {
                try {
                    
                    const localidadData = await obtenerLocalidad();
                    const sexosData = await obtenerSexo();
                    const estadoData = await obtenerEstadoGeneral();
                    const rolData = await obtenerRoles();
                    setRol(rolData);
                    setSexos(sexosData);
                    setLocalidad(localidadData);
                    setEstadoGeneral(estadoData);
                
                    
                } catch (error) {
                    Alert.alert('Error', error.message);
                    console.log(error);
                }
            };
    
        cargarDatos();
        }, []);

        const handleChange = (name, value) => {
            setFormData({ ...formData, [name]: value });
        };

        const registrarProfesional = async () => {
            try{
                const profesionalData = {
                dni_profesional: parseInt(formData.dni_profesional),
                nombre: formData.nombre,
                apellido: formData.apellido,
                cuit: parseInt(formData.cuit),
                id_sexo: formData.id_sexo,
                id_rol: formData.id_rol,
                email: formData.email,
                fecha_nacimiento: formData.fecha_nacimiento,
                telefono_personal: parseInt(formData.telefono_personal),
                telefono_alternativo: parseInt(formData.telefono_alternativo),
                id_estado_general: formData.id_estado_general,
                id_localidad: formData.id_localidad,
                domicilio: formData.domicilio,
                edificio: formData.edificio,
                numero: formData.numero,
                piso: formData.edificio ? formData.piso : null,
                departamento: formData.edificio ? formData.departamento : null
            };
                console.log(profesionalData)
                const respuesta = await habilitarProfesional(profesionalData)
                if(respuesta){
                    mostrarMensaje('Exito', 'Profesional registrado correctamente')
                    console.log("El profesional fue habilitado correctamente")
                }
            }catch(error){
                mostrarMensaje('Error', 'Error al registrar el profesional')
                console.log(error.message)
            }
        }
        const consultarProfesional = async () => {
            // Lógica para consultar el profesional
            try{
                const profesional = await obtenerProfesional(formData.dni_profesional)
                if(profesional){
                    setFormData({
                        ...formData,
                        apellido: profesional.apellido,
                        cuit: profesional.cuit,
                        departamento: profesional.departamento,
                        domicilio: profesional.domicilio,
                        email: profesional.email,
                        fecha_nacimiento: profesional.fecha_nacimiento,
                        id_estado_general: profesional.id_estado_general,
                        id_localidad: profesional.id_localidad,
                        id_rol: profesional.id_rol,
                        id_sexo: profesional.id_sexo,
                        nombre: profesional.nombre,
                        piso: profesional.piso,
                        telefono_personal: profesional.telefono_personal,
                        telefono_alternativo: profesional.telefono_alternativo,
                        edificio: profesional.edificio,
                        numero: profesional.numero,
                    })
                    console.log(profesional)
                }else{
                    mostrarMensaje('Error', 'El profesional no existe, verifique el DNI')
                    console.log("El profesional no existe, verifique el DNI")
                }
            }catch(error){
                console.log(error)
            }
        }

        const limpiarInterfaz = () => {
            setFormData({
                dni_profesional: '',
                nombre: '',
                apellido: '',
                cuit: '',
                id_sexo: '',
                id_rol: '',
                email: '',
                fecha_nacimiento: '',
                telefono_personal: '',
                telefono_alternativo:'',
                id_estado_general: '',
                id_localidad: '',
                domicilio: '',
                edificio: false,
                numero:'',
                id_localidad: '',
                piso: '',
                departamento: ''
            });
        }
        const handleDeshabilitarProfesional = async () => {
            try{
                const respuesta = await deshabilitarProfesional(formData.dni_profesional)
                if(respuesta){
                    mostrarMensaje('Exito', 'El profesional se deshabilito correctamente')
                    console.log("El profesional fue deshabilitado correctamente")
                }
                limpiarInterfaz()
            }catch(error){
                mostrarMensaje('Error', 'Error al deshabilitar el profesional')
                console.log(error)
            }
        }
        const handleModificarProfesional = async () => {
            try {
                const profesionalData = {
                    dni_profesional: parseInt(formData.dni_profesional),
                    nombre: formData.nombre,
                    apellido: formData.apellido,
                    cuit: parseInt(formData.cuit),
                    id_sexo: formData.id_sexo,
                    id_rol: formData.id_rol,
                    email: formData.email,
                    fecha_nacimiento: formData.fecha_nacimiento,
                    telefono_personal: parseInt(formData.telefono_personal),
                    telefono_alternativo: parseInt(formData.telefono_alternativo),
                    id_estado_general: formData.id_estado_general,
                    id_localidad: formData.id_localidad,
                    domicilio: formData.domicilio,
                    edificio: formData.edificio,
                    numero: formData.numero,
                    piso: formData.edificio ? formData.piso : null,
                    departamento: formData.edificio ? formData.departamento : null
                };
                console.log(profesionalData)
                const respuesta = await modificarProfesional(formData.dni_profesional, profesionalData)
                if(respuesta){
                    mostrarMensaje('Exito', 'El profesional se modifico correctamente')
                    console.log("El profesional fue modificado correctamente")
                }
            } catch (error) {
                mostrarMensaje('Error', 'Error al modificar el profesional')
                console.log(error.message)
            }
        }

    return (
        <View style={styles.padre}>
            <ScrollContainer />
            <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
            <View style={styles.formulario}>
                <View style={styles.dniContainer}>
                    <Text style={styles.label}>DNI:</Text>
                    <TextInput
                        style={styles.inputDni}
                        placeholder='DNI'
                        value={formData.dni_profesional}
                        onChangeText={(value) => handleChange('dni_profesional', value)}
                    />
                    <TouchableOpacity style={styles.consultarButton} onPress={consultarProfesional}>
                        <Text style={styles.consultarText}>Consultar</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.fila}>
                    {/* Primera columna */}
                    <View style={styles.columna}>
                        <Text style={styles.label}>Nombre:</Text>
                        <TextInput style={styles.input} placeholder='Nombre' value={formData.nombre} onChangeText={(value) => handleChange('nombre', value)} />
                        <Text style={styles.label}>Apellido:</Text>
                        <TextInput style={styles.input} placeholder='Apellido' value={formData.apellido} onChangeText={(value) => handleChange('apellido', value)} />
                        <Text style={styles.label}>Correo:</Text>
                        <TextInput style={styles.input} placeholder='Correo' value={formData.email} onChangeText={(value) => handleChange('email', value)} />
                        <Text style={styles.label}>Fecha de Nacimiento:</Text>
                        <TextInput style={styles.input} placeholder='--/--/----' value={formData.fecha_nacimiento} onChangeText={(value) => handleChange('fecha_nacimiento', value)} />
                        <Text style={styles.label}>CUIT:</Text>
                        <TextInput style={styles.input} placeholder='CUIT' value={formData.cuit} onChangeText={(value) => handleChange('cuit', value)} />
                        <ListasDesplegables
                            formData={formData}
                            handleChange={handleChange}
                            roles={rol}
                            sexo={sexo}
                            styles={styles}
                        />
                    </View>

                    {/* Segunda columna */}
                    <View style={styles.columna}>
                        <ListasDesplegables
                            formData={formData}
                            handleChange={handleChange}
                            estado_general={estado_general}
                            localidad={localidad}
                            styles={styles}
                        />
                        <Text style={styles.label}>Teléfono Personal:</Text>
                        <TextInput style={styles.input} placeholder='Teléfono Personal' value={formData.telefono_personal} onChangeText={(value) => handleChange('telefono_personal', value)} />
                        <Text style={styles.label}>Teléfono Alternativo:</Text>
                        <TextInput style={styles.input} placeholder='Teléfono Alternativo' value={formData.telefono_alternativo} onChangeText={(value) => handleChange('telefono_alternativo', value)} />
                        
                        

                    </View>

                    {/* Tercera columna */}
                    <View style={styles.columna}>
                        <Text style={styles.label}>Domicilio:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='Domicilio'
                            value={formData.domicilio} 
                            onChangeText={(value) => handleChange('domicilio', value)}
                        />
                        <Text style={styles.label}>Número:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='Número'
                            value={formData.numero} 
                            onChangeText={(value) => handleChange('numero', value)}
                        />

                        <View style={styles.checkboxContainer}>
                            <Text style={styles.label}>¿Vives en un departamento?</Text>
                                <CheckBox
                                    value={formData.edificio}
                                    onValueChange={() => handleChange('edificio', !formData.edificio)}
                                    style={styles.check}
                                />
                        </View>

                        {/* Inputs adicionales si vive en un departamento */}
                        {formData.edificio && (
                            <>
                                <View style={styles.filaPisoDepto}>
                                    <View style={{ flex: 1, marginRight: 8 }}>
                                        <Text style={styles.label}>Piso:</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder='Piso'
                                            value={formData.piso}
                                            onChangeText={(value) => handleChange('piso', value)}
                                        />
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 8 }}>
                                        <Text style={styles.label}>Departamento:</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder='Departamento'
                                            value={formData.departamento}
                                            onChangeText={(value) => handleChange('departamento', value)}
                                        />
                                    </View>
                                </View>
                            </>
                            )}
                        
                    </View>
                </View>
            </View>

            <View style={styles.contenidoBotones}>
                <TouchableOpacity style={styles.botonAlta} onPress={registrarProfesional}><Text style={styles.textoBoton}>Alta</Text></TouchableOpacity>
                <TouchableOpacity style={styles.botonBaja} onPress={handleDeshabilitarProfesional}><Text style={styles.textoBoton}>Baja</Text></TouchableOpacity>
                <TouchableOpacity style={styles.botonModificar} onPress={handleModificarProfesional}><Text style={styles.textoBoton}>Modificar</Text></TouchableOpacity>
                <TouchableOpacity style={styles.botonLimpiar} onPress={limpiarInterfaz}><Text style={styles.textoBoton}>Limpiar</Text></TouchableOpacity>
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
        backgroundColor: 'white',
    },
    bg: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    formulario: {
        marginTop: 8,
        alignSelf: 'center',
        width: '100%',
        maxWidth: 1200,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    dniContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        width: '100%',
    },
    label: {
        fontSize: 15,
        marginBottom: 8,
        fontWeight: '600',
        color: '#2c3e50',
        width: 80,
    },
    inputDni: {
        flex: 1,
        height: 38,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 8,
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
        marginRight: 10,
        fontSize: 15,
        marginLeft: 10,
    },
    consultarButton: {
        backgroundColor: '#f0f7ff',
        borderColor: '#746BC8',
        borderWidth: 1,
        paddingVertical: 0,
        paddingHorizontal: 14,
        borderRadius: 5,
        height: 38,
        justifyContent: 'center',
        marginLeft: 10,
    },
    consultarText: {
        color: '#746BC8',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    fila: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 0,
    },
    columna: {
        flex: 1,
        paddingHorizontal: 10,
        maxWidth: '33.33%',
    },
    label: {
        fontSize: 15,
        marginBottom: 8,
        fontWeight: '600',
        color: '#2c3e50',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        borderRadius: 5,
        marginBottom: 13,
        backgroundColor: '#f9f9f9',
        height: 38,
        fontSize: 15,
    },
    filaPisoDepto: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 0,
        marginBottom: 5,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 13,
    },
    check: {
        marginLeft: 10,
    },
    contenidoBotones: {
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: 18,
        width: '80%',
        gap: 8,
    },
    botonAlta: {
        backgroundColor: '#e8f5e9',
        borderColor: '#4caf50',
        borderWidth: 1,
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 5,
        flex: 1,
        maxWidth: 200,
        height: 40,
        justifyContent: 'center',
        marginRight: 6,
    },
    botonBaja: {
        backgroundColor: '#ffebee',
        borderColor: '#f44336',
        borderWidth: 1,
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 5,
        flex: 1,
        maxWidth: 200,
        height: 40,
        justifyContent: 'center',
        marginLeft: 6,
        marginRight: 6,
    },
    botonModificar: {
        backgroundColor: '#e3f2fd',
        borderColor: '#746BC8',
        borderWidth: 1,
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 5,
        flex: 1,
        maxWidth: 200,
        height: 40,
        justifyContent: 'center',
        marginRight: 6,
    },
    botonLimpiar: {
        backgroundColor: '#f5f5f5',
        borderColor: '#9e9e9e',
        borderWidth: 1,
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 5,
        flex: 1,
        maxWidth: 200,
        height: 40,
        justifyContent: 'center',
    },
    textoBoton: {
        color: '#2c3e50',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
    },
});