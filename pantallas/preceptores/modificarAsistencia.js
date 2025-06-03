import { StyleSheet,View,Image,TouchableOpacity,Text,TextInput,Switch,ScrollView} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { obtenerAlumnosAusentes, obtenerCursoFrontend, registrarAsistenciaFrontend } from '../../scripts/preceptor/scriptGestionAsistencia.js';
import { obtenerAlumnoFiltrado } from '../../scripts/secretaria/scriptGestionAlumno';

import bg from '../../assets/bg1.jpg'

import { FontAwesome5 } from '@expo/vector-icons';

export default function ModificarAsistencia() {
    const navegacion = useNavigation();
    const route = useRoute(); // Hook para acceder a los parámetros de la ruta

    const { id_curso } = route.params; // Aquí recuperamos el idcurso

    console.log('Curso seleccionado:', id_curso); // Verifica si el idcurso se está pasando correctamente

    // Estado y lógica para mostrar a los estudiantes
    const [students, setStudents] = useState([]);
    const [mensajeConfirmacion, setMensajeConfirmacion] = useState(''); // Estado para el mensaje de confirmación
    const [modalVisible, setModalVisible] = useState(false); // Inicializar estado para el modal


    const toggleSwitch = (id) => {
        setStudents((prevEstudiante) =>
            prevEstudiante.map((estudiante) =>
                estudiante.id === id ? { ...estudiante, presente: !estudiante.presente } : estudiante
            )
        );
    };

    const obtenerFechaActual = () => {
        const fecha = new Date();
        const year = fecha.getFullYear();
        const month = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Mes con 2 dígitos
        const day = fecha.getDate().toString().padStart(2, '0'); // Día con 2 dígitos
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const cargarAlumnosAusentes = async () => {
            const fechaActual = obtenerFechaActual();
            try {
                // Obtener los alumnos ausentes desde la API
                const respuesta = await obtenerAlumnosAusentes(id_curso, fechaActual);
                console.log('Respuesta del servidor:', respuesta); // Verifica si la respuesta es la esperada
        
                // Verifica que la propiedad 'alumnos' existe y no está vacía
                if (respuesta && Array.isArray(respuesta.alumnos) && respuesta.alumnos.length > 0) {
                    const alumnosAusentes = respuesta.alumnos;
                    // Mapeamos los datos de los alumnos para establecer el estado de los switches
                    const estudiantesActualizados = alumnosAusentes.map((alumno) => {
                        const estado = alumno.id_estado_asistencia === 2 ? false : true; // Si idestado es 2, el switch estará apagado
                        return { id: alumno.dni_alumno, nombre: alumno.nombreapellido, presente: estado };
                    });
        
                    // Actualizamos el estado con los alumnos ausentes
                    setStudents(estudiantesActualizados);
                } else {
                    console.log('No se encontraron alumnos ausentes o la respuesta está vacía.');
                }
            } catch (error) {
                console.log('Error al obtener los alumnos ausentes:', error.message);
            }
        };
        cargarAlumnosAusentes(); // Llamar a la función al cargar el componente
    }, [id_curso]); // Dependencia de idcurso para cargar los datos cada vez que cambie el curso
    
    const handleRegistrar = async () => {
        try {
            // Iterar sobre cada estudiante y enviar los datos uno a uno
            for (const estudiante of students) {
                // Usar el ID directamente del objeto estudiante
                const alumnosData = await obtenerAlumnoFiltrado(estudiante.id);
                // Verificar si alumnosData contiene la información del alumno
                if (alumnosData) {
                    // Determinar el estado del estudiante basado en el switch
                    const id_estado_asistencia = estudiante.presente ? 3 : 2; // Si el switch está marcado, idestado es 3; si está desmarcado, idestado es 2
    
                    const asistenciaData = {
                        dni_alumno: parseInt(estudiante.id, 10), // Usamos el ID directamente
                        fecha: obtenerFechaActual(), // Se asigna la fecha actual
                        id_curso: id_curso,  // Asegurarse de que es un número
                        id_estado_asistencia: id_estado_asistencia,  // Asignar el valor calculado para idestado
                    };
    
                    console.log("Datos que se van a enviar al backend:", asistenciaData); // Verifica los datos antes de enviarlos
    
                    // Enviar los datos de asistencia al backend (asegúrate de tener el código de envío adecuado)
                    //await enviarAsistencia(asistenciaData); // Asegúrate de que esta función maneje el envío correctamente
                } else {
                    console.error(`No se encontraron datos para el DNI ${estudiante.id}`);
                }
            }
            // Después de procesar todos los estudiantes, confirmar el registro
            confirmarRegistro();
    
        } catch (error) {
            console.error('Error al registrar la asistencia:', error.message);
        }
    };
    const confirmarRegistro = async () => {
        setModalVisible(false); // Cerrar el modal
        try {
            for (const estudiante of students) {
                const asistenciaData = {
                    dni_alumno: parseInt(estudiante.id, 10),
                    fecha: obtenerFechaActual(),
                    id_curso: id_curso,
                    id_estado_asistencia: estudiante.presente ? 3 : 2, // Cambié la lógica para idestado
                };
                console.log("Enviando datos al backend:", asistenciaData);
                const curso = await obtenerCursoFrontend(asistenciaData.id_curso);
                registrarAsistenciaFrontend(asistenciaData);
                setMensajeConfirmacion(`La asistencia del curso "${curso.curso.detalle}" se registró correctamente.`);
                setTimeout(() => {
                    setMensajeConfirmacion('');
                }, 3000);
            }
            console.log("Registro completado.");
        } catch (error) {
            console.error("Error al confirmar el registro:", error.message);
        }
    };
    


    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg}></Image>
            <Picker style={styles.lista}>
                <Picker.Item label='Seleccionar curso' value='' />
                <Picker.Item label='1 b' value='1b' />
                <Picker.Item label='2 a' value='1a' />
            </Picker>
            <View style={styles.busqueda}>
                <FontAwesome5 name="search" size={15} color="black" style={styles.icon} />
                <TextInput placeholder='Ingresar Alumno' style={styles.textBusqueda} />
            </View>
            <View style={styles.contenedorTexto}>
                <Text style={styles.texto}>Nombre</Text>
                <Text style={styles.texto}>MF</Text>
            </View>
            <ScrollView style={styles.listaEstudiantes}>
                {students.map((estudiante) => (
                    <View key={estudiante.id} style={styles.filaEstudiantes}>
                        <Text style={styles.estudiante}>{estudiante.nombre}</Text>
                        <Switch
                            value={estudiante.presente}
                            onValueChange={() => toggleSwitch(estudiante.id)}
                            thumbColor={estudiante.presente ? "#3b82f6" : "#ccc"}
                        />
                    </View>
                ))}
            </ScrollView>
    
            <View style={styles.contenedorBotones}>
                <TouchableOpacity style={styles.volver} onPress={() => navegacion.navigate('Gestionar Asistencia')}>
                    <Text style={styles.botonTexto}>Volver</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.enviar} onPress={handleRegistrar}>
                    <Text style={styles.botonTexto}>Enviar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.exportar}>
                    <Text style={styles.botonTexto}>Exportar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    padre:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    bg:{
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    lista:{
        height: 50,
        width: '90%',
        marginBottom: 20,
        marginTop:20,
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
    },
    busqueda:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
        width: '90%',
        padding: 10,
        marginBottom: 20,
    },
    textBusqueda:{
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    listaEstudiantes:{
        width: '90%',
        marginTop: 10,
    },
    filaEstudiantes:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,   
        borderBottomColor: '#ddd',
    },
    estudiante:{
        fontSize: 18,
    },
    contenedorBotones: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '90%',
        marginTop: 20,
        marginBottom: 60,
    },
    volver: {
        backgroundColor: '#DADADA',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        borderColor: '#000000',
        borderWidth: 0.4,
        alignItems: 'center',
        shadowColor: '#6B6B6D',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.71,
        shadowRadius: 6,
        elevation: 4,
    },
    enviar: {
        backgroundColor: '#D5EFCE',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        borderColor: '#1FB741',
        borderWidth: 0.4,
        alignItems: 'center',
        shadowColor: '#B6FFCA',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.71,
        shadowRadius: 6,
        elevation: 4,
    },
    exportar: {
        backgroundColor: '#CED9EF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        borderColor: '#0500FF',
        borderWidth: 0.4,
        alignItems: 'center',
        shadowColor: '#BAAFFF',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.71,
        shadowRadius: 6,
        elevation: 4,
    },
    contenedorTexto:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    texto:{
       fontWeight:'bold'
    },
    botonTexto:{
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    }
})