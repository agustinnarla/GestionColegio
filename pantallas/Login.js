import { Text, StyleSheet, View,Image,TextInput,TouchableOpacity,ImageBackground} from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

import bg from '../assets/bg1.jpg'
import logo from '../assets/logo_huerto.png'

export default function Login(){
    const navegacion = useNavigation()
    return (
        <View style={styles.padre}>
            <ImageBackground source={bg} style={styles.bg}>
                <View>
                    <Image source={logo} style={styles.logo}/>
                </View>
                <View style={styles.tarjeta}>
                    <View style={styles.cajaTexto}>
                        <FontAwesome5 name="user" size={15} color="black" style={styles.icon} />
                        <TextInput placeholder='Usuario' style={styles.textInput}/>
                    </View>
                    <View style={styles.cajaTexto}>
                        <FontAwesome5 name="lock" size={15} color="black" style={styles.icon} />
                        <TextInput placeholder='Contraseña' style={styles.textInput}/>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.textoOlvide}>
                            Olvide mi contraseña
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.padreBoton}>
                        <TouchableOpacity style={styles.cajaBoton} onPress={() => navegacion.navigate('Home')}>
                            <Text style={styles.textoBoton}>Ingresar</Text>
                        </TouchableOpacity>
                    </View>
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
    logo:{
        marginTop:50,
        width:170,
        height:260
    },
    tarjeta:{
        margin:20,
        borderRadius:10,
        borderColor:'#000AFF',
        borderWidth:0.5,
        width:'70%',
        padding:20,
    },
    cajaTexto:{
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: 15,
        borderColor:'#000AFF',
        borderWidth:0.5,
        backgroundColor: '#cccccc40',
        borderRadius: 10,
        marginVertical: 10,
    },
    textInput:{
        paddingHorizontal:15,
    },
    icon:{
        marginHorizontal: 8,
    },
    padreBoton:{
        alignItems:'center',
    },
    cajaBoton:{
        backgroundColor:'#F0F4FF',
        borderRadius:10,
        borderColor:'#000AFF',
        borderWidth:0.5,
        paddingVertical:15,
        width:150,
        marginTop:20,
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
    textoOlvide:{
        textAlign:'center',
        color:'#005FB7'
    },
    bg:{
        alignItems:'center',
        width: '100%',
        height: '100%',
    }

})