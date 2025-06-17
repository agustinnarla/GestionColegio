import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList, TextInput,Alert,ScrollView, Platform, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState,useEffect } from "react";
import bg from '../../assets/bg1.jpg';
import CustomAlert from '../../componente/CustomAlerts.js';
import { obtenerMateriaPorCurso, obtenerCurso  } from '../../scripts/listasDesplegables/listaDesplegable.js';
import ListasDesplegables from '../../componente/ListasDesplegables';
import { registrarNotas, obtenerNotas } from '../../scripts/secretaria/scriptCargarNotas';
import * as XLSX from 'xlsx';

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
    
    /*
        CARGAMOS LAS LISTAS DESPLEGABLES
    */
    const [curso,setCursos] = useState([]);
    const [materias,setMaterias] = useState([]);
    const [alumnos, setAlumnos] = useState([]); 
    
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
                if (alumnosData) {
                    setAlumnos(alumnosData);
                    console.log('Alumnos cargados:', alumnosData);
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
  };
  
    /*
        REGISTRAMOS NUEVAS NOTAS 
    */
    const handleRegistrar = async () => {
        try {
            

            // Validar que haya alumnos seleccionados
            if (!alumnos || alumnos.length === 0) {
                return Alert.alert('Error', 'No hay alumnos para registrar notas');
            }

            // Validar campos del formulario
            if (!formData.id_materia) {
                return Alert.alert('Error', 'Por favor seleccione una materia');
            }
            if (!formData.id_curso) {
                return Alert.alert('Error', 'Por favor seleccione un curso');
            }

            // Crear array de notas para registrar
            const notasParaRegistrar = alumnos.map(alumno => {
                if (!alumno.dni_alumno) {
                    throw new Error("DNI de alumno no encontrado");
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

            console.log("Datos a registrar:", notasParaRegistrar);

            // Llamar al backend para registrar las notas
            const respuesta = await registrarNotas(notasParaRegistrar);
            console.log('Respuesta del servidor:', respuesta);
            mostrarMensaje('¡Éxito!', 'Se registro las notas de los alumnos exitosamente');
            limpiarInterfaz()
           

        } catch (error) {
            console.log("Error detallado:", error);
            mostrarMensaje('¡Error!', 'Error al registrar las notas ');
        }
    };

    const validarNota = (dni_alumno, campo, valor) => {
        // Validar que el valor sea un número entre 0 y 10
        if (valor === '' || (parseInt(valor) >= 1 && parseInt(valor) <= 10)) {
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

    const exportarAExcel = () => {
        if (!alumnos || alumnos.length === 0) {
            mostrarMensaje('Error', 'No hay datos para exportar');
            return;
        }

        try {
            // Preparar los datos para Excel
            const datosExcel = alumnos.map(alumno => ({
                'Alumno': alumno.nombre_completo,
                'Nota 1': alumno.nota1 || '',
                'Nota 2': alumno.nota2 || '',
                'Nota 3': alumno.nota3 || '',
                'Nota 4': alumno.nota4 || '',
                'Nota 5': alumno.nota5 || '',
                'Nota 6': alumno.nota6 || '',
                'TP 1': alumno.tp1 || '',
                'TP 2': alumno.tp2 || '',
                'TP 3': alumno.tp3 || '',
                'Aulico': alumno.aulico || ''
            }));

            // Crear el libro de Excel
            const ws = XLSX.utils.json_to_sheet(datosExcel);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Notas");

            // Generar el archivo
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

            // Convertir a Blob y descargar
            const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Notas_${formData.id_curso}_${formData.id_materia}.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);

            mostrarMensaje('Éxito', 'Archivo Excel generado correctamente');
        } catch (error) {
            console.error('Error al exportar a Excel:', error);
            mostrarMensaje('Error', 'No se pudo generar el archivo Excel');
        }
    };

    // Función auxiliar para convertir string a ArrayBuffer
    const s2ab = (s) => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
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
                        <TouchableOpacity style={styles.botonConsultar} onPress={cargarAlumnos}>
                            <Text style={styles.textoBoton}>Consultar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botonReiniciar} onPress={limpiarInterfaz}>
                            <Text style={styles.textoBoton}>Reiniciar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botonConsultar} onPress={exportarAExcel}>
                            <Text style={styles.textoBoton}>📄</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Grilla de alumnos y notas */}
            <View style={styles.grillaContainer}>
                <ScrollView>
                    <View>
                        <View style={styles.headerRow}>
                          <Text style={styles.headerCellNombre}>Alumno</Text>
                          {[1,2,3,4,5,6].map(num => (
                            <Text key={`hnota${num}`} style={styles.headerCell}>{`Nota ${num}`}</Text>
                          ))}
                          {[1,2,3].map(num => (
                            <Text key={`htp${num}`} style={styles.headerCell}>{`Tp ${num}`}</Text>
                          ))}
                          <Text style={styles.headerCell}>Aulico</Text>
                        </View>
                        {alumnos.map((item) => (
                          <View key={item.dni_alumno} style={styles.row}>
                            <Text style={styles.cellNombre} numberOfLines={1}>{item.nombre_completo}</Text>
                            {[1,2,3,4,5,6].map((num) => (
                              <TextInput
                                key={num}
                                style={styles.inputNota}
                                value={item[`nota${num}`]?.toString() || ''}
                                inputMode="numeric"
                                maxLength={2}
                                onChangeText={(text) => validarNota(item.dni_alumno, `nota${num}`, text)}
                              />
                            ))}
                            {[1,2,3].map((num) => (
                              <TextInput
                                key={`tp${num}`}
                                style={styles.inputNota}
                                value={item[`tp${num}`]?.toString() || ''}
                                inputMode="numeric"
                                maxLength={2}
                                onChangeText={(text) => validarNota(item.dni_alumno, `tp${num}`, text)}
                              />
                            ))}
                            <TextInput
                              style={styles.inputNota}
                              value={item.aulico?.toString() || ''}
                              inputMode="numeric"
                              maxLength={2}
                              onChangeText={(text) => validarNota(item.dni_alumno, 'aulico', text)}
                            />
                          </View>
                        ))}
                    </View>
                        </ScrollView>
              
                <TouchableOpacity 
                    style={[styles.botonConsultar, {alignSelf: 'center', marginTop: 10, width: 180}]}
                    onPress={handleRegistrar}
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
        </View>
    );
}

const styles = StyleSheet.create({
  padre: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    alignItems: 'center',
    justifyContent: 'center', // Centrado vertical
    position: 'relative',
  },
  bg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },

  // Sección superior
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

  // Botones
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

  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f7ff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: '#b6c6e0',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  headerCell: {
  textAlign: 'center',
  fontWeight: '700',
  fontSize: 15,
  color: '#2a3d6c',
  letterSpacing: 0.5,
  paddingHorizontal: 4,
  minWidth: 80, // Cambia a 80 para que no se superpongan
  flex: 1,
},
  headerCellNombre: {
   textAlign: 'left',
  fontWeight: '700',
  fontSize: 15,
  color: '#2a3d6c',
  letterSpacing: 0.5,
  paddingHorizontal: 8,
  minWidth: 120,
  flex: 2,
  },

  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  rowEven: {
    backgroundColor: '#f4f8fd',
  },
  cellNombre: {
    flex: 2,
  paddingHorizontal: 8,
  minWidth: 120,
  textAlign: 'left',
  fontSize: 15,
  fontWeight: '500',
  color: '#2a3d6c',
  },

  inputNota: {
  height: 34,
  borderWidth: 1,
  borderColor: '#b6c6e0',
  borderRadius: 7,
  textAlign: 'center',
  marginHorizontal: 4, // Menos separación para mejor alineación
  backgroundColor: '#f9f9f9',
  minWidth: 80, // Igual que headerCell
  fontSize: 15,
  color: '#2a3d6c',
  flex: 1,
},

  // Botón confirmar
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
});