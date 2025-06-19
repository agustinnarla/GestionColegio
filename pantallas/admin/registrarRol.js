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
                rol.id_rol === idRol
                    ? { ...rol, id_estado_general: rol.id_estado_general === 1 ? 2 : 1 }
                    : rol
            )
        );
    };

    //Habilitar Rol, confirmacion
    const handleConfirmarRoles = async () => {
    try {
        // Filtra los roles que tienen id_estado_general === 1
        const rolesAHabilitar = rolesDeshabilitados.filter(
            (rol) => rol.id_estado_general === 1
        );
        // Llama a habilitarRol para cada rol habilitado
        await Promise.all(
            rolesAHabilitar.map((rol) =>
                habilitarRol(rol.id_rol)
            )
        );
        alert('Roles actualizados exitosamente.');
    } catch (error) {
        console.error('Error al habilitar roles:', error);
        alert('Ocurrió un error al actualizar los roles.');
    }
    setModalModificarVisible(false);
    await cargarRolesDeshabilitados();
    await cargarRoles();
    await cargarTareas();
};
    
    
    useEffect(() => {
        cargarTareas();
        cargarRoles();
        cargarRolesDeshabilitados();
    }, []);
    

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg} />
            <View style={styles.formulario}>
                <Text style={styles.titulo}>Gestión de Roles</Text>
                <View style={styles.fila}>
                    {/* Columna izquierda: Picker de tareas y agregar */}
                    <View style={styles.columna}>
                        <Text style={styles.label}>Rol:</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedRol}
                                onValueChange={handleRolChange}
                                style={styles.inputPicker}
                            >
                                <Picker.Item label="Seleccionar un Rol" value="" />
                                {roles.map((rol) => (
                                    <Picker.Item key={rol.value} label={rol.label} value={rol.value} />
                                ))}
                            </Picker>
                            <TouchableOpacity style={styles.botonAgregar} onPress={() => setModalVisible(true)}>
                                <Text style={styles.textoBotonAgregar}>+</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.label}>Tareas asignables:</Text>
                        <View style={styles.seleccionadasContainer}>
                            <MultiSelect
                                    items={tareas}
                                    uniqueKey="id"
                                    onSelectedItemsChange={setSelectedItems}
                                    selectedItems={selectedItems}
                                    selectText="Seleccionar tareas"
                                    searchInputPlaceholderText="Buscar tareas..."
                                    displayKey="name"
                                    submitButtonColor="#6c7ae0"
                                    submitButtonText="Seleccionar"
                                    styleDropdownMenu={styles.dropdown}
                                />
                        </View>
                    </View>
                    {/* Columna derecha: Acciones */}
                    <View style={styles.columna}>
                        <TouchableOpacity style={styles.botonAlta} onPress={cargarTareaRol}>
                            <Text style={styles.textoBoton}>Registrar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botonBaja} onPress={handleDeshabilitarRol}>
                            <Text style={styles.textoBoton}>Eliminar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botonModificar} onPress={() => setModalModificarVisible(true)}>
                            <Text style={styles.textoBoton}>Modificar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botonLimpiar} onPress={() => {
                            setSelectedRol('');
                            setSelectedItems([]);
                        }}>
                            <Text style={styles.textoBoton}>Limpiar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Modal para agregar tarea */}
                <Modal visible={modalVisible} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.titulo}>Nuevo Rol</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ingrese nombre del rol"
                                value={nuevoRol}
                                onChangeText={setNuevoRol}
                            />
                            <View style={styles.botonesModal}>
                                <TouchableOpacity style={styles.botonAlta} onPress={handleRegistrarRol}>
                                    <Text style={styles.textoBoton}>Registrar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.botonBaja} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.textoBoton}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                {/* Modal para modificar tareas deshabilitadas */}
                <Modal visible={modalModificarVisible} transparent={true} animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.titulo}>Modificar roles deshabilitadas</Text>
                            {Array.isArray(rolesDeshabilitados) &&
                                rolesDeshabilitados.map((rol) => (
                                    <View key={rol.id_rol} style={styles.itemContainer}>
                                        <Text style={styles.textoTarea}>{rol.detalle}</Text>
                                        <Switch
                                            value={rol.id_estado_general === 1}
                                            onValueChange={() => toggleSwitchRol(rol.id_rol)}
                                        />
                                    </View>
                                ))}
                            <View style={styles.botonesModal}>
                                <TouchableOpacity style={styles.botonBaja} onPress={() => setModalModificarVisible(false)}>
                                    <Text style={styles.textoBoton}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.botonAlta} onPress={handleConfirmarRoles}>
                                    <Text style={styles.textoBoton}>Confirmar</Text>
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
        borderWidth: 1,
        borderColor: '#e5e7eb',
        padding: 10,
        borderRadius: 7,
        marginBottom: 13,
        backgroundColor: '#f3f4f6',
        height: 38,
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
        height: 38,
        paddingHorizontal: 10,
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
        width: '90%',
        maxWidth: 400,
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
});