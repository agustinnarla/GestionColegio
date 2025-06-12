import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Modal, Switch } from 'react-native';
import React, { useState, useEffect } from "react";
import bg from '../../assets/bg1.jpg';
import MultiSelect from 'react-native-multiple-select';
import { Picker } from '@react-native-picker/picker';
import { obtenerRolesDeshabilitados, obtenerTareasDeRoles, obtenerTareas, obtenerRoles} from '../../scripts/listasDesplegables/listaDesplegable.js'
import { registrarRol, deshabilitarRol, habilitarRol} from '../../scripts/admin/scriptCargarRol';
import { registrarTareaRol ,registrarRolTarea } from '../../scripts/admin/scriptTareasRol';

export default function RegistrarRol() {
    const [selectedItems, setSelectedItems] = useState([]);
    const [tareas, setTareas] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedRol, setSelectedRol] = useState('');
    const [rolesDeshabilitados, setRolesDeshabilitados] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [nuevoRol, setNuevoRol] = useState("");
    const [modalModificarVisible, setModalModificarVisible] = useState(false);
    const [tareasOriginales, setTareasOriginales] = useState([]);

    const cargarTareas = async () => {
        try {
            const tareasObtenidas = await obtenerTareas();
            console.log('Tareas obtenidas:', tareasObtenidas);
    
            if (tareasObtenidas && Array.isArray(tareasObtenidas.tareas)) {
                const tareasFormateadas = tareasObtenidas.tareas.map((tarea) => ({
                    id: tarea.id_tarea?.toString(),
                    name: tarea.detalle,
                }));
                setTareas(tareasFormateadas);
            } else {
                console.error('El formato de tareas obtenidas no es válido:', tareasObtenidas);
            }
        } catch (error) {
            console.error('Error al cargar las tareas:', error);
        }
    };
    
    const cargarRoles = async () => {
        try {
            const rolesObtenidos = await obtenerRoles();
            console.log('Roles obtenidos:', rolesObtenidos);
    
            if (rolesObtenidos && Array.isArray(rolesObtenidos)) {
                const rolesFormateados = rolesObtenidos.map((rol) => ({
                    label: rol.detalle, // Usa `detalle` como el texto visible
                    value: rol.id_rol?.toString(), // Usa `id_rol` como el valor único
                }));
                setRoles(rolesFormateados); // Actualiza el estado con los roles formateados
            } else {
                console.error('El formato de roles obtenidos no es válido:', rolesObtenidos);
            }
        } catch (error) {
            console.error('Error al cargar los roles:', error);
        }
    };

    const cargarRolesDeshabilitados = async () => {
        try {
            const respuesta = await obtenerRolesDeshabilitados();
            if (respuesta && respuesta.roles) {
                setRolesDeshabilitados(respuesta.roles);
            }
        } catch (error) {
            console.error('Error al cargar roles deshabilitados:', error);
        }
    };

    const handleRegistrarRol = async () => {
        
        try {
            const response = await registrarRol(nuevoRol);
            if (response && response.data) {
                console.log('Rol registrado con éxito:', response);
    
                // Actualizar el estado `roles` con el nuevo rol
                const nuevoRolFormateado = {
                    label: nuevoRol,
                    value: response.data.id_rol?.toString(),
                };
                setRoles([...roles, nuevoRolFormateado]);
    
                // Limpiar el campo y cerrar el modal
                setNuevoRol('');
                setModalVisible(false);
    
                // Recargar roles y tareas desde la base de datos
                await cargarRoles();
                await cargarTareas();
            } else {
                console.error('Error al registrar el rol');
            }
        } catch (error) {
            console.error('Error al registrar el rol:', error);
        }
    };

    const obtenerTareasPorRolSeleccionado = async (id_rol) => {
        try {
            const data = await obtenerTareasDeRoles(id_rol); // Obtener tareas del rol seleccionado
    
            // Verificar si la respuesta es válida y contiene un array de tareas
            if (data && Array.isArray(data.tareas)) {
                const tareasSeleccionadas = data.tareas.map((item) => item.id_tarea.toString()); // Convertir IDs a string
                setSelectedItems(tareasSeleccionadas); // Marcar tareas seleccionadas en el MultiSelect
                setTareasOriginales(tareasSeleccionadas); // Guardar las tareas originales
            } else {
                console.error('El formato de tareas obtenidas no es válido:', data);
                setSelectedItems([]); // Limpiar en caso de error
                setTareasOriginales([]); // Limpiar las tareas originales
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Si no hay tareas asociadas, limpiar
                setSelectedItems([]);
                setTareasOriginales([]);
            } else {
                console.error('Error al obtener tareas del rol:', error);
                setSelectedItems([]); // Limpiar en caso de error
                setTareasOriginales([]); // Limpiar las tareas originales
            }
        }
    };
    
    //ACTUALIZA EL ROL SELECCIONADO
    const handleRolChange = async (itemValue) => {
        setSelectedRol(itemValue); // Actualizar el rol seleccionado
        if (itemValue) {
            await obtenerTareasPorRolSeleccionado(itemValue); // Cargar las tareas asociadas al rol
        } else {
            setSelectedItems([]); // Si no hay rol seleccionado, limpiar las tareas seleccionadas
        }
    };

    //REGISTRA ROL TAREA
    const cargarTareaRol = async () => {
        if (selectedItems.length > 0 && selectedRol) {
            console.log("Tareas seleccionadas:", selectedItems);
            console.log("Rol seleccionado:", selectedRol);
    
            try {
                // Construir el arreglo de relaciones
                const relaciones = selectedItems.map(id_tarea => ({
                    id_tarea: parseInt(id_tarea),
                    id_rol: parseInt(selectedRol),
                }));
    
                // Llamar a registrarRolTarea con el arreglo de relaciones
                const result = await registrarTareaRol(relaciones);
    
                // Verificar el mensaje de la respuesta
                if (result && result.mensaje) {
                    console.log(result.mensaje); // Muestra el mensaje de éxito en la consola
                    alert('Todas las relaciones se registraron correctamente'); // Mensaje de éxito general
                } else {
                    console.error('Hubo un error al registrar las relaciones');
                    alert('Hubo un error al registrar algunas relaciones');
                }
            } catch (error) {
                console.error('Error al registrar las relaciones:', error);
                alert('Hubo un error al registrar algunas relaciones');
            }
    
            // Recargar datos después de registrar
            await cargarTareas();
            await cargarRoles();
            await cargarRolesDeshabilitados();
        } else {
            alert('Selecciona un rol y al menos una tarea');
        }
    };

    //DESHABILITAR ROL
    const handleDeshabilitarRol = async () => {
        if (!selectedRol) {
            console.warn("No hay rol seleccionado para deshabilitar.");
            return;
        }
    
        // Verifica si está en un navegador o en una app móvil
        if (typeof window !== 'undefined' && window.confirm) {
            const confirmar = window.confirm("¿Seguro que quiere deshabilitar el rol?");
            if (confirmar) {
                try {
                    const respuesta = await deshabilitarRol(selectedRol);
                    if (respuesta && respuesta.mensaje === 'Rol deshabilitado exitosamente') { // Aquí se usa 'mensaje' en lugar de 'ok'
                        setSelectedRol(null);
                        console.log("Rol deshabilitado correctamente");
                    } else {
                        throw new Error(respuesta.mensaje || "Error al deshabilitar el rol");
                    }
                } catch (error) {
                    console.error("Error al deshabilitar el rol:", error);
                }
            } else {
                console.log("Operación cancelada");
            }
        } else {
            Alert.alert(
                "Confirmación",
                "¿Seguro que quiere deshabilitar el rol?",
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
                                const respuesta = await deshabilitarRol(selectedRol);
                                if (respuesta && respuesta.mensaje === 'Rol deshabilitado exitosamente') { // Verifica el mensaje aquí también
                                    setSelectedRol(null);
                                    console.log("Rol deshabilitado correctamente");
                                } else {
                                    throw new Error(respuesta.mensaje || "Error al deshabilitar el rol");
                                }
                            } catch (error) {
                                console.error("Error al deshabilitar el rol:", error);
                            }
                        }
                    }
                ]
            );
        }
        cargarTareas();
        cargarRoles();
        cargarRolesDeshabilitados();
    };
    
    //SWITCH DEL MODAL
    const toggleSwitchRol = (idRol) => {
        setRolesDeshabilitados((prev) =>
            prev.map((rol) =>
                rol.id_rol === idRol ? { ...rol, id_estado: rol.id_estado === 1 ? 2 : 1 } : rol
            )
        );
    };

    //Habilitar Rol, confirmacion
    const handleConfirmarRoles = async () => {
        console.log('Roles actualizados:', rolesDeshabilitados);
        try {
            const result = await Promise.all(
                rolesDeshabilitados.map(rol => {
                    if (rol.id_estado === 1) {
                        return habilitarRol(rol.id_rol); // Llamar a la función que habilita el rol
                    }
                    return null;
                })
            );
            console.log('Roles actualizados en la base de datos:', result);
            cargarTareas();
            cargarRoles();
            cargarRolesDeshabilitados();
        } catch (error) {
            console.error('Error al actualizar roles:', error);
        }
    
        setModalModificarVisible(false); // Cierra el modal después de la confirmación
    };
    
    
    useEffect(() => {
        cargarTareas();
        cargarRoles();
        cargarRolesDeshabilitados();
    }, []);
    

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg}></Image>
            <View style={styles.contenido}>
            <Text style={styles.titulo}>Agregar Rol</Text>
            <View style={styles.pickerContainer}>
            <Picker
                selectedValue={selectedRol} // Valor seleccionado
                onValueChange={handleRolChange} // Actualiza el estado al cambiar el valor
                style={styles.inputPicker}
            >
                <Picker.Item label="Selecciona un rol" value="" /> {/* Opción por defecto */}
                {roles.map((rol) => (
                    <Picker.Item key={rol.value} label={rol.label} value={rol.value} />
                ))}
            </Picker>
            <TouchableOpacity style={styles.botonAgregar} onPress={() => setModalVisible(true)}>
                <Text style={styles.textoBotonAgregar}>+</Text>
            </TouchableOpacity>
        </View>
            <Text style={styles.titulo}>Tareas asignables al rol</Text>
                <Modal visible={modalVisible} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.titulo}>Nuevo Rol</Text>
                            <TextInput
                                style={styles.inputModal}
                                placeholder="Ingrese el nombre del rol"
                                value={nuevoRol}
                                onChangeText={setNuevoRol}
                            />
                            <View style={styles.botonesModal}>
                                <TouchableOpacity style={styles.botonModal} onPress={handleRegistrarRol}>
                                    <Text style={styles.textoBotonModal}>Agregar</Text>
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
                <View style={styles.seleccionadasContainer}>
                <MultiSelect
                    items={tareas}
                    uniqueKey="id"
                    onSelectedItemsChange={setSelectedItems}
                    selectedItems={selectedItems}
                    selectText="Seleccionar tareas"
                    searchInputPlaceholderText="Buscar tareas..."
                    displayKey="name"
                    submitButtonColor="#48d22b"
                    submitButtonText="Seleccionar"
                    styleDropdownMenu={styles.dropdown}
                />
            </View>
                <View style={styles.contenidoBoton}>
                    <TouchableOpacity style={styles.botonRegistrar} onPress={handleRegistrarRol}>
                        <Text style={styles.textoBoton}>Registrar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botonEliminar} onPress={handleDeshabilitarRol}>
                        <Text style={styles.textoBoton}>Eliminar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botonModificar} onPress={() => setModalModificarVisible(true)}>
                        <Text style={styles.textoBoton}>Modificar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botonCancelar}>
                        <Text style={styles.textoBoton}>Cancelar</Text>
                    </TouchableOpacity>
                </View>

                <Modal visible={modalVisible} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.titulo}>Nuevo Rol</Text>
                            <TextInput
                                style={styles.inputModal}
                                placeholder="Ingrese el nombre del rol"
                                value={nuevoRol}
                                onChangeText={setNuevoRol}
                            />
                            <View style={styles.botonesModal}>
                                <TouchableOpacity style={styles.botonModal} onPress={handleRegistrarRol}>
                                    <Text style={styles.textoBotonModal}>Agregar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.botonModalCancelar} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.textoBotonModal}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
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
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#bdc3c7',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#ecf0f1',
        width: '85%',
    },
    dropdown: {
        marginTop: 15,
        width: '85%',
    },
    contenidoBoton: {
        flexDirection: 'row', // Alinea los botones horizontalmente
        justifyContent: 'space-between', // Distribuye espacio uniforme entre los botones
        alignItems: 'center', // Centra los botones verticalmente
        marginTop: 20, // Separación del contenido superior
        width: '100%', // Asegura que el contenedor ocupe el ancho completo
    },
    contenido: {
        width: '90%', // Ajusta el ancho del contenido principal
        backgroundColor: '#fff', // Fondo blanco
        borderRadius: 10, // Bordes redondeados
        padding: 20, // Espaciado interno
        shadowColor: '#000', // Sombra
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // Elevación para sombra en Android
        alignSelf: 'center', // Centra el contenedor horizontalmente
    },
    botonRegistrar: {
        backgroundColor: '#e8f5e9',
        borderColor: '#4caf50',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '22%',
    },
    botonCancelar: {
        backgroundColor: '#f5f5f5',
        borderColor: '#9e9e9e',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '22%',
    },
    botonModificar: {
        backgroundColor: '#e3f2fd',
        borderColor: '#746BC8',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '22%',
    },
    botonEliminar: {
        backgroundColor: '#ffebee',
        borderColor: '#f44336',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '22%',
    },
    textoBoton: {
        color: '#000',
        fontWeight: '600',
        fontSize: 14,
    },
    pickerContainer: {
        flexDirection: 'row', // Alinea los elementos horizontalmente
        alignItems: 'center', // Centra los elementos verticalmente
        justifyContent: 'space-between', // Distribuye espacio entre los elementos
        width: '100%', // Asegura que el contenedor ocupe el ancho completo
        marginBottom: 20, // Espaciado inferior
    },
    inputPicker: {
        flex: 1, // Ocupa el espacio restante
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#fafafa',
        fontSize: 16,
        marginRight: 10, // Espaciado entre el picker y el botón
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    botonAgregar: {
        backgroundColor: '#007BFF', // Color azul para el botón
        padding: 10,
        borderRadius: 5,
    },
    textoBotonAgregar: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
        width: '100%',
    },
    seleccionadasContainer: {
        flexDirection: 'column', // Asegura que los elementos estén en una columna
        justifyContent: 'center', // Centra el contenido verticalmente
        alignItems: 'center', // Centra el contenido horizontalmente
        marginTop: 20, // Separación del contenido superior
        width: '100%', // Asegura que el contenedor ocupe el ancho completo
    },
});
