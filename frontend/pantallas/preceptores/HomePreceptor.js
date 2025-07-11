import { Text, StyleSheet, View,Image,TouchableOpacity,ImageBackground } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'



import bg from '../../assets/bg1.jpg'



export default function HomePreceptor(){

    const navegacion = useNavigation()
    return (
        <View style={styles.padre}>
            <ImageBackground source={bg} style={styles.bg} >
                
                <View style={styles.padreBoton}>
                    <TouchableOpacity style={styles.cajaBoton} onPress={() => navegacion.navigate('Gestionar Asistencia')}>
                        <Text style={styles.textoBoton}>Gestionar Asistencia</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cajaBoton} onPress={() => navegacion.navigate('Gestionar Amonestaciones')}>
                        <Text style={styles.textoBoton}>Gestionar Amonestaciones</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cajaBoton} onPress={() => navegacion.navigate('Consultar Libro de Aula')}>
                        <Text style={styles.textoBoton}>Consultar Libro de Aula</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cajaBoton} onPress={() => navegacion.navigate('Justificar Falta')}>
                        <Text style={styles.textoBoton}>Justificar Falta Alumno</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cajaBoton} onPress={() => navegacion.navigate('Gestionar Observación')}>
                        <Text style={styles.textoBoton}>Gestionar Observación</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    padre:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white'
    },
    padreBoton:{
        alignItems:'center',
        margin:150,
    },
    cajaBoton:{
        backgroundColor:'#F0F4FF',
        borderRadius:10,
        borderColor:'#000AFF',
        borderWidth:0.5,
        paddingVertical:15,
        marginTop: 20,
        width:200,
        shadowColor:'#6D8FE5',
        shadowOffset:{
            width:5,
            height:5
        },
        shadowOpacity:0.71,
        shadowRadius:6,
        elevation:4,
    },
    textoBoton:{
        textAlign:'center',
        color:'black',
        
    },
    bg:{
        alignItems:'center',
        width: '100%',
        height: '100%',
    }

    
})