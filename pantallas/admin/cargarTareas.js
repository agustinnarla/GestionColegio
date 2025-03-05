import { StyleSheet, View, Image, Text, TextInput,TouchableOpacity, Modal, Switch} from 'react-native';
import React, { useState, useEffect } from 'react';
import bg from '../../assets/bg1.jpg';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import MultiSelect from 'react-native-multiple-select';
import { obtenerRoles, obtenerTareas, registrarTareaRol, obtenerTareasRol, agregarTarea, deshabilitarTarea, obtenerTareasDeshabilitadas, habilitarTarea} from '../../scripts/admin/scriptCargarTareas';
import { Picker } from '@react-native-picker/picker';

export default function CargarTareas() {
    const [rolesDisponibles, setRolesDisponibles] = useState([]); // Roles disponibles
    const [selectedRoles, setSelectedRoles] = useState([]); // Roles seleccionados
    const [tareasDisponibles, setTareasDisponibles] = useState([]); // Tareas disponibles
    const [selectedTarea, setSelectedTarea] = useState(''); // Tarea seleccionada (para el Picker)
    const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
    const [nuevaTarea, setNuevaTarea] = useState(''); // Estado para almacenar el nombre de la nueva tarea
    const [modalModificarVisible, setModalModificarVisible] = useState(false);
    const [tareasDeshabilitadas, setTareasDeshabilitadas] = useState([]);


    const toggleSwitch = (idTarea) => {
        setTareasDeshabilitadas((prev) =>
            prev.map((tarea) =>
                tarea.id_tarea === idTarea
                    ? { ...tarea, id_estadoalumno: tarea.id_estadoalumno === 1 ? 2 : 1 }
                    : tarea
            )
        );
    
        // Si el switch se activa, llamamos a handleHabilitarTarea
        handleHabilitarTarea(idTarea);
    };
    

    const cargarTareasDeshabilitadas = async () => {
        try {
            const respuesta = await obtenerTareasDeshabilitadas();
            console.log("Tareas obtenidas:", respuesta);  // Verifica el formato
            setTareasDeshabilitadas(respuesta.tareas || []); // Extrae el array correctamente
        } catch (error) {
            console.error('Error al obtener las tareas deshabilitadas:', error);
        }
    };
    
    

    const actualizarEstadoTarea = async (id_tarea, nuevoEstado) => {
        // Aquí va tu lógica para hacer la petición a la base de datos
        console.log(`Actualizando tarea ${id_tarea} con nuevo estado: ${nuevoEstado}`);
        // Simulamos que la actualización fue exitosa
        return { mensaje: 'Tarea actualizada exitosamente' };
    };

    const handleConfirmarModificacion = async () => {
        console.log('Tareas actualizadas:', tareasDeshabilitadas);
    
        // Aquí iría la lógica para actualizar las tareas en la base de datos
        try {
            const result = await Promise.all(
                tareasDeshabilitadas.map(tarea => {
                    if (tarea.id_estadoalumno === 1) {
                        return actualizarEstadoTarea(tarea.id_tarea, 1); // Actualiza el estado a 1
                    }
                    return null;
                })
            );
            console.log('Tareas actualizadas en la base de datos:', result);
        } catch (error) {
            console.error('Error al actualizar tareas:', error);
        }
    
        setModalModificarVisible(false); // Cierra el modal después de la confirmación
    };

    const cargarRoles = async () => {
        try {
            const rolesObtenidos = await obtenerRoles();
            console.log('Roles obtenidos:', rolesObtenidos);

            if (rolesObtenidos && Array.isArray(rolesObtenidos.roles)) {
                const rolesFormateados = rolesObtenidos.roles.map((rol) => ({
                    key: rol.id_rol?.toString(),
                    value: rol.detalle,
                }));
                setRolesDisponibles(rolesFormateados); // Guardar los roles disponibles
            } else {
                console.error('El formato de roles obtenidos no es válido:', rolesObtenidos);
            }
        } catch (error) {
            console.error('Error al cargar los roles:', error);
        }
    };

    const cargarTareas = async () => {
        try {
            const tareasObtenidas = await obtenerTareas();
            console.log('Tareas obtenidas:', tareasObtenidas);

            if (tareasObtenidas && Array.isArray(tareasObtenidas.roles)) {
                const tareasFormateadas = tareasObtenidas.roles.map((tarea) => ({
                    key: tarea.id_tarea?.toString(),
                    value: tarea.detalle,
                }));
                setTareasDisponibles(tareasFormateadas); // Guardar las tareas disponibles
            } else {
                console.error('El formato de tareas obtenidas no es válido:', tareasObtenidas);
            }
        } catch (error) {
            console.error('Error al cargar las tareas:', error);
        }
    };

    const obtenerRolesTarea = async (id_tarea) => {
        try {
            const data = await obtenerTareasRol(id_tarea); // Obtener los roles asociados a la tarea
            // Verificar si la respuesta es un objeto con la propiedad "rol" que es un array
            if (data && Array.isArray(data.rol)) {
                const rolesSeleccionados = data.rol.map((item) => item.id_rol.toString()); // Convertir a strings
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

    const handleTareaChange = async (itemValue) => {
        setSelectedTarea(itemValue); // Actualizar la tarea seleccionada
        if (itemValue) {
            await obtenerRolesTarea(itemValue); // Cargar los roles asociados a la tarea
        } else {
            setSelectedRoles([]); // Si no hay tarea seleccionada, limpiar los roles seleccionados
        }
    };

    const cargarTareaRol = async () => {
        if (selectedRoles.length > 0 && selectedTarea) {
            console.log("Roles seleccionados:", selectedRoles); // Mostrar todos los roles seleccionados
            console.log("Tarea seleccionada:", selectedTarea);

            // Enviar todos los roles seleccionados
            const result = await Promise.all(
                selectedRoles.map((rol) => registrarTareaRol(rol, selectedTarea))
            );
            const mensaje = result.every((r) => r.mensaje === 'Relación Tarea-Rol actualizada exitosamente')
                ? 'Todos los roles fueron actualizados exitosamente'
                : 'Hubo un error al registrar algunas relaciones';

            alert(mensaje);
        } else {
            alert('Selecciona al menos un rol y una tarea');
        }
    };

    const handleDeshabilitarTarea = async () => {
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
        } catch (error) {
            console.error('Error en handleDeshabilitarTarea:', error);
            alert('Ocurrió un error al deshabilitar la tarea.');
        }
    };

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
                }
            } catch (error) {
                console.error('Error al registrar la tarea:', error);
            }
        }
    };

    const handleHabilitarTarea = async (idTarea) => {
        try {
            const respuesta = await habilitarTarea(idTarea); // Llama a la función que habilita la tarea en la BD
            if (respuesta) {
                alert('Tarea habilitada exitosamente.');
                setTareasDeshabilitadas((prev) => 
                    prev.map((tarea) =>
                        tarea.id_tarea === idTarea ? { ...tarea, id_estadoalumno: 1 } : tarea
                    )
                );
            } else {
                alert('Error al habilitar la tarea.');
            }
        } catch (error) {
            console.error('Error en handleHabilitarTarea:', error);
            alert('Ocurrió un error al habilitar la tarea.');
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
                    items={rolesDisponibles}
                    uniqueKey="key"
                    onSelectedItemsChange={(selectedItems) => setSelectedRoles(selectedItems)}
                    selectedItems={selectedRoles}
                    selectText="Seleccionar Roles"
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
                <Text style={styles.seleccionadas}>
                    Roles seleccionados: {selectedRoles.map(key => rolesDisponibles.find(role => role.key === key)?.value).filter(Boolean).join(', ')}
                </Text>
                <View style={styles.contenidoBoton}>
                    <TouchableOpacity style={styles.botonRegistrar} onPress={cargarTareaRol}>
                        <Text style={styles.textoBoton}>Registrar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botonEliminar} onPress={handleDeshabilitarTarea} >
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
                                            value={tarea.id_estadoalumno === 1}
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
