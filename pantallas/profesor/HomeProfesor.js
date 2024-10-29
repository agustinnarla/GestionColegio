import { Text, StyleSheet, View,Image,TouchableOpacity,ImageBackground } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'



import bg from '../../assets/bg1.jpg'



export default function HomeProfesor(){

    const navegacion = useNavigation()
    return (
        <View style={styles.padre}>
            <ImageBackground source={bg} style={styles.bg} >
                
                <View style={styles.padreBoton}>
                    <TouchableOpacity style={styles.cajaBoton} onPress={() => navegacion.navigate('Libro De Aula')}>
                        <Text style={styles.textoBoton}>Libro De Aula</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cajaBoton} onPress={() => navegacion.navigate('Asignar Evaluaciones')}>
                        <Text style={styles.textoBoton}>Asignar Evaluaciones</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cajaBoton} onPress={() => navegacion.navigate('Cargar Nota Final')}>
                        <Text style={styles.textoBoton}>Cargar Nota Final</Text>
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
        backgroundColor:'white',
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
        width:200,
        marginTop:40,
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