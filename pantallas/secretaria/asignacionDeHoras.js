import React, { useState } from 'react';
import { StyleSheet, View, Text, Picker, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
import bg from '../../assets/bg1.jpg';

export default function AsignacionHoras() {
    const [profesor, setProfesor] = useState('');
    const [curso, setCurso] = useState('');
    const [materia, setMateria] = useState('');
    const [datos, setDatos] = useState([]);

    const handleConsultar = () => {
        // Simulación de carga de datos para la grilla
        const datosSimulados = [
            { id: '1', materia: 'Materia 1', entrada: '08:00', salida: '10:00' },
        ];
        setDatos(datosSimulados);
    };

    const handleReiniciar = () => {
        setProfesor('');
        setCurso('');
        setMateria('');
    };

    const renderItem = ({ item }) => (
        <View style={styles.grillaFila}>
            <Text style={styles.grillaCelda}>{item.materia}</Text>
            <TextInput
                style={styles.grillaCeldaInput}
                placeholder="Hora de entrada"
                value={item.entrada}
            />
            <TextInput
                style={styles.grillaCeldaInput}
                placeholder="Hora de salida"
                value={item.salida}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <Image source={bg} style={styles.bg} />
                <View style={styles.selectorContainer}>
                    <View style={styles.selector}>
                        <Text style={styles.label}>Profesor</Text>
                        <Picker
                            selectedValue={profesor}
                            onValueChange={(itemValue) => setProfesor(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Seleccione un profesor" value="" />
                            <Picker.Item label="Profesor 1" value="profesor1" />
                            <Picker.Item label="Profesor 2" value="profesor2" />
                        </Picker>
                    </View>
                    <View style={styles.selector}>
                        <Text style={styles.label}>Curso</Text>
                        <Picker
                            selectedValue={curso}
                            onValueChange={(itemValue) => setCurso(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Seleccione un curso" value="" />
                            <Picker.Item label="Curso 1" value="curso1" />
                            <Picker.Item label="Curso 2" value="curso2" />
                        </Picker>
                    </View>
                    <View style={styles.selector}>
                        <Text style={styles.label}>Materia</Text>
                        <Picker
                            selectedValue={materia}
                            onValueChange={(itemValue) => setMateria(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Seleccione una materia" value="" />
                            <Picker.Item label="Materia 1" value="materia1" />
                            <Picker.Item label="Materia 2" value="materia2" />
                        </Picker>
                    </View>
                </View>

                {/* Botones de acción */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            (profesor && curso && materia) ? styles.buttonEnabled : styles.buttonDisabled,
                        ]}
                        onPress={handleConsultar}
                        disabled={!profesor || !curso || !materia}
                    >
                        <Text style={styles.buttonText}>Consultar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleReiniciar}>
                        <Text style={styles.buttonText}>Reiniciar Filtro</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleReiniciar}>
                        <Text style={styles.buttonText}>Subir Archivo</Text>
                    </TouchableOpacity>
                </View>

                {/* Grilla */}
                {datos.length > 0 && (
                    <View style={styles.grilla}>
                        <View style={styles.grillaEncabezado}>
                            <Text style={styles.grillaEncabezadoCelda}>Materia</Text>
                            <Text style={styles.grillaEncabezadoCelda}>Entrada</Text>
                            <Text style={styles.grillaEncabezadoCelda}>Salida</Text>
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
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      
    },
    bg: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    selectorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginBottom: 20,
    },
    selector: {
        flex: 1,
        marginHorizontal: 5,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    picker: {
        height: 50,
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 20,
    },
    button: {
        padding: 10,
        backgroundColor: '#ccc',
        borderRadius: 5,
        margin: 10,
        minWidth: '20%',
        alignItems: 'center',
    },
    buttonEnabled: {
        backgroundColor: '#CED9EF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        borderColor: '#0500FF',
        borderWidth: 0.4,
        alignItems: 'center',
        shadowColor: '#BAAFFF',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.71,
        shadowRadius: 6,
        elevation: 4,
    },
    buttonDisabled: {
        backgroundColor: '#DADADA',
        borderColor: '#000000',
        borderWidth: 0.4,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
    },
    grilla: {
        marginTop: 20,
        width: '90%',
    },
    grillaEncabezado: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#ccc',
    },
    grillaEncabezadoCelda: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    grillaFila: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    grillaCelda: {
        flex: 1,
        textAlign: 'center',
    },
    grillaCeldaInput: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        textAlign: 'center',
    },
});
