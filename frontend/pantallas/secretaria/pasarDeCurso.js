import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ScrollView, Platform, Dimensions, ImageBackground } from 'react-native';
import bg from '../../assets/bg1.jpg';
import { obtenerCurso } from '../../scripts/listasDesplegables/listaDesplegable.js';
import ListasDesplegables from '../../componente/ListasDesplegables.jsx';
import {  registrarCursoNuevo, obtenerAlumnoFinal } from '../../scripts/secretaria/scriptPasarCurso.js';
import CustomAlert from '../../componente/CustomAlerts.js';


const { width } = Dimensions.get('window');
const isDesktop = width >= 768;
const isWeb = Platform.OS === 'web';

export default function PasarDeAño() {
   useEffect(() => {
          if (isWeb) {
          document.body.style.overflow = 'auto'; // Activar scroll en web
        } else {
          document.body.style.overflow = 'hidden'; // Desactivarlo en otras plataformas
        }
        }, []);

  
  //Formulario
  const [formData, setFormData] = useState({
  dni_alumno: '',
  id_curso: ''
});

const validarDatos = () => {
  return formData.id_curso;
};

const [alumnos, setAlumnos] = useState([]);
const [curso, setCursos] = useState([]);
const [alumnosSeleccionados, setAlumnosSeleccionados] = useState([]);

// Alertas
const [alertVisible, setAlertVisible] = useState(false);
const [alertTitle, setAlertTitle] = useState('');
const [alertMessage, setAlertMessage] = useState('');

const mostrarMensaje = (titulo, mensaje) => {
  setAlertTitle(titulo);
  setAlertMessage(mensaje);
  setAlertVisible(true);
};

// Cargar cursos al iniciar
useEffect(() => {
  const cargarListaDesplegable = async () => {
    try {
      const cursosData = await obtenerCurso();
      setCursos(cursosData);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  cargarListaDesplegable();
}, []);

const handleChange = (name, value) => {
  setFormData({ ...formData, [name]: value });
};

// Cargar alumnos según curso
const cargarAlumnos = async () => {
  try {
    const alumnosData = await obtenerAlumnoFinal(formData.id_curso);
    if (alumnosData) {
      console.log('Alumnos cargados:', alumnosData);
      setAlumnos(alumnosData);
      setAlumnosSeleccionados([]); // resetear selección
    }
  } catch (error) {
    console.error('Error al cargar alumnos:', error);
    Alert.alert('Error', 'No se pudieron cargar los alumnos');
    setAlumnos([]);
    setAlumnosSeleccionados([]);
  }
};

// Seleccionar/Deseleccionar alumno
const seleccionarAlumno = (dni_alumno) => {
  setAlumnosSeleccionados((prevSeleccionados) => {
    if (prevSeleccionados.includes(dni_alumno)) {
      return prevSeleccionados.filter((dni) => dni !== dni_alumno);
    } else {
      return [...prevSeleccionados, dni_alumno];
    }
  });
};

const validarCurso = () => {
  return(
    formData.id_curso
  )
}
const validarAlumnos = () => {
  return(
    alumnos.length > 0
  )
}



// Registrar
const handleRegistrar = async () => {
  try {
    let alumnosData;
    
    // Si no hay alumnos seleccionados, pasar todos los alumnos
    if (alumnosSeleccionados.length === 0) {
      alumnosData = alumnos.map((alumno) => ({
        dni_alumno: alumno.dni_alumno,
        id_curso: parseInt(formData.id_curso)
      }));
      console.log('Pasando todos los alumnos:', alumnosData.length);
    } else {
      // Si hay alumnos seleccionados, pasar solo los seleccionados
      alumnosData = alumnos
        .filter((alumno) => alumnosSeleccionados.includes(alumno.dni_alumno))
        .map((alumno) => ({
          dni_alumno: alumno.dni_alumno,
          id_curso: parseInt(formData.id_curso)
        }));
      console.log('Pasando alumnos seleccionados:', alumnosData.length);
    }

    if (alumnosData.length === 0) {
      mostrarMensaje('Aviso', 'No hay alumnos para pasar de curso');
      return;
    }

    console.log('Datos a enviar:', alumnosData);
    const respuesta = await registrarCursoNuevo(alumnosData);
    console.log('Alumnos asignados:', respuesta);

    if((parseInt(formData.id_curso) === 11 || parseInt(formData.id_curso) === 12)) {
      mostrarMensaje('¡Éxito!', 'Alumno/os egresado/os');
    } else {
      mostrarMensaje('¡Éxito!', 'Curso nuevo registrado');
    }
    
    setAlumnos([]);
    setAlumnosSeleccionados([]);
    setFormData({ dni_alumno: '', id_curso: '' });

  } catch (error) {
    console.error('Error completo:', error);
    mostrarMensaje('¡Error!', 'Error al asignar el curso nuevo');
  }
};

// Render
return (
  <View style={styles.container}>
    <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
      <View style={isDesktop ? styles.scrollContainerDesktop : styles.scrollContainerMobile}>
        <View style={styles.card}>
          
          <View style={styles.filaFiltros}>
            <View style={styles.filtrosHorizontales}>
              <ListasDesplegables
                formData={formData}
                handleChange={handleChange}
                curso={curso}
                showLabel={false}
                styles={styles}
              />
            </View>
          </View>

          <View style={styles.botonesFiltros}>
            <TouchableOpacity
              style={[styles.botonPrimario, !validarCurso() && styles.botonDeshabilitado]}
              onPress={cargarAlumnos}
              disabled={!validarCurso()}
            >
              <Text style={styles.textoBoton}>Consultar</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.tituloLista}>Alumnos</Text>
          <Text style={styles.textoInformativo}>
            Selecciona alumnos específicos o deja sin seleccionar para pasar todos
          </Text>

      
          <View style={styles.listaAlumnosContainer}>
            <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.scrollViewContent}>
              {alumnos.map((item) => (
                <TouchableOpacity
                  key={item.dni_alumno}
                  onPress={() => seleccionarAlumno(item.dni_alumno)}
                  style={[
                    styles.row,
                    alumnosSeleccionados.includes(item.dni_alumno) && styles.rowSeleccionado
                  ]}
                >
                  <Text style={styles.cellNombre}>{item.nombrecompleto}    ---------    {item.dni_alumno}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <TouchableOpacity style={[styles.botonConfirmar, !validarAlumnos() && styles.botonDeshabilitado]} onPress={handleRegistrar} disabled={!validarAlumnos()}>
            <Text style={styles.textoBotonGrande}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <CustomAlert
        isVisible={alertVisible}
        onClose={() => setAlertVisible(false)}
        title={alertTitle}
        message={alertMessage}
      />
    </ImageBackground>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: '#f5f7fa',
  alignItems: 'center',
  justifyContent: 'center', 
  position: 'relative',
},
  botonDeshabilitado: {
    opacity: 0.5,
        backgroundColor: '#cccccc',
        borderColor: '#999999',
  },
  bg: {
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
   scrollViewDesktop: {
    width: '100%',
    flex: 1,

  },
  rowSeleccionado: {
  backgroundColor: '#cdeed6', // verde claro para indicar selección
},
  scrollViewMobile: {
    width: '100%',
    flex: 1,
  },
  scrollContainerDesktop: {
    width: '100%',
    alignItems: 'center'
  },
  scrollContainerMobile: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 80,
  },
  card: {
  backgroundColor: '#fff',
  borderRadius: 18,
  padding: 32,
  width: '97%',
  maxWidth: 600,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.10,
  shadowRadius: 12,
  elevation: 6,
  alignItems: 'center',
  marginTop: 20,  
  borderWidth: 1,
  borderColor: '#e1e8ed',
},
  filaFiltros: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: 18,
    gap: 18,
  },
  filtrosHorizontales: {
    flex: 3,
    marginRight: 12,
  },
  botonesFiltros: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  botonPrimario: {
    backgroundColor: '#f0f7ff',
    borderColor: '#746BC8',
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#b6f7b6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    height: 40,
    justifyContent: 'center',
    marginBottom: 20,
    minWidth: 110,
  },
  tituloLista: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2a3d6c',
    marginBottom: 10,
    alignSelf: 'center',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  textoInformativo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  listaAlumnosContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    width: '100%',
    maxHeight: 350,
    marginBottom: 24,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  cellNombre: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    color: '#374151',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  botonConfirmar: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#CED9EF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    minWidth: 140,
  },
  textoBoton: {
    color: '#2c3e50',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 40,
  },
  textoBotonGrande: {
    color: '#2c3e50',
    fontSize: 18,    // ...existing code...
      filaFiltros: {
        flexDirection: 'row',
        alignItems: 'center', // Cambia 'flex-end' por 'center' para alinear verticalmente
        width: '100%',
        marginBottom: 18,
        gap: 18,
      },
      filtrosHorizontales: {
        flex: 3,
        marginRight: 0, // Quita el margen derecho para que no se separe tanto
      },
      botonesFiltros: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start', // Cambia a 'flex-start' para que quede pegado al desplegable
        gap: 10,
        alignItems: 'center', // Asegura alineación vertical
      },
      botonPrimario: {
        backgroundColor: '#f0f7ff',
        borderColor: '#746BC8',
        borderWidth: 1,
        paddingVertical: 0, // Ajusta para que el alto sea igual al desplegable
        paddingHorizontal: 18,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#b6f7b6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 4,
        height: 40, // Igual que el desplegable
        justifyContent: 'center',
        marginLeft: 0, // Quita el margen izquierdo
        minWidth: 110,
      },
    // ...existing code...
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
  },
  scrollViewContent: {
    paddingBottom: 10,
  },
});