import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Modal, Switch } from 'react-native';
import React, { useState, useEffect } from "react";
import bg from '../../assets/bg1.jpg';
import MultiSelect from 'react-native-multiple-select';
import { Picker } from '@react-native-picker/picker';
import { obtenerRolesDeshabilitados, obtenerTareasDeRoles, obtenerTareas, obtenerRoles} from '../../scripts/listasDesplegables/listaDesplegable.js'
import { registrarRol, deshabilitarRol, habilitarRol, modificarRol} from '../../scripts/admin/scriptCargarRol.js';
import { registrarTareaRol ,registrarRolTarea } from '../../scripts/admin/scriptTareasRol.js';
import CustomAlert from '../../componente/CustomAlerts.js';

export default function RegistrarRol() {
    const [selectedItems, setSelectedItems] = useState([]);
    const [tareas, setTareas] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedRol, setSelectedRol] = useState('');
    const [rolesDeshabilitados, setRolesDeshabilitados] = useState([]);
    const [modalAgregar, setModalAgregar] = useState(false);
    const [nuevoRol, setNuevoRol] = useState("");
    const [modalModificar, setModalModificar] = useState(false);
    const [tareasOriginales, setTareasOriginales] = useState([]);
    const [rolOriginal, setRolOriginal] = useState("");

    // Mensajes 
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [onConfirm, setOnConfirm] = useState(null);

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
    
    const cargarListaDesplegable = async () => {
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

    const handleRegistrar = async () => {
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
                mostrarMensaje('Exito', 'Rol registrado exitosamente');
                // Limpiar el campo y cerrar el modal
                setNuevoRol('');
                setModalAgregar(false);

                // Recargar roles y tareas desde la base de datos
                await cargarListaDesplegable();
                await cargarTareas();
                limpiarInterfaz()
            } else {
                console.error('Error al registrar el rol');
            }
        } catch (error) {
            console.error('Error al registrar el rol:', error);
            mostrarMensaje('Error', 'Error al registrar el rol');
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
                limpiarInterfaz()
                // Verificar el mensaje de la respuesta
                if (result && result.mensaje) {
                    console.log(result.mensaje); // Muestra el mensaje de éxito en la consola
                    mostrarMensaje('Exito', 'Las relaciones se registraron correctamente');
    
                } 
                    else {
                    console.error('Hubo un error al registrar las relaciones');
                    mostrarMensaje('Error', 'Error al registrar las relaciones');
                }
            } catch (error) {
                console.error('Error al registrar las relaciones:', error);
                mostrarMensaje('Error', 'Error al registrar las relaciones');
            }
    
            // Recargar datos después de registrar
            await cargarTareas();
            await cargarListaDesplegable();
            await cargarRolesDeshabilitados();
        } else {
            alert('Selecciona un rol y al menos una tarea');
        }
    };

    //DESHABILITAR ROL
    const handleDeshabilitar = async () => {
        if (!selectedRol) {
            mostrarMensaje('Advertencia', 'No hay un rol seleccionado');
            return;
        }
            try {
                const respuesta = await deshabilitarRol(selectedRol);
                if (respuesta && respuesta.mensaje === 'Rol deshabilitado exitosamente') {
                    setSelectedRol(null);
                    mostrarMensaje('Éxito', 'Rol deshabilitado exitosamente');
                } else {
                    mostrarMensaje('Error', respuesta.mensaje || 'Error al deshabilitar el rol');
                }
            } catch (error) {
                mostrarMensaje('Error', 'Error al deshabilitar el rol');
            }
            cargarTareas();
            cargarListaDesplegable();
            cargarRolesDeshabilitados();
            limpiarInterfaz()
    };
    
    //SWITCH DEL MODAL
    const tocarSwitch = (idRol) => {
        setRolesDeshabilitados((prev) =>
            prev.map((rol) =>
                rol.id_rol === idRol
                    ? { ...rol, id_estado_general: rol.id_estado_general === 1 ? 2 : 1 }
                    : rol
            )
        );
    };

    //Habilitar Rol, confirmacion
    const handleConfirmar = async () => {
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
        mostrarMensaje('Exito', 'Roles habilitados exitosamente')
    } catch (error) {
        console.error('Error al habilitar roles:', error);
        mostrarMensaje('Error', 'Error al habilitar el rol')
    }

    setModalModificar(false);
    await cargarRolesDeshabilitados();
    await cargarListaDesplegable();
    await cargarTareas();
};
    
 const handleModificar = async () => {
    try {
      if (!rolOriginal) {
        mostrarMensaje("Error", "Seleccione un rol para modificar");
        return;
      }
      if (!nuevoRol.trim()) {
        mostrarMensaje(
          "Error",
          "El nuevo nombre del rol no puede estar vacío"
        );
        return;
      }
      const rolData = { detalle: nuevoRol };
      const respuesta = await modificarRol(rolOriginal, rolData);
      if (respuesta) {
        mostrarMensaje("Éxito", "El rol se modificó correctamente");
        limpiarInterfaz();
        setModalAgregar(false);
        cargarListaDesplegable();
      }
    } catch (error) {
      mostrarMensaje("Error", "Error al modificar el rol");
      console.log(error);
    }
  };

    const validarCampos = () => {
        return(
            selectedRol.length > 0 && selectedItems.length > 0
        )
    }


    const limpiarInterfaz = () => {
    setSelectedItems([])
    setSelectedRol('');
    setRolOriginal('');
    setNuevoRol('');
    }; 

    useEffect(() => {
        cargarTareas();
        cargarListaDesplegable();
        cargarRolesDeshabilitados();
    }, []);
    

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg} />
            <View style={styles.formulario}>
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
                            <TouchableOpacity style={styles.botonAgregar} onPress={() => setModalAgregar(true)}>
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
                        <TouchableOpacity style={[styles.botonAlta, !validarCampos() && styles.botonDeshabilitado]} onPress={cargarTareaRol} disabled={!validarCampos()}>
                            <Text style={styles.textoBoton}>Registrar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.botonBaja, !validarCampos() && styles.botonDeshabilitado]} onPress={handleDeshabilitar} disabled={!validarCampos()}>
                            <Text style={styles.textoBoton}>Deshabilitar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botonModificar} onPress={() => setModalModificar(true)}>
                            <Text style={styles.textoBoton}>Habilitar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botonLimpiar} onPress={(limpiarInterfaz)}>
                            <Text style={styles.textoBoton}>Limpiar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Modal para agregar tarea */}
                <Modal visible={modalAgregar} transparent animationType="slide">
                        <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.titulo}>Registrar Rol Nuevo</Text>
                            <View style={styles.divider} />
                            {/* ComboBox: Picker + TextInput */}
                            <Text style={styles.label}>
                            Selecciona un rol existente o escribe uno nuevo:
                            </Text>
                            <View style={styles.comboContainer}>
                            <Picker
                                selectedValue={rolOriginal}
                                onValueChange={(value) => {
                                setRolOriginal(value);
                                setNuevoRol(value); // Para mostrar en el input
                                }}
                                style={styles.inputPicker}
                            >
                                <Picker.Item label="Seleccionar un Rol" value="" />
                                {roles.map((rol) => (
                                <Picker.Item
                                    key={rol.key}
                                    label={rol.label}
                                    value={rol.label}
                                />
                                ))}
                            </Picker>
                            <TextInput
                                style={styles.input}
                                placeholder="O escriba un rol nuevo"
                                value={nuevoRol}
                                onChangeText={setNuevoRol}
                            />
                            </View>
                            <View style={styles.botonesModal}>
                            <TouchableOpacity
                                style={styles.botonCancelar}
                                onPress={() => {
                                setModalAgregar(false);
                                limpiarInterfaz();
                                }}
                            >
                                <Text style={styles.textoBoton}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.botonModificar}
                                onPress={handleModificar}
                            >
                                <Text style={styles.textoBoton}>Modificar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.botonAlta}
                                onPress={handleRegistrar}
                            >
                                <Text style={styles.textoBoton}>Registrar</Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                        </View>
                    </Modal>
                {/* Modal para modificar tareas deshabilitadas */}
                <Modal visible={modalModificar} transparent={true} animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.titulo}>Modificar roles deshabilitadas</Text>
                            {Array.isArray(rolesDeshabilitados) &&
                                rolesDeshabilitados.map((rol) => (
                                    <View key={rol.id_rol} style={styles.itemContainer}>
                                        <Text style={styles.textoTarea}>{rol.detalle}</Text>
                                        <Switch
                                            value={rol.id_estado_general === 1}
                                            onValueChange={() => tocarSwitch(rol.id_rol)}
                                        />
                                    </View>
                                ))}
                            <View style={styles.botonesModal}>
                                <TouchableOpacity style={styles.botonBaja} onPress={() => setModalModificar(false)}>
                                    <Text style={styles.textoBoton}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.botonAlta} onPress={handleConfirmar}>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6f8fa",
  },
  bg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  formulario: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    marginTop: 32,
    marginBottom: 24,
    padding: 30,
    backgroundColor: "#fff",
    borderRadius: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  botonDeshabilitado:{
    opacity: 0.5,
        backgroundColor: '#cccccc',
        borderColor: '#999999',
  },
  titulo: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2a3d6c",
    marginBottom: 18,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 24,
  },
  columna: {
    width: "48%",
    minWidth: 260,
  },
  label: {
    fontSize: 15,
    marginBottom: 6,
    fontWeight: "500",
    color: "#2a3d6c",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 10,
    borderRadius: 7,
    backgroundColor: "#f3f4f6",
    height: 44, // más alto
    fontSize: 15,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 8,
  },
  inputPicker: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 7,
    backgroundColor: "#f3f4f6",
    fontSize: 15,
    height: 44, // más alto
    paddingHorizontal: 10,
    marginRight: 8,
  },
  botonAgregar: {
    backgroundColor: "#6c7ae0",
    padding: 10,
    borderRadius: 7,
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
  },
  textoBotonAgregar: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  seleccionadasContainer: {
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
  },
  botonAlta: {
    backgroundColor: "#e8f5e9",
    borderColor: "#4caf50",
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 7,
    alignItems: "center",
    marginBottom: 10,
  },
  botonBaja: {
    backgroundColor: "#ffebee",
    borderColor: "#f44336",
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 7,
    alignItems: "center",
    marginBottom: 10,
  },
  botonModificar: {
    backgroundColor: "#e3f2fd",
    borderColor: "#746BC8",
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 7,
    alignItems: "center",
    marginBottom: 10,
  },
  botonLimpiar: {
    backgroundColor: "#f5f5f5",
    borderColor: "#9e9e9e",
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 7,
    alignItems: "center",
    marginBottom: 10,
  },
  textoBoton: {
    color: "#2c3e50",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.12)",
    zIndex: 10,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 10,
    width: "100%",
    maxWidth: 600,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  botonesModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 18,
    gap: 12,
  },
  textoTarea: {
    fontSize: 15,
    flex: 1,
    color: "#222",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#e0e0e0",
    marginVertical: 16,
  },
  comboContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 16, // más espacio entre picker e input
  },
  botonConsultar: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196F3",
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 7,
    alignItems: "center",
    marginBottom: 10,
    width: "50%",
  },
  botonCancelar: {
    backgroundColor: "#ffebee",
    borderColor: "#f44336",
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 7,
    alignItems: "center",
    marginBottom: 10,
  },
});
