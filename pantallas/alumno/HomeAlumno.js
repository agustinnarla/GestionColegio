import { Linking,Text, StyleSheet, View,Image,TouchableOpacity,ImageBackground } from 'react-native'
import React,{use, useEffect, useState} from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';

import bg from '../../assets/bg1.jpg'
import { obtenerAvisosGenerales } from '../../scripts/alumno/scriptAvisos';



export default function HomeAlumno({ dni_usuario }) {
    const navegacion = useNavigation();
    const [hayAvisos, setHayAvisos] = useState(false);

    useEffect(() => {
      const verificarAvisos = async () => {
        try {
          const avisos = await obtenerAvisosGenerales();
          const ultimaVista = await AsyncStorage.getItem('ultimaVistaAvisos');
          let hayNuevo = false;
          if (avisos.length > 0) {
            hayNuevo = avisos.some(aviso => {
              if (!aviso.fecha) return false;
              const [dia, mes, anio] = aviso.fecha.split('-');
              const fechaAviso = new Date(`${anio}-${mes}-${dia}T00:00:00`);
              // Compara solo la fecha, sin hora
              if (!ultimaVista) return true;
              const fechaUltimaVista = new Date(ultimaVista);
              fechaAviso.setHours(0,0,0,0);
              fechaUltimaVista.setHours(0,0,0,0);
              return fechaAviso > fechaUltimaVista;
            });
          }
          setHayAvisos(hayNuevo);
        } catch (error) {
          console.log(error);
        }
      };
      verificarAvisos();
    }, []);

    const handleIrAvisos = async () => {
      // Guarda solo la fecha (sin hora)
      const hoy = new Date();
      hoy.setHours(0,0,0,0);
      await AsyncStorage.setItem('ultimaVistaAvisos', hoy.toISOString());
      navegacion.navigate('Avisos', { dni_usuario });
      setHayAvisos(false); // Opcional: oculta el badge inmediatamente
    };

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
            <View>
              <TouchableOpacity
                style={styles.cajaBoton}
                onPress={handleIrAvisos}
              >
                <Text style={styles.textoBoton}>Avisos</Text>
                {hayAvisos && (
                  <View style={styles.badgeNotificacion} />
                )}
              </TouchableOpacity>
            </View>
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
    },
    badgeNotificacion: {
        position: 'absolute',
        top: 8,
        right: 20,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: 'red',
        borderWidth: 2,
        borderColor: 'white',
        zIndex: 10,
    },
})