import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Modal, Switch } from 'react-native';
import React, { useState, useEffect } from "react";
import bg from '../../assets/bg1.jpg';
import MultiSelect from 'react-native-multiple-select';
import { obtenerTareas, obtenerRoles} from '../../scripts/admin/scriptCargarTareas';
import { Picker } from '@react-native-picker/picker';
import { obtenerTareasRol, registrarRolTarea, registrarRol, deshabilitarRol, obtenerRolesDeshabilitados, habilitarRol} from '../../scripts/admin/scriptCargarRol';
import CustomAlert from '../../componente/CustomAlerts';

export default function RegistrarRol() {
    const [selectedItems, setSelectedItems] = useState([]);
    const [tareas, setTareas] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedRol, setSelectedRol] = useState('');
    const [rolesDeshabilitados, setRolesDeshabilitados] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [nuevoRol, setNuevoRol] = useState("");
    const [modalModificarVisible, setModalModificarVisible] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');


    const mostrarMensaje = (titulo, mensaje) => {
        setAlertTitle(titulo);
        setAlertMessage(mensaje);
        setAlertVisible(true);
    };


    const handleAgregarRol = async () => {
        if (!nuevoRol.trim()) {
            console.warn('El nombre del rol es obligatorio');
            return;
        }
        try {
            const response = await registrarRol(nuevoRol);
            if (response && response.data) {
                console.log('Rol registrado con éxito:', response);
                setRoles([...roles, { label: nuevoRol, value: response.data.id_rol?.toString() }]); 
                setNuevoRol('');
                setModalVisible(false);
                mostrarMensaje('Exito', 'Rol registrado exitosamente');

            } else {
                console.error('Error al registrar el rol');
            }
        } catch (error) {
            console.error('Error al registrar el rol:', error);
            mostrarMensaje('Error', 'Error al registrar el rol, verifique los datos');

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

    const cargarTareas = async () => {
        try {
            const tareasObtenidas = await obtenerTareas();
            console.log('Tareas obtenidas:', tareasObtenidas);
    
            if (tareasObtenidas && Array.isArray(tareasObtenidas.roles)) {
                const tareasFormateadas = tareasObtenidas.roles.map((tarea) => ({
                    id: tarea.id_tarea?.toString(),
                    name: tarea.detalle,
                }));
                setTareas(tareasFormateadas);
            } else {
                console.error('El formato de tareas obtenidas no es válido:', tareasObtenidas);
                

            }
        } catch (error) {
            console.error('Error al cargar las tareas:', error);
            mostrarMensaje('Error', 'Error al obtener las tareas');
        }
    };
    
    const cargarRoles = async () => {
        try {
            const rolesObtenidos = await obtenerRoles();
            console.log('Roles obtenidos:', rolesObtenidos);
    
            if (rolesObtenidos && Array.isArray(rolesObtenidos.roles)) {
                const rolesFormateados = rolesObtenidos.roles.map((rol) => ({
                    label: rol.detalle, // Lo que se muestra en el Picker
                    value: rol.id_rol?.toString(), // El valor del Picker
                }));
                setRoles(rolesFormateados);
            } else {
                console.error('El formato de roles obtenidos no es válido:', rolesObtenidos);
            }
        } catch (error) {
            console.error('Error al cargar los roles:', error);
            mostrarMensaje('Error', 'Error al obtener los roles ');
        }
    };

    const obtenerTareasPorRolSeleccionado = async (id_rol) => {
        try {
            const data = await obtenerTareasRol(id_rol); // Obtener tareas del rol seleccionado
    
            if (data && Array.isArray(data.tareas)) {
                const tareasSeleccionadas = data.tareas.map((item) => item.id_tarea.toString()); // Convertir IDs a string
                setSelectedItems(tareasSeleccionadas); // Marcar tareas seleccionadas en el MultiSelect
            } else {
                console.error('El formato de tareas obtenidas no es válido:', data);
                setSelectedItems([]); // Limpiar en caso de error
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setSelectedItems([]); // Si no hay tareas asociadas, limpiar
            } else {
                console.error('Error al obtener tareas del rol:', error);
                setSelectedItems([]); // Limpiar en caso de error
            }
        }
    };
    
    const handleRolChange = async (itemValue) => {
        setSelectedRol(itemValue); // Actualizar el rol seleccionado
        if (itemValue) {
            await obtenerTareasPorRolSeleccionado(itemValue); // Cargar las tareas asociadas al rol
        } else {
            setSelectedItems([]); // Si no hay rol seleccionado, limpiar las tareas seleccionadas
        }
    };

    const cargarRolTarea = async () => {
        if (selectedItems.length > 0 && selectedRol) {
            console.log("Roles seleccionados:", selectedItems);
            console.log("Tarea seleccionada:", selectedRol);
    
            // Enviar todos los roles seleccionados para la tarea
            const result = await Promise.all(
                selectedItems.map((tarea) => registrarRolTarea(selectedRol, tarea))
            );
    
            console.log("Resultados de la solicitud:", result);  // Agregar este log para depurar
    
            const mensaje = result.every((r) => r.mensaje === 'Relación Tarea-Rol registrada exitosamente')
                ? 'Todas las relaciones fueron registradas exitosamente'
                : 'Hubo un error al registrar algunas relaciones';
    
            alert(mensaje);
        } else {
            alert('Selecciona al menos un rol y una tarea');
        }
    };

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
                        mostrarMensaje('Exito', 'Rol deshabilitado exitosamente');
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
    };
    
    const toggleSwitchRol = (idRol) => {
        setRolesDeshabilitados((prev) =>
            prev.map((rol) =>
                rol.id_rol === idRol ? { ...rol, id_estado: rol.id_estado === 1 ? 2 : 1 } : rol
            )
        );
    };

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
            mostrarMensaje('Exito', 'Rol modificado exitosamente');

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
    

    const onSelectedItemsChange = (selectedItems) => {
        setSelectedItems(selectedItems);
    };

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg}></Image>
            <Text style={styles.titulo}>Agregar Rol</Text>
            <View style={styles.pickerContainer}>
            <Picker
                selectedValue={selectedRol}
                onValueChange={handleRolChange}
                style={styles.inputPicker}
            >
                <Picker.Item label="Selecciona un rol" value="" />
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
                            <TouchableOpacity style={styles.botonModal} onPress={handleAgregarRol}>
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

            <View style={styles.contenidoBoton}>
                <TouchableOpacity style={styles.botonRegistrar}onPress={cargarRolTarea}>
                    <Text style={styles.textoBoton}>Registrar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.botonEliminar} 
                    onPress={handleDeshabilitarRol}>
                    <Text style={styles.textoBoton}>Eliminar</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.contenidoBoton}>
                <TouchableOpacity style={styles.botonModificar} onPress={() => setModalModificarVisible(true)}>
                    <Text style={styles.textoBoton}>Modificar</Text>
                </TouchableOpacity>
            </View>
            <Modal visible={modalModificarVisible} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {Array.isArray(rolesDeshabilitados) &&
                            rolesDeshabilitados.map((rol) => (
                                <View key={rol.id_rol} style={styles.itemContainer}>
                                    <Text style={styles.textoRol}>{rol.detalle}</Text>
                                    <Switch
                                        value={rol.id_estado === 1} 
                                        onValueChange={() => toggleSwitchRol(rol.id_rol)}
                                    />
                                </View>
                            ))}
                        <View style={styles.botonesModal}>
                            <TouchableOpacity style={styles.botonModalCancelar} onPress={() => setModalModificarVisible(false)}>
                                <Text>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.botonModal} onPress={handleConfirmarRoles}>
                                <Text>Confirmar</Text>
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
        backgroundColor: 'white',
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
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
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
    botonCancelar: {
        backgroundColor: '#F3B9B9',
        borderColor: '#FF0000',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        flex: 1,
        marginLeft: 10,
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
    textoBoton: {
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
});
