import { Text, StyleSheet, View,Image,TouchableOpacity,ImageBackground, ScrollView, Dimensions } from 'react-native'
import React, {useState, useEffect} from 'react'
import { useNavigation } from '@react-navigation/native'

import BotonTarea from '../../componente/BotonTarea.jsx';
import { obtenerTareasPorRol} from '../../scripts/navegacion/scriptLogin.js';
import bg from '../../assets/bg1.jpg';

// Obtén el ancho de la ventana
const { width } = Dimensions.get('window');
const isDesktop = width >= 768; // valor  como pantalla de escritorio

export default function HomePreceptor({ route }) {
    const navegacion = useNavigation();
    const [tareas, setTareas] = useState([]);
    const id_rol = route?.params?.id_rol;
    const dni_usuario = route?.params?.dni_usuario;

    useEffect(() => {
        const cargarTareas = async () => {
            const data = await obtenerTareasPorRol(id_rol);
            setTareas(data.tareas || []);

        }
        if (id_rol) {
            cargarTareas();
        }
    }, [id_rol]);

    return (
        <View style={styles.padre}>
            <ImageBackground source={bg} style={styles.bg}>
                <ScrollView
                    contentContainerStyle={isDesktop ? styles.scrollContainerDesktop : styles.scrollContainerMobile}
                    horizontal={isDesktop} 
                >
                    <View style={isDesktop ? styles.padreBotonDesktop : styles.padreBoton}>
                        {tareas.map((tarea) => (
                            <BotonTarea
                                key={tarea.id_tarea}
                                tarea={tarea}
                                onPress={(t) => navegacion.navigate(t.ruta, { dni_usuario })}
                            />
                        ))}
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
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 40,
        maxWidth: 600,
    },
    padreBotonDesktop: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 40,
        paddingVertical: 40,
        maxWidth: 800,
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
