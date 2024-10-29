import { StyleSheet,View,Image,TouchableOpacity,Text,TextInput,Switch,ScrollView} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import bg from '../../assets/bg1.jpg'

import { FontAwesome5 } from '@expo/vector-icons';



export default function GestionarAsistencia(){
    const navegacion = useNavigation();

    const [students, setStudents] = useState([
        { id: 1, nombre: 'Agustin Arla', presente: true },
        { id: 2, nombre: 'Agustin Romanisio', presente: true },
        { id: 3, nombre: 'Valentin Lopez', presente: false },
      ]);
    
      const toggleSwitch = (id) => {
        setStudents((prevEstudiante) =>
            prevEstudiante.map((estudiante) =>
            estudiante.id === id ? { ...estudiante, presente: !estudiante.presente } : estudiante
          )
        );
      };


    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg}></Image>
            <Picker style={styles.lista}>
                <Picker.Item  label='Seleccionar curso' value=''/>
                <Picker.Item  label='1 b' value='1b'/>
                <Picker.Item  label='2 a' value='1a'/>
            </Picker>
            <View style={styles.busqueda}>
                <FontAwesome5 name="search" size={15} color="black" style={styles.icon} />
                <TextInput placeholder='Ingresar Alumno' style={styles.textBusqueda}/>
            </View>
            <View style={styles.contenedorTexto}>
                <Text style={styles.texto}>Nombre</Text>
                <Text style={styles.texto}>P</Text>
            </View>
            <ScrollView style={styles.listaEstudiantes}>
                {students.map((estudiante) => (
                <View key={estudiante.id} style={styles.filaEstudiantes}>
                    
                    <Text style={styles.estudiante}>{estudiante.nombre}</Text>
                    <Switch
                    value={estudiante.presente}
                    onValueChange={() => toggleSwitch(estudiante.id)}
                    thumbColor={estudiante.presente ? "#3b82f6" : "#ccc"}
                    />
                </View>
                ))}
            </ScrollView>

            <View style={styles.contenedorBotones}>
                <TouchableOpacity style={styles.modificar}><Text style={styles.botonTexto} onPress={() => navegacion.navigate('Modificar Asistencia')}>Modificar</Text></TouchableOpacity>
                <TouchableOpacity style={styles.enviar}><Text style={styles.botonTexto}>Enviar</Text></TouchableOpacity>
                <TouchableOpacity style={styles.exportar}><Text style={styles.botonTexto}>Exportar</Text></TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    padre:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    bg:{
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    lista:{
        height: 50,
        width: '90%',
        marginBottom: 20,
        marginTop:20,
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
    },
    busqueda:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
        width: '90%',
        padding: 10,
        marginBottom: 20,
    },
    textBusqueda:{
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    listaEstudiantes:{
        width: '90%',
        marginTop: 10,
    },
    filaEstudiantes:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,   
        borderBottomColor: '#ddd',
    },
    estudiante:{
        fontSize: 18,
    },
    contenedorBotones: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '90%',
        marginTop: 20,
        marginBottom: 60,
    },
    modificar: {
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
    enviar: {
        backgroundColor: '#D5EFCE',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        borderColor: '#1FB741',
        borderWidth: 0.4,
        alignItems: 'center',
        shadowColor: '#B6FFCA',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.71,
        shadowRadius: 6,
        elevation: 4,
    },
    exportar: {
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
    contenedorTexto:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    texto:{
       fontWeight:'bold'
    },
    botonTexto:{
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    }
})