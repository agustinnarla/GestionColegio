import { StyleSheet, View, Image, ScrollView, TextInput, Text, TouchableOpacity, Dimensions, Platform,FlatList, ActivityIndicator, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect } from "react";
import bg from '../../assets/bg1.jpg';
import { obtenerCaracteristicasUnidad, obtenerCursoPorProfesor, obtenerCursosPorProfesor, obtenerMateriaPorCursoYProfesor } from '../../scripts/listasDesplegables/listaDesplegable.js';
import { registrarLibroAula, obtenerNumeroDeClase } from '../../scripts/profesor/scriptLibroAula.js';
import CustomAlert from '../../componente/CustomAlerts.js';
import ListasDesplegables from '../../componente/ListasDesplegables.jsx';



export default function LibroAula({ route }) {

    //🟢 Formulario
    const [formData, setFormData] = useState({
        id_materia: '',
        id_caracteristica_unidad: '',
        id_curso: '',
        fecha: '',
        numero_clase: '',
        unidad: '',
        tema_abarcado: '',
        dni_profesional: ''
    });

    //🟢 Estado del Mensajes 
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    //🟢 Mesnaje 
    const mostrarMensaje = (titulo, mensaje) => {
        setAlertTitle(titulo);
        setAlertMessage(mensaje);
        setAlertVisible(true);
    };

    //🟢 Estado listas desplegables 
    const [materiaPorCursoYProfesor, setMateriasPorCursoProfesor] = useState([]);
    const [caracteristica_unidad, setCaracteristica] = useState('');
    const [loading, setLoading] = useState(true);
    const [cursoPorProfesor, setCursoPorProfesor] = useState([]);
    const [numero_clase, setNumeroClase] = useState(0);

    //🟢 Capturamos Parametros 
    const { dni_usuario } = route.params;
    const dni_profesional = dni_usuario

    if (!dni_usuario) {
        console.error('DNI Usuario no definido');
        return <Text>Error: DNI Usuario no definido</Text>;
    }

    console.log('DNI Usuario:', dni_usuario);
    console.log('El dni usuario se paso a ->', dni_profesional)


    //🟢 Obtenemos curso por profesor
    useEffect(() => {
            const cargarCursoPorProfesor = async () => {
                
                    try {
                        const cursoData = await obtenerCursoPorProfesor(dni_profesional);
                        setCursoPorProfesor(cursoData);
                    } catch (error) {
                        console.error('Error al cargar alumnos:', error);
                    }
                
            };
            cargarCursoPorProfesor();
        }, [dni_profesional]);

    //🟢 Obtenemos materias por profesor 
    useEffect(() => {
        const cargarMateriasPorCursoYProfesor = async () => {
            try {
                const data = await obtenerMateriaPorCursoYProfesor(formData.id_curso, dni_profesional);
                setMateriasPorCursoProfesor(data);
            } catch (error) {
                console.error('Error al cargar las materias:', error);
            } finally {
                setLoading(false);
            }
        };

        cargarMateriasPorCursoYProfesor();
    }, [formData.id_curso, dni_profesional]);

    useEffect(() => {
        const cargarCaracteristicas = async () => {
            try{
                const data = await obtenerCaracteristicasUnidad();
                setCaracteristica(data);
            }catch(error){  
                console.log("Error al cargar las características de la unidad", error)
            }
        };
        cargarCaracteristicas();
    }, []);

    useEffect(() => {
        const cargarNumerClase = async () => {
            try{
                
                const data = await obtenerNumeroDeClase(dni_profesional, formData.id_curso, formData.id_materia);
                setNumeroClase(data ? data.toString() : "0");
            }catch(error){
                console.log(error)
            }
        }
        cargarNumerClase();
    }, [dni_profesional, formData.id_curso, formData.id_materia]);


    const validarCampos = () => {
        return  formData.id_materia &&
        formData.id_caracteristica_unidad &&
        formData.id_curso &&
        formData.fecha &&
        formData.unidad &&
        formData.tema_abarcado 
    };

    
    const formatearFecha = (fecha) => {
        const [dia, mes, año] = fecha.split('/');
        return `${año}/${mes}/${dia}`;
    };

    // Registrar 
    const handleRegistrar = async () => {
        try {
            const libroAulaData = {
                id_curso: formData.id_curso,
                id_materia: formData.id_materia,
                id_caracteristica_unidad: formData.id_caracteristica_unidad,
                fecha: formatearFecha(formData.fecha),
                numero_clase: numero_clase,
                unidad: formData.unidad,
                tema_abarcado: formData.tema_abarcado,
                dni_profesional: dni_usuario,
            };

            if (!validarCampos()) {
                mostrarMensaje('Error', 'Por favor complete todos los campos correctamente');
                return;
            }

            console.log('Datos del libro de aula', libroAulaData); 
            
            const respuesta = await registrarLibroAula(libroAulaData);
            mostrarMensaje('¡Éxito!', 'El libro de Aula se registró correctamente');
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
            mostrarMensaje('Error', 'No se pudo registrar el libro de aula');
        }
    };

        // Limpiar formulario
        const limpiarInterfaz = () => {
            setFormData({
                id_materia: '',
                id_caracteristica_unidad: '',
                id_curso: '',
                fecha: '',
                unidad: '',
                tema_abarcado: '',
                dni_profesional: ''
            });
            setNumeroClase('')
        };

    
    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

     // Manejar cambios en el formulario
     const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    return (
        <View style={styles.padre}>
            <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.card}>
                        <View style={styles.contenidoLista}>
                            <ListasDesplegables 
                                formData={formData} 
                                handleChange={handleChange} 
                                materias_curso_profesor={materiaPorCursoYProfesor}
                                showLabel={true}
                                styles={styles}
                            />
                            <ListasDesplegables 
                                formData={formData} 
                                handleChange={handleChange} 
                                cursos={cursoPorProfesor}
                                showLabel={true}
                                styles={styles}
                            />
                            <ListasDesplegables 
                                formData={formData} 
                                handleChange={handleChange} 
                                caracteristica_unidad={caracteristica_unidad}
                                showLabel={true}
                                styles={styles}
                            />
                        </View>

                        <Text style={styles.label}>Fecha:</Text>
                        <TextInput style={styles.input} 
                            placeholder='DD/MM/AAAA' 
                            value={formData.fecha}
                            onChangeText={(value) => handleChange('fecha', value)}
                        />

                        <Text style={styles.label}>Clase N°:</Text>
                        <TextInput style={styles.input} 
                            placeholder='0' 
                            keyboardType="numeric"
                            editable={false}
                            value={numero_clase}
                            onChangeText={(value) => handleChange('numero_clase', value)} 
                        />

 
                        <Text style={styles.label} >Unidad:</Text>
                        <TextInput style={styles.input} 
                            placeholder='0' 
                            keyboardType="numeric"
                            value={formData.unidad} 
                            onChangeText={(value) => handleChange('unidad', value)}
                        />

                        <Text style={styles.label}>Tema abarcado:</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder='Ingresar Tema abarcado en la clase'
                            onChangeText={(value) => handleChange('tema_abarcado', value)}
                            value={formData.tema_abarcado}
                            multiline={true}
                            numberOfLines={4}
                        />
                        <View style={styles.contenidoBoton}>
                            <TouchableOpacity style={[styles.botonRegistrar, !validarCampos() && styles.botonDeshabilitado]} onPress={handleRegistrar} disabled={!validarCampos()}>
                                <Text style={styles.textoBoton} >Registrar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.botonCancelar} onPress={limpiarInterfaz}>
                                <Text style={styles.textoBoton} >Limpiar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
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
    },
    bg: {
        flex: 1,
        width: '100%',
        height: '100%',
        zIndex: -1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    botonDeshabilitado: {
        opacity: 0.5,
        backgroundColor: '#cccccc',
        borderColor: '#999999',
    },
    card: {
        width: '90%',
        maxWidth: 600,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2a3d6c',
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: '#fafafa',
        fontSize: 16,
         color: '#2a3d6c'
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
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
    },
    botonCancelar: {
        backgroundColor: '#F3B9B9',
        borderColor:'#FF0000',
        borderWidth:1,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 1,
    },
    textoBoton: {
       color: '#2a3d6c',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});