import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, Dimensions, Image, TouchableOpacity, FlatList, Alert, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import bg from '../../assets/bg1.jpg';
import CustomAlert from '../../componente/CustomAlerts.js';
import { obtenerMateriaPorCurso, obtenerCurso  } from '../../scripts/listasDesplegables/listaDesplegable.js';
import ListasDesplegables from '../../componente/ListasDesplegables.jsx';
import { registrarNotas, obtenerNotas } from '../../scripts/secretaria/scriptCargarNotas.js';

import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';


const { width } = Dimensions.get('window');
const isDesktop = width >= 768;
const isWeb = Platform.OS === 'web';

export default function CargarNotas() {
    
  useEffect(() => {
          if (isWeb) {
          document.body.style.overflow = 'auto'; // Activar scroll en web
        } else {
          document.body.style.overflow = 'hidden'; // Desactivarlo en otras plataformas
        }
        }, []);

    /*
        FORMULARIO
    */

    const [formData, setFormData] = useState({
        dni_alumno: '',
        id_materia: '',
        id_curso:'',
        nota1: '',
        nota2: '',
        nota3: '',
        nota4: '',
        nota5: '',
        nota6: '',
        tp1: '',
        tp2: '',
        tp3: '',
        aulico: ''
    });
    
    const validarCampos = (...campos) => 
      campos.every(campo => formData[campo]?.length > 0);

    const habilitarBotones = () => validarCampos('id_curso','id_materia');
 
 

    

    const validarLista = () => {
      return(
        alumnos.length > 0
      )
    }

    const habilitarAgregar= () => {
      return(
        alumnosSeleccionados.length > 0 && 
        notaGlobal.length > 0 &&
        notaSeleccionada.length > 0
      )
    }

    const habilitarGrilla = () => {
      return(
        notaSeleccionada.length > 0
      )
    }
    /*
        CARGAMOS LAS LISTAS DESPLEGABLES
    */
    const [curso,setCursos] = useState([]);
    const [materias,setMaterias] = useState([]);
    const [alumnos, setAlumnos] = useState([]); 
    const [notaSeleccionada, setNotaSeleccionada] = useState('');
    const [alumnosSeleccionados, setAlumnosSeleccionados] = useState([]);
    const [notaGlobal, setNotaGlobal] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [sumaEsperada, setSumaEsperada] = useState('');
    const [mensajeValidacion, setMensajeValidacion] = useState('');
    const [modalSumaEsperadaVisible, setModalSumaEsperadaVisible] = useState(false);

    const modalSumaEsperada = () => {
        setModalSumaEsperadaVisible(true);
    };

    const confirmarSumaEsperada = async () => {
        setModalSumaEsperadaVisible(false);
        await cargarAlumnos();
    };

    const validarYRegistrarNotas = async () => {
        // Suma las notas ingresadas por el usuario en la grilla
        const sumaNotasIngresadas = alumnos.reduce((total, alumno) => {
            let sumaAlumno = 0;
            // Suma solo la nota seleccionada
            if (alumno[notaSeleccionada] !== undefined && alumno[notaSeleccionada] !== null && alumno[notaSeleccionada] !== '') {
                sumaAlumno += parseInt(alumno[notaSeleccionada]) || 0;
            }
            console.log('Alumno:', alumno.nombre_completo, 'Suma Alumno:', sumaAlumno);
            return total + sumaAlumno;
        }, 0);

        console.log('Suma total de notas ingresadas:', sumaNotasIngresadas);
        console.log('Suma esperada:', sumaEsperada);

        // Compara la suma ingresada con la suma esperada
        if (parseInt(sumaEsperada) === sumaNotasIngresadas) {
            setMensajeValidacion('Las notas coinciden. ¿Desea registrar las notas?');
        } else {
            setMensajeValidacion(`La suma de las notas ingresadas (${sumaNotasIngresadas}) no coincide con la suma esperada (${sumaEsperada}). ¿Desea registrar las notas de todas formas?`);
        }
        setModalVisible(true);
    };

    const confirmarRegistro = async () => {
        setModalVisible(false);
        await handleRegistrar();
    };

    const cancelarRegistro = () => {
        setModalVisible(false);
    };

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const cursosData = await obtenerCurso();
                setCursos(cursosData);
                if (formData.id_curso) {
                        const materiasData = await obtenerMateriaPorCurso(formData.id_curso);;
                    setMaterias(materiasData);
                } else {
                    setMaterias([]); 
                }
            } catch (error) {
                Alert.alert('Error', error.message);
            }
        };
        cargarDatos();
    }, [formData.id_curso]);

    // Mensajes 
      const [alertVisible, setAlertVisible] = useState(false);
      const [alertTitle, setAlertTitle] = useState('');
      const [alertMessage, setAlertMessage] = useState('');
    
    
        const mostrarMensaje = (titulo, mensaje) => {
            setAlertTitle(titulo);
            setAlertMessage(mensaje);
            setAlertVisible(true);
        };

    /*
        CARGAMOS ALUMNOS SEGÚN EL CURSO Y MATERIA SELECCIONADOS
    */
   
    const cargarAlumnos = async () => {
        if (formData.id_curso && formData.id_materia) {  
            try {
                const alumnosData = await obtenerNotas(formData.id_curso, formData.id_materia);
                if (Array.isArray(alumnosData)) {
                    setAlumnos(alumnosData);
                } else {
                    setAlumnos([]);
                }
            } catch (error) {
                console.error('Error al cargar alumnos:', error);
                Alert.alert('Error', 'No se pudieron cargar los alumnos');
            }
        } else {
            Alert.alert('Aviso', 'Por favor seleccione un curso y una materia');
        }
    };

    const limpiarInterfaz = () => {
      setFormData({
          dni_alumno: '',
          id_materia: '',
          id_curso: '',
          nota1: '',
          nota2: '',
          nota3: '',
          nota4: '',
          nota5: '',
          nota6: '',
          tp1: '',
          tp2: '',
          tp3: '',
          aulico: ''
      });
      setAlumnos([]); 
      setNotaSeleccionada('')
      setNotaGlobal([]);
      setSumaEsperada([])
  };
  
    /*
        REGISTRAMOS NUEVAS NOTAS 
    */

    const handleRegistrar = async () => {
        try {
            

            // Validar que haya alumnos seleccionados
            if (!alumnos || alumnos.length === 0) {
                return mostrarMensaje('Error', 'No hay alumnos para registrar notas');
            }

            // Validar campos del formulario
            if (!formData.id_materia) {
                return mostrarMensaje('Error', 'Por favor seleccione una materia');
            }
            if (!formData.id_curso) {
                return mostrarMensaje('Error', 'Por favor seleccione un curso');
            }

            // Crear array de notas para registrar
            const notasParaRegistrar = alumnos.map(alumno => {
                if (!alumno.dni_alumno) {
                    throw new mostrarMensaje('Error','DNI de alumno no encontrado');
                }

                return {
                    dni_alumno: parseInt(alumno.dni_alumno),
                    id_materia: parseInt(formData.id_materia),
                    id_curso: parseInt(formData.id_curso),
                    nota1: alumno.nota1 ? parseInt(alumno.nota1) : null,
                    nota2: alumno.nota2 ? parseInt(alumno.nota2) : null,
                    nota3: alumno.nota3 ? parseInt(alumno.nota3) : null,
                    nota4: alumno.nota4 ? parseInt(alumno.nota4) : null,
                    nota5: alumno.nota5 ? parseInt(alumno.nota5) : null,
                    nota6: alumno.nota6 ? parseInt(alumno.nota6) : null,
                    tp1: alumno.tp1 ? parseInt(alumno.tp1) : null,
                    tp2: alumno.tp2 ? parseInt(alumno.tp2) : null,
                    tp3: alumno.tp3 ? parseInt(alumno.tp3) : null,
                    aulico: alumno.aulico ? parseInt(alumno.aulico) : null
       
                };
            });

            //console.log("Datos a registrar:", notasParaRegistrar);

            // Llamar al backend para registrar las notas
            const respuesta = await registrarNotas(notasParaRegistrar);
            //console.log('Respuesta del servidor:', respuesta);
            mostrarMensaje('Éxito', 'Notas registradas correctamente');
            limpiarInterfaz()
           

        } catch (error) {
            console.log("Error detallado:", error);
            mostrarMensaje('Error', 'Error al registrar las notas ');
        }
    };

    const validarNota = (dni_alumno, campo, valor) => {
        // Permitir formato como "1-", "2-", etc. o números del 1-10
        if (valor === '' || 
            (parseInt(valor) >= 1 && parseInt(valor) <= 10) ||
            /^[1-9]-$/.test(valor) ||
            /^10-$/.test(valor)) {
            setAlumnos(prevAlumnos => 
                prevAlumnos.map(alumno => 
                    alumno.dni_alumno === dni_alumno 
                        ? { ...alumno, [campo]: valor === '' ? '' : valor }
                        : alumno
                )
            );
        }
    };

   
    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const exportarNotasAExcel = async (alumnos) => {
      if (!Array.isArray(alumnos) || alumnos.length === 0) {
        alert("No hay alumnos para exportar.");
        return;
      }

      try {
        const data = alumnos.map(a => ({
          DNI: a.dni_alumno,
          Alumno: a.nombre_completo,
          Nota1: a.nota1 || '',
          Nota2: a.nota2 || '',
          Nota3: a.nota3 || '',
          Nota4: a.nota4 || '',
          Nota5: a.nota5 || '',
          Nota6: a.nota6 || '',
          TP1: a.tp1 || '',
          TP2: a.tp2 || '',
          TP3: a.tp3 || '',
          Aulico: a.aulico || ''
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Notas");

        if (Platform.OS === 'web') {
          // WEB: Descargar usando Blob y enlace
          const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
          const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");

          a.href = url;
          a.download = "notas.xlsx";
          document.body.appendChild(a);
          
          a.click();

          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        } else {
          // MOBILE: Usar expo-file-system y expo-sharing
          const excelBinary = XLSX.write(workbook, { type: "base64", bookType: "xlsx" });
          const fileUri = FileSystem.documentDirectory + "notas.xlsx";
          await FileSystem.writeAsStringAsync(fileUri, excelBinary, {
            encoding: FileSystem.EncodingType.Base64,
          });

          if (!(await Sharing.isAvailableAsync())) {
            mostrarMensaje("Advertencia","La función para compartir no está disponible en este dispositivo");
            return;
          }
          await Sharing.shareAsync(fileUri);
        }
      } catch (error) {
        console.error("Error al exportar Excel:", error);
        mostrarMensaje("Error","Error al exportar las notas.");
      }
    };

    const validarNotas = () => {
      
      const sumaNotasIngresadas = alumnos.reduce((total, alumno) => {
        let sumaAlumno = 0;
        
        if (alumno[notaSeleccionada] !== undefined && alumno[notaSeleccionada] !== null && alumno[notaSeleccionada] !== '') {
          sumaAlumno += parseInt(alumno[notaSeleccionada]) || 0;
        }
        console.log('Alumno:', alumno.nombre_completo, 'Suma Alumno:', sumaAlumno);
        return total + sumaAlumno;
      }, 0);

      console.log('Suma total de notas ingresadas:', sumaNotasIngresadas);
      console.log('Suma esperada:', sumaEsperada);

      
      if (parseInt(sumaEsperada) === sumaNotasIngresadas) {
        setMensajeValidacion('Las notas coinciden. ¿Desea continuar?');
      } else {
        setMensajeValidacion(`La suma de las notas ingresadas (${sumaNotasIngresadas}) no coincide con la suma esperada (${sumaEsperada}).`);
      }
      setModalVisible(true);
    };
  

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg} />

            {/* Filtros y acciones */}
            <View style={styles.contenedorSuperior}>
                <View style={styles.filtrosRow}>
                    <View style={styles.filtrosContainer}>
                        <ListasDesplegables
                            formData={formData}
                            handleChange={handleChange}
                            curso={curso}
                            showLabel={false}
                            materias={materias}
                            styles={{ ...styles, input: styles.inputDesplegable }}
                        />
                    </View>
                    <View style={styles.botonesContainer}>
                        <TouchableOpacity style={[styles.botonConsultar, !habilitarBotones() && styles.botonDeshabilitado]} onPress={modalSumaEsperada} disabled={!habilitarBotones()}>
                            <Text style={styles.textoBoton}>Consultar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.botonReiniciar, !habilitarBotones() && styles.botonDeshabilitado]} onPress={limpiarInterfaz} disabled={!habilitarBotones()}>
                            <Text style={styles.textoBoton}>Reiniciar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.botonConsultar, !habilitarBotones() && styles.botonDeshabilitado]} onPress={() => exportarNotasAExcel(alumnos)} disabled={!habilitarBotones()}>
                            <Text style={styles.textoBoton}>📄</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.headerContainer}>
                            <View style={styles.leftContainer}>
                                <View style={styles.filtroGroupInline}>
                                    <Text style={styles.headerText}>Seleccionar campo a editar:</Text>
                                    <Picker
                                        disabled={!validarLista()}
                                        selectedValue={notaSeleccionada}
                                        onValueChange={(itemValue) => setNotaSeleccionada(itemValue)}
                                        style={styles.inputDesplegable}
                                    >
                                        <Picker.Item label="Seleccione una opción" value="" />
                                        <Picker.Item label="Nota 1" value="nota1" />
                                        <Picker.Item label="Nota 2" value="nota2" />
                                        <Picker.Item label="Nota 3" value="nota3" />
                                        <Picker.Item label="Nota 4" value="nota4" />
                                        <Picker.Item label="Nota 5" value="nota5" />
                                        <Picker.Item label="Nota 6" value="nota6" />
                                        <Picker.Item label="TP1" value="tp1" />
                                        <Picker.Item label="TP2" value="tp2" />
                                        <Picker.Item label="TP3" value="tp3" />
                                        <Picker.Item label="Aulico" value="aulico" />
                                    </Picker>
                                </View>
                            </View>
                            <View style={styles.rightContainer}>
                                <Text style={styles.headerText}>Nota para seleccionados:</Text>
                                <TextInput
                                    disabled={!habilitarGrilla()}
                                    style={styles.notaGlobalInput}
                                    value={notaGlobal}
                                    inputMode="numeric"
                                    maxLength={2}
                                    onChangeText={(text) => {
                                       
                                        if (text === '' || 
                                            (parseInt(text) >= 1 && parseInt(text) <= 10) ||
                                            /^[1-9]-$/.test(text) ||
                                            /^10-$/.test(text)) {
                                            setNotaGlobal(text);
                                        }
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        setAlumnos(prev =>
                                            prev.map(alumno =>
                                                alumnosSeleccionados.includes(alumno.dni_alumno)
                                                    ? { ...alumno, [notaSeleccionada]: notaGlobal }
                                                    : alumno
                                            )
                                        );
                                        setNotaGlobal('');
                                    }}
                                    style={[styles.aplicarButton, !habilitarAgregar() && styles.botonDeshabilitado]}
                                    disabled={!habilitarAgregar()}
                                >
                                    <Text style={{ color: '#2a3d6c', fontWeight: 'bold'}}>Aplicar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        
            {/* Grilla de alumnos y notas */}
            <View style={[styles.grillaContainer, !habilitarGrilla() && styles.botonDeshabilitado]}>
                <ScrollView scrollEnabled={habilitarGrilla()}>
                    <View>
                        

                        <View style={styles.headerRow}>
                            <Text style={styles.headerCellNombre}>Alumno</Text>
                            <Text style={styles.headerCell}>{notaSeleccionada.toUpperCase()}</Text>
                        </View>
                        {alumnos.map((item) => {
                            const seleccionado = alumnosSeleccionados.includes(item.dni_alumno);
                            const valor = item[notaSeleccionada]?.toString() || '';
                        
                            return (
                                <View key={item.dni_alumno} style={[styles.row, seleccionado && { backgroundColor: 'rgba(0, 0, 255, 0.2)' }]}>

                                    {/* Zona de selección */}
                                    <TouchableOpacity
                                        disabled={!habilitarGrilla()}
                                        onPress={() => {
                                            setAlumnosSeleccionados(prev =>
                                                prev.includes(item.dni_alumno)
                                                    ? prev.filter(dni => dni !== item.dni_alumno)
                                                    : [...prev, item.dni_alumno]
                                            );
                                        }}
                                        delayLongPress={200}
                                        style={[
                                            { paddingHorizontal: 10, justifyContent: 'center' },
                                            !habilitarGrilla() && styles.botonDeshabilitado
                                        ]}
                                    >
                                        {/* Nombre del alumno */}
                                        <Text style={styles.cellNombre} numberOfLines={1}>
                                            {item.nombre_completo}
                                        </Text>
                                    </TouchableOpacity>



                                    {/* Nota editable */}
                                    <TextInput
                                        style={[
                                            styles.inputNota,
                                            parseInt(valor) < 6 ? styles.notaMenor : styles.notaMayor,
                                            !habilitarGrilla() && styles.botonDeshabilitado
                                        ]}
                                        value={valor}
                                        inputMode="numeric"
                                        maxLength={2}
                                        editable={habilitarGrilla()}
                                        onChangeText={(text) =>
                                            validarNota(item.dni_alumno, notaSeleccionada, text)
                                        }
                                    />
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>

                <TouchableOpacity
                    style={[styles.botonConsultar, (!validarCampos() || alumnos.length === 0) && styles.botonDeshabilitado, { alignSelf: 'center', marginTop: 10, width: 180 }]}
                    onPress={validarYRegistrarNotas}
                    disabled={!validarCampos() || alumnos.length === 0}
                >
                    <Text style={styles.textoBoton}>Confirmar Notas</Text>
                </TouchableOpacity>
            </View>
            <CustomAlert
                isVisible={alertVisible}
                onClose={() => setAlertVisible(false)}
                title={alertTitle}
                message={alertMessage}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{mensajeValidacion}</Text>
                        <View style={styles.botonesModal}>
                            <Button title="Continuar" onPress={confirmarRegistro} />
                            <Button title="Cancelar" onPress={cancelarRegistro} />
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalSumaEsperadaVisible}
                onRequestClose={() => {
                    setModalSumaEsperadaVisible(!modalSumaEsperadaVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Ingrese la suma esperada:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Suma esperada"
                            keyboardType="number-pad"
                            value={sumaEsperada}
                            onChangeText={setSumaEsperada}
                        />
                        <View style={styles.botonesModal}>
                            <Button title="Continuar" onPress={confirmarSumaEsperada} />
                            <Button title="Cancelar" onPress={() => setModalSumaEsperadaVisible(false)} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
  padre: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    alignItems: 'center',
    justifyContent: 'center', 
    position: 'relative',
  },
  bg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  notaMenor:{
    borderColor: '#ff0000',
    borderWidth: 1,
  },
  notaMayor:{
    borderColor: '#00ff00',
    borderWidth: 1,
  },
botonDeshabilitado: {
        opacity: 0.5,
        backgroundColor: '#cccccc',
        borderColor: '#999999',
    },
  
  contenedorSuperior: {
    width: '97%',
    maxWidth: 1200,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    marginTop: 36,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 6,
    alignSelf: 'center',
  },

  filtrosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 18,
    width: '100%',
  },

  filtrosContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    minWidth: 320,
  },

  inputDesplegable: {
    flex: 1,
    minWidth: 120,
    maxWidth: 200,
    height: 40,
    borderWidth: 1.5,
    borderColor: '#d1d9e6',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginRight: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },

 
  botonesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  botonConsultar: {
    backgroundColor: '#f0f7ff',
    borderColor: '#746BC8',
    borderWidth: 1,
    paddingVertical: 0,
    paddingHorizontal: 18,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#b6f7b6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    height: 40,
    justifyContent: 'center',
    marginLeft: 4,
    minWidth: 100,
  },
  botonReiniciar: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
    borderWidth: 1,
    paddingVertical: 0,
    paddingHorizontal: 14,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#f44336',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    height: 40,
    justifyContent: 'center',
    minWidth: 100,
  },
  textoBoton: {
    color: '#2a3d6c',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 40,
  },

  // Grilla
  grillaContainer: {
    width: '50%',
    maxWidth: 800,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 32,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 6,
    alignSelf: 'center',
  },

  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f7ff',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: '#b6c6e0',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerCell: {
  textAlign: 'center',
  fontWeight: '700',
  fontSize: 14,
  color: '#2a3d6c',
  letterSpacing: 0.5,
  paddingHorizontal: 2,
  minWidth: 70, 
  maxWidth: 80,
  flex: 0,
  alignSelf: 'center',
},
  headerCellNombre: {
   textAlign: 'left',
  fontWeight: '700',
  fontSize: 15,
  color: '#2a3d6c',
  letterSpacing: 0.5,
  paddingHorizontal: 8,
  minWidth: 120,
  flex: 1,
  },

  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  rowEven: {
    backgroundColor: '#f4f8fd',
  },
  cellNombre: {
    flex: 1,
    paddingHorizontal: 8,
    minWidth: 130,
    textAlign: 'left',
    fontSize: 15,
    fontWeight: '500',
    color: '#2a3d6c',
  },

  inputNota: {
  height: 28,
  borderWidth: 1,
  borderColor: '#b6c6e0',
  borderRadius: 6,
  textAlign: 'center',
  marginHorizontal: 2, 
  backgroundColor: '#f9f9f9',
  minWidth: 50, 
  maxWidth: 60,
  fontSize: 14,
  color: '#2a3d6c',
  flex: 0,
  alignSelf: 'center',
},

  
  botonConfirmar: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 10,
    marginTop: 16,
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#CED9EF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    minWidth: 140,
  },
  textoBotonConfirmar: {
    color: '#2a3d6c',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  // Scroll views
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
  },

  // Responsive
  '@media (max-width: 768)': {
    contenedorSuperior: {
      marginTop: 10,
      marginBottom: 10,
      padding: 10,
    },
    filtrosRow: {
      flexDirection: 'column',
      gap: 10,
    },
    filtrosContainer: {
      flexDirection: 'column',
      width: '100%',
      minWidth: 'auto',
      gap: 8,
    },
    inputDesplegable: {
      width: '100%',
      maxWidth: 'none',
      marginRight: 0,
      marginBottom: 8,
    },
    botonesContainer: {
      width: '100%',
      justifyContent: 'center',
      gap: 8,
    },
    grillaContainer: {
      marginBottom: 10,
    },
    headerCell: {
      fontSize: 12,
      minWidth: 50,
    },
    headerCellNombre: {
      fontSize: 12,
      minWidth: 90,
    },
    inputNota: {
      minWidth: 32,
      height: 28,
    },
    cellNombre: {
      fontSize: 13,
      minWidth: 90,
    },
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  botonesModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
  },
  notaGlobalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    width: '97%',
    maxWidth: 1200,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 32,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 6,
    alignSelf: 'center',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 28, 
    marginTop: 10
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  headerText: {
    color: 'black',
    fontSize: 16,
    marginRight: 8,
  },
  notaGlobalInput: {
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    width: 60,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#b6c6e0'
  },
  aplicarButton: {
    backgroundColor: '#f0f7ff',
    borderColor: '#746BC8',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    marginRight: 30,
  },
  filtroGroupInline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputDesplegable: {
    flex: 1,
    minWidth: 120,
    maxWidth: 200,
    height: 40,
    borderWidth: 1.5,
    borderColor: '#d1d9e6',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginRight: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },
});