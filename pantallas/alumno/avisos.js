import { StyleSheet, View, Image, TextInput, Text, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React from "react";
import bg from '../../assets/bg1.jpg';

export default function Avisos() {
    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg} />
            
            
            <View style={styles.filtro}>
                <Picker style={styles.lista}>
                    <Picker.Item label='Curso' value='' />
                    <Picker.Item label='1 b' value='1b' />
                    <Picker.Item label='2 a' value='1a' />
                </Picker>
                <TextInput style={styles.fechaInput} placeholder='--/--/----' />
            </View>
            
            <ScrollView style={styles.scrollAvisos}>
                <View style={styles.tarjeta}>
                    <Text style={styles.textoAviso}>Información: Mañana no habrá clases</Text>
                    <Text style={styles.textoMotivo}>Motivo: Día del maestro</Text>
                    <Text style={styles.textoDH}>08/09/2021 -- 11:21pm</Text>
                </View>
                
                <View style={styles.tarjeta}>
                    <Text style={styles.textoAviso}>Información: Mañana no habrá clases de biología</Text>
                    <Text style={styles.textoMotivo}>Motivo: Licencia del docente</Text>
                    <Text style={styles.textoMotivo}>Profesor Afectado: Alguien</Text>
                    <Text style={styles.textoMotivo}>Cursos Afectados: 1b, 2b</Text>
                    <Text style={styles.textoDH}>08/09/2021 -- 11:21pm</Text>
                </View>
                
                <View style={styles.tarjeta}>
                    <Text style={styles.textoAviso}>Información: Mañana no habrá clases de biología</Text>
                    <Text style={styles.textoMotivo}>Motivo: Licencia del docente</Text>
                    <Text style={styles.textoMotivo}>Profesor Afectado: Alguien</Text>
                    <Text style={styles.textoMotivo}>Cursos Afectados: 1b, 2b</Text>
                    <Text style={styles.textoDH}>09/09/2021 -- 10:14pm</Text>
                </View>
            </ScrollView>
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
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
        color: '#fff',
        backgroundColor: '#1E88E5',
        width: '100%',
        padding: 10,
    },
    filtro: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '90%',
        marginVertical: 20,
    },
    lista: {
        height: 50,
        width: '45%',
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
    },
    fechaInput: {
        height: 50,
        width: '45%',
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    scrollAvisos: {
        width: '90%',
    },
    tarjeta: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        borderColor: '#ddd',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 3,
    },
    textoAviso: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    textoMotivo: {
        fontSize: 14,
        marginBottom: 2,
    },
    textoDH: {
        fontSize: 12,
        textAlign: 'right',
        marginTop: 10,
        color: '#777',
    },
});
