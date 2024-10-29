import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from "react";
import bg from '../../assets/bg1.jpg';

export default function ConsultarLibro() {
    const [datos, setDatos] = useState([]);
    
    const consultarDatos = () => {
        // Simulando datos obtenidos
        const datosSimulados = [
            { id: '1', materia: 'Biología', nombre: 'Clase 1', categoria: 'Teoría', queSeDio: 'Genética' },
            { id: '2', materia: 'Biología', nombre: 'Clase 2', categoria: 'Práctica', queSeDio: 'Genética' },
        ];
        setDatos(datosSimulados);
    };

    const reiniciarFiltro = () => {
        setDatos([]);
    };

    const renderItem = ({ item }) => (
        <View style={styles.fila}>
            <Text style={styles.celda}>{item.materia}</Text>
            <Text style={styles.celda}>{item.nombre}</Text>
            <Text style={styles.celda}>{item.categoria}</Text>
            <Text style={styles.celda}>{item.queSeDio}</Text>
        </View>
    );

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg} />
            
            <View style={styles.contenido}>
                <View style={styles.filtroContainer}>
                   
                    <Picker style={styles.materias}>
                        <Picker.Item label='Seleccionar espacio Curricular' value="" />
                        <Picker.Item label='Biología' value="Biologia" />
                        <Picker.Item label='Química' value="Quimica" />
                    </Picker>
                </View>
                
                <View style={styles.filtroContainer}>
                  
                    <Picker style={styles.profesores}>
                        <Picker.Item label='Seleccionar profesor' value="" />
                        <Picker.Item label='Profesor 1' value="Profesor1" />
                        <Picker.Item label='Profesor 2' value="Profesor2" />
                    </Picker>
                </View>
                
                <TouchableOpacity style={styles.botonConsultar} onPress={consultarDatos}>
                    <Text style={styles.textoBoton}>Consultar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.botonReiniciar} onPress={reiniciarFiltro}>
                    <Text style={styles.textoBoton}>Reiniciar Filtro</Text>
                </TouchableOpacity>
            </View>
            
            {/* Grilla */}
            {datos.length > 0 && (
                <View style={styles.grilla}>
                    <View style={styles.encabezado}>
                        <Text style={styles.celdaEncabezado}>Materia</Text>
                        <Text style={styles.celdaEncabezado}>Nombre</Text>
                        <Text style={styles.celdaEncabezado}>Categoría</Text>
                        <Text style={styles.celdaEncabezado}>Qué se dio</Text>
                    </View>
                    <FlatList
                        data={datos}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    />
                </View>
            )}
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
        width: '100%',
        height: '100%',
    },
    contenido: {
        flexDirection: 'row',
        justifyContent: 'space-around',  
        alignItems: 'center',
        marginTop: 20,
        width: '80%', 
        paddingHorizontal: 10,
    },
    filtroContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    materias: {
        height: 50,
        width: 300, 
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
    },
    profesores: {
        height: 50,
        width: 200,
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
    },
    botonConsultar: {
        backgroundColor: '#CED9EF',
        borderColor: '#0500FF',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginHorizontal: 10, 
        alignItems: 'center',
    },
    botonReiniciar: {
        backgroundColor: '#DADADA',
        borderColor: '#000000',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    textoBoton: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
    grilla: {
        marginTop: 20,
        width: '90%',
    },
    encabezado: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#ccc',
    },
    fila: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    celdaEncabezado: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    celda: {
        flex: 1,
        textAlign: 'center',
    },
});
