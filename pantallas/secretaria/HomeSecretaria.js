import { Text, StyleSheet, View, ScrollView, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

import bg from '../../assets/bg1.jpg';

// Obtén el ancho de la ventana
const { width } = Dimensions.get('window');
const isDesktop = width >= 768; // Ajusta el valor según lo que consideres como pantalla de escritorio

export default function HomeSecretaria() {
    const navegacion = useNavigation();
    return (
        <View style={styles.padre}>
            <ImageBackground source={bg} style={styles.bg}>
                <ScrollView
                    contentContainerStyle={isDesktop ? styles.scrollContainerDesktop : styles.scrollContainerMobile}
                >
                    
                    <View style={styles.contenedorFilas}>
                        <View style={styles.filaBotones}>
                            <TouchableOpacity style={styles.cajaBoton} onPress={() => navegacion.navigate('Gestionar Alumno')}>
                                <Text style={styles.textoBoton}>Gestionar Alumno</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cajaBoton} onPress={() => navegacion.navigate('Gestionar Profesor/Preceptor')}>
                                <Text style={styles.textoBoton}>Gestionar Profesor/Preceptor</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cajaBoton} onPress={() => navegacion.navigate('Cargar Notas')}>
                                <Text style={styles.textoBoton}>Cargar Notas</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cajaBoton} onPress={() => navegacion.navigate('Asignacion de Horas')}>
                                <Text style={styles.textoBoton}>Asignación de Horas</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.filaBotones}>
                            <TouchableOpacity style={styles.cajaBoton} onPress={() => navegacion.navigate('Asistencia Profesor/Preceptor')}>
                                <Text style={styles.textoBoton}>Asistencia Profesor/Preceptor</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cajaBoton} onPress={() => navegacion.navigate('Justificar Falta Profesor/Preceptor')}>
                                <Text style={styles.textoBoton}>Justificar Falta</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cajaBoton} onPress={() => navegacion.navigate('Libro Matriz')}>
                                <Text style={styles.textoBoton}>Libro Matriz</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cajaBoton} onPress={() => navegacion.navigate('Pasar De Curso')}>
                                <Text style={styles.textoBoton}>Pasar de curso</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cajaBoton} onPress={() => navegacion.navigate('Crear Avisos')}>
                                <Text style={styles.textoBoton}>Crear Avisos</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>
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
    contenedorFilas: {
        width: '100%',
        maxWidth: 900,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '20%',
    },
    filaBotones: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 10,
    },
    scrollContainerDesktop: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scrollContainerMobile: {
        alignItems: 'center',
    },
    padreBoton: {
        alignItems: 'center',
        margin: 100,
    },
    padreBotonDesktop: {
        flexDirection: 'wrap',
        flexWrap: 'wrap',
        justifyContent: 'center',
        margin: 20,
    },
    cajaBoton: {
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
    textoBoton: {
        textAlign: 'center',
        color: 'black',
    },
    bg: {
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
});
