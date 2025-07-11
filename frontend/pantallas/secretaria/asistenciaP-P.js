import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Platform, Dimensions  } from 'react-native';
import { obtenerProfesionalesAsistencia} from '../../scripts/listasDesplegables/listaDesplegable.js'
import { registrarEntradaProfesor, registrarSalidaProfesor } from '../../scripts/secretaria/scriptAsistenciaProfesor.js';
import { ImageBackground } from 'react-native-web';
import bg from '../../assets/bg1.jpg';
import CustomAlert from '../../componente/CustomAlerts.js';

const { width } = Dimensions.get('window');
const isDesktop = width >= 768;
const isWeb = Platform.OS === 'web';


export default function RegistroAsistencia() {
  const [profesores, setProfesores] = useState([]); 
  const [busqueda, setBusqueda] = useState(''); 
  const [seleccionado, setSeleccionado] = useState(null); 
  const [entrada, setEntrada] = useState(false); 

   useEffect(() => {
        if (isWeb) {
        document.body.style.overflow = 'auto'; // Activar scroll en web
      } else {
        document.body.style.overflow = 'hidden'; // Desactivarlo en otras plataformas
      }
      }, []);

  const [formData, setFormData] = useState({
    dni_profesional: '',
    fecha: '',
    hora_entrada: '',
    hora_salida: '',
  });

  // Mensajes 
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
  
  
     const mostrarMensaje = (titulo, mensaje) => {
          setAlertTitle(titulo);
          setAlertMessage(mensaje);
          setAlertVisible(true);
      };

    const validarEntrada = () => {
       return (
           formData.hora_entrada 
        )
    }
    const validarSalida = () => {
       return (
           formData.hora_salida 
        )
    }
    
  // Cargar los profesores al montar el componente
  useEffect(() => {
    const cargarProfesionales = async () => {
      try {
        const data = await obtenerProfesionalesAsistencia();
        setProfesores(data.profesor); 
      } catch (error) {
        console.log('Error al cargar los profesores:', error);
        Alert.alert('Error', 'No se pudieron cargar los profesores');
      }
    };
    cargarProfesionales();
  }, []);

  // Actualizar `formData` al seleccionar un profesor
  const handleSeleccionarProfesional = (profesor) => {
    setSeleccionado(profesor);
    setFormData({
      ...formData,
      dni_profesional: profesor.dni_profesional, // Actualiza el DNI del profesor seleccionado
      fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
    });
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (name, value) => {
    console.log(`Actualizando ${name}:`, value); // Depuración
    setFormData({ ...formData, [name]: value });
};

 const handleRegistrar = async () => {
    try {
        const profesorData = {
            dni_profesional: parseInt(formData.dni_profesional),
            fecha: formData.fecha,
            hora_entrada: entrada ? formData.hora_entrada : null,
            hora_salida: !entrada ? formData.hora_salida : null,
        };

        console.log("Datos enviados al servidor:", profesorData);

        if (entrada) {
            //Profesionales
            const respuesta = await registrarEntradaProfesor(profesorData);
            //console.log("Registro de entrada exitoso:", respuesta);
            mostrarMensaje('Exito','Se registro la entrada del profesional exitosamente')
            // Actualizar el estado del profesor en la lista
            setProfesores(prevProfesores => 
                prevProfesores.map(prof => 
                    prof.dni_profesional === profesorData.dni_profesional 
                        ? { ...prof, tieneEntrada: true }
                        : prof
                )
            );
        } else {
            //Profesionales
            const respuesta = await registrarSalidaProfesor(profesorData);
            mostrarMensaje('Exito','Se registro la salida del profesional exitosamente')
            //console.log("Registro de salida exitoso:", respuesta);
            // Actualizar el estado del profesor en la lista
            setProfesores(prevProfesores => 
                prevProfesores.map(prof => 
                    prof.dni_profesional === profesorData.dni_profesional 
                        ? { ...prof, tieneSalida: true }
                        : prof
                )
            );
        }

        // Hacer metodo limpiar interfaz
        setFormData({
            dni_profesional: "",
            fecha: "",
            hora_entrada: "",
            hora_salida: "",
        });
        setSeleccionado(null);
    } catch (error) {
        //console.error("Error al registrar la entrada/salida:", error.message);
        mostrarMensaje('¡Error!', 'Error al registrar la asistencia del profesional');
    }
};

  // Filtrar los profesores según la búsqueda
  const profesoresFiltrados = profesores.filter((profesor) =>
    profesor.nombre_apellido.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <View style={styles.container}>
       <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
      <View style={isDesktop ? styles.scrollContainerDesktop : styles.scrollContainerMobile}>
      <Text style={styles.titulo}>Registro de Asistencia</Text>

      {/* Botones Entrada / Salida */}
      <View style={styles.botonesContainer}>
        <TouchableOpacity
          style={[styles.boton, entrada && styles.botonActivoEntrada]}
          onPress={() => setEntrada(true)}
        >
          <Text>Entrada</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.boton, !entrada && styles.botonActivoSalida]}
          onPress={() => setEntrada(false)}
        >
          <Text>Salida</Text>
        </TouchableOpacity>
      </View>

      {/* Campo de búsqueda */}
      <TextInput
        style={styles.input}
        placeholder="Buscar profesor/preceptor"
        value={busqueda}
        onChangeText={setBusqueda}
      />

      {/* Lista de profesores */}
      <FlatList
          data={profesoresFiltrados}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.profesor,
                item.tieneEntrada && !item.tieneSalida ? styles.profesorEntradaRegistrada :
                item.tieneEntrada && item.tieneSalida ? styles.profesorCompleto :
                styles.profesorNoRegistrado
              ]}
              onPress={() => {
                if (item.tieneEntrada && !item.tieneSalida) {
                  setEntrada(false); // Cambiar a modo salida si ya tiene entrada registrada
                }
                handleSeleccionarProfesional(item);
              }}
            >
              <Text style={styles.profesorTexto}>{item.nombre_apellido}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listaProfesores}
        />

      {/* Formulario para registrar asistencia */}
      {seleccionado && (
        <View style={styles.formulario}>
          <Text>Registro de {entrada ? 'Entrada' : 'Salida'} para {seleccionado.nombre_apellido}</Text>

          <TextInput
              style={styles.input}
              placeholder={`Hora de ${entrada ? 'entrada' : 'salida'} (ej: 08:30)`}
              onChangeText={(text) => handleChange(entrada ? 'hora_entrada' : 'hora_salida', text)}
              value={entrada ? formData.hora_entrada : formData.hora_salida}
          />

         <TouchableOpacity
          style={[
            styles.botonRegistrar,
            (entrada ? !validarEntrada() : !validarSalida()) && styles.botonDeshabilitado
          ]}
          onPress={handleRegistrar}
          disabled={entrada ? !validarEntrada() : !validarSalida()}
        >
          <Text>Aceptar</Text>
        </TouchableOpacity>
        </View>
      )}
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
    width: '100%',
    height: '100%', 
    alignItems: 'center',
  },
  bg: {
    width: '100%',
    height: '100%',
  },
  botonDeshabilitado: {
        opacity: 0.5,
        backgroundColor: '#cccccc',
        borderColor: '#999999',
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
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2a3d6c',
    marginTop: 32,
    marginBottom: 24,
    letterSpacing: 0.7,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
    marginBottom: 24,
  },
  boton: {
    borderWidth: 1,
    borderColor: '#746BC8',
    backgroundColor: '#f0f7ff',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
    minWidth: 120,
    elevation: 2,
    shadowColor: '#b6f7b6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
  },
  botonActivoEntrada: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
  },
  botonActivoSalida: {
    backgroundColor: '#fde8e8',
    borderColor: '#ef4444',
  },
  input: {
    borderColor: '#e1e8ed',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginVertical: 18,
    backgroundColor: '#fff',
    fontSize: 16,
    width: 370,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  listaProfesores: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    marginBottom: 12,
  },
  profesor: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
    marginVertical: 4,
    borderRadius: 10,
    backgroundColor: '#f9fafb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  profesorNoRegistrado: {
    backgroundColor: '#fde8e8',
    borderColor: '#ef4444',
  },
  profesorEntradaRegistrada: {
    backgroundColor: '#e0f2fe',
    borderColor: '#0ea5e9',
  },
  profesorCompleto: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
  },
  profesorTexto: {
    fontSize: 17,
    color: '#374151',
    fontWeight: '600',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  formulario: {
    marginTop: 28,
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    width: 400,
    alignSelf: 'center',
    marginBottom: 80,
  },
  botonRegistrar: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 18,
    elevation: 2,
    shadowColor: '#CED9EF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
  },
});