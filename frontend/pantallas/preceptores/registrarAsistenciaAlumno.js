import { StyleSheet,View,Image,TouchableOpacity,Text,TextInput,Switch,ScrollView, Platform,Modal, Button} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState,useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { registrarAsistenciaFrontend, obtenerCursoFrontend, validarFechaAsistencia, exportarExcelConDatos  } from '../../scripts/preceptor/scriptGestionAsistencia.js';
import { obtenerAlumnoFiltrado } from '../../scripts/secretaria/scriptGestionAlumno.js';
import { obtenerCurso, obtenerAlumnoCurso} from '../../scripts/listasDesplegables/listaDesplegable.js';
import bg from '../../assets/bg1.jpg'
import { FontAwesome5 } from '@expo/vector-icons';
import CustomAlert from '../../componente/CustomAlerts.js';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function RegistrarAsistenciaAlumno(){
    const navegacion = useNavigation();

    //🟢 Formulario
    const [formData, setFormData] = useState({
        dni_alumno: '',
        fecha: '',
        id_curso: '',
        id_estado_asistencia: ''
    });

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

    
    //🟢 Estados y  Listas desplegables
    const [cursos, setCursos] = useState([]);
    const [botonActivado, setBotonActivado] = useState(false);
    const [estudiantes, setEstudiantes] = useState([]);
    const [ausentes, setAusentes] = useState([]); 

    //🟢 Modal
    const [modalVisible, setModalVisible] = useState(false); 

    //🟢 Confirmación
    const [mensajeConfirmacion, setMensajeConfirmacion] = useState(''); 

    const [botonModificarActivado, setBotonModificarActivado] = useState(false);

    //🟢 Cargamos listas desplegable del curso
    useEffect(() => {
        const cargarListaDesplegables = async () => {
            try {
                const cursosData = await obtenerCurso();
                if (!cursosData || cursosData.length === 0) return;
                const fechaActual = obtenerFechaActual();
                const cursosConEstado = await Promise.all(
                    cursosData.map(async (curso) => {
                        const tieneAsistencia = await validarFechaAsistencia(curso.id_curso, fechaActual);
                        return {
                            ...curso,
                            tieneAsistencia,
                        };
                    })
                );
                setCursos(cursosConEstado);
            } catch (error) {
                console.error("Error al cargar los cursos:", error);
            }
        };
        cargarListaDesplegables();
    }, []);

    //🟢 Marca el curso seleccionado y habilita el botón de modificar si tiene asistencia
    useEffect(() => {
        if (formData.id_curso) {
            const cursoSeleccionado = cursos.find(curso => Number(curso.id_curso) === Number(formData.id_curso));
            if (cursoSeleccionado && cursoSeleccionado.tieneAsistencia) {
                setBotonModificarActivado(true);
            } else {
                setBotonModificarActivado(false);
            }
        } else {
            setBotonModificarActivado(false);
        }
    }, [formData.id_curso, cursos]);

    //🟢 Cargamos los alumnos 
    useEffect(() => {
        const cargarAlumnos = async () => {
            if (formData.id_curso) {
                try {
                    const alumnosData = await obtenerAlumnoCurso(formData.id_curso);
                    const alumnosConPresente = alumnosData.map((alumno) => ({
                        ...alumno,
                        presente: true,
                        formData: {
                            dni_alumno: alumno.dni_alumno,
                            fecha: '',
                            id_curso: formData.id_curso,
                            id_estado_asistencia: 1,
                        },
                    }));
                    setEstudiantes(alumnosConPresente);
                    setBotonActivado(true);
                } catch (error) {
                    setBotonActivado(false);
                }
            }
        };
        cargarAlumnos();
    }, [formData.id_curso]);

    //🟢 Cambiar Estado de Asistencia 
    const cambiarAsistencia = (dni) => {
        setEstudiantes((prevEstudiantes) =>
            prevEstudiantes.map((estudiante) => {
                if (estudiante.dni_alumno === dni) {
                    const nuevoPresente = !estudiante.presente;
                    const nuevoEstado = nuevoPresente ? 1 : 2;
                    return {
                        ...estudiante,
                        presente: nuevoPresente,
                        formData: {
                            ...estudiante.formData,
                            id_estado_asistencia: nuevoEstado,
                        },
                    };
                }
                return estudiante;
            })
        );
    };

    //🟢 Limpiar interfaz
    const limpiarInterfaz = async () => {
        setModalVisible(false);
        setMensajeConfirmacion('');
        setBotonActivado(false);
        setBotonModificarActivado(false);
        try {
            const cursosData = await obtenerCurso();
            const fechaActual = obtenerFechaActual();
            const cursosConEstado = await Promise.all(
                cursosData.map(async (curso) => {
                    const tieneAsistencia = await validarFechaAsistencia(curso.id_curso, fechaActual);
                    return {
                        ...curso,
                        tieneAsistencia,
                    };
                })
            );
            setCursos(cursosConEstado);
        } catch (error) {
            // nada
        }
    };

    //🟢 Registrar 
    const handleRegistrar = async () => {
        try {
            const ausentesTemp = [];
            for (const estudiante of estudiantes) {
                const alumnosData = await obtenerAlumnoFiltrado(estudiante.formData.dni_alumno);
                const alumno = Array.isArray(alumnosData) ? alumnosData[0] : alumnosData;
                if (!alumno || !alumno.nombre || !alumno.apellido) continue;
                const asistenciaData = {
                    dni_alumno: estudiante.formData.dni_alumno ? parseInt(estudiante.formData.dni_alumno, 10) : null,
                    fecha: obtenerFechaActual(),
                    id_curso: estudiante.formData.id_curso ? parseInt(estudiante.formData.id_curso, 10) : null,
                    id_estado_asistencia: estudiante.formData.id_estado_asistencia ? parseInt(estudiante.formData.id_estado_asistencia, 10) : null,
                };
              
                if (!asistenciaData.dni_alumno || !asistenciaData.id_curso || !asistenciaData.id_estado_asistencia) continue;
                if (asistenciaData.id_estado_asistencia === 2) {
                    ausentesTemp.push({
                        nombre: alumno.nombre,
                        apellido: alumno.apellido,
                        dni_alumno: asistenciaData.dni_alumno,
                    });
                }
            }
            
            setAusentes(ausentesTemp);
            if (ausentesTemp.length > 0) {
                setModalVisible(true);
            } else {
                console.log("No hay ausentes. Registro completado.");
                setModalVisible(true);
                
            }
        } catch (error) {
            // nada
        }
    };

    //🟢 Confirmar 
    const confirmarRegistro = async () => {
        setModalVisible(false);
        try {
            for (const estudiante of estudiantes) {
                const asistenciaData = {
                    dni_alumno: parseInt(estudiante.formData.dni_alumno, 10),
                    fecha: obtenerFechaActual(),
                    id_curso: parseInt(estudiante.formData.id_curso, 10),
                    id_estado_asistencia: parseInt(estudiante.formData.id_estado_asistencia, 10),
                };
                // Cambiar nombre
                const curso = await obtenerCursoFrontend(asistenciaData.id_curso);
                // Cambiar nombre
                registrarAsistenciaFrontend(asistenciaData)
                mostrarMensaje('Exito',`Se registro la asistencia correctamente`)
            }
            limpiarInterfaz();
        } catch (error) {
            mostrarMensaje('Error',`Error al registrar la asistencia`)

        }
    };

    //🟢 Obtenemos fecha del día 
    const obtenerFechaActual = () => {
        const fecha = new Date();
        const anio = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const dia = String(fecha.getDate()).padStart(2, '0');
        return `${anio}-${mes}-${dia}`;
    }

    const validarCampos = () => {
        return(
            estudiantes.length > 0 
        )
    }

    const PickerField = React.memo(({ label, selectedValue, onValueChange, items }) => {
        return (
            <>
                <Text style={styles.label}>{label}</Text>
                <Picker
                    style={styles.input}
                    selectedValue={selectedValue}
                    onValueChange={onValueChange}
                >
                    {items.length > 0 ? (
                        items.map((item) => (
                            <Picker.Item key={item.key || item.value} label={item.label} value={item.value} />
                        ))
                    ) : (
                        <Picker.Item label="Cargando..." value="" />
                    )}
                </Picker>
            </>
        );
    });

    {cursos.map((curso) => (
        console.log(curso)
    ))}

    const cursoSeleccionado = cursos.find(c => c.id_curso === formData.id_curso);
const tieneAsistencia = cursoSeleccionado?.tieneAsistencia;
    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };


    //🟢 Exportamos excel 
    const exportarAsistenciaExcel = (estudiantes) => {
        const data = estudiantes.map(a => ({
            Fecha: obtenerFechaActual(),
            DNI: a.dni_alumno,
            Alumno: a.nombrecompleto || `${a.nombre || ''} ${a.apellido || ''}`,
            Estado: a.presente ? 'Presente' : 'Ausente'
        }));

        exportarExcelConDatos(data, 'asistencia.xlsx',  `${cursoSeleccionado ? cursoSeleccionado.detalle : 'curso'}`) ;
    };

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg} />
            <View style={styles.wrapper}>

                <View style={styles.card}>
                <Picker
                        selectedValue={formData.id_curso}
                        onValueChange={(value) => setFormData({ ...formData, id_curso: value })}
                        style={[
                            { height: 50, width: 220, borderRadius: 8, marginBottom: 10, alignSelf: 'center' },
                            tieneAsistencia && { backgroundColor: '#d1fae5', borderColor: '#059669', borderWidth: 1 }
                        ]}
                    >
                        <Picker.Item label="Seleccione el curso" value="" color="#888" />
                        {cursos.map((curso) => (
                            <Picker.Item
                                key={curso.id_curso}
                                label={
                                    curso.tieneAsistencia
                                        ? `${curso.detalle} ✅`
                                        : curso.detalle
                                }
                                value={curso.id_curso}
                                color={curso.tieneAsistencia ? '#059669' : '#222'}
                            />
                        ))}
                    </Picker>
                    <View style={styles.busqueda}>
                        <FontAwesome5 name="search" size={15} color="#bbb" style={styles.icon} />
                        <TextInput placeholder='Buscar alumno...' style={styles.textBusqueda}/>
                    </View>
                </View>
                <View style={styles.headerLista}>
                    <Text style={styles.headerNombre}>Nombre</Text>
                    <Text style={styles.headerPresente}>P</Text>
                </View>
                <ScrollView style={styles.listaEstudiantes}>
                    {estudiantes.map((estudiante) => (
                        <View key={estudiante.id} style={styles.filaEstudiantes}>
                            <Text style={styles.estudiante}>{estudiante.nombrecompleto}</Text>
                            <Switch
                                value={estudiante.presente}
                                onValueChange={() => cambiarAsistencia(estudiante.dni_alumno)}
                                thumbColor={estudiante.presente ? "#4caf50" : "#bbb"}
                                trackColor={{ false: "#e5e7eb", true: "#bbf7d0" }}
                                style={styles.switch}
                            />
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.contenedorBotones}>
                    <TouchableOpacity style={[styles.boton, styles.modificar, !botonModificarActivado && styles.botonDeshabilitado]} disabled={!botonModificarActivado} onPress={() => navegacion.navigate('Modificar Asistencia', { id_curso: formData.id_curso, detalle_curso : cursoSeleccionado ? cursoSeleccionado.detalle : '' })}>
                        <Text style={styles.botonTexto}>Modificar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.boton, styles.enviar, !validarCampos() && styles.botonDeshabilitado]} disabled={!validarCampos()} onPress={handleRegistrar}>
                        <Text style={styles.botonTexto}>Enviar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.boton, styles.exportar, !botonModificarActivado && styles.botonDeshabilitado]}
                        disabled={!botonModificarActivado}
                        onPress={() => exportarAsistenciaExcel(estudiantes)}
                    >
                        <Text style={styles.botonTexto}>📄</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* Modal de Confirmación */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Confirmar registro</Text>
                        <Text style={{marginBottom: 8}}> {ausentes.length === 0 ? 'No hay alumnos ausentes' : 'Alumnos ausentes'}</Text>
                        {ausentes.map((alumno) => (
                            <Text key={alumno.dni_alumno} style={styles.alumnoItem}>
                                {alumno.nombre} {alumno.apellido} - DNI: {alumno.dni_alumno}
                            </Text>
                        ))}
                        <View style={styles.modalButtons}>
                            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                            <Button title="Confirmar" onPress={confirmarRegistro} />
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Mensaje de confirmación */}
            {mensajeConfirmacion !== '' && (
                <View style={styles.mensajeOverlay}>
                    <View style={styles.mensajeConfirmacion}>
                        <Text style={styles.mensajeTexto}>{mensajeConfirmacion}</Text>
                    </View>
                </View>
            )}
            <CustomAlert
                isVisible={alertVisible}
                onClose={() => setAlertVisible(false)}
                title={alertTitle}
                message={alertMessage}
            />
        </View>
    )
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
        marginTop: 2,
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
    modificar: {
        backgroundColor: '#f6fafe',
         borderColor: '#746BC8',
        borderWidth: 1,
    },
    enviar: {
        backgroundColor: '#e8f5e9',
        borderColor: '#4caf50',
        borderWidth: 1,
    },
    exportar: {
        backgroundColor: '#f0f7ff',
    borderColor: '#746BC8',
        borderWidth: 1,
    },
    botonTexto: {
        color: '#2a3d6c',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    botonDeshabilitado: {
        opacity: 0.5,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.18)',
    },
    modalContent: {
        width: '92%',
        maxWidth: 340,
        padding: 18,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 0.5,
        borderColor: '#e5e7eb',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#1f2937',
        letterSpacing: 0.2,
    },
    alumnoItem: {
        fontSize: 14,
        marginVertical: 3,
        color: '#374151',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 14,
        width: '100%',
        gap: 8,
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
    picker: {
         height: 50,
    width: 220,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'center',
    backgroundColor: '#f9fafb',
    color: '#222',
    },
});