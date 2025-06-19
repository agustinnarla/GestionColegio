import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import MultiSelect from 'react-native-multiple-select';
import bg from '../../assets/bg1.jpg';
import { obtenerMateria, obtenerEspecialidad } from '../../scripts/listasDesplegables/listaDesplegable.js';
import { registrarCurso } from '../../scripts/admin/scriptRegistrarCurso';
import ListasDesplegables from '../../componente/ListasDesplegables.jsx';

export default function RegistrarCurso() {
    const [materias, setMaterias] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [materiasSeleccionadas, setMateriasSeleccionadas] = useState([]);

    const [formData, setFormData] = useState({
        detalle: '',
        id_especialidad: '',
        id_materia: [],
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
    
    
                console.log("Especialidades transformadas:", especialidadesData);
                setEspecialidades(especialidadesData);
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
            id_materia: materiasSeleccionadas.map(Number)
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
                id_materia: [],
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
                <Text style={styles.label}>Nombre del curso</Text>
                <TextInput
                    placeholder="0° Año - Division"
                    placeholderTextColor="#888"
                    style={styles.input}
                    value={formData.detalle}
                    onChangeText={(text) => handleChange('detalle', text)}
                />
                
               
                     <ListasDesplegables 
                        formData={formData} 
                        handleChange={handleChange} 
                        especialidad={especialidades}
                        styles={styles}
                    />
                
                <Text style={styles.label}>Materias asignables:</Text>
                <MultiSelect
                    items={materias}
                    uniqueKey="id"
                    onSelectedItemsChange={(selectedItems) => {
                        setMateriasSeleccionadas(selectedItems);
                        handleChange('id_materia', selectedItems);
                    }}
                    selectedItems={materiasSeleccionadas}
                    selectText="Seleccione las materias"
                    searchInputPlaceholderText="Buscar materias..."

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
        backgroundColor: '#f4f6fb',
    },
    bg: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        zIndex: -1,
    },
    contenido: {
        width: '100%',
        maxWidth: 720,
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 36,
        marginTop: 36,
        marginBottom: 24,
        shadowColor: '#6c7ae0',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10,
        shadowRadius: 16,
        elevation: 4,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#e3e8f0',
    },
    titulo: {
        fontSize: 26,
        fontWeight: '700',
        color: '#2a3d6c',
        marginBottom: 28,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    label: {
        fontSize: 16,
        marginBottom: 7,
        fontWeight: '600',
        color: '#3b4371',
        marginTop: 18,
        letterSpacing: 0.1,
    },
    input: {
        width: '100%',
        height: 46,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 10,
        paddingHorizontal: 14,
        marginBottom: 20,
        backgroundColor: '#f7f8fa',
        fontSize: 16,
        color: '#222',
        fontWeight: '500',
        shadowColor: '#e3e8f0',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
    },
    pickerContainer: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 10,
        marginBottom: 30,
        backgroundColor: '#f7f8fa',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    picker: {
        width: '100%',
        color: '#2a3d6c',
        fontSize: 16,
        backgroundColor: 'transparent',
        fontWeight: '500',
    },
    multiSelect: {
        width: '100%',
        marginBottom: 22,
        marginTop: 30, 
        backgroundColor: '#f7f8fa',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#d1d5db',
        paddingVertical: 2,
    },
    botonRegistrar: {
        width: '50%',
        height: 50,
        backgroundColor: '#e8f5e9',
        borderColor: '#4caf50',
        borderWidth: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 18,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#6c7ae0',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 6,
        alignSelf: 'center',
    },
    textoBoton: {
      
        fontWeight: 'bold',
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
    },
    botonLimpiar: {
        width: '100%',
        height: 44,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d1d5db',
        marginBottom: 4,
    },
    textoBotonSecundario: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6c7ae0',
        letterSpacing: 0.2,
    },
});