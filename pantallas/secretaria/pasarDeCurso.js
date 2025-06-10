import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ScrollView, Platform, Dimensions, ImageBackground } from 'react-native';
import bg from '../../assets/bg1.jpg';
import { obtenerCurso } from '../../scripts/listasDesplegables/listaDesplegable';
import ListasDesplegables from '../../componente/ListasDesplegables';
import {  registrarCursoNuevo, obtenerAlumnoFinal } from '../../scripts/secretaria/scriptPasarCurso';
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
  
  
  //Cargamos datos 
  const [alumnos, setAlumnos] = useState([]);
  const [curso, setCursos] = useState([]);

  // Mensajes 
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');


   const mostrarMensaje = (titulo, mensaje) => {
        setAlertTitle(titulo);
        setAlertMessage(mensaje);
        setAlertVisible(true);
    };

  useEffect(() => {
    const cargarDatos = async () => {
        try {
            const cursosData = await obtenerCurso();
            setCursos(cursosData); 
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    cargarDatos();
    }, []);
    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    // Cargar alumnos cuando se selecciona un curso
    const cargarAlumnos = async () => {
      try {
        const alumnosData = await obtenerAlumnoFinal(formData.id_curso);
        if (alumnosData) {
          console.log('Alumnos cargados:', alumnosData);
          setAlumnos(alumnosData);
        }
      } catch (error) {
        console.error('Error al cargar alumnos:', error);
        Alert.alert('Error', 'No se pudieron cargar los alumnos');
        setAlumnos([]);
      } 
    };
  
    //Registramos curso nuevo 
    const handleRegistrar = async() => {
      try {
        const alumnosData = alumnos.map(alumno => ({
          dni_alumno: alumno.dni_alumno,
          id_curso: parseInt(formData.id_curso) 
        }));

        console.log("Datos a enviar:", alumnosData);

        const respuesta = await registrarCursoNuevo(alumnosData);
        
        console.log("Alumnos Asignados al curso nuevo perfectamente",respuesta)
        mostrarMensaje('¡Éxito!', 'Alumnos asignados al nuevo curso');
        setAlumnos([]);
        setFormData({
          dni_alumno: '',
          id_curso:'',
      });
      } catch(error) {
        console.error("Error completo:", error);
        mostrarMensaje('¡Error!', 'Error al asignar el curso nuevo');
      }
    }
 return (
  <View style={styles.container}>
    <ImageBackground source={bg} style={styles.bg} resizeMode="cover" >
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
          <TouchableOpacity style={styles.botonPrimario} onPress={cargarAlumnos}>
            <Text style={styles.textoBoton}>Consultar</Text>
          </TouchableOpacity>
        </View>
      <Text style={styles.tituloLista}>Alumnos</Text>
      <View style={styles.listaAlumnosContainer}>
        <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.scrollViewContent}>
          {alumnos.map((item) => (
            <View key={item.dni_alumno} style={styles.row}>
              <Text style={styles.cellNombre}>{item.nombrecompleto}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <TouchableOpacity style={styles.botonConfirmar} onPress={handleRegistrar}>
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
  justifyContent: 'center', // Centrado vertical
  position: 'relative',
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