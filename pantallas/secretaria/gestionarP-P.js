import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Picker, CheckBox, Alert } from 'react-native';
import bg from '../../assets/bg1.jpg';
import { obtenerSexo, obtenerEstadoGeneral, obtenerLocalidad,obtenerRoles} from '../../scripts/listasDesplegables/listaDesplegable.js'
import ListasDesplegables from '../../componente/ListasDesplegables';
import { obtenerProfesional, habilitarProfesional, deshabilitarProfesional, modificarProfesional } from '../../scripts/secretaria/scriptGestionPP.js';


export default function GestionarProfesional() {
    const [viveEnDepto, setViveEnDepto] = useState(false); // Estado para la checkbox
    const [piso, setPiso] = useState('');
    const [depto, setDepto] = useState('');

    const[rol, setRol] = useState([])
    const[localidad,setLocalidad] = useState([])
    const[sexo,setSexos] = useState([])
    const[estadoalumno,setEstadoAlumno] = useState([])

    const [formData, setFormData] = useState({
        dni: '',
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
        idlocalidad: '',
        domicilio: '',
        edificio: false,
        numero:'',
        id_localidad: '',
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
                    console.log('rolData:', rolData);
                    setRol(rolData.roles);
                    setSexos(sexosData);
                    setLocalidad(localidadData);
                    setEstadoAlumno(estadoData);
                
                    
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
                dni: parseInt(formData.dni),
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
                    console.log("El profesional fue habilitado correctamente")
                }

            }catch(error){
                
                console.log(error.message)
            }
        }
        const consultarProfesional = async () => {
            // Lógica para consultar el profesional
            try{
                const profesional = await obtenerProfesional(formData.dni)
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
                    console.log("El profesional no existe, verifique el DNI")
                }
            }catch(error){
                console.log(error)
            }
        }

        const limpiarFormulario = () => {
            setFormData({
                dni: '',
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
                idlocalidad: '',
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
                const respuesta = await deshabilitarProfesional(formData.dni)
                if(respuesta){
                    console.log("El profesional fue deshabilitado correctamente")
                }
                limpiarFormulario()
            }catch(error){
                console.log(error)
            }
        }
        const handleModificarProfesional = async () => {
            try {
                const profesionalData = {
                    dni: parseInt(formData.dni),
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
                const respuesta = await modificarProfesional(formData.dni, profesionalData)
                if(respuesta){
                    console.log("El profesional fue modificado correctamente")
                }
            } catch (error) {
                console.log(error.message)
            }
        }

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg}></Image>
            <View style={styles.formulario}>
                <View style={styles.dniContainer}>
                    <Text style={styles.label}>DNI:</Text>
                    <TextInput style={styles.inputDni} placeholder='DNI' onChangeText={(value) => handleChange('dni', value)} />
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
                            
                            estadoalumno={estadoalumno}
                            localidad={localidad}
                            styles={styles}
                        />

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
                                <Text style={styles.label}>Piso:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder='Piso'
                                    value={formData.piso}
                                    onChangeText={(value) => handleChange('piso', value)}
                                />
                                <Text style={styles.label}>Departamento:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder='Departamento'
                                    value={formData.depto}
                                    onChangeText={(value) => handleChange('depto', value)}
                                />
                            </>
                        )}
                    </View>

                    {/* Tercera columna */}
                    <View style={styles.columna}>
                        <Text style={styles.label}>Teléfono Personal:</Text>
                        <TextInput style={styles.input} placeholder='Teléfono Personal' value={formData.telefono_personal} onChangeText={(value) => handleChange('telefono_personal', value)} />
                        <Text style={styles.label}>Teléfono Alternativo:</Text>
                        <TextInput style={styles.input} placeholder='Teléfono Alternativo' value={formData.telefono_alternativo} onChangeText={(value) => handleChange('telefono_alternativo', value)} />
                    </View>
                </View>
            </View>

            <View style={styles.contenidoBotones}>
                <TouchableOpacity style={styles.botonAlta} onPress={registrarProfesional}><Text style={styles.textoBoton}>Alta</Text></TouchableOpacity>
                <TouchableOpacity style={styles.botonBaja} onPress={handleDeshabilitarProfesional}><Text style={styles.textoBoton}>Baja</Text></TouchableOpacity>
                <TouchableOpacity style={styles.botonModificar} onPress={handleModificarProfesional}><Text style={styles.textoBoton}>Modificar</Text></TouchableOpacity>
                <TouchableOpacity style={styles.botonLimpiar} onPress={limpiarFormulario}><Text style={styles.textoBoton}>Limpiar</Text></TouchableOpacity>
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
        width: '100%',
        height: '100%',
    },
    formulario: {
        width: '90%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    dniContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10, 
    },
    consultarButton: {
        backgroundColor: '#CED9EF',
        borderColor: '#746BC8',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginLeft:10
    },
    consultarText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
    fila: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    columna: {
        flex: 1,
        marginRight: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    inputDni: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
        width: 200,
        marginLeft:10
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    check:{
        marginLeft:10
    },
    contenidoBotones: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '50%',
    },
    botonAlta:{
        backgroundColor: '#CFEFCE',
        borderColor: '#33FF00',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
    },
    botonBaja:{
        backgroundColor: '#F3B9B9',
        borderColor: '#FF0000',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        flex: 1,
        marginLeft: 10,
        marginRight:10
    },
    botonModificar:{
        backgroundColor: '#CED9EF',
        borderColor: '#746BC8',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
    },
    botonLimpiar:{
        backgroundColor: '#DADADA',
        borderColor: '#000000',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        flex: 1,
    },
    textoBoton:{
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    }
    
});
