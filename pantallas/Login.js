import { Text, StyleSheet, View,Image,TextInput,TouchableOpacity,ImageBackground,Alert} from 'react-native'
import React, { useState } from 'react'

import { FontAwesome5 } from '@expo/vector-icons';

import appFirebase from '../credenciales.js'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import bg from '../assets/bg1.jpg'
import logo from '../assets/logo_huerto.png'


const auth = getAuth(appFirebase)


export default function Login(props){
    //Creamos login 
    const [email, SetEmail] = useState()
    const [contraseña, SetContraseña] = useState()

    const login = async()=>{
        try{
            await signInWithEmailAndPassword(auth,email,contraseña)   
            Alert.alert('Iniciando sesion','Accediendo..') 
            props.navigation.navigate("Home")
        }catch(err){
            console.log(err)
            Alert.alert('Error','El usuario o la contraseña son incorrectos')
        }
    }

    
    return (
        <View style={styles.padre}>
            <ImageBackground source={bg} style={styles.bg}>
                <View>
                    <Image source={logo} style={styles.logo}/>
                </View>
                <View style={styles.tarjeta}>
                    <View style={styles.cajaTexto}>
                        <FontAwesome5 name="user" size={15} color="black" style={styles.icon} />
                        <TextInput placeholder='Usuario' style={styles.textInput}
                        onChangeText={(text)=>SetEmail(text)}/>
                    </View>
                    <View style={styles.cajaTexto}>
                        <FontAwesome5 name="lock" size={15} color="black" style={styles.icon} />
                        <TextInput placeholder='Contraseña' secureTextEntry={true} style={styles.textInput}
                        onChangeText={(text)=> SetContraseña(text)}/>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.textoOlvide}>
                            Olvide mi contraseña
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.padreBoton}>
                        <TouchableOpacity style={styles.cajaBoton} onPress={login}>
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
        width:'20%',
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