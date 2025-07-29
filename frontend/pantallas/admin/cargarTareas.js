import { StyleSheet, View, Image, Text, TextInput,TouchableOpacity, Modal, Switch} from 'react-native';
import React, { useState, useEffect } from 'react';
import bg from '../../assets/bg1.jpg';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import MultiSelect from 'react-native-multiple-select';
import { obtenerRoles, obtenerTareas, obtenerRolesDeTarea, obtenerTareasDeshabilitadas } from '../../scripts/listasDesplegables/listaDesplegable.js';
import { agregarTarea, deshabilitarTarea, habilitarTarea, consultarTarea, modificarTarea} from '../../scripts/admin/scriptCargarTareas.js';
import { registrarRolTarea, registrarTareaRol} from '../../scripts/admin/scriptTareasRol.js';
import { Picker } from '@react-native-picker/picker';
import CustomAlert from '../../componente/CustomAlerts.js';

export default function CargarTareas() {
    //🟢 Estados del formulario y listas desplegables
    const [rolesDisponibles, setRolesDisponibles] = useState([]); // Lista de roles disponibles
    const [selectedRoles, setSelectedRoles] = useState([]); // Roles seleccionados
    const [tareasDisponibles, setTareasDisponibles] = useState([]); // Tareas disponibles
    const [selectedTarea, setSelectedTarea] = useState(''); // Tarea seleccionada (para el Picker)
    const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
    const [nuevaTarea, setNuevaTarea] = useState(''); // Estado para almacenar el nombre de la nueva tarea
    const [modalModificarVisible, setModalModificarVisible] = useState(false);
    const [tareasDeshabilitadas, setTareasDeshabilitadas] = useState([]);
    const [nuevaRuta, setNuevaRuta] = useState(''); // Estado para almacenar la ruta de la nueva tarea

    //🟢 Mensajes 
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [onConfirm, setOnConfirm] = useState(null);

    //🟢 Mensajes
    const mostrarMensaje = (titulo, mensaje) => {
        setAlertTitle(titulo);
        setAlertMessage(mensaje);
        setAlertVisible(true);
    };

    const mostrarConfirmacion = (titulo, mensaje, accionConfirmar) => {
        setAlertTitle(titulo);
        setAlertMessage(mensaje);
        setOnConfirm(() => accionConfirmar);
        setAlertVisible(true);
    };

    //🟢 Cargar lista desplegables
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

    //🟢 Cargar roles dentro del MultiSelect
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

    //🟢 Cargar tareas deshabilitadas para habilitarlas 
    const cargarTareasDeshabilitadas = async () => {
        try {
            const respuesta = await obtenerTareasDeshabilitadas();
            console.log("Tareas obtenidas:", respuesta);  // Verifica el formato
            setTareasDeshabilitadas(respuesta.tareas || []); // Extrae el array correctamente
        } catch (error) {
            console.error('Error al obtener las tareas deshabilitadas:', error);
        }
    };

    //🟢 Cargar roles de la tarea seleccionada
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

    //🟢 Registrar Tarea y Rol
    const handleRegistrarCombinacion = async () => {
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
                    mostrarMensaje('Exito', 'Todos los roles se asignaron exitosamente')
                } else {
                    console.error('Hubo un error al registrar las relaciones');
                    mostrarMensaje('Error','Hubo un error al asignar algunos roles');
                }
            } catch (error) {
                console.error('Error al registrar las relaciones:', error);
                mostrarMensaje('Error','Hubo un error al asignar los roles a la tarea');
            }
    
            // Recargar datos después de registrar
            await cargarTareas();
            await cargarRoles();
            await cargarTareasDeshabilitadas();
            await cargarRolesTareas(selectedTarea); // Recargar los roles específicos de esta tarea
            limpiarInterfaz()
        } else {
            alert('Selecciona una tarea y al menos un rol');
        }
    };

    //🟢 Cambiar estado de la tarea
    const cambiarSwitch = (idTarea) => {
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

    //🟢 Confirmar modificación
    const handleConfirmarModificacion = async () => {
        try {
            // Filtra las tareas que tienen id_estado_general === 1
            const tareasAHabilitar = tareasDeshabilitadas.filter(
                (tarea) => tarea.id_estado_general === 1
            );
            // Llama a handleHabilitarTarea para cada tarea habilitada
            const resultados = await Promise.all(
                tareasAHabilitar.map((tarea) =>
                    handleHabilitar(tarea.id_tarea)
                )
            );
            console.log('Resultados de habilitar tareas:', resultados);
            mostrarMensaje('Exito','Tareas habilitadas exitosamente.');
        } catch (error) {
            console.error('Error al habilitar tareas:', error);
            mostrarMensaje('Error','Ocurrió un error al habilitar las tareas.');
        }
        // Cierra el modal
        setModalModificarVisible(false);
    };


    //🟢 Validar cambios en el formulario
    const handleChange = async (itemValue) => {
        setSelectedTarea(itemValue); // Actualizar la tarea seleccionada
        if (itemValue) {
            await cargarRolesTareas(itemValue); // Cargar los roles asociados a la tarea
        } else {
            setSelectedRoles([]); // Si no hay tarea seleccionada, limpiar los roles seleccionados
        }
    };

    //🟢 Deshabilitar tarea
    const handleDeshabilitar = async () => {
        if (!selectedTarea) {
            mostrarMensaje('Advertencia','Por favor, selecciona una tarea para deshabilitar.');
            return;
        }
        try {
            const respuesta = await deshabilitarTarea(selectedTarea); // selectedTarea es el id_tarea
            if (respuesta) {
                mostrarMensaje('Exito','Tarea deshabilitada exitosamente.');
                setTareasDisponibles((prev) => 
                    prev.filter((tarea) => tarea.key !== selectedTarea)
                );
                setSelectedTarea(''); // Limpiar la selección del Picker
            } else {
                mostrarMensaje('Error','Error al deshabilitar la tarea.');
            }
            cargarRoles();
            cargarTareas();
            cargarTareasDeshabilitadas();
            limpiarInterfaz()
        } catch (error) {
            console.error('Error en handleDeshabilitarTarea:', error);
            mostrarMensaje('Error','Ocurrió un error al deshabilitar la tarea.');
        }
    };

    //🟢 Registrar Tarea 
    const handleRegistrar= async () => {
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
                    limpiarInterfaz()
                    mostrarMensaje('Exito','Se registro la tarea exitosamente')
                }
            } catch (error) {
                console.error('Error al registrar la tarea:', error);
                mostrarMensaje('Error', 'Error al registrar la tarea')
            }
        }
    };

    //🟢 Habilitar tarea 
    const handleHabilitar = async (idTarea) => {
        try {
            const respuesta = await habilitarTarea(idTarea); // Llama a la función que habilita la tarea en la BD
            if (respuesta) {
                mostrarMensaje('Exito','Se habilito la tarea exitosamente', idTarea);
                cargarRoles();
                cargarTareas();
                cargarTareasDeshabilitadas();
                limpiarInterfaz()
                return true;
            } else {
                console.error('Error al habilitar la tarea:', idTarea);
                mostrarMensaje('Error','Error al habilitar la tarea:', idTarea);
                return false;
            }
        } catch (error) {
            console.error('Error en handleHabilitar:', error);
            return false;
        }
    };
    
    //🟢 Consultar tarea 
    const handleConsultar = async (detalle) => {
        if (!detalle || !detalle.trim()) {
            mostrarMensaje("Error", "Por favor ingrese el nombre de la tarea a consultar");
            return;
        }
        try {
            const data = await consultarTarea(detalle);
            console.log("La tarea consultada es ", data)
            if (data.tareas) {
                mostrarMensaje("Éxito", `Tarea encontrada`);
                setNuevaRuta(data.tareas[0].ruta || ''); // Asigna la ruta de la tarea consultada
                setNuevaTarea(data.tareas[0].detalle || ''); // Asigna el detalle de la tarea consultada
            } else {
                mostrarMensaje("Error", "Tarea no encontrada");
            }
        } catch (error) {
            console.log("Error al consultar la tarea", error)
            mostrarMensaje("Error", "No se pudo consultar la tarea");
        }
    }

    //🟢 Modificar tarea 
    const handleModificar = async () => {
        try {
            const tareaData = {
            detalle: nuevaTarea,
            ruta: nuevaRuta, 
            };
            console.log(tareaData);
            const respuesta = await modificarTarea(nuevaTarea, tareaData);
            if (respuesta) {
            mostrarMensaje("Exito", "El tarea se modifico correctamente");
            console.log("El tarea fue modificado correctamente");
            limpiarInterfaz();
            }
        } catch (error) {
            mostrarMensaje("Error", "Error al modificar el tarea");
            console.log(error.message);
        }
    }



    //🟢 Limpiar interfaz
    const limpiarInterfaz = () => {
        setSelectedTarea('');
        setSelectedRoles([]);
        setNuevaRuta('');
        setNuevaTarea('');
    };

    useEffect(() => {
        cargarRoles();
        cargarTareas();
        cargarTareasDeshabilitadas();
    }, []);

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg} />
            <View style={styles.formulario}>
                <Text style={styles.titulo}>Gestión de Tareas</Text>
                <View style={styles.fila}>
                    {/* Columna izquierda: Picker de tareas y agregar */}
                    <View style={styles.columna}>
                        <Text style={styles.label}>Tarea:</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedTarea}
                                onValueChange={handleChange}
                                style={styles.inputPicker}
                            >
                                <Picker.Item label="Seleccionar Tarea" value="" />
                                {tareasDisponibles.map((tarea) => (
                                    <Picker.Item key={tarea.key} label={tarea.value} value={tarea.key} />
                                ))}
                            </Picker>
                            <TouchableOpacity style={styles.botonAgregar} onPress={() => setModalVisible(true)}>
                                <Text style={styles.textoBotonAgregar}>+</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.label}>Roles asignables:</Text>
                        <View style={styles.seleccionadasContainer}>
                            <MultiSelect
                                    items={rolesDisponibles}
                                    uniqueKey="id"
                                    onSelectedItemsChange={setSelectedRoles}
                                    selectedItems={selectedRoles}
                                    selectText="Seleccionar roles"
                                    searchInputPlaceholderText="Buscar roles..."
                                    displayKey="name"
                                    submitButtonColor="#6c7ae0"
                                    submitButtonText="Seleccionar"
                                    styleDropdownMenu={styles.dropdown}
                                />
                        </View>
                    </View>
                    {/* Columna derecha: Acciones */}
                    <View style={styles.columna}>
                        <TouchableOpacity style={styles.botonAlta} onPress={handleRegistrarCombinacion}>
                            <Text style={styles.textoBoton}>Registrar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botonBaja} onPress={handleDeshabilitar}>
                            <Text style={styles.textoBoton}>Deshabilitar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botonModificar} onPress={() => setModalModificarVisible(true)}>
                            <Text style={styles.textoBoton}>Habilitar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botonLimpiar} onPress={limpiarInterfaz}>
                            <Text style={styles.textoBoton}>Limpiar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Modal para agregar tarea */}
                <Modal visible={modalVisible} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.titulo}>Gestión de Tarea</Text>
                            <View style={styles.divider} />
                            {/* ComboBox: Picker + TextInput */}
                            <Text style={styles.label}>Selecciona una tarea existente o escribe una nueva:</Text>
                            <View style={styles.comboContainer}>
                                <Picker
                                    selectedValue={nuevaTarea}
                                    style={styles.inputPicker}
                                    onValueChange={setNuevaTarea}
                                >
                                    <Picker.Item label="Seleccionar tarea..." value="" />
                                    {tareasDisponibles.map((tarea) => (
                                        <Picker.Item key={tarea.key} label={tarea.value} value={tarea.value} />
                                    ))}
                                </Picker>
                                <TextInput
                                    style={styles.input}
                                    placeholder="O escriba una tarea nueva"
                                    value={nuevaTarea}
                                    onChangeText={setNuevaTarea}
                                />
                            </View>
                            <TouchableOpacity style={styles.botonConsultar} onPress={() => handleConsultar(nuevaTarea)}>
                                <Text style={styles.textoBoton}>Consultar</Text>
                            </TouchableOpacity>
                            <View style={styles.divider} />
                            <Text style={styles.label}>Ruta de la tarea:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ingrese la ruta de la tarea"
                                value={nuevaRuta}
                                onChangeText={setNuevaRuta}
                            />
                            <View style={styles.botonesModal}>
                                <TouchableOpacity style={styles.botonCancelar} onPress={() => { setModalVisible(false); limpiarInterfaz(); }}>
                                    <Text style={styles.textoBoton}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.botonModificar} onPress={handleModificar}>
                                    <Text style={styles.textoBoton}>Modificar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.botonAlta} onPress={handleRegistrar}>
                                    <Text style={styles.textoBoton}>Registrar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                {/* Modal para modificar tareas deshabilitadas */}
                <Modal visible={modalModificarVisible} transparent={true} animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.titulo}>Tareas Deshabilitadas</Text>
                            {Array.isArray(tareasDeshabilitadas) &&
                                tareasDeshabilitadas.map((tarea) => (
                                    <View key={tarea.id_tarea} style={styles.itemContainer}>
                                        <Text style={styles.textoTarea}>{tarea.detalle}</Text>
                                        <Switch
                                            value={tarea.id_estado_general === 1}
                                            onValueChange={() => cambiarSwitch(tarea.id_tarea)}
                                        />
                                    </View>
                                ))}
                            <View style={styles.botonesModal}>
                                <TouchableOpacity style={styles.botonBaja} onPress={() => setModalModificarVisible(false)}>
                                    <Text style={styles.textoBoton}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.botonAlta} onPress={handleConfirmarModificacion}>
                                    <Text style={styles.textoBoton}>Confirmar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
             <CustomAlert
            isVisible={alertVisible}
            onClose={() => {
                setAlertVisible(false);
                setOnConfirm(null); // Limpia el callback al cerrar
            }}
            title={alertTitle}
            message={alertMessage}
            showConfirm={!!onConfirm}
            onConfirm={onConfirm}
            confirmText="Confirmar"
            cancelText="Cancelar"
        />
        </View>
    );
}

const styles = StyleSheet.create({
    padre: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f6f8fa',
    },
    bg: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    formulario: {
        width: '100%',
        maxWidth: 900,
        alignSelf: 'center',
        marginTop: 32,
        marginBottom: 24,
        padding: 30,
        backgroundColor: '#fff',
        borderRadius: 14,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
    },
    titulo: {
        fontSize: 22,
        fontWeight: '600',
        color: '#2a3d6c',
        marginBottom: 18,
        textAlign: 'center',
        letterSpacing: 0.2,
    },
    fila: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 24,
    },
    columna: {
        width: '48%',
        minWidth: 260,
    },
    label: {
        fontSize: 15,
        marginBottom: 6,
        fontWeight: '500',
        color: '#2a3d6c',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        padding: 10,
        borderRadius: 7,
        backgroundColor: '#f3f4f6',
        height: 44, // más alto
        fontSize: 15,
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        gap: 8,
    },
    inputPicker: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 7,
        backgroundColor: '#f3f4f6',
        fontSize: 15,
        height: 44, // más alto
        paddingHorizontal: 10,
        marginRight: 8,
    },
    botonAgregar: {
        backgroundColor: '#6c7ae0',
        padding: 10,
        borderRadius: 7,
        width: 38,
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoBotonAgregar: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    seleccionadasContainer: {
        marginTop: 10,
        marginBottom: 10,
        width: '100%',
    },
    botonAlta: {
        backgroundColor: '#e8f5e9',
        borderColor: '#4caf50',
        borderWidth: 1,
        paddingVertical: 10,
        borderRadius: 7,
        alignItems: 'center',
        marginBottom: 10,
    },
    botonBaja: {
        backgroundColor: '#ffebee',
        borderColor: '#f44336',
        borderWidth: 1,
        paddingVertical: 10,
        borderRadius: 7,
        alignItems: 'center',
        marginBottom: 10,
    },
    botonModificar: {
        backgroundColor: '#e3f2fd',
        borderColor: '#746BC8',
        borderWidth: 1,
        paddingVertical: 10,
        borderRadius: 7,
        alignItems: 'center',
        marginBottom: 10,
    },
    botonLimpiar: {
        backgroundColor: '#f5f5f5',
        borderColor: '#9e9e9e',
        borderWidth: 1,
        paddingVertical: 10,
        borderRadius: 7,
        alignItems: 'center',
        marginBottom: 10,
    },
    textoBoton: {
        color: '#2c3e50',
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
        zIndex: 10,
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 10,
        width: '100%',
        maxWidth: 600,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    botonesModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 18,
        gap: 12,
    },
    textoTarea: {
        fontSize: 15,
        flex: 1,
        color: '#222',
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: '#e0e0e0',
        marginVertical: 16,
    },
    comboContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 16, // más espacio entre picker e input
    },
    botonConsultar: {
        backgroundColor: '#e3f2fd',
        borderColor: '#2196F3',
        borderWidth: 1,
        paddingVertical: 10,
        borderRadius: 7,
        alignItems: 'center',
        marginBottom: 10,
        width: '50%',
    },
    botonCancelar: {
        backgroundColor: '#ffebee',
        borderColor: '#f44336',
        borderWidth: 1,
        paddingVertical: 10,
        borderRadius: 7,
        alignItems: 'center',
        marginBottom: 10,
    },
});