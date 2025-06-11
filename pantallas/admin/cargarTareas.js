import { StyleSheet, View, Image, Text, TextInput,TouchableOpacity, Modal, Switch} from 'react-native';
import React, { useState, useEffect } from 'react';
import bg from '../../assets/bg1.jpg';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import MultiSelect from 'react-native-multiple-select';
import { obtenerRoles, obtenerTareas, obtenerRolesDeTarea, obtenerTareasDeshabilitadas } from '../../scripts/listasDesplegables/listaDesplegable.js';
import { agregarTarea, deshabilitarTarea, habilitarTarea} from '../../scripts/admin/scriptCargarTareas';
import { registrarRolTarea, registrarTareaRol} from '../../scripts/admin/scriptTareasRol';
import { Picker } from '@react-native-picker/picker';

export default function CargarTareas() {
    const [rolesDisponibles, setRolesDisponibles] = useState([]); // Lista de roles disponibles
    const [selectedRoles, setSelectedRoles] = useState([]); // Roles seleccionados
    const [tareasDisponibles, setTareasDisponibles] = useState([]); // Tareas disponibles
    const [selectedTarea, setSelectedTarea] = useState(''); // Tarea seleccionada (para el Picker)
    const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
    const [nuevaTarea, setNuevaTarea] = useState(''); // Estado para almacenar el nombre de la nueva tarea
    const [modalModificarVisible, setModalModificarVisible] = useState(false);
    const [tareasDeshabilitadas, setTareasDeshabilitadas] = useState([]);

    //CARGA LAS TAREAS DENTRO DEL COMBOBOX
    const cargarTareas = async () => {
        try {
            const tareasObtenidas = await obtenerTareas();
            console.log('Tareas obtenidas 123:', tareasObtenidas);

            if (tareasObtenidas && Array.isArray(tareasObtenidas.tareas)) {
                const tareasFormateadas = tareasObtenidas.tareas.map((tareas) => ({
                    key: tareas.id_tarea?.toString(),
                    value: tareas.detalle,
                }));
                setTareasDisponibles(tareasFormateadas); // Guardar las tareas disponibles
            } else {
                console.error('El formato de tareas obtenidas no es válido:', tareasObtenidas);
            }
        } catch (error) {
            console.error('Error al cargar las tareas:', error);
        }
    };

    //CARGA LOS ROLES DENTRO DEL MULTIPLESELECT
    const cargarRoles = async () => {
        try {
            const rolesObtenidos = await obtenerRoles();
            console.log('Roles obtenidos:', rolesObtenidos);
    
            if (rolesObtenidos && Array.isArray(rolesObtenidos)) {
                const rolesFormateados = rolesObtenidos.map((rol) => ({
                    id: rol.id_rol?.toString(), // Clave única para el MultiSelect
                    name: rol.detalle, // Usa `detalle` como el texto visible
                }));
                setRolesDisponibles(rolesFormateados); // Actualiza el estado con los roles formateados
            } else {
                console.error('El formato de roles obtenidos no es válido:', rolesObtenidos);
            }
        } catch (error) {
            console.error('Error al cargar los roles:', error);
        }
    };

    //CARGA TAREAS DESHABILITADAS DENTRO DEL MODAL MODIFICAR
    const cargarTareasDeshabilitadas = async () => {
        try {
            const respuesta = await obtenerTareasDeshabilitadas();
            console.log("Tareas obtenidas:", respuesta);  // Verifica el formato
            setTareasDeshabilitadas(respuesta.tareas || []); // Extrae el array correctamente
        } catch (error) {
            console.error('Error al obtener las tareas deshabilitadas:', error);
        }
    };

    const cargarRolesTareas = async (id_tarea) => {
        try {
            const data = await obtenerRolesDeTarea(id_tarea); // Obtener los roles asociados a la tarea
            console.log('Roles obtenidos para la tarea:', data);
    
            // Verificar si la respuesta es un objeto con la propiedad "roles" que es un array
            if (data && Array.isArray(data.roles)) {
                const rolesSeleccionados = data.roles.map((rol) => rol.id_rol.toString()); // Convertir IDs a strings
                setSelectedRoles(rolesSeleccionados); // Actualizar los roles seleccionados
            } else {
                console.error('El formato de roles obtenidos no es válido:', data);
                setSelectedRoles([]); // Limpiar los roles seleccionados en caso de error
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Si la respuesta es 404, no hay roles asociados, por lo que se limpia el estado
                setSelectedRoles([]);
            } else {
                console.error('Error al obtener los roles de la tarea:', error);
                setSelectedRoles([]); // Limpiar los roles seleccionados en caso de error
            }
        }
    };

    //ES PARA REGISTRARLO
    const cargarRolTarea = async () => {
        if (selectedRoles.length > 0 && selectedTarea) {
            console.log("Roles seleccionados:", selectedRoles);
            console.log("Tarea seleccionada:", selectedTarea);
    
            try {
                // Construir el arreglo de relaciones (ahora con id_tarea fijo y roles variables)
                const relaciones = selectedRoles.map(id_rol => ({
                    id_tarea: parseInt(selectedTarea),
                    id_rol: parseInt(id_rol),
                }));
    
                // Llamar a registrarTareaRol con el arreglo de relaciones
                const result = await registrarRolTarea(relaciones);
    
                // Verificar el mensaje de la respuesta
                if (result && result.mensaje) {
                    console.log(result.mensaje); // Muestra el mensaje de éxito en la consola
                    alert('Todos los roles se asignaron correctamente a la tarea');
                } else {
                    console.error('Hubo un error al registrar las relaciones');
                    alert('Hubo un error al asignar algunos roles');
                }
            } catch (error) {
                console.error('Error al registrar las relaciones:', error);
                alert('Hubo un error al asignar los roles a la tarea');
            }
    
            // Recargar datos después de registrar
            await cargarTareas();
            await cargarRoles();
            await cargarTareasDeshabilitadas();
            await cargarRolesTareas(selectedTarea); // Recargar los roles específicos de esta tarea
        } else {
            alert('Selecciona una tarea y al menos un rol');
        }
    };

    //METODO QUE GESTIONA EL CAMBIO DEL SWITCH
    const toggleSwitch = (idTarea) => {
        setTareasDeshabilitadas((prev) =>
            prev.map((tarea) =>
                tarea.id_tarea === idTarea
                    ? {
                          ...tarea,
                          id_estado_general: tarea.id_estado_general === 1 ? 2 : 1, // Cambia el estado
                      }
                    : tarea
            )
        );
    };

    //Confirma la habilitacion de la tarea
    const handleConfirmarModificacion = async () => {
        try {
            // Filtra las tareas que tienen id_estado_general === 1
            const tareasAHabilitar = tareasDeshabilitadas.filter(
                (tarea) => tarea.id_estado_general === 1
            );
            // Llama a handleHabilitarTarea para cada tarea habilitada
            const resultados = await Promise.all(
                tareasAHabilitar.map((tarea) =>
                    handleHabilitarTarea(tarea.id_tarea)
                )
            );
            console.log('Resultados de habilitar tareas:', resultados);
            alert('Tareas habilitadas exitosamente.');
        } catch (error) {
            console.error('Error al habilitar tareas:', error);
            alert('Ocurrió un error al habilitar las tareas.');
        }
        // Cierra el modal
        setModalModificarVisible(false);
    };


    //CAMBIA EL ESTADO DE LA TAREA SELECCIONADA
    const handleTareaChange = async (itemValue) => {
        setSelectedTarea(itemValue); // Actualizar la tarea seleccionada
        if (itemValue) {
            await cargarRolesTareas(itemValue); // Cargar los roles asociados a la tarea
        } else {
            setSelectedRoles([]); // Si no hay tarea seleccionada, limpiar los roles seleccionados
        }
    };

    //DESHABILITA TAREA
    const eliminarTarea = async () => {
        if (!selectedTarea) {
            alert('Por favor, selecciona una tarea para deshabilitar.');
            return;
        }
        try {
            const respuesta = await deshabilitarTarea(selectedTarea); // selectedTarea es el id_tarea
            if (respuesta) {
                alert('Tarea deshabilitada exitosamente.');
                setTareasDisponibles((prev) => 
                    prev.filter((tarea) => tarea.key !== selectedTarea)
                );
                setSelectedTarea(''); // Limpiar la selección del Picker
            } else {
                alert('Error al deshabilitar la tarea.');
            }
            cargarRoles();
            cargarTareas();
            cargarTareasDeshabilitadas();
        } catch (error) {
            console.error('Error en handleDeshabilitarTarea:', error);
            alert('Ocurrió un error al deshabilitar la tarea.');
        }
    };

    //REGISTRA UNA NUEVA TAREA
    const handleRegistrarTarea = async () => {
        if (nuevaTarea.trim()) {
            try {
                const response = await agregarTarea(nuevaTarea); // Pasar directamente el detalle
                if (response && response.id_tarea) {
                    setTareasDisponibles((prev) => [
                        ...prev,
                        { key: response.id_tarea.toString(), value: nuevaTarea },
                    ]);
                    setNuevaTarea('');
                    setModalVisible(false);
                    cargarRoles();
                    cargarTareas();
                    cargarTareasDeshabilitadas();
                }
            } catch (error) {
                console.error('Error al registrar la tarea:', error);
            }
        }
    };

    //HABILITA TAREA
    const handleHabilitarTarea = async (idTarea) => {
        try {
            const respuesta = await habilitarTarea(idTarea); // Llama a la función que habilita la tarea en la BD
            if (respuesta) {
                console.log('Tarea habilitada exitosamente:', idTarea);
                cargarRoles();
                cargarTareas();
                cargarTareasDeshabilitadas();
                return true;
            } else {
                console.error('Error al habilitar la tarea:', idTarea);
                return false;
            }
        } catch (error) {
            console.error('Error en handleHabilitarTarea:', error);
            return false;
        }
    };
    
    useEffect(() => {
        cargarRoles();
        cargarTareas();
        cargarTareasDeshabilitadas();
    }, []);

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg} />
            <View style={styles.contenido}>
                <Text style={styles.titulo}>Tarea</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedTarea}
                        onValueChange={handleTareaChange}
                        style={styles.inputPicker} // Nuevo estilo para el Picker
                    >
                        <Picker.Item label="Seleccionar Tarea" value="" />
                        {tareasDisponibles.map((tarea) => (
                            <Picker.Item key={tarea.key} label={tarea.value} value={tarea.key} />
                        ))}
                    </Picker>
                    {/* Botón para abrir el modal de agregar tarea */}
                    <TouchableOpacity style={styles.botonAgregar} onPress={() => setModalVisible(true)}>
                        <Text style={styles.textoBotonAgregar}>+</Text>
                    </TouchableOpacity>
                </View>
                <Modal visible={modalVisible} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.titulo}>Nueva Tarea</Text>
                            <TextInput
                                style={styles.inputModal}
                                placeholder="Ingrese nombre de la tarea"
                                value={nuevaTarea}
                                onChangeText={setNuevaTarea}
                            />
                            <View style={styles.botonesModal}>
                                <TouchableOpacity style={styles.botonModal} onPress={handleRegistrarTarea}>
                                    <Text style={styles.textoBotonModal}>Registrar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.botonModalCancelar}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.textoBotonModal}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Text style={styles.subtitulo}>Roles asignables a las Tareas</Text>
                <MultiSelect
                    items={rolesDisponibles} // Lista de roles disponibles
                    uniqueKey="id" // Clave única para cada rol
                    onSelectedItemsChange={setSelectedRoles} // Actualiza los roles seleccionados
                    selectedItems={selectedRoles} // Roles seleccionados
                    selectText="Seleccionar roles"
                    searchInputPlaceholderText="Buscar roles..."
                    displayKey="name" // Clave para mostrar el nombre del rol
                    submitButtonColor="#48d22b"
                    submitButtonText="Seleccionar"
                    styleDropdownMenu={styles.dropdown}
                />
                <Text style={styles.seleccionadas}>
                    Roles seleccionados: {selectedRoles.map(id => {
                        const rol = rolesDisponibles.find(r => r.id === id);
                        return rol ? rol.name : null;
                    }).filter(Boolean).join(', ')}
                </Text>
                <View style={styles.contenidoBoton}>
                    <TouchableOpacity style={styles.botonRegistrar} onPress={cargarRolTarea}>
                        <Text style={styles.textoBoton}>Registrar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botonEliminar} onPress={eliminarTarea} >
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
                                {Array.isArray(tareasDeshabilitadas) &&
                                    tareasDeshabilitadas.map((tarea) => (
                                        <View key={tarea.id_tarea} style={styles.itemContainer}>
                                            <Text style={styles.textoTarea}>{tarea.detalle}</Text>
                                            <Switch
                                                value={tarea.id_estado_general === 1}
                                                onValueChange={() => toggleSwitch(tarea.id_tarea)}
                                            />
                                        </View>
                                    ))}
                                <View style={styles.botonesModal}>
                                    <TouchableOpacity style={styles.botonModalCancelar} onPress={() => setModalModificarVisible(false)}>
                                        <Text>Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.botonModal} onPress={handleConfirmarModificacion}>
                                        <Text>Confirmar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <TouchableOpacity style={styles.botonCancelar}>
                        <Text style={styles.textoBoton}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
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
        marginBottom: 20,
        backgroundColor: '#fafafa',
        width: '100%',
        fontSize: 16,
    },
    dropdown: {
        width: '100%',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fafafa',
        marginBottom: 15,
        padding: 10,
    },
    dropdownText: {
        fontSize: 16,
        color: '#333',
    },
    seleccionadas: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
        fontStyle: 'italic',
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
    botonModificar: {
        backgroundColor: '#CED9EF',
        borderColor: '#746BC8',
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
        marginLeft: 10,
    },
    botonCancelar:{
        backgroundColor: '#DADADA',
        borderColor: '#000000',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        flex: 1,
    },
    textoBoton:{
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%', 
        marginBottom: 20, 
    },
    inputPicker: {
        flex: 1, 
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#fafafa',
        fontSize: 16,
        marginRight: 10, 
    },
    botonAgregar: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        width: 40, 
        height: 40, 
        justifyContent: 'center', 
        alignItems: 'center', 
    },
    textoBotonAgregar: {
        color: '#FFF',
        fontSize: 18,
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
    textoTarea: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
        width: '100%',
    },
});
