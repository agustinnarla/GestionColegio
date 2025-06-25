import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TextInput, Text, ScrollView, TouchableOpacity, Alert, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import { obtenerMotivos, obtenerCurso, obtenerProfesores, obtenerEstadoGeneral} from '../../scripts/listasDesplegables/listaDesplegable.js'
import { obtenerAvisosCurso, obtenerAvisosGenerales } from '../../scripts/alumno/scriptAvisos.js';
import { obtenerAvisos, crearAvisos} from '../../scripts/secretaria/scriptCargarAvisos';
import bg from '../../assets/bg1.jpg';
import ListasDesplegables from '../../componente/ListasDesplegables.jsx';

export default function Avisos() {
  const [informacion, setInformacion] = useState('');
  const [motivo, setMotivo] = useState('');
  const [motivosData, setMotivosData] = useState([]); // Para guardar la lista completa
  const [profesor, setProfesor] = useState([]); // Cambiado a array para múltiple selección
  const [cursosData, setCursosData] = useState([]); // Nuevo estado para cursos
  const [cursosAfectados, setCursosAfectados] = useState([]);
  const [fecha, setFecha] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fechaTexto, setFechaTexto] = useState('');
  const [profesoresData, setProfesoresData] = useState([]); // Para almacenar los datos de profesores
  const [estado_general, setEstadoGeneral] = useState([]);

  const [formData, setFormData] = useState({
    id_estado_general: '',
    id_motivo: '',
  })

    // En tu componente:
    const [avisos, setAvisos] = useState([]);
    const [cargandoAvisos, setCargandoAvisos] = useState(false);
    const [errorAvisos, setErrorAvisos] = useState(null);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || fecha;
    setShowDatePicker(false);
    setFecha(currentDate);
    
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();
    setFechaTexto(`${day}/${month}/${year}`);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const validarFecha = (text) => {
    // Expresión regular para validar DD/MM/YYYY
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    const esValida = regex.test(text);
    setFechaValida(esValida);
    setFecha(text);
    
    // Autoformateo mientras escribe
    if (text.length === 2 || text.length === 5) {
      if (text.length === 2 && text.indexOf('/') === -1) {
        setFecha(text + '/');
      } else if (text.length === 5 && text.lastIndexOf('/') === 2) {
        setFecha(text + '/');
      }
    }
  };

 
    const cargarEstadoGeneral = async () => {
        try {
            
            const estadoData = await obtenerEstadoGeneral();
            setEstadoGeneral(estadoData);
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };
  
  
  useEffect(() => {
    cargarProfesores();
    cargarCursos();
    cargarMotivos();
    cargarEstadoGeneral();
    cargarAvisos();
  }, []); // Solo se ejecuta al montar el componente

  const cargarProfesores = async () => {
    try {
      const response = await obtenerProfesores();
      console.log("Datos crudos de profesores:", response); 
      
      // Accedemos al array de profesores dentro del objeto
const listaProfesores = Array.isArray(response) ? response : (response.profesores || []);      
      if (listaProfesores.length > 0) {
        const profesoresFormateados = listaProfesores.map(prof => ({
          key: prof.dni_profesional.toString(),
          value: `${prof.nombre}`
        }));
        
        console.log("Profesores formateados:", profesoresFormateados);
        setProfesoresData(profesoresFormateados);
      } else {
        console.log("Array de profesores vacío");
      }
    } catch (error) {
      console.error("Error al cargar profesores:", error);
    }
  };

  const cargarCursos = async () => {
    try {
      const response = await obtenerCurso();
      console.log("Datos crudos de cursos:", response); 
      
      // Accedemos al array de cursos dentro del objeto
const listaCursos = Array.isArray(response) ? response : (response.cursos || []);

      if (listaCursos.length > 0) {
        const cursosFormateados = listaCursos.map(curso => ({
          key: curso.id_curso.toString(), // Usamos id_curso como clave
          value: curso.detalle.toUpperCase() // Mostramos el detalle en mayúsculas (ej: "1 A")
        }));
        
        console.log("Cursos formateados:", cursosFormateados);
        setCursosData(cursosFormateados);
      } else {
        console.log("Array de cursos vacío");
      }
    } catch (error) {
      console.error("Error al cargar cursos:", error);
      Alert.alert("Error", "No se pudieron cargar los cursos");
    }
  };

  const cargarMotivos = async () => {
    try {
      const response = await obtenerMotivos();
      console.log("Respuesta de motivos:", response);
      setMotivosData(response);
    } catch (error) {
      console.error("Error al cargar motivos:", error);
      setMotivosData([{key: '0', value: 'Error al cargar motivos'}]);
    }
  };

  const agregarAviso = async () => {
    if (informacion && fechaTexto) {
      try {
        // Convierte la fecha del input a YYYY-MM-DD
        let fechaISO = fechaTexto;
        if (fechaTexto.includes('/')) {
          // Si el usuario escribe DD/MM/YYYY, conviértelo
          const partes = fechaTexto.split('/');
          if (partes.length === 3) {
            fechaISO = `${partes[2]}-${partes[1]}-${partes[0]}`;
          }
        }

        const datosParaBackend = {
          informacion,
          id_motivo: formData.id_motivo,
          fecha: fechaISO,
          id_estado_general: formData.id_estado_general,
          profesores: profesor,
          cursos: cursosAfectados
        };

        console.log('Datos a enviar al backend:', datosParaBackend);

        const respuesta = await crearAvisos(datosParaBackend);
        console.log('Respuesta del backend:', respuesta);
        cargarAvisos();
        Alert.alert('Éxito', 'Aviso creado correctamente');
        limpiarInterfaz();

      } catch (error) {
        console.error('Error al crear aviso:', error);
        Alert.alert('Error', error.message || 'Error al crear el aviso');
      }
    } else {
      console.error('Completar');
      Alert.alert('Error', 'Complete todos los campos obligatorios');
    }
};

const cargarAvisos = async () => {
    try {
        setCargandoAvisos(true);
        setErrorAvisos(null);

        const avisosObtenidosGenerales = await obtenerAvisosGenerales();
        console.log("Datos recibidos del backend:", avisosObtenidosGenerales);

        // Accede al array de avisos correctamente
        const listaAvisos = Array.isArray(avisosObtenidosGenerales)
            ? avisosObtenidosGenerales
            : avisosObtenidosGenerales.avisos || [];

        // Filtrar por fecha mayor o igual a hoy
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // Ignora la hora

        const avisosFiltrados = listaAvisos.filter(aviso => {
            if (!aviso.fecha) return false;
            // Convertir "DD-MM-YYYY" a Date
            const [dia, mes, anio] = aviso.fecha.split('-');
            const fechaAviso = new Date(`${anio}-${mes}-${dia}T00:00:00`);
            return fechaAviso >= hoy;
        });


        setAvisos(avisosFiltrados);
    } catch (error) {
        console.error('Error al cargar avisos:', error);
        setErrorAvisos('No se pudieron cargar los avisos. Intente nuevamente.');
        Alert.alert('Error', 'No se pudieron cargar los avisos');
    } finally {
        setCargandoAvisos(false);
    }
};

  const limpiarInterfaz = () => {
    setInformacion('');
    setMotivo('');
    setProfesor([]);
    setCursosAfectados([]);
    setFecha(new Date());
    setFechaTexto('');
  };
  
const handleChange = (name, value) => {
            setFormData({ ...formData, [name]: value });
        };


  return (
    <View style={styles.container}>
      <Image source={bg} style={styles.bg} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.flexRow}>
          {/* Formulario */}
          <View style={styles.formulario}>
            <Text style={styles.label}>Información</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ingrese la información del aviso"
              value={informacion}
              onChangeText={setInformacion}
              multiline
            />

            <Text style={styles.label}>Fecha</Text>
            <TextInput
              style={styles.input}
              placeholder="AAAA-MM-DD"
              value={fechaTexto}
              onChangeText={setFechaTexto}
              keyboardType="numeric"
              maxLength={10}
            />
            
            <ListasDesplegables
                formData={formData}
                handleChange={handleChange}
                motivos={motivosData}
                styles={styles}
                showLabel={true}
            />  

            <ListasDesplegables
                formData={formData}
                handleChange={handleChange}
                estado_general={estado_general}
                styles={styles}
                showLabel={true}
            />  

            <Text style={styles.label}>Profesores Afectados</Text>
            <MultipleSelectList
              setSelected={(val) => setProfesor(val)}
              data={profesoresData}
              save="key"
              label="Profesores"
              placeholder="Seleccionar profesor(es) (opcional)"
              boxStyles={styles.dropdown}
              dropdownTextStyles={styles.dropdownText}
              notFoundText="No hay profesores disponibles"
            />
            <Text style={styles.label}>Cursos afectados</Text>
            <MultipleSelectList
            setSelected={(val) => setCursosAfectados(val)}
            data={cursosData} // Usamos los cursos cargados dinámicamente
            save="key"
            label="Cursos"
            placeholder="Seleccionar curso(s) (opcional)"
            boxStyles={styles.dropdown}
            dropdownTextStyles={styles.dropdownText}
            notFoundText="No hay cursos disponibles"
          />
            <TouchableOpacity style={styles.boton} onPress={agregarAviso}>
              <Text style={styles.botonTexto}>Agregar Aviso</Text>
            </TouchableOpacity>
          </View>
          {/* Lista de avisos */}
          <View style={styles.listaAvisosContainer}>
            <Text style={styles.tituloAvisos}>Lista de Avisos</Text>
            <ScrollView style={styles.scrollAvisos}>
            {avisos.length === 0 ? (
              <Text style={styles.textoSinAvisos}>No hay avisos disponibles</Text>
            ) : (
              avisos.map((avisos) => (
                <View key={avisos.id} style={styles.tarjeta}>
                  <Text style={styles.textoAviso}>{avisos.informacion}</Text>
                  <Text style={styles.textoMotivo}>Motivo: {avisos.detalle}</Text>
                  {avisos.profesor && <Text style={styles.textoMotivo}>{avisos.profesor}</Text>}
                  {avisos.cursos && <Text style={styles.textoMotivo}>{avisos.cursos}</Text>}
                  <Text style={styles.textoDH}>{avisos.fecha}</Text>
                </View>
              ))
            )}
          </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  padre: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    position: 'relative',
  },
  container: { // AGREGA ESTE ESTILO
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  formulario: {
    width: '95%',
    maxWidth: 600,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    marginTop: 10, // <--- REDUCE ESTE VALOR
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 6,
    alignSelf: 'center',
  },
  input: {
    marginTop: 10,
    backgroundColor: '#f9f9f9',
    borderColor: '#b6c6e0',
    borderWidth: 1.5,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    color: '#2a3d6c',
  },
  boton: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
    shadowColor: '#CED9EF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
  },
  botonTexto: {
    color: '#2a3d6c',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  dropdown: {
    backgroundColor: '#f9f9f9',
    borderColor: '#b6c6e0',
    borderWidth: 1.5,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: '#2a3d6c',
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1.5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 2,
  },
  scrollAvisos: {
    width: '95%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  listaAvisosContainer: {
    width: '95%',
    maxWidth: 600,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  tituloAvisos: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2a3d6c',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  textoSinAvisos: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
  },
  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 18,
    borderColor: '#e1e8ed',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  textoAviso: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2a3d6c',
  },
  textoMotivo: {
    fontSize: 14,
    marginBottom: 2,
    color: '#374151',
  },
  textoDH: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 10,
    color: '#777',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2a3d6c',
  },
  textArea: {
    height: 100,
  },
  pickerContainer: {
    backgroundColor: '#f9f9f9',
    borderColor: '#b6c6e0',
    borderWidth: 1.5,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  picker: {
    backgroundColor: '#f9f9f9',
    borderColor: '#b6c6e0',
    borderWidth: 1.5,
    borderRadius: 8,
    padding: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 20,
  },
  flexRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
});