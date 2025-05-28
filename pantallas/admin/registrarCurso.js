import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
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
                const materiasData = await obtenerMateria();
                const especialidadesData = await obtenerEspecialidad();
                setMaterias(Array.isArray(materiasData) ? materiasData : []);
                setEspecialidades(Array.isArray(especialidadesData) ? especialidadesData : []);
            } catch (error) {
                Alert.alert('Error', error.message);
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
            
            Alert.alert('Éxito', 'Curso registrado exitosamente');
            limpiarInterfaz();
        } catch (error) {
            console.error('Error al registrar el curso:', error.message);
            Alert.alert('Error', 'No se pudo registrar el curso');
        }
    };

    const limpiarInterfaz = () => {
        setFormData({
            detalle: '',
            id_especialidad: '',
            id_materias: [],
        });
        setMateriasSeleccionadas([]);
    };

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg} />
            <View style={styles.contenido}>
                <Text style={styles.titulo}>Curso</Text>
                <TextInput
                    placeholder='Registrar curso'
                    placeholderTextColor="#888"
                    style={styles.input}
                    value={formData.detalle}
                    onChangeText={(text) => handleChange('detalle', text)}
                />
                <Text>Materias asignables a un curso</Text>
                <MultiSelect
                    items={materias}
                    uniqueKey="id"
                    onSelectedItemsChange={setMateriasSeleccionadas}
                    selectedItems={materiasSeleccionadas}
                    selectText="Seleccionar Materias"
                    searchInputPlaceholderText="Buscar..."
                    tagRemoveIconColor="#CCC"
                    tagBorderColor="#CCC"
                    tagTextColor="#CCC"
                    selectedItemTextColor="#CCC"
                    selectedItemIconColor="#CCC"
                    itemTextColor="#000"
                    displayKey="name"
                    searchInputStyle={{ color: '#CCC' }}
                    submitButtonColor="#CCC"
                    submitButtonText="Seleccionar"
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
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: '#fafafa',
        fontSize: 16,
    },
    botonRegistrar: {
        backgroundColor: '#CFEFCE',
        borderColor: '#33FF00',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    textoBoton: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },
});