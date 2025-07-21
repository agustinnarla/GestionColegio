import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function BotonTarea({ tarea, onPress }) {
    return (
        <TouchableOpacity style={styles.boton} onPress={() => onPress(tarea)}>
            <Text style={styles.texto}>{tarea.detalle}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    boton: {
        backgroundColor: '#F0F4FF',
        borderRadius: 10,
        borderColor: '#000AFF',
        borderWidth: 0.5,
        paddingVertical: 15,
        width: 200,
        margin: 10,
        shadowColor: '#6D8FE5',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.71,
        shadowRadius: 6,
        elevation: 4,
    },
    texto: {
        textAlign: 'center',
        color: 'black',
    },
});