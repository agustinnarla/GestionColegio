import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import bg from '../../assets/bg1.jpg';
import { obtenerEstadosFaltaPP, obtenerFaltasPP, registrarJustificacionPP } from '../../scripts/secretaria/scriptJustificarFaltaPP';
import { obtenerCertificado } from '../../scripts/preceptor/scriptGestionJustificarFalta';

const formatFecha = (fechaISO) => {
    if (!fechaISO) return '--/--/----';
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
};

export default function JustificarFaltaP_P() {
    const [estadosFalta, setEstadosFalta] = useState([]);
    const [certificados, setCertificados] = useState([]);
    const [faltas, setFaltas] = useState([]);
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [estadoFaltaPorProfesor, setEstadoFaltaPorProfesor] = useState({});
    const [certificadoPorProfesor, setCertificadoPorProfesor] = useState({});

    const cargarEstadosFaltaPP = async () => {
        try {
            const estados = await obtenerEstadosFaltaPP();
            setEstadosFalta(estados);
        } catch (error) {
            console.error('Error al cargar estados de falta:', error.message);
            Alert.alert('Error', 'No se pudieron cargar los estados de falta');
        }
    };

    const cargarCertificados = async () => {
        try {
            const certificados = await obtenerCertificado();
            setCertificados(Array.isArray(certificados) ? certificados : []);
        } catch (error) {
            console.error('Error al cargar certificados:', error.message);
            Alert.alert('Error', 'No se pudieron cargar los certificados');
        }
    };

    const cargarFaltas = async () => {
        try {
            const faltasData = await obtenerFaltasPP(fechaDesde, fechaHasta);
            setFaltas(Array.isArray(faltasData) ? faltasData : []);
            
            // Inicializar los estados por profesor
            const estadoInicial = {};
            const certificadoInicial = {};
            
            faltasData.forEach(falta => {
                estadoInicial[falta.dni_profesor] = falta.id_estadofalta_pp || null;
                certificadoInicial[falta.dni_profesor] = falta.id_certificado || null;
            });
            
            setEstadoFaltaPorProfesor(estadoInicial);
            setCertificadoPorProfesor(certificadoInicial);
            
        } catch (error) {
            console.error('Error al cargar faltas:', error.message);
            Alert.alert('Error', 'No se pudieron cargar las faltas');
        }
    };

    useEffect(() => {
        cargarEstadosFaltaPP();
        cargarCertificados();
    }, []);

    const handleConsultar = () => {
        if (fechaDesde && fechaHasta) {
            cargarFaltas();
        } else {
            Alert.alert('Error', 'Por favor ingrese ambas fechas');
        }
    };

    const actualizarSeleccionProfesor = (tipo, valor, dni_profesor, fecha) => {
      // Actualizar el estado local
      if (tipo === 'estadoFalta') {
          setEstadoFaltaPorProfesor(prev => ({
              ...prev,
              [dni_profesor]: valor
          }));
      } else if (tipo === 'certificado') {
          setCertificadoPorProfesor(prev => ({
              ...prev,
              [dni_profesor]: valor
          }));
      }
  
      // Preparar datos para enviar al backend
      const datosParaEnviar = {
          dni_profesor,
          fecha,
          id_estadofalta: tipo === 'estadoFalta' ? valor : estadoFaltaPorProfesor[dni_profesor],
          id_certificado: tipo === 'certificado' ? valor : certificadoPorProfesor[dni_profesor]
      };
  
      // Solo enviar si tenemos al menos el estado de falta
      if (datosParaEnviar.id_estadofalta) {
          registrarJustificacion(datosParaEnviar);
      }
    };

      const formatFechaParaBackend = (fechaISO) => {
        if (!fechaISO) return null;
        const fecha = new Date(fechaISO);
        const año = fecha.getFullYear();
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const dia = fecha.getDate().toString().padStart(2, '0');
        return `${año}-${mes}-${dia}`;
    };

    const registrarJustificacion = async ({ dni_profesor, fecha, id_estadofalta, id_certificado }) => {
      if (!dni_profesor || !fecha) {
          console.log('Faltan datos requeridos');
          return;
      }
  
      try {
          // Preparar los datos para enviar
          const formData = {
              dni_profesor,
              fecha: formatFechaParaBackend(fecha),
              id_estadofalta: id_estadofalta || null,  // Puede ser null
              id_certificado: id_certificado || null   // Puede ser null
          };
  
          console.log('Enviando datos:', formData);
  
          const resultado = await registrarJustificacionPP(formData);
          console.log('Respuesta del servidor:', resultado);
          
          if (resultado.justificado === "No se realizaron cambios") {
              Alert.alert('Información', 'No se realizaron cambios en la justificación');
          } else {
              Alert.alert('Éxito', 'Justificación registrada correctamente');
          }
      } catch (error) {
          console.error('Error al registrar justificación:', error);
          Alert.alert('Error', error.response?.data?.error || 'No se pudo registrar la justificación');
      }
  };
  

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg}></Image>
            <View style={styles.contenido}>
                <View style={styles.contenidoFecha}>
                    <View style={styles.filaInputs}>
                        <Text style={styles.label}>Fecha desde:</Text>
                        <TextInput 
                            placeholder='DD/MM/YYYY' 
                            style={Platform.OS === 'web' ? styles.inputPequeño : styles.input}
                            value={fechaDesde}
                            onChangeText={setFechaDesde}
                        />
                    </View>
                    <View style={styles.filaInputs}>
                        <Text style={styles.label}>Fecha hasta:</Text>
                        <TextInput 
                            placeholder='DD/MM/YYYY' 
                            style={Platform.OS === 'web' ? styles.inputPequeño : styles.input}
                            value={fechaHasta}
                            onChangeText={setFechaHasta}
                        />
                    </View>
                    <TouchableOpacity style={styles.boton} onPress={handleConsultar}>
                        <Text style={styles.botonTexto}>Consultar</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal>
                    <View style={styles.tabla}>
                        <View style={[styles.fila, styles.encabezados]}>
                            <Text style={styles.encabezado}>DNI</Text>
                            <Text style={styles.encabezado}>Fecha</Text>
                            <Text style={styles.encabezado}>Estado de la Falta</Text>
                            <Text style={styles.encabezado}>Certificado Médico</Text>
                        </View>
                        
                        {faltas.length > 0 ? (
                            faltas.map((falta, index) => (
                                <View key={index} style={styles.fila}>
                                    <Text style={styles.celda}>{falta.dni_profesor}</Text>
                                    <Text style={styles.celda}>{formatFecha(falta.fecha)}</Text>
                                    
                                    <Picker
                                      style={styles.celda}
                                      selectedValue={estadoFaltaPorProfesor[falta.dni_profesor] || null}
                                      onValueChange={(itemValue) => {
                                          actualizarSeleccionProfesor('estadoFalta', itemValue, falta.dni_profesor, falta.fecha);
                                      }}
                                  >
                                      <Picker.Item label="Seleccione estado de falta" value={null} />
                                      {estadosFalta.map(estado => (
                                          <Picker.Item
                                              key={estado.id_estadofalta_pp}
                                              label={estado.detalle}
                                              value={estado.id_estadofalta_pp}
                                          />
                                      ))}
                                  </Picker>

                                  <Picker
                                      style={styles.celda}
                                      selectedValue={certificadoPorProfesor[falta.dni_profesor] || null}
                                      onValueChange={(itemValue) => {
                                          actualizarSeleccionProfesor('certificado', itemValue, falta.dni_profesor, falta.fecha);
                                      }}
                                  >
                                      <Picker.Item label="Seleccione certificado médico" value={null} />
                                      {certificados.map(certificado => (
                                          <Picker.Item
                                              key={certificado.id_certificado}
                                              label={certificado.detalle}
                                              value={certificado.id_certificado}
                                          />
                                      ))}
                                  </Picker>
                                </View>
                            ))
                        ) : (
                            <View style={styles.fila}>
                                <Text style={styles.celda}>No hay datos disponibles</Text>
                                <Text style={styles.celda}></Text>
                                <Text style={styles.celda}></Text>
                                <Text style={styles.celda}></Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    padre: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f7fa',
    },
    bg: {
        alignItems: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: -1,
        opacity: 0.13,
    },
    contenido: {
        width: '95%',
        maxWidth: 1100,
        backgroundColor: '#fff',
        padding: 32,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10,
        shadowRadius: 12,
        elevation: 6,
        alignItems: 'center',
        marginTop: 36,
        marginBottom: 36,
    },
    contenidoFecha: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 18,
        width: '100%',
        gap: 24,
    },
    filaInputs: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        minWidth: 180,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        textAlign: 'center',
        color: '#2a3d6c',
    },
    input: {
        width: 160,
        padding: 10,
        borderWidth: 1.5,
        borderColor: '#b6c6e0',
        borderRadius: 8,
        marginBottom: 0,
        backgroundColor: '#f9f9f9',
        textAlign: 'center',
        fontSize: 16,
    },
    inputPequeño: {
        width: 140,
        padding: 8,
        borderWidth: 1.5,
        borderColor: '#b6c6e0',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        textAlign: 'center',
        fontSize: 15,
    },
    boton: {
        backgroundColor: '#f0f7ff',
        borderColor: '#746BC8',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignSelf: 'center',
        elevation: 2,
        shadowColor: '#CED9EF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 4,
        minWidth: 120,
        marginLeft: 12,
    },
    botonTexto: {
        color: '#2a3d6c',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    tabla: {
        marginTop: 18,
        minWidth: 900,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e1e8ed',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
        overflow: 'hidden',
    },
    encabezados: {
        flexDirection: 'row',
        backgroundColor: '#f0f7ff',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e8ed',
        paddingVertical: 12,
        paddingHorizontal: 6,
    },
    encabezado: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#2a3d6c',
        textAlign: 'center',
        minWidth: 180,
        flex: 1,
        paddingHorizontal: 4,
    },
    fila: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        backgroundColor: '#fff',
    },
    celda: {
        flex: 1,
        minWidth: 180,
        textAlign: 'center',
        fontSize: 15,
        color: '#374151',
        paddingHorizontal: 4,
        paddingVertical: 4,
        backgroundColor: '#fff',
    },
    picker: {
        flex: 1,
        minWidth: 180,
        height: 38,
        backgroundColor: '#f9f9f9',
        borderRadius: 7,
        borderWidth: 1,
        borderColor: '#b6c6e0',
        color: '#2a3d6c',
        fontSize: 15,
        marginHorizontal: 0,
    },
    archivo: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    archivoInfo: {
        fontSize: 18,
        textAlign: 'center',
    },
});