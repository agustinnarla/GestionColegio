import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Alert, Modal, Switch } from 'react-native';
import React, { useState, useEffect } from 'react';
import bg from '../../assets/bg1.jpg';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import MultiSelect from 'react-native-multiple-select';
import { Picker } from '@react-native-picker/picker';
import { registrarMateriaProfesor, deshabilitarMateria, registrarMateria, habilitarMateria } from '../../scripts/admin/scriptGestionMaterias';
import { obtenerMateria, obtenerProfesores, obtenerProfesorPorMateria, obtenerMateriasDeshabilitadas } from '../../scripts/listasDesplegables/listaDesplegable.js';
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

    const cargarMaterias = async () => {
        try {
            const materiasObtenidas = await obtenerMateria();
            console.log('Materias obtenidas:', materiasObtenidas);
    
            if (materiasObtenidas && Array.isArray(materiasObtenidas)) {
                const materiasFormateadas = materiasObtenidas.map((materia) => ({
                    key: materia.id_materia?.toString(), // Clave única para el Picker
                    value: materia.detalle, // Texto visible en el Picker
                }));
                setMaterias(materiasFormateadas); // Actualiza el estado con las materias formateadas
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
            setMateriasDeshabilitadas(respuesta); // Extrae el array correctamente
        } catch (error) {
            console.error('Error al obtener las tareas deshabilitadas:', error);
        }
    };

    const cargarProfesores = async () => {
        try {
            // Obtener los datos de los profesores desde la API
            const profesoresObtenidos = await obtenerProfesores();
            // Verificar que los datos obtenidos estén en el formato esperado
            if (profesoresObtenidos && Array.isArray(profesoresObtenidos)) {
                // Mapear los datos para transformarlos en el formato necesario para MultipleSelectList
                const profesoresFormateados = profesoresObtenidos.map((profesor) => ({
                    key: profesor.dni_profesional.toString(),  // Usa `dni_profesional` como clave única
                    value: `${profesor.nombre}`,  // Solo el nombre
                }));
                console.log(profesoresFormateados);
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
        console.log("Profesores:", selectedProfesores);
        console.log("Materia:", selectedMateria);

        const relaciones = selectedProfesores.map(dni => ({
            dni_profesional: dni,
            id_materia: selectedMateria
        }));

        const result = await registrarMateriaProfesor(relaciones);

        if (result && result.mensaje) {
            mostrarMensaje('Exito', 'Relación registrada exitosamente');
            limpiarInterfaz()
        } else {
            mostrarMensaje('Error', 'Error al registrar la relación');
        }
    } else {
        mostrarMensaje('Advertencia', 'Seleccione una materia y un profesor');
    }
};

    const cargarProfesoresPorMateria = async (idMateria) => {
        try {
            const data = await obtenerProfesorPorMateria(idMateria);
            if (data && Array.isArray(data.profesor)) {
                const dniProfesores = data.profesor
                    .filter(prof => prof.dni_profesional) // Filtrar objetos que tengan `dni_profesor` definido
                    .map(prof => prof.dni_profesional.toString()); // Convertir a string
                setSelectedProfesores(dniProfesores); // Actualizar con las claves correctas
                console.log(data.profesor);
            } else {
                console.error('El formato de profesores obtenidos no es válido:', data);
                setSelectedProfesores([]); // Limpiar en caso de error
            }
        } catch (error) {
            console.error('Error al cargar los profesores por materia:', error);
            setSelectedProfesores([]); // Limpiar en caso de error
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

    const handleDeshabilitarMateria = () => {
            if (!selectedMateria) {
                mostrarMensaje('Advertencia', 'No hay una materia seleccionada');
                return;
            }
            mostrarConfirmacion(
                'Confirmación',
                '¿Seguro que quiere deshabilitar la materia?',
                async () => {
                    try {
                        const respuesta = await deshabilitarMateria(selectedMateria);
                        if (respuesta && respuesta.mensaje === 'Materia deshabilitado exitosamente') {
                            setSelectedMateria(null);
                            mostrarMensaje('Éxito', 'Materia deshabilitado exitosamente');
                        } else {
                            mostrarMensaje('Error', respuesta.mensaje || 'Error al deshabilitar la materia');
                        }
                    } catch (error) {
                        mostrarMensaje('Error', 'Error al deshabilitar la materia');
                    }
                    cargarProfesores()
                    cargarMateriasDeshabilitadas
                    cargarMaterias()
                    limpiarInterfaz()
                }
            );
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
                limpiarInterfaz()
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
                mostrarMensaje('Exito', 'Materia habilitada exitosamente')
                cargarMaterias();
                cargarProfesores();
                cargarMateriasDeshabilitadas();
                limpiarInterfaz()
                return true;
            } else {
                mostrarMensaje('Error', 'Error al habilitar la materia');
                return false;
            }
        } catch (error) {
            console.error('Error en handleHabilitarMateria:', error);
            return false;
        }
    };

    const handleConfirmarModificacion = async () => {
        try {
            // Filtra las materias que tienen id_estado_general === 1
            const materiasAHabilitar = materiasDeshabilitadas.filter(
                (materia) => materia.id_estado_general === 1
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
            mostrarMensaje('Exito', 'Materia habilitada exitosamente')
        } catch (error) {
            console.error('Error al habilitar materias:', error);
            mostrarMensaje('Error', 'Error al habilitar la materia')
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
                        id_estado_general: 1, // Cambia el estado a 1
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
            <View style={styles.formulario}>
                <Text style={styles.titulo}>Gestión de Materias</Text>
                <View style={styles.fila}>
                    {/* Columna izquierda: Picker de tareas y agregar */}
                    <View style={styles.columna}>
                        <Text style={styles.label}>Materia:</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedMateria}
                                onValueChange={handleMateriaChange}
                                style={styles.inputPicker}
                            >
                                <Picker.Item label="Seleccionar una Materia" value="" />
                                {materias.map((materia) => (
                                    <Picker.Item key={materia.key} label={materia.value} value={materia.key} />
                                ))}
                            </Picker>
                            <TouchableOpacity style={styles.botonAgregar} onPress={() => setModalVisible(true)}>
                                <Text style={styles.textoBotonAgregar}>+</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.label}>Profesores asignables:</Text>
                        <View style={styles.seleccionadasContainer}>
                            <MultiSelect
                            items={profesores} // Lista de profesores disponibles
                            uniqueKey="key" // Clave única para cada profesor
                            onSelectedItemsChange={(selectedItems) => setSelectedProfesores(selectedItems)} // Actualiza los profesores seleccionados
                            selectedItems={selectedProfesores} // Profesores seleccionados
                            selectText="Seleccionar Profesores"
                            searchInputPlaceholderText="Buscar..."
                            displayKey="value" // Clave para mostrar el nombre del profesor
                            submitButtonColor="#48d22b"
                            submitButtonText="Seleccionar"
                            styleDropdownMenu={styles.dropdown}
                        />
                        </View>
                    </View>
                    {/* Columna derecha: Acciones */}
                    <View style={styles.columna}>
                        <TouchableOpacity style={styles.botonAlta} onPress={cargarMateriaProfesor}>
                            <Text style={styles.textoBoton}>Registrar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botonBaja} onPress={handleDeshabilitarMateria}>
                            <Text style={styles.textoBoton}>Eliminar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botonModificar} onPress={() => setModalModificarVisible(true)}>
                            <Text style={styles.textoBoton}>Modificar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botonLimpiar} onPress={limpiarInterfaz}>
                            <Text style={styles.textoBoton}>Limpiar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Modal para agregar materia */}
                <Modal visible={modalVisible} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.titulo}>Nueva Materia</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ingrese nombre de la materia"
                                value={nuevaMateria}
                                onChangeText={setNuevaMateria}
                            />
                            <View style={styles.botonesModal}>
                                <TouchableOpacity style={styles.botonAlta} onPress={handleRegistrarMateria}>
                                    <Text style={styles.textoBoton}>Registrar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.botonBaja} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.textoBoton}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                
                    </View>
                </Modal>
                {/* Modal para modificar materias */}
                <Modal visible={modalModificarVisible} transparent animationType="slide">
    <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
            <Text style={styles.titulo}>Modificar Materias</Text>
            {materiasDeshabilitadas.length === 0 ? (
                <Text>No hay materias deshabilitadas.</Text>
            ) : (
                materiasDeshabilitadas.map((materia) => (
                    <View key={materia.id_materia} style={styles.itemContainer}>
                        <Text style={styles.textoTarea}>{materia.detalle}</Text>
                        <Switch
                            value={materia.id_estado_general === 1}
                            onValueChange={() => toggleSwitch(materia.id_materia)}
                        />
                    </View>
                ))
            )}
            <View style={styles.botonesModal}>
                <TouchableOpacity style={styles.botonAlta} onPress={handleConfirmarModificacion}>
                    <Text style={styles.textoBoton}>Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botonBaja} onPress={() => setModalModificarVisible(false)}>
                    <Text style={styles.textoBoton}>Cancelar</Text>
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