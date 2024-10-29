import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React from "react";
import bg from '../../assets/bg1.jpg';

export default function JustificarFaltaP_P() {
    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg}></Image>
            <View style={styles.contenido}>
                <View style={styles.contenidoFecha}>
                    <View style={styles.filaInputs}>
                        <Text style={styles.label}>Fecha desde:</Text>
                        <TextInput placeholder='--/--/----' style={Platform.OS === 'web' ? styles.inputPequeño : styles.input} />
                    </View>
                    <View style={styles.filaInputs}>
                        <Text style={styles.label}>Fecha hasta:</Text>
                        <TextInput placeholder='--/--/----' style={Platform.OS === 'web' ? styles.inputPequeño : styles.input} />
                    </View>
                    <TouchableOpacity style={styles.boton}>
                        <Text style={styles.botonTexto}>Consultar</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal>
                    <View style={styles.tabla}>
                        <View style={[styles.fila, styles.encabezados]}>
                            <Text style={styles.encabezado}>Nombre</Text>
                            <Text style={styles.encabezado}>Fecha</Text>
                            <Text style={styles.encabezado}>Estado de la Falta</Text>
                            <Text style={styles.encabezado}>Certificado Médico</Text>
                            <Text style={styles.encabezado}>Días Habilitados</Text>
                        </View>
                        
                        <View style={styles.fila}>
                            <Text style={styles.celda}>Juan Pérez</Text>
                            <TextInput style={styles.celda} placeholder="--/--/----" />
                            <Picker style={styles.celda}>
                                <Picker.Item label="Ausente Justificado" value="ausenteJustificado" />
                                <Picker.Item label="Ausente" value="ausente" />
                                <Picker.Item label="Tarde" value="tarde" />
                            </Picker>
                            <Picker style={styles.celda}>
                                <Picker.Item label="No entregado" value="no" />
                                <Picker.Item label="Entregado" value="si" />
                            </Picker>
                            <TextInput style={styles.celda} placeholder="Días habilitados" keyboardType="numeric" />
                            <TouchableOpacity style={styles.archivo}><Text style={styles.archivoInfo}>📁</Text></TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
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
        alignItems: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: -1,
    },
    contenido: {
        width: '70%',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center', 
    },
    contenidoFecha: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    filaInputs: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
        textAlign: 'center',
    },
    inputPequeño: {
        width: '100%',
        padding: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
        textAlign: 'center', 
    },
    boton: {
        backgroundColor: '#CED9EF',
        borderColor: '#0500FF',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignSelf: 'center',
    },
    botonTexto: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center', 
    },
    tabla: {
        marginTop: 20,
    },
    encabezados: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    fila: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        alignItems: 'center', 
    },
    encabezado: {
        fontWeight: 'bold',
        width: 200,
        marginRight: 10,
        textAlign: 'center',
    },
    celda: {
        flex: 1,
        width: 200,
        textAlign: 'center',
        borderWidth: 1,
        marginRight: 10,
        borderColor: '#ccc',
        padding: 8,
    },
    archivo: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    archivoInfo: {
        fontSize: 18,
        textAlign: 'center',
    },
});
