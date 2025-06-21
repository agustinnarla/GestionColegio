import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList,ImageBackground, TextInput, ScrollView, Modal, Alert} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import React, { useState, useEffect } from "react";
import bg from '../../assets/bg1.jpg';
import { agregarNota, modificarEstadoEvaluativo } from '../../scripts/profesor/scriptCargarNotaFinal';
import { obtenerCursoPorProfesor, obtenerMateriasPorProfesor, obtenerAlumnosNoRegulares } from '../../scripts/listasDesplegables/listaDesplegable';


export default function CargarNotasFinal({route}) {
    const [datos, setDatos] = useState([]);
    const [notas, setNotas] = useState({});
    const [rolesSeleccionados, setRolesSeleccionados] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [cursosSeleccionados, setCursosSeleccionados] = useState([]); // Estado para los cursos seleccionados
    const [cursoSeleccionado, setCursoSeleccionado] = useState(null); // Estado para un curso único seleccionado
    const [materias, setMaterias] = useState([]);
    const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
    const [materiasSeleccionadas, setMateriasSeleccionadas] = useState([]); // Debe contener los ID de las materias seleccionadas    const [modalVisible, setModalVisible] = useState(false);
    const [notasAEnviar, setNotasAEnviar] = useState([]);

    const consultarDatos = () => {
        console.log("Consultando datos con filtros:");
        console.log("Cursos seleccionados:", cursosSeleccionados);
        console.log("Materias seleccionadas:", materiasSeleccionadas);
        cargarAlumnosFiltrados(); // Llama al método que aplica el filtro
    };

    const { dni_usuario } = route.params;

    if (!dni_usuario) {
        console.error('DNI Usuario no definido');
        return <Text>Error: DNI Usuario no definido</Text>;
    }

    console.log('DNI Usuario:', dni_usuario);

    const cargarAlumnosFiltrados = async () => {
        try {
            const respuesta = await obtenerAlumnosNoRegulares(dni_usuario);
            const todosLosAlumnos = respuesta.alumnos || []; // Accede a la propiedad "alumnos" o usa un array vacío si no está definido
    
            console.log("Todos los alumnos:", todosLosAlumnos); // Verifica el formato aquí
    
            if (!Array.isArray(todosLosAlumnos)) {
                throw new Error("El formato de todosLosAlumnos no es un array");
            }
    
            // Filtrar localmente según las selecciones
            const alumnosFiltrados = todosLosAlumnos.filter(alumno => {
                const cumpleCurso = cursosSeleccionados.length === 0 || 
                                    cursosSeleccionados.includes(alumno.id_curso?.toString());
                const cumpleMateria = materiasSeleccionadas.length === 0 || 
                                      materiasSeleccionadas.includes(alumno.id_materia?.toString());
                return cumpleCurso && cumpleMateria; // Filtra por curso y materia
            });
    
            console.log("Alumnos filtrados:", alumnosFiltrados);
    
            // Mapear los datos al formato necesario
            const datosFiltrados = alumnosFiltrados.map((alumno) => ({
                id: alumno.dni_alumno?.toString(),
                id_materia: alumno.id_materia?.toString(),
                materia: alumno.detalle_materia,
                nombre: `${alumno.nombre} ${alumno.apellido}`,
                curso: alumno.detalle_curso,
                id_curso: alumno.id_curso?.toString()
            }));
    
            setDatos(datosFiltrados); // Actualiza el estado con los datos filtrados
            console.log("Datos filtrados:", datosFiltrados); // Verifica los datos filtrados
        } catch (error) {
            console.error("Error al cargar alumnos filtrados:", error);
            Alert.alert("Error", "No se pudieron cargar los datos filtrados");
        }
    };

    const reiniciarFiltro = () => {
        setCursosSeleccionados([]);
        setMateriasSeleccionadas([]);

    };

    const cargarCursosPorProfesor = async () => {
        try {
            const data = await obtenerCursoPorProfesor(dni_usuario);
            console.log("DATA RECIBIDA:", data);
            setCursos(data.cursos);
        } catch (error) {
            console.error("Error al cargar cursos del profesor:", error);
        }
    };
    
    const cargarMateriasPorProfesor = async () => {
        try {
            const data = await obtenerMateriasPorProfesor(dni_usuario);
            console.log("MATERIAS RECIBIDAS:", data);
    
            if (data && data.materias) {
                const materiasFormateadas = data.materias.map(materia => ({
                    key: materia.id_materia.toString(), // Clave única para el MultipleSelectList
                    value: materia.detalle // Nombre de la materia
                }));
                setMaterias(materiasFormateadas); // Actualiza el estado con las materias formateadas
            }
        } catch (error) {
            console.error("Error al cargar materias del profesor:", error);
        }
    };

    useEffect(() => {
        if (dni_usuario && cursos.length === 0 && materias.length === 0) {
            cargarCursosPorProfesor();
            cargarMateriasPorProfesor();
        }
    }, [dni_usuario]);
    
    
    const handleNotaChange = (idAlumno, idMateria, valorNota) => {
        const key = `${idAlumno}-${idMateria}`;
        setNotas(prevState => ({
            ...prevState,
            [key]: {
                nota_final: valorNota.replace(/\s+/g, '') // Quitar espacios
            }
        }));
    };

    const handleCursoChange = (curso) => {
        setCursoSeleccionado(curso); // Actualiza el estado del curso seleccionado
        console.log("Curso seleccionado:", curso);
    };

    const prepararEnvio = () => {
        const notasParaEnviar = datos
            .map(alumno => {
                const key = `${alumno.id}-${alumno.id_materia}`;
                const notaActual = notas[key]?.nota_final?.trim() || '';
    
                if (notaActual === '' || notaActual === alumno.nota_original) {
                    return null;
                }
    
                return {
                    id_curso: alumno.id_curso,
                    id_materia: alumno.id_materia,
                    dni_profesional: dni_usuario,
                    dni_alumno: alumno.id,
                    nota_final: Number(notaActual),
                    nombre: alumno.nombre // 👉 agregamos nombre para mostrarlo en errores
                };
            })
            .filter(Boolean);
    
        console.log("Notas modificadas para enviar:", notasParaEnviar);
    
        if (notasParaEnviar.length === 0) {
            Alert.alert("Aviso", "No hay notas modificadas para enviar.");
            return;
        }
    
        const algunaNotaInvalida = notasParaEnviar.some(nota => {
            return isNaN(nota.nota_final) || nota.nota_final < 1 || nota.nota_final > 10;
        });
    
        if (algunaNotaInvalida) {
            Alert.alert("Error", "Verifica que todas las notas estén entre 1 y 10.");
            return;
        }
    
        setNotasAEnviar(notasParaEnviar);
        setModalVisible(true);
    };
    
    

    const confirmarEnvio = async () => {
        try {
            const resultados = [];
            const errores = [];
    
            for (const nota of notasAEnviar) {
                try {
                    // Validar que todos los campos están presentes
                    if (!nota.id_curso || !nota.id_materia || !nota.dni_profesional || !nota.dni_alumno || nota.nota_final === undefined || !nota.nombre) {
                        throw new Error('Faltan campos requeridos');
                    }
            
                    // Convertir los valores al tipo correcto
                    const notaParaEnviar = {
                        id_curso: Number(nota.id_curso), // Convertir a número
                        id_materia: Number(nota.id_materia), // Convertir a número
                        dni_profesional: String(nota.dni_profesional), // Asegurarse de que sea cadena
                        dni_alumno: String(nota.dni_alumno), // Asegurarse de que sea cadena
                        nota_final: Number(nota.nota_final) // Convertir a número
                    };
            
                    // Enviar nota al backend
                    console.log(notaParaEnviar)
                    const resultado = await agregarNota(notaParaEnviar);
                    resultados.push(resultado);
            
                    // Actualizar estado evaluativo
                    await modificarEstadoEvaluativo({
                        dni_alumno: notaParaEnviar.dni_alumno,
                        id_materia: notaParaEnviar.id_materia
                    });
                } catch (error) {
                    const errorMsg = `Error al procesar nota para ${nota.nombre || 'undefined'}: ${error.message}`;
                    console.error(errorMsg);
                    errores.push(errorMsg);
                }
            }
    
            // Mostrar resumen de operación
            if (resultados.length > 0) {
                let mensaje = `Se enviaron ${resultados.length} notas correctamente`;
                if (errores.length > 0) {
                    mensaje += `\n\nErrores (${errores.length}):\n${errores.join('\n')}`;
                }
                Alert.alert("Éxito", mensaje);
            } else {
                Alert.alert("Error", "No se pudo enviar ninguna nota");
            }
    
            setModalVisible(false);
            // Recargar datos
            cargarAlumnosFiltrados();
        } catch (error) {
            console.error("Error en confirmarEnvio:", error);
            Alert.alert("Error", "Ocurrió un problema al enviar las notas");
        }
    };
    const renderItem = ({ item }) => {
        const key = `${item.id}-${item.id_materia}`;
        const nota = notas[key] || { nota_final: '' };
        
        return (
            <View style={styles.fila}>
                <Text style={styles.celda}>{item.materia}</Text>
                <Text style={styles.celda}>{item.nombre}</Text>
                <Text style={styles.celda}>{item.curso}</Text>
                <View style={styles.celdaInputContainer}>
                    <TextInput
                        style={styles.inputNota}
                        keyboardType="numeric"
                        placeholder="Nota"
                        value={nota.nota_final}
                        onChangeText={valorNota => handleNotaChange(item.id, item.id_materia, valorNota)}
                        maxLength={3}
                    />
            </View>
            </View>
        );
    };

    return (
        <View style={styles.padre}>
            <ImageBackground source={bg} style={styles.bg}>
            
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.filtrosContainer}>
                    <View style={styles.filtroGroup}>
                    <MultipleSelectList
                            setSelected={(val) => {
                                console.log("Cursos seleccionados:", val);
                                setCursosSeleccionados(val); // Actualiza el estado con los cursos seleccionados
                            }}
                            data={cursos.map(curso => ({
                                key: curso.id_curso?.toString() || '', // Clave única para cada curso
                                value: curso.detalle || 'Sin detalle' // Nombre del curso
                            }))}
                            save="key"
                            label="Cursos"
                            placeholder="Seleccionar cursos"
                            boxStyles={styles.dropdown}
                            dropdownTextStyles={styles.dropdownText}
                        />
                    </View>

                    <View style={styles.filtroGroup}>
                    <MultipleSelectList
                        setSelected={(val) => {
                            console.log("Materias seleccionadas:", val);
                            setMateriasSeleccionadas(val); // Actualiza el estado con los ID de las materias seleccionadas
                        }}
                        data={materias} // Usa el estado `materias` directamente
                        save="key" // Clave que se guardará en el estado
                        label="Materias"
                        placeholder="Seleccionar materias"
                        boxStyles={styles.dropdown}
                        dropdownTextStyles={styles.dropdownText}
                    />
                    </View>
                    <View style={styles.botonesContainer}>
                        <TouchableOpacity style={styles.botonConsultar} onPress={consultarDatos}>
                            <Text style={styles.textoBoton}>Consultar</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.botonReiniciar} onPress={reiniciarFiltro}>
                            <Text style={styles.textoBoton}>Reiniciar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
                {datos.length > 0 && (
                    <>
                        <View style={styles.grillaContainer}>
                        <View style={styles.encabezado}>
                            <Text style={styles.celdaEncabezado}>Materia</Text>
                            <Text style={styles.celdaEncabezado}>Nombre</Text>
                            <Text style={styles.celdaEncabezado}>Curso</Text>
                            <Text style={styles.celdaEncabezado}>Nota Final</Text>
                        </View>
                            <FlatList
                                data={datos}
                                renderItem={renderItem}
                                keyExtractor={(item) => `${item.id}-${item.id_materia}`}
                                scrollEnabled={false}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.botonEnviar}
                            onPress={prepararEnvio}>
                            <Text style={styles.textoBotonEnviar}>ENVIAR DATOS</Text>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>

            {/* Modal de confirmación */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitulo}>Confirmar Envío</Text>
                        <Text style={styles.modalSubtitulo}>¿Estás seguro que deseas enviar estas notas?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={confirmarEnvio}>
                                <Text style={styles.modalButtonText}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    padre: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    bg: {
        flex: 1,
    },
    scrollContainer: {
        padding: 0,
        alignItems: 'center',
        minHeight: '100%',
    },
    filtrosContainer: {
        width: '100%',
        maxWidth: 900,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 28,
        marginTop: 36,
        marginBottom: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10,
        shadowRadius: 12,
        elevation: 6,
        alignSelf: 'center',
    },
    filtroGroup: {
        marginBottom: 18,
    },
    dropdown: {
        backgroundColor: '#f9f9f9',
        borderColor: '#b6c6e0',
        borderWidth: 1.5,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 8,
    },
    dropdownText: {
        fontSize: 16,
        color: '#2a3d6c',
    },
    botonesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 14,
        marginTop: 10,
    },
    botonConsultar: {
        backgroundColor: '#e8f5e9',
        borderColor: '#4caf50',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#CED9EF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 4,
        minWidth: 120,
        alignItems: 'center',
        marginRight: 8,
    },
    botonReiniciar: {
        backgroundColor: '#ffebee',
        borderColor: '#f44336',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#f44336',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 4,
        minWidth: 120,
        alignItems: 'center',
        marginLeft: 8,
    },
    botonEnviar: {
        backgroundColor: '#746BC8',
        borderColor: '#4b3bbd',
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 10,
        marginTop: 24,
        alignItems: 'center',
        alignSelf: 'center',
        elevation: 3,
        shadowColor: '#CED9EF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 4,
        minWidth: 180,
    },
    textoBoton: {
        color: '#2a3d6c',
        fontSize: 16,
        fontWeight: 'bold',
    },
    textoBotonEnviar: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    grillaContainer: {
        width: '100%',
        maxWidth: 900,
        backgroundColor: '#fff',
        borderRadius: 16,
        marginTop: 18,
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10,
        shadowRadius: 12,
        elevation: 6,
        alignSelf: 'center',
        overflow: 'hidden',
    },
    encabezado: {
        flexDirection: 'row',
        backgroundColor: '#f0f7ff',
        paddingVertical: 14,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    celdaEncabezado: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15,
        color: '#2a3d6c',
        paddingHorizontal: 6,
    },
    fila: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    celda: {
        flex: 1,
        textAlign: 'center',
        fontSize: 15,
        color: '#374151',
        paddingHorizontal: 6,
        justifyContent: 'center',
    },
    celdaInputContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputNota: {
        width: 70,
        height: 38,
        borderWidth: 1.5,
        borderColor: '#b6c6e0',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        textAlign: 'center',
        fontSize: 16,
        color: '#2a3d6c',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 28,
        borderRadius: 14,
        width: '90%',
        maxWidth: 400,
        alignItems: 'center',
    },
    modalTitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#2a3d6c',
    },
    modalSubtitulo: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        color: '#374151',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
        gap: 10,
    },
    modalButton: {
        padding: 12,
        borderRadius: 8,
        width: '48%',
        alignItems: 'center',
    },
    confirmButton: {
        backgroundColor: '#4CAF50',
    },
    cancelButton: {
        backgroundColor: '#f44336',
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});