import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Alert, Modal, Switch } from 'react-native';
import React, { useState, useEffect } from 'react';
import bg from '../../assets/bg1.jpg';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import MultiSelect from 'react-native-multiple-select';
import { Picker } from '@react-native-picker/picker';
import { obtenerMaterias, obtenerProfesor, registrarMateriaProfesor, obtenerProfesorXMateria, deshabilitarMateria, registrarMateria, obtenerMateriasDeshabilitadas, habilitarMateria } from '../../scripts/admin/scriptGestionMaterias';
import CustomAlert from '../../componente/CustomAlerts';

export default function GestionarMaterias() {
    const [profesores, setProfesores] = useState([]);
    const [selectedProfesores, setSelectedProfesores] = useState([]);
    const [selectedMateria, setSelectedMateria] = useState('');
    const [materias, setMaterias] = useState([]);
    const [resetKey, setResetKey] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [nuevaMateria, setNuevaMateria] = useState('');
    const [modalModificarVisible, setModalModificarVisible] = useState(false);
    const [materiasDeshabilitadas, setMateriasDeshabilitadas] = useState([]);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const mostrarMensaje = (titulo, mensaje) => {
        setAlertTitle(titulo);
        setAlertMessage(mensaje);
        setAlertVisible(true);
    };

    const cargarMaterias = async () => {
        try {
            const materiasObtenidas = await obtenerMaterias();
            if (materiasObtenidas && Array.isArray(materiasObtenidas.materias)) {
                const materiasFormateadas = materiasObtenidas.materias.map((materia) => ({
                    key: materia.id_materia.toString(),
                    value: materia.detalle,
                }));
                setMaterias(materiasFormateadas);
            } else {
                console.error('El formato de materias obtenidas no es válido:', materiasObtenidas);
            }
        } catch (error) {
            console.error('Error al cargar las materias:', error);
        }
    };

    const cargarMateriasDeshabilitadas = async () => {
        try {
            const respuesta = await obtenerMateriasDeshabilitadas();
            console.log("Materias deshabilitadas obtenidas:", respuesta);  // Verifica el formato
            setMateriasDeshabilitadas(respuesta.materias || []); // Extrae el array correctamente
        } catch (error) {
            console.error('Error al obtener las tareas deshabilitadas:', error);
        }
    };

    const cargarProfesores = async () => {
        try {
            // Obtener los datos de los profesores desde la API
            const profesoresObtenidos = await obtenerProfesor();
            // Verificar que los datos obtenidos estén en el formato esperado
            if (profesoresObtenidos && Array.isArray(profesoresObtenidos.profesor)) {
                // Mapear los datos para transformarlos en el formato necesario para MultipleSelectList
                const profesoresFormateados = profesoresObtenidos.profesor.map((profesor) => ({
                    key: profesor.dni_profesor.toString(),  // Asegúrate de que `key` sea un string
                    value: `${profesor.nombre} ${profesor.apellido}`,  // Concatenar el nombre y apellido
                }));
                console.log(profesoresFormateados)
                // Guardar los profesores formateados en el estado
                setProfesores(profesoresFormateados);
            } else {
                console.error('El formato de profesores obtenidos no es válido:', profesoresObtenidos);
            }
            
        } catch (error) {
            console.error('Error al cargar los profesores:', error);
        }
    };

    const cargarMateriaProfesor = async () => {
        if (selectedMateria && selectedProfesores.length > 0) {
            console.log("profesores" + selectedProfesores)
            console.log("materia" + selectedMateria)
            const result = await registrarMateriaProfesor(selectedProfesores, selectedMateria);
            // Verificar el mensaje de la respuesta
            if (result && result.mensaje) {
                alert(result.mensaje);  // Muestra el mensaje de éxito o de error
            } else {
                alert('Hubo un error al registrar la relación');
            }
        } else {
            alert('Selecciona una materia y al menos un profesor');
        }
    };
    const cargarProfesoresPorMateria = async (idMateria) => {
        const data = await obtenerProfesorXMateria(idMateria);
        if (data && data.profesor) {
            const dniProfesores = data.profesor.map(prof => prof.dni_profesor.toString());
            setSelectedProfesores(dniProfesores);  // Actualizar con las claves correctas
        }
    };

    const handleMateriaChange = async (itemValue) => {
        setSelectedMateria(itemValue);  // Actualiza la materia seleccionada
        if (itemValue) {
            await cargarProfesoresPorMateria(itemValue);  // Carga los profesores asignados
        } else {
            setSelectedProfesores([]);  // Si no hay materia seleccionada, limpia la selección
        }
    };

    const handleDeshabilitarMateria = async () => {
        if (!selectedMateria) {
            mostrarMensaje('Advertencia', 'No hay materia seleccionada para deshabilitar.');
            return;
        }
    
        // Verifica si está en un navegador o en una app móvil
        if (typeof window !== 'undefined' && window.confirm) {
            const confirmar = window.confirm("¿Seguro que quiere deshabilitar la materia?");
            if (confirmar) {
                try {
                    const respuesta = await deshabilitarMateria(selectedMateria);
                    if (respuesta && respuesta.mensaje) {  // Verifica el campo "mensaje"
                        setSelectedMateria(null);
                        setSelectedProfesores([]);
                        console.log("Materia deshabilitada correctamente");
                        cargarMaterias();
                        cargarProfesores();
                        cargarMateriasDeshabilitadas();
                        alert(respuesta.mensaje);  // Muestra el mensaje de éxito del backend
                    } else {
                        throw new Error("Error al deshabilitar la materia");
                    }
                } catch (error) {
                    console.error("Error al deshabilitar la materia:", error);
                    alert("Error al deshabilitar la materia");  // Mensaje de error
                }
            } else {
                console.log("Operación cancelada");
            }
        } else {
            Alert.alert(
                "Confirmación",
                "¿Seguro que quiere deshabilitar la materia?",
                [
                    {
                        text: "Cancelar",
                        onPress: () => console.log("Cancelado"),
                        style: "cancel"
                    },
                    {
                        text: "Confirmar",
                        onPress: async () => {
                            try {
                                const respuesta = await deshabilitarMateria(selectedMateria);
                                if (respuesta && respuesta.mensaje) {  // Verifica el campo "mensaje"
                                    setSelectedMateria(null);
                                    setSelectedProfesores([]);
                                    console.log("Materia deshabilitada correctamente");
                                    mostrarMensaje('Exito', 'Materia deshabilitada correctamente.');
                                } else {
                                    throw new Error("Error al deshabilitar la materia");
                                }
                            } catch (error) {
                                console.error("Error al deshabilitar la materia:", error);
                                mostrarMensaje('Error', 'Error al deshabilitada la materia.');
                            }
                        }
                    }
                ]
            );
        }
    };

    const handleRegistrarMateria = async () => {
        if (!nuevaMateria.trim()) {
            mostrarMensaje('Advertencia', 'El nombre de la materia es obligatorio.');

            return;
        }
        try {
            const response = await registrarMateria(nuevaMateria);
            if (response) {
                console.log('Materia registrada con éxito:', response);
                setModalVisible(false);
                setNuevaMateria('');
                cargarMaterias();
                cargarProfesores();
                cargarMateriasDeshabilitadas();
                mostrarMensaje('Exito', 'Materia registrada exitosamente.');
            } else {
                console.error('Error al registrar la materia');
            }
        } catch (error) {
            console.error('Error al registrar la materia:', error);
            mostrarMensaje('Error', 'Error al registrar la materia.');

        }
    };

    const handleHabilitarMateria = async (idMateria) => {
        try {
            const respuesta = await habilitarMateria(idMateria); // Llama a la función que habilita la materia en la BD
            if (respuesta) {
                console.log('Materia habilitada exitosamente:', idMateria);
                cargarMaterias();
                cargarProfesores();
                cargarMateriasDeshabilitadas();
                return true;
            } else {
                console.error('Error al habilitar la materia:', idMateria);
                return false;
            }
        } catch (error) {
            console.error('Error en handleHabilitarMateria:', error);
            return false;
        }
    };

    const handleConfirmarModificacion = async () => {
        try {
            // Filtra las materias que tienen id_estadoalumno === 1
            const materiasAHabilitar = materiasDeshabilitadas.filter(
                (materia) => materia.id_estadoalumno === 1
            );
    
            // Llama a handleHabilitarMateria para cada materia habilitada
            const resultados = await Promise.all(
                materiasAHabilitar.map((materia) =>
                    handleHabilitarMateria(materia.id_materia)
                )
            );
            cargarMaterias();
            cargarProfesores();
            cargarMateriasDeshabilitadas();
            console.log('Resultados de habilitar materias:', resultados);
            alert('Materias habilitadas exitosamente.');
        } catch (error) {
            console.error('Error al habilitar materias:', error);
            alert('Ocurrió un error al habilitar las materias.');
        }
    
        // Cierra el modal
        setModalModificarVisible(false);
    };

    // Función para cambiar el estado de una materia
    const toggleSwitch = (id_materia) => {
        setMateriasDeshabilitadas((prevMaterias) =>
            prevMaterias.map((materia) =>
                materia.id_materia === id_materia
                    ? {
                          ...materia,
                          id_estadoalumno: 1, // Cambia el estado a 1
                      }
                    : materia
            )
        );
    };
    
    const limpiarInterfaz = () => {
        setSelectedMateria("");
        setSelectedProfesores([]);
        setResetKey(prevKey => prevKey + 1);  // Cambiar la clave para reiniciar el componente
    };

    useEffect(() => { 
        cargarMaterias();
        cargarProfesores();
        cargarMateriasDeshabilitadas();
        
    }, []);
    useEffect(() => {
        console.log("hola" + materiasDeshabilitadas)
    }, [materiasDeshabilitadas]);    

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg} />
            <View style={styles.contenido}>
                <Text style={styles.titulo}>Materias</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedMateria}
                        onValueChange={handleMateriaChange}
                        style={styles.input}
                    >
                        <Picker.Item label="Seleccionar Materia" value="" />
                        {materias.map((materia) => (
                            <Picker.Item key={materia.key} label={materia.value} value={materia.key} />
                        ))}
                    </Picker>
                    <TouchableOpacity style={styles.botonAgregar} onPress={() => setModalVisible(true)}>
                        <Text style={styles.textoBotonAgregar}>+</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.subtitulo}>Profesores asignables a la Materia</Text>
                <MultiSelect
                    items={profesores}
                    uniqueKey="key"
                    onSelectedItemsChange={(selectedItems) => setSelectedProfesores(selectedItems)}
                    selectedItems={selectedProfesores}
                    selectText="Seleccionar Profesores"
                    searchInputPlaceholderText="Buscar..."
                    tagRemoveIconColor="#CCC"
                    tagBorderColor="#CCC"
                    tagTextColor="#CCC"
                    selectedItemTextColor="#CCC"
                    selectedItemIconColor="#CCC"
                    itemTextColor="#000"
                    displayKey="value"
                    searchInputStyle={{ color: '#CCC' }}
                    submitButtonColor="#CCC"
                    submitButtonText="Seleccionar"
                />
                <Text style={styles.seleccionadas}>Profesores seleccionados: {selectedProfesores.join(', ')}</Text>
                <View style={styles.contenidoBoton}>
                    <TouchableOpacity style={styles.botonRegistrar} onPress={cargarMateriaProfesor}>  {/* Llamar a registrar cuando se hace clic */}
                        <Text style={styles.textoBoton}>Registrar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botonEliminar} onPress={handleDeshabilitarMateria}>
                        <Text style={styles.textoBoton}>Eliminar</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.contenidoBoton}>
                    <TouchableOpacity style={styles.botonModificar} onPress={() => setModalModificarVisible(true)}>
                        <Text style={styles.textoBoton}>Modificar</Text>
                    </TouchableOpacity>

                    <Modal visible={modalModificarVisible} transparent={true} animationType="slide">
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                {Array.isArray(materiasDeshabilitadas) && materiasDeshabilitadas.length > 0 ? (
                                    materiasDeshabilitadas.map((materia) => (
                                        <View key={materia.id_materia} style={styles.itemContainer}>
                                            <Text style={styles.textoTarea}>{materia.detalle}</Text>
                                            <Switch
                                                value={materia.id_estadoalumno === 1}
                                                onValueChange={() => toggleSwitch(materia.id_materia)}
                                            />
                                        </View>
                                    ))
                                ) : (
                                    <Text>No hay materias deshabilitadas.</Text>
                                )}
                                <View style={styles.botonesModal}>
                                    <TouchableOpacity
                                        style={styles.botonModalCancelar}
                                        onPress={() => setModalModificarVisible(false)}
                                    >
                                        <Text>Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.botonModal}
                                        onPress={handleConfirmarModificacion}
                                    >
                                        <Text>Confirmar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <TouchableOpacity style={styles.botonCancelar} onPress={limpiarInterfaz}>
                        <Text style={styles.textoBoton}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.titulo}>Nueva Materia</Text>
                        <TextInput
                            style={styles.inputModal}
                            placeholder="Ingrese nombre de la materia"
                            value={nuevaMateria}
                            onChangeText={setNuevaMateria}
                        />
                        <View style={styles.botonesModal}>
                            <TouchableOpacity style={styles.botonModal} onPress={handleRegistrarMateria}>
                                <Text style={styles.textoBotonModal}>Registrar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.botonModalCancelar} onPress={() => setModalVisible(false)}>
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
}

const styles = StyleSheet.create({
    padre: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
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
    contenido: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center',
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    subtitulo: {
        fontSize: 18,
        marginBottom: 10,
        color: '#333',
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#fafafa',
        width: '100%',
        fontSize: 16,
    },
    seleccionadas: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
        fontStyle: 'italic',
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    botonAgregar: {
        marginLeft: 10,
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
    },
    textoBotonAgregar: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    contenidoBoton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '85%',
    },
    botonRegistrar: {
        backgroundColor: '#CFEFCE',
        borderColor: '#33FF00',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        flex: 1
    }
});