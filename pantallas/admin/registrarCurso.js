import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import MultiSelect from 'react-native-multiple-select';
import bg from '../../assets/bg1.jpg';
import { obtenerMateria, obtenerEspecialidad } from '../../scripts/listasDesplegables/listaDesplegable.js';
import { registrarCurso } from '../../scripts/admin/scriptRegistrarCurso';

export default function RegistrarCurso() {
    const [materias, setMaterias] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [materiasSeleccionadas, setMateriasSeleccionadas] = useState([]);

    const [formData, setFormData] = useState({
        detalle: '',
        id_especialidad: '',
        id_materias: [],
    });

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // Cargar materias
                const materiasData = await obtenerMateria();
                console.log("Datos obtenidos de la API (Materias):", materiasData);
    
                const materiasTransformadas = Array.isArray(materiasData)
                    ? materiasData.map(materia => ({
                        id: materia.id_materia, // Cambia `id_materia` a `id`
                        name: materia.detalle, // Cambia `detalle` a `name`
                    }))
                    : [];
    
                console.log("Materias transformadas:", materiasTransformadas);
                setMaterias(materiasTransformadas);
    
                // Cargar especialidades
                const especialidadesData = await obtenerEspecialidad();
                console.log("Datos obtenidos de la API (Especialidades):", especialidadesData);
    
                const especialidadesTransformadas = Array.isArray(especialidadesData.especialidad)
                    ? especialidadesData.especialidad.map(especialidad => ({
                        id: especialidad.id_especialidad, // Cambia `id_especialidad` a `id`
                        name: especialidad.detalle, // Cambia `detalle` a `name`
                    }))
                    : [];
    
                console.log("Especialidades transformadas:", especialidadesTransformadas);
                setEspecialidades(especialidadesTransformadas);
            } catch (error) {
                console.error("Error al cargar los datos:", error.message);
                Alert.alert('Error', 'No se pudieron cargar los datos.');
            }
        };
        cargarDatos();
    }, []);

    // Manejar cambios en el formulario
    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleRegistrar = async () => {
        if (!formData.detalle) {
            Alert.alert('Error', 'Por favor ingrese el nombre del curso');
            return;
        }
        if (materiasSeleccionadas.length === 0) {
            Alert.alert('Error', 'Por favor seleccione al menos una materia');
            return;
        }

        const cursoData = {
            detalle: formData.detalle,
            id_especialidad: parseInt(formData.id_especialidad),
            id_materias: materiasSeleccionadas
        };
        
        try {
            const respuesta = await registrarCurso(cursoData);
            console.log('Curso Registrado:', respuesta);
            limpiarInterfaz();
            Alert.alert('Éxito', 'Curso registrado exitosamente');
        } catch (error) {
            console.error('Error al registrar el curso:', error);
            Alert.alert('Error', 'No se pudo registrar el curso');
        }
    };

    const limpiarInterfaz = () => {
        try {
            setFormData({
                detalle: '',
                id_especialidad: '',
                id_materias: [],
            });
            setMateriasSeleccionadas([]);
            console.log('Interfaz limpiada correctamente');
        } catch (error) {
            console.error('Error al limpiar la interfaz:', error.message);
        }
    };

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg} />
            <View style={styles.contenido}>
                <Text style={styles.titulo}>Registrar Curso</Text>
                <TextInput
                    placeholder="Nombre del curso"
                    placeholderTextColor="#888"
                    style={styles.input}
                    value={formData.detalle}
                    onChangeText={(text) => handleChange('detalle', text)}
                />
                <Text style={styles.label}>Especialidad</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={formData.id_especialidad}
                        onValueChange={(itemValue) => handleChange('id_especialidad', itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Seleccione una especialidad" value="" />
                        {especialidades.map(especialidad => (
                            <Picker.Item
                                key={especialidad.id}
                                label={especialidad.name}
                                value={especialidad.id}
                            />
                        ))}
                    </Picker>
                </View>
                <Text style={styles.label}>Materias asignables</Text>
                <MultiSelect
                    items={materias}
                    uniqueKey="id"
                    onSelectedItemsChange={(selectedItems) => {
                        setMateriasSeleccionadas(selectedItems);
                        handleChange('id_materias', selectedItems);
                    }}
                    selectedItems={materiasSeleccionadas}
                    selectText="Seleccione las materias"
                    searchInputPlaceholderText="Buscar materias..."
                    tagRemoveIconColor="#CCC"
                    tagBorderColor="#CCC"
                    tagTextColor="#000"
                    selectedItemTextColor="#000"
                    selectedItemIconColor="#000"
                    itemTextColor="#000"
                    displayKey="name"
                    searchInputStyle={{ color: '#000' }}
                    submitButtonColor="#48d22b"
                    submitButtonText="Aceptar"
                    styleDropdownMenuSubsection={styles.multiSelect}
                />
                <TouchableOpacity style={styles.botonRegistrar} onPress={handleRegistrar}>
                    <Text style={styles.textoBoton}>Registrar</Text>
                </TouchableOpacity>
            </View>
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
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
        backgroundColor: '#F9F9F9',
        fontSize: 16,
        color: '#333',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        alignSelf: 'flex-start',
        color: '#333',
    },
    pickerContainer: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 8,
        marginBottom: 20,
        justifyContent: 'center',
        backgroundColor: '#F9F9F9',
    },
    picker: {
        width: '100%',
        height: '100%',
        color: '#333',
    },
    multiSelect: {
        width: '100%',
        marginBottom: 20,
    },
    botonRegistrar: {
        width: '100%',
        height: 50,
        backgroundColor: '#48d22b',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    textoBoton: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
});