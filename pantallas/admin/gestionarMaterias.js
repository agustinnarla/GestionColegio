import { StyleSheet, View, Image, Text, TextInput,TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import bg from '../../assets/bg1.jpg';
import { MultipleSelectList } from 'react-native-dropdown-select-list';

export default function GestionarMaterias() {
    const [selectedProfesores, setProfesores] = useState([]);

    const profesores = [
        { key: '1', value: 'Profesor 1' },
        { key: '2', value: 'Profesor 2' },
        { key: '3', value: 'Profesor 3' },
        { key: '4', value: 'Profesor 4' },
    ];

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg} />
            <View style={styles.contenido}>
                <Text style={styles.titulo}>Materias</Text>
                <TextInput
                    placeholder='Insertar Materia'
                    style={styles.input}
                    placeholderTextColor="#888"
                />
                <Text style={styles.subtitulo}>Profesores asignables a la Materia</Text>

                <MultipleSelectList
                    setSelected={(val) => setProfesores(val)}
                    data={profesores}
                    save="value"
                    label="Profesores"
                    placeholder="Seleccionar Profesores"
                    boxStyles={styles.dropdown}
                    dropdownTextStyles={styles.dropdownText}
                />

                <Text style={styles.seleccionadas}>Profesores seleccionados: {selectedProfesores.join(', ')}</Text>

                <View style={styles.contenidoBoton}>
                    <TouchableOpacity style={styles.botonRegistrar}>
                        <Text style={styles.textoBoton}>Registrar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botonEliminar}>
                        <Text style={styles.textoBoton}>Eliminar</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.contenidoBoton}>
                    <TouchableOpacity style={styles.botonModificar}>
                        <Text style={styles.textoBoton}>Modificar</Text>
                    </TouchableOpacity>
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
    }
});
