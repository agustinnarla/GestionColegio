import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, ScrollView, Platform, Alert, Modal } from 'react-native';
import React, { useState, useEffect } from "react";
import bg from '../../assets/bg1.jpg';
import { obtenerCurso } from '../../scripts/secretaria/scriptGestionAlumno.js';
import { obtenerAlumnoCurso, obtenerSolicitante } from '../../scripts/preceptor/scriptGestionarObservacion.js';
import { registrarAmonestacion, imprimirArchivo, obtenerCantidadAmonestaciones } from '../../scripts/preceptor/scriptGestionAmonestacion.js';
import ListasDesplegables from '../../componente/ListasDesplegables';
import CustomAlert from '../../componente/CustomAlerts.js';

export default function GestionarAmonestaciones() {
    // Formulario
    const [formData, setFormData] = useState({
        dni_alumno: '',
        id_solicitante: '',
        cantidad: '',
        fecha: '',
        motivo: '',
        id_curso: ''
    });

    // Listas desplegables
    const [cursos, setCursos] = useState([]);
    const [solicitantes, setSolicitante] = useState([]);
    const [alumnos, setAlumnos] = useState([]);
    const [totalAmonestaciones, setTotalAmonestaciones] = useState('0');

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

    // Validar campos del formulario
    const validarCampos = () => {
        return formData.dni_alumno && 
            formData.id_solicitante && 
            formData.cantidad.length >= 1 && 
            formData.fecha.length >= 10 && 
            formData.motivo.length >= 3 &&
            formData.id_curso && 
            validarFecha(formData.fecha) &&
            validarNumeroPositivo(formData.cantidad) 
    };

    // Validar formato de fecha
    const validarFecha = (fecha) => {
        const regex = /^\d{2}-\d{2}-\d{4}$/;
        return regex.test(fecha);
    };

    // Validar que sea un número positivo
    const validarNumeroPositivo = (numero) => {
        return !isNaN(numero) && parseInt(numero) > 0;
    };


    // Cargar cursos y solicitantes
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const cursosData = await obtenerCurso();
                const solicitanteData = await obtenerSolicitante();
                setCursos(cursosData);
                setSolicitante(solicitanteData);
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

    // Cargar cantidad de amonestaciones de acuerdo al DNI
    useEffect(() => {
        const cargarAmonestacion = async () => {
            if (formData.dni_alumno) {
                try {
                    const total = await obtenerCantidadAmonestaciones(formData.dni_alumno);
                    setTotalAmonestaciones(total ? total.toString() : "0");
                } catch (error) {
                    console.error('Error al obtener total de amonestaciones:', error);
                    setTotalAmonestaciones("0");
                }
            }
        };
        cargarAmonestacion();
    }, [formData.dni_alumno]);

    // Registrar amonestación
    const handleRegistrar = async () => {
        try {
            const alumnoData = {
                dni_alumno: parseInt(formData.dni_alumno),
                id_solicitante: parseInt(formData.id_solicitante),
                cantidad: parseInt(formData.cantidad),
                fecha: formatearFecha(formData.fecha),
                motivo: formData.motivo
            };

            if (!validarCampos()) {
                mostrarMensaje('Error', 'Por favor complete todos los campos correctamente');
                return;
            }

            console.log('Datos de la amonestación', alumnoData); 
            
            const respuesta = await registrarAmonestacion(alumnoData);
            mostrarMensaje('¡Éxito!', 'La amonestación se registró correctamente');
            console.log('Amonestación Registrada:', respuesta);
            
            setModalVisible(true); // Abrir el modal después de registrar la amonestación
        } catch (error) {
            console.error('Error al registrar la amonestación:', error.message);
            mostrarMensaje('Error', 'No se pudo registrar la amonestación');
        }
    };

    // Limpiar formulario
    const limpiarInterfaz = () => {
        setFormData({
            dni_alumno: '',
            id_solicitante: '',
            cantidad: '',
            fecha: '',
            motivo: '',
            id_curso: ''
        });
        setTotalAmonestaciones('0'); 
    };

    // Imprimir archivo
    const handleImprimir = async () => {
        try {
            const alumnoSeleccionado = alumnos.find(a => parseInt(a.dni_alumno) === parseInt(formData.dni_alumno));
            const solicitanteSeleccionado = solicitantes.find(s => parseInt(s.id_solicitante) === parseInt(formData.id_solicitante));

            const rutaPDF = await imprimirArchivo(formData, alumnoSeleccionado, solicitanteSeleccionado);
            mostrarMensaje('Éxito', `PDF generado correctamente\nUbicación: ${rutaPDF}`);
            
            if (Platform.OS === 'web') {
                window.open(rutaPDF);
            }

            limpiarInterfaz(); // Limpiar la interfaz después de imprimir
            setModalVisible(false); // Cerrar el modal
        } catch (error) {
            console.error('Error al imprimir:', error);
            mostrarMensaje('Error', 'No se pudo generar el PDF');
        }
    };

    // Manejar cambios en el formulario
    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    // Formatear fecha en formato AAAA-MM-DD
    const formatearFecha = (fecha) => {
        const [dia, mes, año] = fecha.split('-');
        return `${año}-${mes}-${dia}`;
    };

    const Content = (
        <View style={styles.contenido}>
            <ListasDesplegables 
                formData={formData} 
                handleChange={handleChange} 
                curso={cursos} 
                alumnos={alumnos}
                solicitantes={solicitantes}
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

            <Text style={styles.label}>Cantidad:</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Cantidad de amonestación del día" 
                value={formData.cantidad}  
                onChangeText={(value) => handleChange('cantidad', value)}
            />

            <Text style={styles.label}>Cantidad de amonestaciones totales:</Text>
            <TextInput style={styles.input} placeholder="x" keyboardType="numeric" editable={false} value={totalAmonestaciones}/>

            <Text style={styles.label}>Motivo:</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Motivo de las observaciones" 
                value={formData.motivo}  
                onChangeText={(value) => handleChange('motivo', value)}
            />

            <View style={styles.botonesContainer}>
                <TouchableOpacity style={[styles.botonRegistrar, !validarCampos() && styles.botonDeshabilitado]} onPress={handleRegistrar}>
                    <Text style={styles.textoBoton}>Registrar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botonCancelar} onPress={limpiarInterfaz}>
                    <Text style={styles.textoBoton}>Cancelar</Text>
                </TouchableOpacity>
            </View>
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.titulo}>¿Desea imprimir la amonestación?</Text>
                        <View style={styles.botonesModal}>
                            <TouchableOpacity
                                style={styles.botonImprimirModal}
                                onPress={handleImprimir}
                            >
                                <Text style={styles.textoBotonModal}>Imprimir</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.botonCancelarModal} onPress={() => setModalVisible(false)}>
                                <Text style={styles.textoBotonModal}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <CustomAlert
            isVisible={alertVisible}
            onClose={() => setAlertVisible(false)}
            title={alertTitle}
            message={alertMessage}
            />
        </View>
    );

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg} />
            {Platform.OS === 'web' ? Content : <ScrollView contentContainerStyle={styles.scroll}>{Content}</ScrollView>}
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
    scroll: {
        flexGrow: 1,  
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    contenido: {
        width: '90%',
        maxWidth: 500,
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
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
    },
    botonesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 60,
    },
    botonRegistrar: {
        backgroundColor: '#CFEFCE',
        borderColor: '#33FF00',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
    },
    botonCancelar: {
        backgroundColor: '#F3B9B9',
        borderColor: '#FF0000',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 1,
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
    },
});