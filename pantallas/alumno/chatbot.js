import { StyleSheet, View, Image, TouchableOpacity, TextInput, Text, ScrollView } from 'react-native';
import React from "react";
import bg from '../../assets/bg1.jpg';

export default function ChatBot() {
    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg}></Image>

            <ScrollView style={styles.chat}>
                <View style={styles.mensajeAlumno}>
                    <Text style={styles.textoAlumno}>¿Qué materias tengo mañana?</Text>
                </View>
                <View style={styles.mensajeBot}>
                    <Text style={styles.textoBot}>Las materias que tendrás mañana son: Biología, Matemáticas, Lengua.</Text>
                </View>
            </ScrollView>

            <View style={styles.inputArea}>
                <TextInput style={styles.inputTexto} placeholder='Escribe una pregunta' />
                <TouchableOpacity style={styles.boton}>
                    <Text style={styles.textoBoton}>ENVIAR</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    padre: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    bg: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.1,
    },
    chat: {
        flex: 1,
        marginTop:5,
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 3,
    },
    mensajeAlumno: {
        alignSelf: 'flex-start',
        backgroundColor: '#DCF8C6',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        maxWidth: '80%',
    },
    mensajeBot: {
        alignSelf: 'flex-end',
        backgroundColor: '#E5E5EA',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        maxWidth: '80%',
    },
    textoAlumno: {
        color: '#000',
    },
    textoBot: {
        color: '#000',
    },
    inputArea: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        marginBottom: 20,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 10,
    },
    inputTexto: {
        height: 40,
        width: '75%',
        backgroundColor: '#f2f2f2',
        borderRadius: 20,
        paddingHorizontal: 15,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    boton: {
        height: 40,
        width: '20%',
        backgroundColor: '#C5C3C3',
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5,
    },
    textoBoton: {
        color: 'black',
        fontWeight: 'bold',
    }
});
