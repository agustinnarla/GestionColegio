import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import React from "react";
import { Picker } from '@react-native-picker/picker';
import bg from '../../assets/bg1.jpg';

export default function GestionarObservaciones() {
    const Content = (
        <View style={styles.contenido}>
            <Text style={styles.label}>Curso:</Text>
            <Picker style={styles.lista}>
                <Picker.Item label="Seleccionar Curso" value="" />
                <Picker.Item label="1 B" value="1b" />
                <Picker.Item label="2 B" value="2b" />
            </Picker>

            <Text style={styles.label}>Fecha:</Text>
            <TextInput style={styles.input} placeholder="--/--/----" keyboardType="number-pad" />

            <Text style={styles.label}>Alumno:</Text>
            <Picker style={styles.lista}>
                <Picker.Item label="Selecciona Alumno" value="" />
                <Picker.Item label="Alumno 1" value="alumno1" />
                <Picker.Item label="Alumno 2" value="alumno2" />
            </Picker>

            <Text style={styles.label}>Solicitado Por:</Text>
            <TextInput style={styles.input} placeholder="Solicitado Por" />

            <Text style={styles.label}>Motivo:</Text>
            <TextInput style={styles.input} placeholder="Motivo de la observaciones" />

            <View style={styles.botonesContainer}>
                <TouchableOpacity style={styles.botonRegistrar}>
                    <Text style={styles.textoBoton}>Registrar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botonCancelar}>
                    <Text style={styles.textoBoton}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botonImprimir}>
                    <Text style={styles.textoBoton}>Imprimir</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg} />
            {Platform.OS === 'web' ? Content : <ScrollView contentContainerStyle={styles.scroll}>{Content}</ScrollView>}
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
    scroll:{
        flexGrow: 1,  
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        
    },
    contenido: {
        width: '100%',
        maxWidth: 700,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
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
    lista: {
        width: '100%',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
    },
    botonesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    botonRegistrar: {
        backgroundColor: '#CFEFCE',
        borderColor: '#33FF00',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
    },
    botonCancelar: {
        backgroundColor: '#F3B9B9',
        borderColor: '#FF0000',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 1,
    },
    botonImprimir:{
        flex: 1,
        backgroundColor: '#CED9EF',
        paddingVertical: 12, 
        paddingHorizontal: 20,
        borderRadius: 5,
        borderColor: '#0500FF',
        borderWidth: 0.4,
        marginRight: 15,
        marginLeft: 15,
        alignItems: 'center',
    },
    textoBoton: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
