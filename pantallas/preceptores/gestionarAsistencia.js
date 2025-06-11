import { StyleSheet,View,Image,TouchableOpacity,Text,TextInput,Switch,ScrollView, Modal, Button} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState,useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
//import { obtenerCurso } from '../../scripts/secretaria/scriptGestionAlumno';
//import { obtenerAlumnoCurso } from '../../scripts/preceptor/scriptGestionarObservacion.js';
import { registrarAsistenciaFrontend, obtenerCursoFrontend, validarFechaAsistencia } from '../../scripts/preceptor/scriptGestionAsistencia.js';
import { obtenerAlumnoFiltrado } from '../../scripts/secretaria/scriptGestionAlumno';
import { obtenerCurso, obtenerAlumnoCurso} from '../../scripts/listasDesplegables/listaDesplegable.js';

import bg from '../../assets/bg1.jpg'

import { FontAwesome5 } from '@expo/vector-icons';
//import { registrarAsistencia } from '../../back/metodos/metodosAsistencia.mjs';



export default function GestionarAsistencia(){
    const navegacion = useNavigation();

     //Formulario
    const [formData, setFormData] = useState({
        dni_alumno: '',
        fecha: '',
        id_curso: '',
        id_estado_asistencia: ''
    });

     // Listas desplegables
    const [cursos, setCursos] = useState([]);
    const [botonActivado, setBotonActivado] = useState(false);
    const [estudiantes, setEstudiantes] = useState([]);
    const [ausentes, setAusentes] = useState([]); // Lista de alumnos ausentes
    const [modalVisible, setModalVisible] = useState(false); // Control del modal
    const [mensajeConfirmacion, setMensajeConfirmacion] = useState(''); // Estado para el mensaje de confirmación
    const [botonModificarActivado, setBotonModificarActivado] = useState(false);


    
    // Cargar cursos
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const cursosData = await obtenerCurso(); // Obtener los cursos desde listaDesplegable.js
                console.log("Cursos obtenidos:", cursosData); // Verifica si los datos están llegando bien

                if (!cursosData || cursosData.length === 0) {
                    console.log("No hay cursos disponibles.");
                    return;
                }

                // Fecha actual
                const fechaActual = obtenerFechaActual(); // Asegúrate de que esta función esté definida
                console.log("Fecha actual:", fechaActual);

                // Validar la asistencia para cada curso
                const cursosConEstado = await Promise.all(
                    cursosData.map(async (curso) => {
                        const tieneAsistencia = await validarFechaAsistencia(curso.id_curso, fechaActual);
                        console.log(`Curso ${curso.id_curso} tiene asistencia:`, tieneAsistencia);
                        return {
                            ...curso,
                            tieneAsistencia, // Agregar el estado de asistencia al curso
                        };
                    })
                );
                console.log("Cursos con estado de asistencia:", cursosConEstado);

                // Actualizar estado con los cursos y su estado de asistencia
                setCursos(cursosConEstado);
            } catch (error) {
                console.error("Error al cargar los cursos:", error);
                Alert.alert('Error', 'Hubo un problema al cargar los cursos.');
            }
        };
        cargarDatos();
    }, []);

    // Marca el curso seleccionado y habilita el botón de modificar si tiene asistencia
    useEffect(() => {
        if (formData.id_curso) {
            // Asegura que los datos sean numéricos y encuentra el curso seleccionado
            const cursoSeleccionado = cursos.find(curso => Number(curso.id_curso) === Number(formData.id_curso));
            if (cursoSeleccionado) {
                console.log('Curso seleccionado:', cursoSeleccionado);
                // Verifica si el curso tiene asistencia
                if (cursoSeleccionado.tieneAsistencia) {
                    console.log("Activando botón Modificar");
                    setBotonModificarActivado(true); // Habilitar el botón si tiene asistencia
                } else {
                    console.log("Desactivando botón Modificar");
                    setBotonModificarActivado(false); // Desactivar el botón si no tiene asistencia
                }
            } else {
                console.log('Curso no encontrado');
                setBotonModificarActivado(false); // Desactivar el botón si no se encuentra el curso
            }
        } else {
            setBotonModificarActivado(false); // Desactivar el botón si no hay `idcurso`
        }
    }, [formData.id_curso, cursos]); // Dependencias: formData.idcurso y cursos


    // Carga alumnos en base al curso
    useEffect(() => {
        const cargarAlumnos = async () => {
            if (formData.id_curso) {
                try {
                    const alumnosData = await obtenerAlumnoCurso(formData.id_curso);
                    // Asegura que todos los estudiantes tengan 'presente: true' y 'formData' propio
                    const alumnosConPresente = alumnosData.map((alumno) => ({
                        ...alumno,
                        presente: true, // Todos están inicialmente marcados como presentes
                        formData: {
                            dni_alumno: alumno.dni_alumno,
                            fecha: '',
                            id_curso: formData.id_curso,
                            id_estado_asistencia: 1, // Inicializa como presente
                        },
                    }));
                    setEstudiantes(alumnosConPresente);
                    setBotonActivado(true); // Activa el botón
                } catch (error) {
                    console.error('Error al cargar alumnos:', error);
                    setBotonActivado(false); // Si ocurre un error, desactiva el botón
                }
            }
        };
        cargarAlumnos();
    }, [formData.id_curso]); // Se ejecuta solo cuando cambia el curso
    
    //cambia el switch del alumno
    const toggleSwitch = (dni) => {
        setEstudiantes((prevEstudiantes) =>
            prevEstudiantes.map((estudiante) => {
                if (estudiante.dni_alumno === dni) {
                    const nuevoPresente = !estudiante.presente;
                    const nuevoEstado = nuevoPresente ? 1 : 2; // 1 = presente, 2 = ausente
                    return {
                        ...estudiante,
                        presente: nuevoPresente,
                        formData: {
                            ...estudiante.formData,
                            id_estado_asistencia: nuevoEstado, // Actualiza id_estado_asistencia
                        },
                    };
                }
                return estudiante;
            })
        );
    };

    const limpiarInterfaz = async () => {
        setModalVisible(false); // Cierra el modal
        setMensajeConfirmacion(''); // Limpia el mensaje de confirmación
        setBotonActivado(false); // Desactiva el botón de enviar
        setBotonModificarActivado(false); // Desactiva el botón de modificar
    
        // Recargar los cursos para actualizar el Picker
        try {
            const cursosData = await obtenerCurso(); // Llama a la función que obtiene los cursos
            const fechaActual = obtenerFechaActual(); // Obtén la fecha actual
            const cursosConEstado = await Promise.all(
                cursosData.map(async (curso) => {
                    const tieneAsistencia = await validarFechaAsistencia(curso.id_curso, fechaActual);
                    return {
                        ...curso,
                        tieneAsistencia, // Actualiza el estado de asistencia
                    };
                })
            );
            setCursos(cursosConEstado); // Actualiza el estado de los cursos
        } catch (error) {
            console.error("Error al recargar los cursos:", error);
        }
    };
    
    const validarCampos = () => {
        return formData.dni_alumno && 
            formData.idsolicitante && 
            formData.fecha.length >= 10 && 
            formData.motivo.length >= 3 &&
            formData.id_curso; 
    };
    const handleRegistrar = async () => {
        try {
            const ausentesTemp = []; // Lista temporal de alumnos ausentes
            for (const estudiante of estudiantes) {
                console.log("FormData del estudiante:", estudiante.formData);
    
                // Obtener datos del alumno
                const alumnosData = await obtenerAlumnoFiltrado(estudiante.formData.dni_alumno);
                console.log("Datos del alumno obtenidos:", alumnosData);
    
                // Manejar ambos casos: si alumnosData es un array o un objeto
                const alumno = Array.isArray(alumnosData) ? alumnosData[0] : alumnosData;
                console.log("Datos del alumno procesado:", alumno);
    
                if (!alumno || !alumno.nombre || !alumno.apellido) {
                    console.error(`No se encontraron datos válidos para el DNI ${estudiante.formData.dni_alumno}`);
                    continue; // Salta al siguiente estudiante
                }
    
                // Construir el objeto de asistencia
                const asistenciaData = {
                    dni_alumno: estudiante.formData.dni_alumno ? parseInt(estudiante.formData.dni_alumno, 10) : null,
                    fecha: obtenerFechaActual(),
                    id_curso: estudiante.formData.id_curso ? parseInt(estudiante.formData.id_curso, 10) : null,
                    id_estado_asistencia: estudiante.formData.id_estado_asistencia ? parseInt(estudiante.formData.id_estado_asistencia, 10) : null,
                };
    
                console.log("Datos que se van a enviar al backend:", asistenciaData);
    
                if (!asistenciaData.dni_alumno || !asistenciaData.id_curso || !asistenciaData.id_estado_asistencia) {
                    console.error("Datos incompletos en asistenciaData:", asistenciaData);
                    continue; // Salta al siguiente estudiante si los datos son incompletos
                }
    
                // Si el estudiante está ausente, agregarlo a la lista de ausentes
                if (asistenciaData.id_estado_asistencia === 2) {
                    ausentesTemp.push({
                        nombre: alumno.nombre,
                        apellido: alumno.apellido,
                        dni_alumno: asistenciaData.dni_alumno,
                    });
                }
            }
    
            // Actualizar el estado con los ausentes
            setAusentes(ausentesTemp);
            // Mostrar el modal si hay ausentes
            if (ausentesTemp.length > 0) {
                setModalVisible(true);
            } else {
                console.log("No hay ausentes. Registro completado.");
                await confirmarRegistro(); // Si no hay ausentes, confirmar el registro directamente
            }
        } catch (error) {
            console.error('Error al registrar la asistencia:', error.message);
        }
    };

    const confirmarRegistro = async () => {
        setModalVisible(false); // Cerrar el modal
        try {
            for (const estudiante of estudiantes) {
                const asistenciaData = {
                    dni_alumno: parseInt(estudiante.formData.dni_alumno, 10),
                    fecha: obtenerFechaActual(),
                    id_curso: parseInt(estudiante.formData.id_curso, 10),
                    id_estado_asistencia: parseInt(estudiante.formData.id_estado_asistencia, 10),
                };
                console.log("Enviando datos al backend:", asistenciaData);
                const curso = await obtenerCursoFrontend(asistenciaData.id_curso);
                registrarAsistenciaFrontend(asistenciaData)
                setMensajeConfirmacion(`La asistencia del curso "${curso.curso.detalle}" se registró correctamente.`);
                setTimeout(() => {
                    setMensajeConfirmacion('');
                }, 3000);
            }
            console.log("Registro completado.");
            limpiarInterfaz();
        } catch (error) {
            console.error("Error al confirmar el registro:", error.message);
        }
    };

    const obtenerFechaActual = () => {
        const fecha = new Date();
        const anio = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript comienzan desde 0, por eso sumamos 1
        const dia = String(fecha.getDate()).padStart(2, '0'); // Asegura que el día sea de dos dígitos
        return `${anio}-${mes}-${dia}`;
    }
    //Ver reutilización
    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };
    //Ver reutilización
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
    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg}></Image>
            <View style={styles.container}>
            <Picker
                selectedValue={formData.id_curso}
                onValueChange={(value) => setFormData({ ...formData, id_curso: value })}
                style={{ height: 50, width: 200 }}
            >
                <Picker.Item label="Seleccione el curso" value="" />
                {cursos.map((curso) => (
                    <Picker.Item
                        key={curso.id_curso} // Asegúrate de que `idcurso` es único
                        label={
                            curso.tieneAsistencia
                                ? `${curso.detalle} ✅` // Agregar un emoji si tiene asistencia
                                : curso.detalle
                        }
                        value={curso.id_curso}
                    />
                ))}
            </Picker>
        </View>
            <View style={styles.busqueda}>
                <FontAwesome5 name="search" size={15} color="black" style={styles.icon} />
                <TextInput placeholder='Ingresar Alumno' style={styles.textBusqueda}/>
            </View>
            <View style={styles.contenedorTexto}>
                <Text style={styles.texto}>Nombre</Text>
                <Text style={styles.texto}>P</Text>
            </View>
            <ScrollView style={styles.listaEstudiantes}>
                {estudiantes.map((estudiante) => (
                <View key={estudiante.id} style={styles.filaEstudiantes}>
                    <Text style={styles.estudiante}>{estudiante.nombrecompleto}</Text>
                    <Switch
                    value={estudiante.presente}
                    onValueChange={() => toggleSwitch(estudiante.dni_alumno)}
                    thumbColor={estudiante.presente ? "#3b82f6" : "#ccc"}
                    />
                </View>
                ))}
            </ScrollView>

            <View style={styles.contenedorBotones}>
                <TouchableOpacity style={[styles.modificar, { opacity: botonModificarActivado ? 1 : 0.5 }]}disabled={!botonModificarActivado}onPress={() => navegacion.navigate('Modificar Asistencia', { id_curso: formData.id_curso })}><Text style={styles.botonTexto}>Modificar</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.enviar, { opacity: botonActivado ? 1 : 0.5 }]} disabled={!botonActivado} onPress={handleRegistrar}><Text style={styles.botonTexto}>Enviar</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.exportar, { opacity: botonActivado ? 1 : 0.5 }]} disabled={!botonActivado}><Text style={styles.botonTexto}>Exportar</Text></TouchableOpacity>
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
                            <Text>Los siguientes alumnos están ausentes:</Text>
                            {ausentes.map((alumno) => (
                                <Text key={alumno.dni_alumno} style={styles.alumnoItem}>
                                    Nombre: {alumno.nombre} {alumno.apellido} - DNI: {alumno.dni_alumno}
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
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    padre: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    bg: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: -1,
    },
    container: {
        width: '95%',
        maxWidth: 420,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginTop: 36,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
        alignItems: 'center',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#e1e8ed',
    },
    busqueda: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        width: '100%',
        padding: 12,
        marginBottom: 18,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    textBusqueda: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#374151',
    },
    listaEstudiantes: {
        width: '100%',
        marginTop: 10,
        maxHeight: 320,
        borderRadius: 10,
        backgroundColor: '#f9fafb',
        paddingHorizontal: 4,
    },
    filaEstudiantes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        backgroundColor: '#fff',
        borderRadius: 6,
        marginBottom: 2,
        paddingHorizontal: 8,
    },
    estudiante: {
        fontSize: 16,
        color: '#374151',
        flex: 1,
    },
    contenedorTexto: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
        marginBottom: 2,
        paddingHorizontal: 8,
    },
    texto: {
        fontWeight: '600',
        color: '#1f2937',
        fontSize: 15,
        letterSpacing: 0.3,
    },
    contenedorBotones: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        marginTop: 24,
        marginBottom: 36,
        gap: 10,
    },
    modificar: {
        backgroundColor: '#f0f7ff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderColor: '#746BC8',
        borderWidth: 1,
        alignItems: 'center',
        elevation: 2,
        minWidth: 90,
    },
    enviar: {
        backgroundColor: '#e8f5e9',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderColor: '#4caf50',
        borderWidth: 1,
        alignItems: 'center',
        elevation: 2,
        minWidth: 90,
    },
    exportar: {
        backgroundColor: '#fff8e1',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderColor: '#ffb300',
        borderWidth: 1,
        alignItems: 'center',
        elevation: 2,
        minWidth: 90,
    },
    botonTexto: {
        color: '#2c3e50',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        maxWidth: 400,
        padding: 24,
        backgroundColor: 'white',
        borderRadius: 14,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
        borderWidth: 1,
        borderColor: '#e1e8ed',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 10,
        color: '#1f2937',
        letterSpacing: 0.5,
    },
    alumnoItem: {
        fontSize: 16,
        marginVertical: 5,
        color: '#374151',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '100%',
        gap: 10,
    },
    mensajeOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10,
    },
    mensajeConfirmacion: {
        backgroundColor: '#10b981',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
    },
    mensajeTexto: {
        color: '#FFF',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
    },
    picker: {
        width: '100%',
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        borderColor: '#d1d5db',
        borderWidth: 1,
        marginBottom: 16,
        color: '#374151',
    },
});