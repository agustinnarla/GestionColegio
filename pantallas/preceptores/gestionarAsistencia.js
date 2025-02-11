import { StyleSheet,View,Image,TouchableOpacity,Text,TextInput,Switch,ScrollView, Modal, Button} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState,useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { obtenerCurso } from '../../scripts/secretaria/scriptGestionAlumno';
import { obtenerAlumnoCurso } from '../../scripts/preceptor/scriptGestionarObservacion.js';
import { registrarAsistenciaFrontend, obtenerCursoFrontend, validarFechaAsistencia } from '../../scripts/preceptor/scriptGestionAsistencia.js';
import { obtenerAlumnoFiltrado } from '../../scripts/secretaria/scriptGestionAlumno';

import bg from '../../assets/bg1.jpg'

import { FontAwesome5 } from '@expo/vector-icons';
//import { registrarAsistencia } from '../../back/metodos/metodosAsistencia.mjs';



export default function GestionarAsistencia(){
    const navegacion = useNavigation();

     //Formulario
    const [formData, setFormData] = useState({
        dnialumno: '',
        fecha: '',
        idcurso: '',
        idestado: ''
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
                const cursosData = await obtenerCurso(); // Obtener los cursos desde la API
                console.log("Cursos obtenidos:", cursosData);  // Verifica si los datos están llegando bien
                
                if (!cursosData || cursosData.length === 0) {
                    console.log("No hay cursos disponibles.");
                    return;
                }
        
                // Fecha actual
                const fechaActual = obtenerFechaActual();
                console.log("Fecha actual:", fechaActual);
        
                // Validar la asistencia para cada curso
                const cursosConEstado = await Promise.all(
                    cursosData.map(async (curso) => {
                        // Asegúrate de que `validarFechaAsistencia` esté funcionando correctamente
                        const tieneAsistencia = await validarFechaAsistencia(curso.idcurso, fechaActual);
                        console.log(`Curso ${curso.idcurso} tiene asistencia:`, tieneAsistencia); // Verifica si se obtiene el estado de asistencia correctamente
                        return {
                            ...curso,
                            tieneAsistencia, // Agregar el estado de asistencia al curso
                        };
                    }),
                );
                console.log("Cursos con estado de asistencia:", cursosConEstado);  // Verifica si la lista está correctamente procesada
        
                // Actualizar estado con los cursos y su estado de asistencia
                setCursos(cursosConEstado); // Actualizar el estado de los cursos
        
            } catch (error) {
                console.error("Error al cargar los cursos:", error);
                Alert.alert('Error', 'Hubo un problema al cargar los cursos.');
            }
        };
        
        cargarDatos(); // Llamamos a la función para cargar los cursos
    }, []);

    // Marca el curso seleccionado y habilita el botón de modificar si tiene asistencia
    useEffect(() => {
        if (formData.idcurso) {
            // Asegura que los datos sean numéricos y encuentra el curso seleccionado
            const cursoSeleccionado = cursos.find(curso => Number(curso.idcurso) === Number(formData.idcurso));
            
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
    }, [formData.idcurso, cursos]); // Dependencias: formData.idcurso y cursos


    // Carga alumnos en base al curso
    useEffect(() => {
        const cargarAlumnos = async () => {
            if (formData.idcurso) {
                try {
                    const alumnosData = await obtenerAlumnoCurso(formData.idcurso);

                    // Asegura que todos los estudiantes tengan 'presente: true' y 'formData' propio
                    const alumnosConPresente = alumnosData.map((alumno) => ({
                        ...alumno,
                        presente: true, // Todos están inicialmente marcados como presentes
                        formData: { // Asignamos un formData único para cada alumno
                            dnialumno: alumno.dnialumno,
                            fecha: '',
                            idcurso: formData.idcurso,
                            idestado: 1, // Asumimos que están presentes inicialmente
                        },
                    }));

                    setEstudiantes(alumnosConPresente); // Actualiza el estado con los estudiantes cargados
                    setBotonActivado(true); // Activa el botón
                } catch (error) {
                    console.error('Error al cargar alumnos:', error);
                    setBotonActivado(false); // Si ocurre un error, desactiva el botón
                }
            }
        };
        cargarAlumnos();
    }, [formData.idcurso]); // Se ejecuta solo cuando cambia el curso
    
    //cambia el switch del alumno
    const toggleSwitch = (dni) => {
        setEstudiantes((prevEstudiantes) =>
            prevEstudiantes.map((estudiante) => {
                if (estudiante.dnialumno === dni) {
                    const nuevoPresente = !estudiante.presente;
                    const nuevoEstado = nuevoPresente ? 1 : 2; // 1 si está presente, 2 si no
    
                    // Actualizamos el 'formData' del alumno correspondiente
                    const nuevoFormData = {
                        ...estudiante.formData,
                        idestado: nuevoEstado, // Establecemos el idestado
                    };
                    return {
                        ...estudiante,
                        presente: nuevoPresente, // Cambia el estado 'presente'
                        formData: nuevoFormData, // Actualiza el formData
                    };
                }
                console.log(estudiante)
                //console.log(formData)
                return estudiante;
            })
        );
    };
    
    const validarCampos = () => {
        return formData.dnialumno && 
            formData.idsolicitante && 
            formData.fecha.length >= 10 && 
            formData.motivo.length >= 3 &&
            formData.idcurso; 
    };
    
    const handleRegistrar = async () => {
        try {
            const ausentesTemp = []; // Lista temporal de alumnos ausentes
            // Iterar sobre cada estudiante y enviar los datos uno a uno
            for (const estudiante of estudiantes) {
                // Usar el formData de cada estudiante, no el formData global
                const alumnosData = await obtenerAlumnoFiltrado(estudiante.formData.dnialumno);
    
                // Verificar si alumnosData contiene la información del alumno
                if (alumnosData) {
                    const asistenciaData = {
                        dnialumno: parseInt(estudiante.formData.dnialumno, 10),
                        fecha: obtenerFechaActual(), // Se asigna la fecha actual
                        idcurso: parseInt(estudiante.formData.idcurso, 10),  // Asegurarse de que es un número
                        idestado: parseInt(estudiante.formData.idestado, 10),
                    };
    
                    console.log("Datos que se van a enviar al backend:", asistenciaData); // Verifica los datos antes de enviarlos
    
                    // Si el idestado es 2 (ausente), agregar al set de ausentes
                    if (asistenciaData.idestado === 2) {
                        ausentesTemp.push({
                            nombre: alumnosData.nombre, // Nombre del alumno
                            apellido: alumnosData.apellido,
                            dnialumno: asistenciaData.dnialumno,
                        });
                    }
                } else {
                    console.error(`No se encontraron datos para el DNI ${estudiante.formData.dnialumno}`);
                }
            }
    
            // Actualizar el estado con los ausentes encontrados al final de la iteración
            setAusentes(ausentesTemp);
    
            // Mostrar el modal si hay ausentes
            if (ausentesTemp.length > 0) {
                setModalVisible(true);
            } else {
                // Proceder directamente si no hay ausentes
                confirmarRegistro();
            }
    
        } catch (error) {
            console.error('Error al registrar la asistencia:', error.message);
        }
    }

    const confirmarRegistro = async () => {
        setModalVisible(false); // Cerrar el modal
        try {
            for (const estudiante of estudiantes) {
                const asistenciaData = {
                    dnialumno: parseInt(estudiante.formData.dnialumno, 10),
                    fecha: obtenerFechaActual(),
                    idcurso: parseInt(estudiante.formData.idcurso, 10),
                    idestado: parseInt(estudiante.formData.idestado, 10),
                };
                console.log("Enviando datos al backend:", asistenciaData);
                const curso = await obtenerCursoFrontend(asistenciaData.idcurso);
                registrarAsistenciaFrontend(asistenciaData)
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
                selectedValue={formData.idcurso}
                onValueChange={(value) => handleChange('idcurso', value)}
                style={styles.lista}
                >
                <Picker.Item label="Seleccione el curso" value="" />
                {cursos.map((curso) => (
                    <Picker.Item
                        key={curso.idcurso}
                        label={
                            curso.tieneAsistencia
                            ? `${curso.detalle} ✅`  // Agregar un emoji 
                            : curso.detalle
                        }
                        value={curso.idcurso}
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
                    onValueChange={() => toggleSwitch(estudiante.dnialumno)}
                    thumbColor={estudiante.presente ? "#3b82f6" : "#ccc"}
                    />
                </View>
                ))}
            </ScrollView>

            <View style={styles.contenedorBotones}>
                <TouchableOpacity style={[styles.modificar, { opacity: botonModificarActivado ? 1 : 0.5 }]}disabled={!botonModificarActivado}onPress={() => navegacion.navigate('Modificar Asistencia', { idcurso: formData.idcurso })}><Text style={styles.botonTexto}>Modificar</Text></TouchableOpacity>
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
                            <Text key={alumno.dnialumno} style={styles.alumnoItem}>
                                (Nombre: {alumno.nombre + " "}{alumno.apellido}) (DNI: {alumno.dnialumno})
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
        width: '100%',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
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
    modificar: {
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
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    alumnoItem: {
        fontSize: 16,
        marginVertical: 5,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '100%',
    },
    mensajeOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
        zIndex: 10, // Asegura que aparezca sobre otros elementos
    },
    mensajeConfirmacion: {
        backgroundColor: '#28A745',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    mensajeTexto: {
        color: '#FFF',
        fontSize: 16,
        textAlign: 'center',
    },
    lista: {
        height: 50,
        width: '100%',
    },
    cursoConAsistencia: {
        color: '#2b9f7e', // Verde pastel
    },
    cursoSinAsistencia: {
        color: '#000000', // Negro por defecto
    }
    
})