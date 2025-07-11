import { Text, StyleSheet, View, ScrollView, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

import bg from '../../assets/bg1.jpg';

// Obtén el ancho de la ventana
const { width } = Dimensions.get('window');
const isDesktop = width >= 768; // valor  como pantalla de escritorio

export default function HomeAdmin() {
    const navegacion = useNavigation();
    return (
        <View style={styles.padre}>
            <ImageBackground source={bg} style={styles.bg}>
                <ScrollView
                    contentContainerStyle={isDesktop ? styles.scrollContainerDesktop : styles.scrollContainerMobile}
                    horizontal={isDesktop} // Establece horizontal en true si es una pantalla de escritorio
                >
                    <View style={isDesktop ? styles.padreBotonDesktop : styles.padreBoton}>
                        <TouchableOpacity style={styles.cajaBoton} onPress={() => navegacion.navigate('Gestionar Materias')}>
                            <Text style={styles.textoBoton}>Gestionar Materias</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cajaBoton} onPress={() => navegacion.navigate('Registrar Usuario')}>
                            <Text style={styles.textoBoton}>Registrar Usuario</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cajaBoton} onPress={() => navegacion.navigate('Registrar Curso')}>
                            <Text style={styles.textoBoton}>Registrar Curso</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cajaBoton} onPress={() => navegacion.navigate('Registrar Rol')}>
                            <Text style={styles.textoBoton}>Registrar Rol</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cajaBoton} onPress={() => navegacion.navigate('Cargar Tareas')}>
                            <Text style={styles.textoBoton}>Cargar Tareas</Text>
                        </TouchableOpacity>
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
