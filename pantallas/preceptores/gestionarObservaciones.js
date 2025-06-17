import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, ScrollView, Platform, Alert, Modal } from 'react-native';
import React, { useState, useEffect, useMemo } from "react";
import { Picker } from '@react-native-picker/picker';
import bg from '../../assets/bg1.jpg';
import { obtenerCurso, obtenerAlumnoCurso, obtenerProfesionales } from '../../scripts/listasDesplegables/listaDesplegable.js'
import { registrarObservacion,mostrarMensaje, imprimirArchivo } from '../../scripts/preceptor/scriptGestionarObservacion.js';
import ListasDesplegables from '../../componente/ListasDesplegables.jsx';
import CustomAlert from '../../componente/CustomAlerts.js';
import ScrollContainer from '../../componente/ScrollContainer.jsx';
import { ImageBackground } from 'react-native-web';

export default function GestionarObservaciones() {
    // Formulario
    const [formData, setFormData] = useState({
        dni_alumno: '',
        dni_profesional: '',
        fecha: '',
        motivo: '',
        id_curso: ''
    });

    // Modal
    const [modalVisible, setModalVisible] = useState(false);

    // Mensajes 
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const mostrarMensaje = (titulo, mensaje) => {
        setAlertTitle(titulo);
        setAlertMessage(mensaje);
        setAlertVisible(true);
    };

    // Listas desplegables
    const [cursos, setCursos] = useState([]);
    const [profesional, setProfesional] = useState([]);
    const [alumnos, setAlumnos] = useState([]);

    // Validamos que los datos tengan contenido
    const validarCampos = () => {
        const fechaEsValida = validarFecha(formData.fecha);
    
        return (
            formData.dni_alumno &&
            formData.dni_profesional &&
            formData.fecha.length >= 10 &&
            formData.motivo.length >= 3 &&
            formData.id_curso &&
            fechaEsValida
        );
    };

    // Metodo para limpiar la interfaz al apretar el boton cancelar o registrar
    const limpiarInterfaz = () => {
        setFormData({
            dni_alumno: '',
            dni_profesional: '',
            fecha: '',
            motivo: '',
            id_curso: ''
        });
        setModalVisible(false);
    };

    // RegistrarObservación()
    const handleRegistrar = async () => {
        try {
            if (!validarCampos()) {
                if (!validarFecha(formData.fecha)) {
                    mostrarMensaje('Error', 'La fecha ingresada no es válida. Use el formato DD-MM-AAAA.');
                } else {
                    mostrarMensaje('Error', 'Por favor complete todos los campos correctamente.');
                }
                return;
            }
    
            const alumnoData = {
                dni_alumno: parseInt(formData.dni_alumno),
                dni_profesional: parseInt(formData.dni_profesional),
                fecha: formatearFecha(formData.fecha),
                motivo: formData.motivo
            };
    
            console.log('Datos de la observación', alumnoData);
    
            const respuesta = await registrarObservacion(alumnoData);
            mostrarMensaje('Observación registrada correctamente');
            console.log('Observación Registrada:', respuesta);
    
            setModalVisible(true); // Abrir el modal después de registrar la observación
        } catch (error) {
            console.error('Error al registrar la observación:', error.message);
            mostrarMensaje('Error', 'No se pudo registrar la observación');
        }
    };

    // ImprimirArchivo()
    const handleImprimir = async () => {
        try {
            const alumnoSeleccionado = alumnos.find(a => parseInt(a.dni_alumno) === parseInt(formData.dni_alumno));
            const profesionalSeleccionado = profesional.find(p => parseInt(p.dni_profesional) === parseInt(formData.dni_profesional));

            const rutaPDF = await imprimirArchivo(formData, alumnoSeleccionado, profesionalSeleccionado);
            mostrarMensaje('Éxito', `PDF generado correctamente\nUbicación: ${rutaPDF}`);
            
            if (Platform.OS === 'web') {
                window.open(rutaPDF);
            }
            setModalVisible(false); // Cerrar el modal después de imprimir la observación
            limpiarInterfaz();
        } catch (error) {
            console.error('Error al imprimir:', error);
            mostrarMensaje('Error', 'No se pudo generar el PDF');
        }
    };

    const validarFecha = (fecha) => {
        // Verificar formato DD-MM-AAAA
        const regex = /^\d{2}-\d{2}-\d{4}$/;
        if (!regex.test(fecha)) {
            return false;
        }
    
        // Dividir la fecha en día, mes y año
        const [dia, mes, año] = fecha.split('-').map(Number);
    
        // Crear un objeto de fecha y verificar si es válida
        const fechaValida = new Date(año, mes - 1, dia);
        if (
            fechaValida.getFullYear() !== año ||
            fechaValida.getMonth() !== mes - 1 ||
            fechaValida.getDate() !== dia
        ) {
            return false;
        }
    
        // Verificar que el año sea mayor a 2024
        if (año <= 2024) {
            return false;
        }
    
        // Verificar que la fecha esté dentro del rango del 21 de febrero al 21 de diciembre
        const inicioRango = new Date(año, 1, 21); // 21 de febrero
        const finRango = new Date(año, 11, 21); // 21 de diciembre
        if (fechaValida < inicioRango || fechaValida > finRango) {
            return false;
        }
    
        return true;
    };

      // Formatear fecha en formato AAAA-MM-DD
    const formatearFecha = (fecha) => {
        const [dia, mes, año] = fecha.split('-');
        return `${año}-${mes}-${dia}`;
    };

    const validarFormulario = useMemo(() => validarCampos(), [formData]);

    // Cargar cursos y solicitantes
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const cursosData = await obtenerCurso();
                const profesionalData = await obtenerProfesionales();
                setCursos(cursosData);
                setProfesional(profesionalData);
            } catch (error) {
                Alert.alert('Error', error.message);
            }
        };
        cargarDatos();
    }, []);

    // Cargar alumnos cuando se selecciona un curso
    useEffect(() => {
        const cargarAlumnos = async () => {
            if (formData.id_curso) {
                try {
                    const alumnosData = await obtenerAlumnoCurso(formData.id_curso);
                    setAlumnos(alumnosData);
                } catch (error) {
                    console.error('Error al cargar alumnos:', error);
                }
            }
        };
        cargarAlumnos();
    }, [formData.id_curso]);

    // Manejar cambios en el formulario
    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };


    const Content = (
        <View style={styles.contenido}>
            <ListasDesplegables 
                formData={formData} 
                handleChange={handleChange} 
                curso={cursos} 
                alumnos={alumnos}
                profesionales={profesional}
                styles={styles}
            />


            <Text style={styles.label}>Fecha:</Text>
            <TextInput 
                style={styles.input} 
                placeholder="DD-MM-AAAA" 
                keyboardType="number-pad" 
                value={formData.fecha}  
                onChangeText={(value) => handleChange('fecha', value)}
            />

            <Text style={styles.label}>Motivo:</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Motivo de las observaciones" 
                value={formData.motivo}  
                onChangeText={(value) => handleChange('motivo', value)}
            />
            <View style={styles.botonesContainer}>
                <TouchableOpacity style={[styles.botonRegistrar, !validarFormulario && styles.botonDeshabilitado]} onPress={handleRegistrar}>
                    <Text style={styles.textoBoton}>Registrar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botonCancelar} onPress={limpiarInterfaz}>
                    <Text style={styles.textoBoton}>Cancelar</Text>
                </TouchableOpacity>
            </View>
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.titulo}>¿Desea imprimir la observación?</Text>
                        <View style={styles.botonesModal}>
                            <TouchableOpacity
                                style={styles.botonImprimirModal}
                                onPress={handleImprimir}
                            >
                                <Text style={styles.textoBotonModal}>Imprimir</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.botonCancelarModal} onPress={limpiarInterfaz}>
                                <Text style={styles.textoBotonModal}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
           
        </View>
        
    );

    return (
        <View style={styles.padre}>
            <ScrollContainer />
            <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
            {Platform.OS === 'web' ? Content : <ScrollView contentContainerStyle={styles.scroll}>{Content}</ScrollView>}
            <CustomAlert
                isVisible={alertVisible}
                onClose={() => setAlertVisible(false)}
                title={alertTitle}
                message={alertMessage}
            />
            </ImageBackground>
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
        zIndex: -1,
    },
    scroll:{
        flexGrow: 1,  
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        
    },
    contenido: {
        marginTop:20,
        width: '100%',
        maxWidth: 700,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: 120,
        alignSelf: 'center'
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: '#fafafa',
        fontSize: 16,
    },
    lista: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: '#fafafa',
        fontSize: 16,
    },
    botonesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 25,
        alignSelf: 'center'
    },
    botonRegistrar: {
        backgroundColor: '#CFEFCE',
        borderColor: '#33FF00',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
        minWidth: 200,
    },
    botonCancelar: {
        backgroundColor: '#F3B9B9',
        borderColor: '#FF0000',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 5,
        flex: 1,
        minWidth: 200,
    },
    botonImprimir:{
        flex: 1,
        backgroundColor: '#CED9EF',
        paddingVertical: 12, 
        paddingHorizontal: 20,
        borderRadius: 5,
        borderColor: '#0500FF',
        borderWidth: 0.4,
        marginRight: 15,
        marginLeft: 15,
        alignItems: 'center',
    },
    textoBoton: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    botonDeshabilitado: {
        opacity: 0.5,
        backgroundColor: '#cccccc',
        borderColor: '#999999',
    },
    
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    botonesModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '50%',
    },
    botonImprimirModal: {
        backgroundColor: '#CED9EF',
        borderColor: '#0500FF',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
    },
    botonCancelarModal: {
        backgroundColor: '#F3B9B9',
        borderColor: '#FF0000',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 1,
    },
    textoBotonModal: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});
