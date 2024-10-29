import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from "react";
import bg from '../../assets/bg1.jpg';
import MultiSelect from 'react-native-multiple-select';

export default function RegistrarRol() {
    const [selectedItems, setSelectedItems] = useState([]);

    const tareas = [
        { id: '1', name: 'Tarea 1' },
        { id: '2', name: 'Tarea 2' },
        { id: '3', name: 'Tarea 3' },
        { id: '4', name: 'Tarea 4' },
    ];

    const onSelectedItemsChange = (selectedItems) => {
        setSelectedItems(selectedItems);
    };

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg}></Image>
            <Text style={styles.titulo}>Agregar Rol</Text>
            <TextInput
                style={styles.input}
                placeholder='Agregar un nuevo rol'
            />
            <Text style={styles.titulo}>Tareas asignables al rol</Text>

            <MultiSelect
                items={tareas}
                uniqueKey="id"
                onSelectedItemsChange={onSelectedItemsChange}
                selectedItems={selectedItems}
                selectText="Seleccionar tareas"
                searchInputPlaceholderText="Buscar tareas..."
                tagRemoveIconColor="#CCC"
                tagBorderColor="#CCC"
                tagTextColor="#000"
                selectedItemTextColor="#CCC"
                selectedItemIconColor="#CCC"
                itemTextColor="#000"
                displayKey="name"
                searchInputStyle={{ color: '#CCC' }}
                submitButtonColor="#48d22b"
                submitButtonText="Seleccionar"
                styleDropdownMenu={styles.dropdown}
            />

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
});
