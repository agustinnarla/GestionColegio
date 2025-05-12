import { StyleSheet, View, Image, ScrollView, TextInput, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect } from "react";
import bg from '../../assets/bg1.jpg';
import { obtenerCursoPorMateria, obtenerMateriaPorProfesor } from '../../scripts/profesor/scriptLibroAula.js';
import { obtenerTipoDeEvaluacion, registrarEvaluacion } from '../../scripts/profesor/scriptAsignarEvaluacion';
import ListasDesplegables from '../../componente/ListasDesplegables';

export default function LibroAula({ route }) {

     const [formData, setFormData] = useState({
                id_materia: '',
                id_curso: '',
                id_tipo_de_evaluacion: '',
                fecha: '',
                tema_abarcado: '',
                dni_profesor: ''
            });

    const [materias, setMaterias] = useState([]);
    const [tipo_de_evaluacion, setTipoEvaluacion] = useState('');
    const [loading, setLoading] = useState(true);
    const [cursoPorMateria, setCursoPorMateria] = useState([]);


        const { dni_usuario } = route.params;
    
        if (!dni_usuario) {
            console.error('DNI Usuario no definido');
            return <Text>Error: DNI Usuario no definido</Text>;
        }
    
        console.log('DNI Usuario:', dni_usuario);

            useEffect(() => {
                    const cagarCursoPorMateria = async () => {
                        if (formData.id_materia) {
                            try {
                                const cursoData = await obtenerCursoPorMateria(formData.id_materia);
                                setCursoPorMateria(cursoData);
                            } catch (error) {
                                console.error('Error al cargar alumnos:', error);
                            }
                        }
                    };
                    cagarCursoPorMateria();
                }, [formData.id_materia]);
        
            useEffect(() => {
                const cargarMaterias = async () => {
                    try {
                        const data = await obtenerMateriaPorProfesor(dni_usuario);
                        setMaterias(data);
                    } catch (error) {
                        console.error('Error al cargar las materias:', error);
                    } finally {
                        setLoading(false);
                    }
                };
        
                cargarMaterias();
            }, [dni_usuario]);
        
            useEffect(() => {
                const cargarTipoDeEvaluacion = async () => {
                    try{
                        const data = await obtenerTipoDeEvaluacion();
                        setTipoEvaluacion(data);
                    }catch(error){  
                        console.log("Error al cargar las características de la unidad", error)
                    }
                };
                cargarTipoDeEvaluacion();
            }, []);
        
                const formatearFecha = (fecha) => {
                const [dia, mes, año] = fecha.split('-');
                return `${año}-${mes}-${dia}`;
                };
        
                if (loading) {
                    return <ActivityIndicator size="large" color="#0000ff" />;
                }
            
                 const handleRegistrar = async () => {
                            try {
                                const asignarEvaluacionData = {
                                    id_curso: formData.id_curso,
                                    id_materia: formData.id_materia,
                                    id_tipo_de_evaluacion: formData.id_tipo_de_evaluacion,
                                    fecha: formatearFecha(formData.fecha),
                                    tema_abarcado: formData.tema_abarcado,
                                    dni_profesor: dni_usuario,
                                };
                    
                                // if (!validarCampos()) {
                                //     mostrarMensaje('Error', 'Por favor complete todos los campos correctamente');
                                //     return;
                                // }
                    
                                console.log('Datos del libro de aula', asignarEvaluacionData); 
                                
                                const respuesta = await registrarEvaluacion(asignarEvaluacionData);
                                //mostrarMensaje('¡Éxito!', 'El libro de Aula se registró correctamente');
                                //console.log('Libro de Aula Registrada:', respuesta);
                                console.log('Respuesta del servidor:', respuesta);
                                // if (respuesta) {
                                //     mostrarMensaje('¡Éxito!', 'El libro de Aula se registró correctamente');
                                // } else {
                                //     mostrarMensaje('Error', 'No se pudo registrar el libro de aula');
                                // }
                                limpiarInterfaz();
                            } catch (error) {
                                console.error('Error al registrar el libro de aula:', error.message);
                                //mostrarMensaje('Error', 'No se pudo registrar el libro de aula');
                            }
                        };
                    
                        // Limpiar formulario
                        const limpiarInterfaz = () => {
                            setFormData({
                                id_materia: '',
                                id_curso: '',
                                id_tipo_de_evaluacion: '',
                                fecha: '',
                                tema_abarcado: '',
                                dni_profesor: ''
                            });
                        };
                
                 // Manejar cambios en el formulario
                const handleChange = (name, value) => {
                    setFormData({ ...formData, [name]: value });
                };
            

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg} />
            <ScrollView contentContainerStyle={styles.contenidoScroll}>
        
                    <ListasDesplegables 
                        formData={formData} 
                        handleChange={handleChange} 
                        materias={materias}
                        curso={cursoPorMateria}
                        tipo_de_evaluacion={tipo_de_evaluacion}
                        styles={styles}
                    />
        
                <Text style={styles.label}>Fecha:</Text>
                <TextInput
                    style={styles.input}
                    placeholder='--/--/----'
                    onChangeText={(value) => handleChange('fecha', value)}
                    keyboardType='numeric'
                />
                <Text style={styles.label}>Temas </Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder='Ingrese los temas abarcados separados con - o ,'
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={(value) => handleChange('tema_abarcado', value)}
                />

                <View style={styles.contenidoBoton}>
                    <TouchableOpacity style={styles.botonRegistrar} onPress={handleRegistrar}>
                        <Text style={styles.textoBoton}>Registrar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botonCancelar}>
                        <Text style={styles.textoBoton}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    padre: {
        flex: 1,
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
    contenidoScroll: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#2c3e50',
    },
    contenidoLista: {
        borderWidth: 1,
        borderColor: '#bdc3c7',
        borderRadius: 5,
        marginBottom: 15,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    input: {
        borderWidth: 1,
        borderColor: '#bdc3c7',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#ecf0f1',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top', 
    },
    contenidoBoton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    botonRegistrar: {
        backgroundColor: '#CFEFCE',
        borderColor:'#33FF00',
        borderWidth:1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    botonCancelar: {
        backgroundColor: '#F3B9B9',
        borderColor:'#FF0000',
        borderWidth:1,
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
