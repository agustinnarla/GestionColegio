import { StyleSheet, View, Image, Text, TextInput,TouchableOpacity, Alert, Modal } from 'react-native';
import React, { useState , useEffect} from 'react';
import bg from '../../assets/bg1.jpg';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import MultiSelect from 'react-native-multiple-select';
import { Picker } from '@react-native-picker/picker';
import { obtenerMaterias, obtenerProfesor, registrarMateriaProfesor, obtenerProfesorXMateria, deshabilitarMateria, registrarMateria } from '../../scripts/admin/scriptGestionMaterias';


export default function GestionarMaterias() {
    const [profesores, setProfesores] = useState([]);
    const [selectedProfesores, setSelectedProfesores] = useState([]);
    const [selectedMateria, setSelectedMateria] = useState('');
    const [materias, setMaterias] = useState([]);
    const [resetKey, setResetKey] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [nuevaMateria, setNuevaMateria] = useState('');


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
            console.warn("No hay materia seleccionada para deshabilitar.");
            return;
        }
    
        // Verifica si está en un navegador o en una app móvil
        if (typeof window !== 'undefined' && window.confirm) {
            const confirmar = window.confirm("¿Seguro que quiere deshabilitar la materia?");
            if (confirmar) {
                try {
                    const respuesta = await deshabilitarMateria(selectedMateria);
                    if (respuesta && respuesta.ok) {
                        setSelectedMateria(null);
                        setSelectedProfesores([]);
                        console.log("Materia deshabilitada correctamente");
                    } else {
                        throw new Error("Error al deshabilitar la materia");
                    }
                } catch (error) {
                    console.error("Error al deshabilitar la materia:", error);
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
                                if (respuesta && respuesta.ok) {
                                    setSelectedMateria(null);
                                    setSelectedProfesores([]);
                                    console.log("Materia deshabilitada correctamente");
                                } else {
                                    throw new Error("Error al deshabilitar la materia");
                                }
                            } catch (error) {
                                console.error("Error al deshabilitar la materia:", error);
                            }
                        }
                    }
                ]
            );
        }
    };

    const handleRegistrarMateria = async () => {
        if (!nuevaMateria.trim()) {
            console.warn('El nombre de la materia es obligatorio');
            return;
        }
    
        try {
            const response = await registrarMateria(nuevaMateria);
            if (response) {
                console.log('Materia registrada con éxito:', response);
                setModalVisible(false);
                setNuevaMateria('');
                cargarMaterias();
            } else {
                console.error('Error al registrar la materia');
            }
        } catch (error) {
            console.error('Error al registrar la materia:', error);
        }
    };
    
    
    
    const limpiarInterfaz = () => {
        setSelectedMateria("");
        setSelectedProfesores([]);
        setResetKey(prevKey => prevKey + 1);  // Cambiar la clave para reiniciar el componente
    };

    useEffect(() => { 
        cargarMaterias();
        cargarProfesores();
    }, []);
    useEffect(() => {
        console.log('Profesores seleccionados:', selectedProfesores);
        console.log('Profesores:', profesores);
    }, [selectedProfesores]);    

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
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        marginLeft: 10,
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
        flex: 1,
        marginRight: 10,
    },
    botonEliminar: {
        backgroundColor: '#F3B9B9',
        borderColor: '#FF0000',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        flex: 1,
    },
    botonCancelar: {
        backgroundColor: '#DADADA',
        borderColor: '#000000',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        flex: 1,
    },
    textoBoton: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    inputModal: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        width: '100%',
        padding: 10,
        marginBottom: 20,
        fontSize: 16,
    },
    botonesModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    botonModal: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    botonModalCancelar: {
        backgroundColor: '#F44336',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    textoBotonModal: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

