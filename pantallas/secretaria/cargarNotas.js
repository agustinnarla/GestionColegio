import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from "react";
import bg from '../../assets/bg1.jpg';

export default function CargarNotas() {
    
    const [datos, setDatos] = useState([]);
    const [notas, setNotas] = useState({});

    const consultarDatos = () => {
        // Simulando datos obtenidos
        const datosSimulados = [
            { id: '1', materia: 'Matematica', nombre: 'Agustín'},
            { id: '2', materia: 'Matematica', nombre: 'Roberto' },
        ];
        setDatos(datosSimulados);
    };

    const reiniciarFiltro = () => {
        setDatos([]);
        setNotas({});
    };

    const handleNotaChange = (id, valorNota, numeroEvaluacion) => {
        // Actualizar las notas ingresadas en el estado
        setNotas(prevState => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                [numeroEvaluacion]: parseFloat(valorNota) || 0
            }
        }));
    };

    const calcularPromedio = (id) => {
        const notasEvaluacion = notas[id] || {};
        const totalNotas = Object.values(notasEvaluacion);
        if (totalNotas.length === 0) return 0;
        
        const suma = totalNotas.reduce((acc, curr) => acc + curr, 0);
        return (suma / totalNotas.length).toFixed(2);
    };

    const renderItem = ({ item }) => {
        const promedio = calcularPromedio(item.id);

        return (
            <View style={styles.fila}>
                <Text style={styles.celda}>{item.materia}</Text>
                <Text style={styles.celda}>{item.nombre}</Text>
                {/* Inputs para las notas */}
                <View style={styles.notasContainer}>
                    {[1, 2, 3,4,5,6].map((evaluacion) => (
                        <TextInput
                            key={evaluacion}
                            style={styles.inputNota}
                            keyboardType="numeric"
                            placeholder={`Nota ${evaluacion}`}
                            onChangeText={valorNota => handleNotaChange(item.id, valorNota, evaluacion)}
                        />
                    ))}
                </View>

                <Text style={styles.promedioText}>Promedio: {promedio}</Text>
            </View>
        );
    };

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg} />
            
            <View style={styles.contenido}>
                <View style={styles.filtroContainer}>
                    <Picker style={styles.curso}>
                        <Picker.Item label='Selecciona un curso' value="" />
                        <Picker.Item label='Curso 1' value="curso1" />
                        <Picker.Item label='Curso 2' value="curso2" />
                    </Picker>
                </View>
                
                <View style={styles.filtroContainer}>
                    <Picker style={styles.etapa}>
                        <Picker.Item label='Selecciona la etapa' value="" />
                        <Picker.Item label='Primer Etapa' value="pri" />
                        <Picker.Item label='Segunda Etapa' value="seg" />
                    </Picker>
                </View>

                <View style={styles.materia}>
                    <Picker style={styles.etapa}>
                        <Picker.Item label='Selecciona la materia' value="" />
                        <Picker.Item label='Matematica' value="mat" />
                        <Picker.Item label='Fisica' value="fis" />
                    </Picker>
                </View>
                
                <TouchableOpacity style={styles.botonConsultar} onPress={consultarDatos}>
                    <Text style={styles.textoBoton}>Consultar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.botonReiniciar} onPress={reiniciarFiltro}>
                    <Text style={styles.textoBoton}>Reiniciar Filtro</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botonReiniciar} onPress={reiniciarFiltro}>
                    <Text style={styles.textoBoton}>📁</Text>
                </TouchableOpacity>
            </View>
            
            {/* Grilla para mostrar las notas */}
            {datos.length > 0 && (
                <View style={styles.grilla}>
                    <View style={styles.encabezado}>
                        <Text style={styles.celdaEncabezado}>Materia</Text>
                        <Text style={styles.celdaEncabezado}>Nombre</Text>
                        <Text style={styles.celdaEncabezado}>Notas</Text>
                        <Text style={styles.celdaEncabezado}>Promedio</Text>
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
    curso: {
        height: 50,
        width: 300, 
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
    },
    etapa: {
        height: 50,
        width: 200,
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
    },
    materia: {
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
    notasContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flex: 1,
    },
    inputNota: {
        width: 50,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        textAlign: 'center',
        marginHorizontal: 5,
    },
    promedioText: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
