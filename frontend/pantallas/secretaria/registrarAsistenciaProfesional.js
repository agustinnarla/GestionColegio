import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Platform, Dimensions  } from 'react-native';
import { obtenerProfesionalesAsistencia} from '../../scripts/listasDesplegables/listaDesplegable.js'
import { registrarEntradaProfesores, registrarSalidaProfesores } from '../../scripts/secretaria/scriptAsistenciaProfesor.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageBackground } from 'react-native-web';
import bg from '../../assets/bg1.jpg';
import CustomAlert from '../../componente/CustomAlerts.js';

const { width } = Dimensions.get('window');
const isDesktop = width >= 768;
const isWeb = Platform.OS === 'web';


export default function RegistrarAsistenciaProfesional() {
  const [profesores, setProfesores] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [seleccionados, setSeleccionados] = useState([]);
  const [entrada, setEntrada] = useState(false);


  
   useEffect(() => {
        if (isWeb) {
        document.body.style.overflow = 'auto'; // Activar scroll en web
      } else {
        document.body.style.overflow = 'hidden'; // Desactivarlo en otras plataformas
      }
      }, []);

    

  const [formData, setFormData] = useState({
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

   

    const seleccionarProfesional = (profesor) => {
  setSeleccionados((prev) => {
    if (prev.includes(profesor.dni_profesional)) {
      return prev.filter((dni) => dni !== profesor.dni_profesional);
    } else {
      return [...prev, profesor.dni_profesional];
    }
  });
};
  // Cargar los profesores 
 useEffect(() => {
  const cargarProfesionales = async () => {
    try {
      const data = await obtenerProfesionalesAsistencia();
      let listaProfesores = data.profesor || [];

      // Recuperar entradas guardadas
      const entradasGuardadas = JSON.parse(await AsyncStorage.getItem('entradas')) || [];
      listaProfesores = listaProfesores.map((prof) => ({
        ...prof,
        tieneEntrada: entradasGuardadas.includes(prof.dni_profesional),
      }));

      setProfesores(listaProfesores);
    } catch (error) {
      console.log('Error al cargar los profesores:', error);
      Alert.alert('Error', 'No se pudieron cargar los profesores');
    }
  };

  cargarProfesionales();
}, []);


  // Manejar cambios en los campos del formulario
  const handleChange = (name, value) => {
    console.log(`Actualizando ${name}:`, value); // Depuración
    setFormData({ ...formData, [name]: value });
};

const handleRegistrar = async () => {
  try {
    if (seleccionados.length === 0) {
      mostrarMensaje('Aviso', 'No seleccionaste ningún profesional');
      return;
    }

    const fecha = new Date().toISOString().split('T')[0];
    const data = seleccionados.map((dni) => ({
      dni_profesional: parseInt(dni),
      fecha: fecha,
      hora_entrada: entrada ? formData.hora_entrada : null,
      hora_salida: !entrada ? formData.hora_salida : null,
    }));

    const respuesta = entrada
      ? await registrarEntradaProfesores(data)
      : await registrarSalidaProfesores(data);

    // Actualizar estado local y AsyncStorage si es entrada
    if (entrada) {
      setProfesores((prev) =>
        prev.map((prof) =>
          seleccionados.includes(prof.dni_profesional)
            ? { ...prof, tieneEntrada: true }
            : prof
        )
      );

      // Guardar en AsyncStorage
      const guardadasRaw = await AsyncStorage.getItem('entradas');
      const guardadas = guardadasRaw ? JSON.parse(guardadasRaw) : [];
      const nuevas = Array.from(new Set([...guardadas, ...seleccionados]));
      await AsyncStorage.setItem('entradas', JSON.stringify(nuevas));
    }

    mostrarMensaje('Exito', `Se registró la ${entrada ? 'entrada' : 'salida'} de los profesionales`);
    setSeleccionados([]);
    setFormData({ hora_entrada: '', hora_salida: '' });

  } catch (error) {
    console.error(error);
    mostrarMensaje('Error', 'Error al registrar asistencia');
  }
};


 


return (
  <View style={styles.container}>
    <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
      <View style={isDesktop ? styles.scrollContainerDesktop : styles.scrollContainerMobile}>

        {/* Botones Entrada / Salida */}
        <View style={styles.botonesContainer}>
          <TouchableOpacity
            style={[styles.boton, entrada && styles.botonActivoEntrada]}
            onPress={() => setEntrada(true)}
          >
            <Text style={styles.botonTexto}>Entrada</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.boton, !entrada && styles.botonActivoSalida]}
            onPress={() => setEntrada(false)}
          >
            <Text style={styles.botonTexto}>Salida</Text>
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
          data={profesores.filter((p) =>
            p.nombre_apellido.toLowerCase().includes(busqueda.toLowerCase())
          )}
          keyExtractor={(item) => item.dni_profesional.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.profesor,
                seleccionados.includes(item.dni_profesional) && styles.profesorSeleccionado,
                item.tieneEntrada && !item.tieneSalida
                  ? styles.profesorEntradaRegistrada
                  : item.tieneEntrada && item.tieneSalida
                  ? styles.profesorCompleto
                  : styles.profesorNoRegistrado,
              ]}
              onPress={() => seleccionarProfesional(item)}
            >
              <Text style={styles.profesorTexto}>{item.nombre_apellido}</Text>
            </TouchableOpacity>
          )}
        />

        {/* Formulario para registrar asistencia */}
        {seleccionados.length > 0 && (
          <View style={styles.formulario}>
            <Text>
            Registro de {entrada ? 'entrada' : 'salida'} para{' '}
          {seleccionados.length > 1
            ? `${seleccionados.length} profesionales`
            : seleccionados.length === 1
            ? profesores.find(p => p.dni_profesional === seleccionados[0])?.nombre_apellido || '1 profesional'
            : 'profesionales'}
        </Text>
            <TextInput
              style={styles.input}
              placeholder={`Hora de ${entrada ? 'entrada' : 'salida'} (ej: 08:30)`}
              onChangeText={(text) => handleChange(entrada ? 'hora_entrada' : 'hora_salida', text)}
              value={entrada ? formData.hora_entrada : formData.hora_salida}
            />
            <TouchableOpacity
              style={[
                 
                styles.botonRegistrar,
                !(entrada ? formData.hora_entrada : formData.hora_salida) && styles.botonDeshabilitado,
              ]}
              onPress={handleRegistrar}
              disabled={!(entrada ? formData.hora_entrada : formData.hora_salida)}
              
            >
              <Text style={styles.botonTexto}>Aceptar</Text>
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
)}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    width: '100%',
    height: '100%', 
    alignItems: 'center',
  },
  botonTexto:{
    color: '#2a3d6c',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bg: {
    width: '100%',
    height: '100%',
  },
  profesorSeleccionado: {
  backgroundColor: '#a0c4ff',
  borderColor: '#3b82f6', 
  borderWidth: 2,
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
    marginTop: 40,  
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
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
 
    marginVertical: 4,
    borderRadius: 10,

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