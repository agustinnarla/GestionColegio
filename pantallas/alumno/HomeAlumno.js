import { Linking,Text, StyleSheet, View,Image,TouchableOpacity,ImageBackground } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'



import bg from '../../assets/bg1.jpg'



export default function HomeAlumno({ dni_usuario }) {
    const navegacion = useNavigation();
  
    console.log('DNI recibido en HomeAlumno:', dni_usuario);
  
    return (
      <View style={styles.padre}>
        <ImageBackground source={bg} style={styles.bg}>
          <View style={styles.padreBoton}>
            <TouchableOpacity
              style={styles.cajaBoton}
              onPress={() => navegacion.navigate('Materias', { dni_usuario })}
            >
              <Text style={styles.textoBoton}>Materias</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cajaBoton}
              onPress={() => navegacion.navigate('Avisos')}
            >
              <Text style={styles.textoBoton}>Avisos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cajaBoton}
              onPress={() => Linking.openURL('https://classroom.google.com/')}
            >
              <Text style={styles.textoBoton}>Classroom</Text>
            </TouchableOpacity>
            
          </View>
        </ImageBackground>
      </View>
    );
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