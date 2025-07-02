import { Linking,Text, StyleSheet, View,Image,TouchableOpacity,ImageBackground } from 'react-native'
import React,{ useEffect, useState, useCallback } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';


import bg from '../../assets/bg1.jpg'
import { obtenerAvisosGenerales, obtenerAvisosCurso, obtenerUltimaVisitaAvisos, actualizarUltimaVisitaAvisos } from '../../scripts/alumno/scriptAvisos';



export default function HomeAlumno({ dni_usuario }) {
    const navegacion = useNavigation();
    const [cantidadAvisos, setCantidadAvisos] = useState(0);

    // Mueve la función fuera del useEffect
    const verificarAvisos = useCallback(async () => {
        try {
            const [avisosGenerales, avisosCurso, ultimaVista] = await Promise.all([
                obtenerAvisosGenerales(),
                obtenerAvisosCurso(dni_usuario),
                obtenerUltimaVisitaAvisos(dni_usuario)
            ]);

            const avisos = [...avisosGenerales, ...avisosCurso];
            let cantidadNuevos = 0;

            if (avisos.length > 0) {
                const fechaUltimaVista = ultimaVista ? new Date(ultimaVista) : null;
                console.log('Fecha ultima visita', fechaUltimaVista)
                avisos.forEach(aviso => {
                  if (!aviso.fecha_registro) {
                    console.log('Aviso sin fecha:', aviso);
                    return;
                  }
                  const fechaAviso = new Date(aviso.fecha_registro);
                  if (isNaN(fechaAviso.getTime())) {
                    console.log('Aviso con fecha inválida:', aviso.fecha_registro, aviso);
                    return;
                  }
                  if (fechaUltimaVista && !isNaN(fechaUltimaVista.getTime())) {
                    console.log(
                      'Comparando:',
                      fechaAviso.toISOString(),
                      '>',
                      fechaUltimaVista.toISOString(),
                      fechaAviso > fechaUltimaVista
                    );
                  } else {
                    console.log(
                      'Comparando:',
                      fechaAviso.toISOString(),
                      '> null (sin ultima visita)'
                    );
                  }
                });

                cantidadNuevos = avisos.filter(aviso => {
                  if (!aviso.fecha_registro) return false;
                  const fechaAviso = new Date(aviso.fecha_registro);
                  if (isNaN(fechaAviso.getTime())) return false;
                  return !fechaUltimaVista || fechaAviso > fechaUltimaVista;
                }).length;
            }
              
            setCantidadAvisos(cantidadNuevos);
        } catch (error) {
            console.error('Error al verificar avisos:', error);
        }
    }, [dni_usuario]);

    useEffect(() => {
        if (dni_usuario) verificarAvisos();
    }, [dni_usuario, verificarAvisos]);

    useFocusEffect(
      useCallback(() => {
        if (dni_usuario) {
          verificarAvisos();
        }
      }, [dni_usuario, verificarAvisos])
    );


    const handleIrAvisos = async () => {
      try {
        const ahora = new Date();
        const resp = await actualizarUltimaVisitaAvisos(dni_usuario, ahora.toISOString());

        if (resp && resp.ok) {
          setCantidadAvisos(0); 
          navegacion.navigate('Avisos', { dni_usuario });
        } else {
          alert('No se pudo actualizar la última visita.');
        }
      } catch (error) {
        console.error('Error al actualizar la visita:', error);
      }
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
                {cantidadAvisos > 0 && (
                  <View style={styles.badgeNotificacion}>
                    <Text style={styles.badgeTexto}>{cantidadAvisos}</Text>
                  </View>
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
        top: -8,
        right: -8,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: 'red',
        borderWidth: 2,
        borderColor: 'white',
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeTexto: {
        color: 'white',
        fontWeight: '500', 
        fontSize: 12,
        textAlign: 'center',
        includeFontPadding: false,
        textAlignVertical: 'center',
        padding: 0,
        margin: 0,
    },
})