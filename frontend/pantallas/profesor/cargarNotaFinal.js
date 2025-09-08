import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList,ImageBackground, TextInput, ScrollView, Modal, Alert} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import React, { useState, useEffect, useMemo } from "react";
import bg from '../../assets/bg1.jpg';
import { agregarNota, modificarEstadoEvaluativo } from '../../scripts/profesor/scriptCargarNotaFinal';
import { obtenerCursoPorMateria, obtenerAlumnosNoRegulares,  obtenerMateriaPorProfesor } from '../../scripts/listasDesplegables/listaDesplegable';
import CustomAlert from '../../componente/CustomAlerts';

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
    const [selectKey, setSelectKey] = useState(0);

   

    //🟢 Estado del Mensaje
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [enviando, setEnviando] = useState(false);

    //🟢 Mensaje 
    const mostrarMensaje = (titulo, mensaje) => {
        setAlertTitle(titulo);
        setAlertMessage(mensaje);
        setAlertVisible(true);
    };

    const { dni_usuario } = route.params;

    if (!dni_usuario) {
        console.error('DNI Usuario no definido');
        return <Text>Error: DNI Usuario no definido</Text>;
    }

    console.log('DNI Usuario:', dni_usuario);

    

    const reiniciarFiltro = () => {
    setCursosSeleccionados([]);
    setMateriasSeleccionadas([]);
    setDatos([]);
    setNotas({});
    setNotasAEnviar([]);
    setModalVisible(false);
    setSelectKey(prev => prev + 1); 
    };

    const dni_profesional = dni_usuario
    
    


// 🟢 Cargar materias al cambiar cursoSeleccionado
    useEffect(() => {
        const cargarMateriasPorProfesor = async () => {
        
            try {
                const data = await obtenerMateriaPorProfesor(dni_profesional);
                console.log("MATERIAS RECIBIDAS:", data);

                if (Array.isArray(data)) { 
                    const materiasFormateadas = data.map(m => ({
                        key: m.id_materia.toString(),
                        value: m.detalle
                    }));
                    setMaterias(materiasFormateadas);
                } else {
                    console.error("La respuesta no es un array:", data);
                    setMaterias([]);
                }

            } catch (error) {
                console.error("Error al cargar materias:", error);
            }
        };

        cargarMateriasPorProfesor();

    }, [dni_profesional]);
    
    // 🟢 Cargar cursos una sola vez
   useEffect(() => {
    const cargarCursosPorMateria = async () => {
        try {
            const data = await obtenerCursoPorMateria(materiasSeleccionadas);
            console.log("CURSOS RECIBIDOS:", data);

            const cursosArray = Array.isArray(data) ? data : data.cursos || [];
            setCursos(cursosArray);
        } catch (error) {
            console.error("Error al cargar cursos del profesor:", error);
            setCursos([]);
        }
    };

    if (materiasSeleccionadas.length > 0) {
        cargarCursosPorMateria();
    } else {
        setCursos([]);
    }
}, [materiasSeleccionadas]);

console.log("Cursos seleccionados:", cursosSeleccionados);
console.log("Materias seleccionadas:", materiasSeleccionadas);
   const validarListas = () => {
    return cursosSeleccionados.length > 0 && materiasSeleccionadas.length > 0;
    };

const cargarAlumnosFiltrados = async () => {
        try {
            // Validar que los arrays no estén vacíos y que los valores sean válidos
            const materiaId = materiasSeleccionadas[0];
            const cursoId = cursosSeleccionados[0];
            
            if (!materiaId || !cursoId) {
                console.error("IDs inválidos:", { materiaId, cursoId });
                mostrarMensaje("Error", "Debe seleccionar una materia y un curso válidos");
                return;
            }
            
            const respuesta = await obtenerAlumnosNoRegulares(cursoId, materiaId);
            const todosLosAlumnos = respuesta.alumnos || []; // Accede a la propiedad "alumnos" o usa un array vacío si no está definido
            console.log("Respuesta de obtenerAlumnosNoRegulares:", respuesta);
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
            mostrarMensaje("Error", "No se pudieron cargar los datos filtrados");
        }
    };

     const consultarAlumnos = () => {
        console.log("Consultando datos con filtros:");
        console.log("Cursos seleccionados:", cursosSeleccionados);
        console.log("Materias seleccionadas:", materiasSeleccionadas);
        cargarAlumnosFiltrados(); // Llama al método que aplica el filtro
    };

    const handleNotaChange = (idAlumno, idMateria, valorNota) => {
        const key = `${idAlumno}-${idMateria}`;
        setNotas(prevState => ({
            ...prevState,
            [key]: {
                nota_final: valorNota.replace(/\s+/g, '') // Quitar espacios
            }
        }));
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
                    nombre: alumno.nombre 
                };
            })
            .filter(Boolean);
    
        console.log("Notas modificadas para enviar:", notasParaEnviar);
    
        if (notasParaEnviar.length === 0) {
            mostrarMensaje("Aviso", "No hay notas modificadas para enviar.");
            return;
        }
    
        const algunaNotaInvalida = notasParaEnviar.some(nota => {
            return isNaN(nota.nota_final) || nota.nota_final < 1 || nota.nota_final > 10;
        });
    
        if (algunaNotaInvalida) {
            mostrarMensaje("Error", "Verifica que todas las notas estén entre 1 y 10.");
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
                mostrarMensaje('Exito', 'Se registró la nota final correctamente')
            } else {
                mostrarMensaje("Error", "Al registrar la nota final");
            }
    
            setModalVisible(false);
            // Recargar datos
            cargarAlumnosFiltrados();
            reiniciarFiltro();
        } catch (error) {
            console.error("Error en confirmarEnvio:", error);
            mostrarMensaje("Error", "Ocurrió un problema al enviar las notas");
        }
    };

    const cargarGrilla = ({ item }) => {
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
                    

                    <View style={styles.filtroGroup}>
                    <MultipleSelectList
                        key={selectKey} 
                            setSelected={setMateriasSeleccionadas}
                            selected={materiasSeleccionadas}
                            data={materias}
                            save="key"
                            label="Materias"
                            placeholder="Seleccionar materias"
                            boxStyles={styles.dropdown}
                            dropdownTextStyles={styles.dropdownText}
                        />
                    </View>
                    <MultipleSelectList
    key={selectKey}
    setSelected={setCursosSeleccionados}
    selected={cursosSeleccionados}
    data={cursos.map(curso => ({
        key: curso.id_curso?.toString() || '',
        value: curso.detalle || 'Sin detalle'
    }))}
    save="key"
    label="Cursos"
    placeholder="Seleccionar cursos"
    boxStyles={styles.dropdown}
    dropdownTextStyles={styles.dropdownText}
/>
                    </View>
                    <View style={styles.botonesContainer}>
                        <TouchableOpacity style={[styles.botonConsultar, !validarListas() && styles.botonDeshabilitado]} onPress={consultarAlumnos} disabled={!validarListas()}>
                            <Text style={styles.textoBoton}>Consultar</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={[styles.botonReiniciar]} onPress={reiniciarFiltro} >
                            <Text style={styles.textoBoton}>Reiniciar Filtros</Text>
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
                                renderItem={cargarGrilla}
                                keyExtractor={(item) => `${item.id}-${item.id_materia}`}
                                scrollEnabled={false}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.botonEnviar}
                            onPress={prepararEnvio}>
                            <Text style={styles.textoBotonEnviar}>Registrar</Text>
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
                                style={[styles.botonReiniciar, styles.botonReiniciar]}
                                onPress={() => setModalVisible(false)}>
                                <Text style={styles.textoBoton}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.botonEnviar, styles.botonConsultar]}
                                onPress={confirmarEnvio}>
                                <Text style={styles.textoBoton}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            </ImageBackground>
            <CustomAlert
            isVisible={alertVisible}
            onClose={() => setAlertVisible(false)}
            title={alertTitle}
            message={alertMessage}
            showSpinner={enviando}
        />
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
        width: '100%',
        height: '100%',
        zIndex: -1,
    },
    scrollContainer: {
        padding: 0,
        alignItems: 'center',
        minHeight: '100%',
    },
    botonDeshabilitado: {
        opacity: 0.5,
        backgroundColor: '#cccccc',
        borderColor: '#999999',
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
        backgroundColor: '#CED9EF',
    borderColor: '#0500FF',
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
        minWidth: 120,
    },
    botonReiniciar: {
          backgroundColor: '#DADADA',
        borderColor: '#000000',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
        minWidth: 120,
    },
    botonEnviar: {
        
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
    textoBoton: {
        color: '#2a3d6c',
        fontSize: 16,
        fontWeight: 'bold',
    },
    textoBotonEnviar: {
        color: '#2a3d6c',
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