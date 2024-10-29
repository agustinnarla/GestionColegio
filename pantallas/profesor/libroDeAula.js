import { StyleSheet, View, Image, ScrollView, TextInput, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from "react";
import bg from '../../assets/bg1.jpg';

export default function LibroAula() {
    const [materia, setMateria] = useState('');
    const [caracteristica, setCaracteristica] = useState('');

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg} />
            <ScrollView contentContainerStyle={styles.contenidoScroll}>
                <Text style={styles.label}>Materia</Text>
                <View style={styles.contenidoLista}>
                    <Picker
                        selectedValue={materia}
                        onValueChange={(itemValue) => setMateria(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label='Seleccionar Materia' value='' />
                        <Picker.Item label='Biología' value='Biología' />
                        <Picker.Item label='Química' value='Química' />
                    </Picker>
                </View>

                <Text style={styles.label}>Fecha</Text>
                <TextInput style={styles.input} placeholder='--/--/----' keyboardType="numeric" />

                <Text style={styles.label}>Clase N°</Text>
                <TextInput style={styles.input} placeholder='0' keyboardType="numeric" />

                <Text style={styles.label}>Unidad</Text>
                <TextInput style={styles.input} placeholder='1' keyboardType="numeric" />

                <Text style={styles.label}>Características de la unidad</Text>
                <View style={styles.contenidoLista}>
                    <Picker
                        selectedValue={caracteristica}
                        onValueChange={(itemValue) => setCaracteristica(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label='Seleccionar característica' value='' />
                        <Picker.Item label='Evaluativa' value='Evaluativa' />
                        <Picker.Item label='Práctica' value='Práctica' />
                    </Picker>
                </View>

                <Text style={styles.label}>Tema abarcado</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder='Genética: Conceptos de fenotipo-genotipo'
                    multiline={true}
                    numberOfLines={4}
                />

                <View style={styles.contenidoBoton}>
                    <TouchableOpacity style={styles.botonRegistrar}>
                        <Text style={styles.textoBoton}>Registrar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botonCancelar}>
                        <Text style={styles.textoBoton}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    padre: {
        flex: 1,
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
    contenidoScroll: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#2c3e50',
    },
    contenidoLista: {
        borderWidth: 1,
        borderColor: '#bdc3c7',
        borderRadius: 5,
        marginBottom: 15,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    input: {
        borderWidth: 1,
        borderColor: '#bdc3c7',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#ecf0f1',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top', 
    },
    contenidoBoton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    botonRegistrar: {
        backgroundColor: '#CFEFCE',
        borderColor:'#33FF00',
        borderWidth:1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,

    },
    botonCancelar: {
        backgroundColor: '#F3B9B9',
        borderColor:'#FF0000',
        borderWidth:1,
        paddingVertical: 15,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    textoBoton: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
