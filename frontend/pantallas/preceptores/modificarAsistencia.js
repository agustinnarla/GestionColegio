import { StyleSheet, View, Image, TouchableOpacity, Text, TextInput, Switch, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { obtenerAlumnosAusentes, obtenerCursoFrontend, registrarAsistenciaFrontend } from '../../scripts/preceptor/scriptGestionAsistencia.js';
import { obtenerAlumnoFiltrado } from '../../scripts/secretaria/scriptGestionAlumno';
import bg from '../../assets/bg1.jpg';
import { FontAwesome5 } from '@expo/vector-icons';
import CustomAlert from '../../componente/CustomAlerts.js';

export default function ModificarAsistencia() {
    const navegacion = useNavigation();
    const route = useRoute();
    const { id_curso } = route.params;

    //🟢 Estado y lista de alumnos 
    const [students, setStudents] = useState([]);
    const [mensajeConfirmacion, setMensajeConfirmacion] = useState('');



    const [modalVisible, setModalVisible] = useState(false);

    //🟢 Cambios en el switch
    const toggleSwitch = (id) => {
        setStudents((prevEstudiante) =>
            prevEstudiante.map((estudiante) =>
                estudiante.id === id ? { ...estudiante, presente: !estudiante.presente } : estudiante
            )
        );
    };

    
    //🟢 Estado y Mensajes 
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    //🟢 Mensaje 
    const mostrarMensaje = (titulo, mensaje) => {
        setAlertTitle(titulo);
        setAlertMessage(mensaje);
        setAlertVisible(true);
    };

    //🟢 Obtenemos fecha actual 
    const obtenerFechaActual = () => {
        const fecha = new Date();
        const year = fecha.getFullYear();
        const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const day = fecha.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    //🟢 Cargamos los alumnos 
    useEffect(() => {
        const cargarAlumnosAusentes = async () => {
            const fechaActual = obtenerFechaActual();
            try {
                const respuesta = await obtenerAlumnosAusentes(id_curso, fechaActual);
                if (respuesta && Array.isArray(respuesta.alumnos) && respuesta.alumnos.length > 0) {
                    const alumnosAusentes = respuesta.alumnos;
                    const estudiantesActualizados = alumnosAusentes.map((alumno) => {
                        const estado = alumno.id_estado_asistencia === 2 ? false : true;
                        return { id: alumno.dni_alumno, nombre: alumno.nombreapellido, presente: estado };
                    });
                    setStudents(estudiantesActualizados);
                } else {
                    setStudents([]);
                }
            } catch (error) {
                setStudents([]);
            }
        };
        cargarAlumnosAusentes();
    }, [id_curso]);

    //🟢 Registramos 
    const handleRegistrar = async () => {
        try {
            for (const estudiante of students) {
                const alumnosData = await obtenerAlumnoFiltrado(estudiante.id);
                if (alumnosData) {
                    const id_estado_asistencia = estudiante.presente ? 3 : 2;
                    const asistenciaData = {
                        dni_alumno: parseInt(estudiante.id, 10),
                        fecha: obtenerFechaActual(),
                        id_curso: id_curso,
                        id_estado_asistencia: id_estado_asistencia,
                    };
                    await registrarAsistenciaFrontend(asistenciaData);
                    mostrarMensaje('Exito', 'Se modificó la asistencia correctamente');

                }
            }
        } catch (error) {
            mostrarMensaje('Error', 'Error al modificar la asistencia ');
        }
    };

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg} />
            <View style={styles.wrapper}>
                <View style={styles.card}>
                    <View style={styles.busqueda}>
                        <FontAwesome5 name="search" size={15} color="#bbb" style={styles.icon} />
                        <TextInput placeholder='Buscar alumno...' style={styles.textBusqueda} />
                    </View>
                    <View style={styles.headerLista}>
                        <Text style={styles.headerNombre}>Nombre</Text>
                        <Text style={styles.headerPresente}>MF</Text>
                    </View>
                    <ScrollView style={styles.listaEstudiantes}>
                        {students.map((estudiante) => (
                            <View key={estudiante.id} style={styles.filaEstudiantes}>
                                <Text style={styles.estudiante}>{estudiante.nombre}</Text>
                                <Switch
                                    value={estudiante.presente}
                                    onValueChange={() => toggleSwitch(estudiante.id)}
                                    thumbColor={estudiante.presente ? "#4caf50" : "#bbb"}
                                    trackColor={{ false: "#e5e7eb", true: "#bbf7d0" }}
                                    style={styles.switch}
                                />
                            </View>
                        ))}
                    </ScrollView>
                    <View style={styles.contenedorBotones}>
                        <TouchableOpacity style={[styles.boton, styles.volver]} onPress={() => navegacion.goBack()}>
                            <Text style={styles.botonTexto}>Volver</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.boton, styles.enviar]} onPress={handleRegistrar}>
                            <Text style={styles.botonTexto}>Enviar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                                                style={[styles.boton, styles.volver]}
                                                
                                            >
                                                <Text style={styles.botonTexto}>📄</Text>
                                            </TouchableOpacity>
                    </View>
                </View>
                {mensajeConfirmacion !== '' && (
                    <View style={styles.mensajeOverlay}>
                        <View style={styles.mensajeConfirmacion}>
                            <Text style={styles.mensajeTexto}>{mensajeConfirmacion}</Text>
                        </View>
                    </View>
                )}
            </View>
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
        backgroundColor: '#f6f8fa',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    bg: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: -1,
    },
    wrapper: {
        width: '100%',
        maxWidth: 420,
        alignSelf: 'center',
        marginTop: 32,
        marginBottom: 24,
        paddingHorizontal: 8,
    },
    titulo: {
        fontSize: 22,
        fontWeight: '600',
        color: '#2a3d6c',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: 0.2,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 18,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
        borderWidth: 0.5,
        borderColor: '#e5e7eb',
    },
    busqueda: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        width: '100%',
        padding: 8,
        marginTop: 10,
        borderWidth: 0,
    },
    textBusqueda: {
        flex: 1,
        marginLeft: 8,
        fontSize: 15,
        color: '#2a3d6c',
        backgroundColor: 'transparent',
    },
    headerLista: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 8,
        marginBottom: 2,
        marginTop: 12,
    },
    headerNombre: {
        fontWeight: '500',
        color: '#2a3d6c',
        fontSize: 14,
    },
    headerPresente: {
        fontWeight: '500',
        color: '#2a3d6c',
        fontSize: 14,
    },
    listaEstudiantes: {
        width: '100%',
        maxHeight: 260,
        borderRadius: 10,
        backgroundColor: '#fff',
        paddingHorizontal: 2,
        borderWidth: 0,
        marginBottom: 10,
    },
    filaEstudiantes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#e5e7eb',
        backgroundColor: 'transparent',
        borderRadius: 0,
        marginBottom: 0,
        paddingHorizontal: 8,
    },
    estudiante: {
        fontSize: 15,
        color: '#222',
        flex: 1,
    },
    switch: {
        transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
    },
    contenedorBotones: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
        gap: 8,
    },
    boton: {
        flex: 1,
        marginHorizontal: 4,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    volver: {
        backgroundColor: '#f6fafe',
         borderColor: '#746BC8',
        borderWidth: 1,
    },
    enviar: {
        backgroundColor: '#e8f5e9',
        borderColor: '#4caf50',
        borderWidth: 1,
    },
     botonTexto: {
        color: '#2a3d6c',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    mensajeOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
        zIndex: 10,
    },
    mensajeConfirmacion: {
        backgroundColor: '#10b981',
        padding: 14,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    mensajeTexto: {
        color: '#FFF',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
    },
});