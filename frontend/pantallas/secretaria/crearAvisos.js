import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TextInput, Text, ScrollView, TouchableOpacity, Alert, Button,ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import { obtenerMotivos, obtenerCurso, obtenerProfesores, obtenerEstadoGeneral} from '../../scripts/listasDesplegables/listaDesplegable.js'
import { obtenerAvisosCurso, obtenerAvisosGenerales } from '../../scripts/alumno/scriptAvisos.js';
import { obtenerAvisos, crearAvisos} from '../../scripts/secretaria/scriptCargarAvisos.js';
import bg from '../../assets/bg1.jpg';
import ListasDesplegables from '../../componente/ListasDesplegables.jsx';
import CustomAlert from '../../componente/CustomAlerts.js';
import ScrollContainer from '../../componente/ScrollContainer.jsx';

export default function Avisos() {
  const [informacion, setInformacion] = useState('');
  const [motivo, setMotivo] = useState('');
  const [motivosData, setMotivosData] = useState([]); // Para guardar la lista completa
  const [profesor, setProfesor] = useState([]); // Cambiado a array para múltiple selección
  const [cursosData, setCursosData] = useState([]); // Nuevo estado para cursos
  const [cursosAfectados, setCursosAfectados] = useState([]);
  const [fecha_aviso, setFecha] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fechaTexto, setFechaTexto] = useState('');
  const [fechaValida, setFechaValida] = useState(true);
  const [profesoresData, setProfesoresData] = useState([]); // Para almacenar los datos de profesores
  const [estado_general, setEstadoGeneral] = useState([]);
  const [selectKey, setSelectKey] = useState(1);

    // Mensajes 
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [enviando, setEnviado] = useState(false)
  
  
    const mostrarMensaje = (titulo, mensaje) => {
        setAlertTitle(titulo);
        setAlertMessage(mensaje);
        setAlertVisible(true);
    };

  
  const [formData, setFormData] = useState({
    id_estado_general: '',
    id_motivo: '',
  });

    // En tu componente:
    const [avisos, setAvisos] = useState([]);
    const [cargandoAvisos, setCargandoAvisos] = useState(false);
    const [errorAvisos, setErrorAvisos] = useState(null);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || fecha_aviso;
    setShowDatePicker(false);
    setFecha(currentDate);
    
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();
    setFechaTexto(`${year}/${month}/${day}`);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const validarFecha = (text) => {
    setFechaTexto(text);

    if (!text.trim()) {
      setFechaValida(true);
      return;
    }

    const regex = /^\d{4}\/\d{2}\/\d{2}$/;
    if (!regex.test(text)) {
      setFechaValida(false);
      return;
    }

    const [year, month, day] = text.split('/').map(Number);
    const diasPorMes = [31, (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month < 1 || month > 12 || day < 1 || day > diasPorMes[month - 1]) {
      setFechaValida(false);
      return;
    }

    setFechaValida(true);
  };
 
  const cargarEstadoGeneral = async () => {
        try {
            
            const estadoData = await obtenerEstadoGeneral();
            setEstadoGeneral(estadoData);
        } catch (error) {
          mostrarMensaje('Error', error.message);
        }
    };
  
  
  useEffect(() => {
    cargarProfesores();
    cargarCursos();
    cargarMotivos();
    cargarEstadoGeneral();
  }, []); 

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
      mostrarMensaje("Error", "No se pudieron cargar los cursos");
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
        // Convierte la fecha del input a AAAA/MM/DD
        
        let fechaISO = fechaTexto; // AAAA/MM/DD
        const [year, month, day] = fechaTexto.split('/').map(Number);
        const ahora = new Date();
        const hora = ahora.toISOString().slice(11, 19); // HH:MM:SS
        fechaISO = `${year}/${month.toString().padStart(2,'0')}/${day.toString().padStart(2,'0')}T${hora}Z`;
  
        setEnviado(true)
        mostrarMensaje('Enviando', 'Enviando aviso al email...');
        
        const datosParaBackend = {
          informacion,
          id_motivo: formData.id_motivo,
          fecha_aviso: fechaISO,
          id_estado_general: formData.id_estado_general,
          profesores: profesor,
          cursos: cursosAfectados
        };

        console.log('Datos a enviar al backend:', datosParaBackend);
        
        const respuesta = await crearAvisos(datosParaBackend);
        console.log('Respuesta del backend:', respuesta);

        // Transición suave entre mensajes
        setTimeout(() => {
            setAlertVisible(false);
            setTimeout(() => {
                mostrarMensaje('Éxito', 'Aviso creado correctamente');
                limpiarInterfaz();
                setEnviado(false);
            }, 300); // Pequeña pausa para la transición
        }, 500);
      } catch (error) {
        setEnviado(false)
        // Transición suave para el error también
        setTimeout(() => {
            setAlertVisible(false);
            setTimeout(() => {
                console.error('Error al crear aviso:', error);
                mostrarMensaje('Error', error.message || 'Error al crear el aviso');
            }, 300);
        }, 500);
        
      }
    } else {
      setEnviado(false)
      console.error('Completar');
      mostrarMensaje('Error', 'Complete todos los campos obligatorios');
    }
  };

  const validarCampos = () => {
    return(
      informacion && fechaTexto && formData.id_motivo && formData.id_estado_general
    )
  }

  const limpiarInterfaz = () => {
    console.log('Limpiando interfaz...');
    
    // Limpiar todos los estados del formulario
    setInformacion('');
    setFormData({
      id_estado_general: '',
      id_motivo: '',
    });
    setProfesor([]);
    setCursosAfectados([]);
    setFecha(new Date());
    setFechaTexto('');
    setFechaValida(true);
    
    // Forzar la recreación de los componentes MultipleSelectList
    setSelectKey(prev => prev + 1); 
    
    // Asegurar que los componentes se limpien completamente después de un breve delay
    setTimeout(() => {
      setProfesor([]);
      setCursosAfectados([]);
      console.log('Interfaz limpiada completamente');
    }, 50);
  };
  
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };


  return (
    <View style={styles.container}>
      <ScrollContainer/>
          <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
      
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
              style={[styles.input, !fechaValida && styles.inputError]}
              placeholder="AAAA/MM/DD"
              value={fechaTexto}
              onChangeText={validarFecha}
              keyboardType="numeric"
              maxLength={10}
            />
            {!fechaValida && fechaTexto && (
              <Text style={styles.errorText}>
                Formato inválido. Use AAAA/MM/DD (ej: 2024/12/25)
              </Text>
            )}
            
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
              key={`profesores-${selectKey}`} 
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
              key={`cursos-${selectKey}`} 
              setSelected={(val) => setCursosAfectados(val)}
              data={cursosData} 
              save="key"
              label="Cursos"
              placeholder="Seleccionar curso(s) (opcional)"
              boxStyles={styles.dropdown}
              dropdownTextStyles={styles.dropdownText}
              notFoundText="No hay cursos disponibles"
          />
        
          
            <View style={styles.botonesContainer}>
              <TouchableOpacity style={[styles.boton, styles.botonAgregar, !validarCampos() && styles.botonDeshabilitado]} onPress={agregarAviso} disabled={!validarCampos()}>
                <Text style={styles.botonTexto}>Agregar Aviso</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.boton, styles.botonLimpiar]} onPress={limpiarInterfaz}>
                <Text style={styles.botonTexto}>Limpiar</Text>
              </TouchableOpacity>
            </View>
          </View>
      </View>

      </ScrollView>
      </ImageBackground>
            <CustomAlert
            isVisible={alertVisible}
            onClose={() => setAlertVisible(false)}
            title={alertTitle}
            message={alertMessage}
            showSpinner={enviando}
     />   
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    alignItems: 'center',
  },
  bg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  formulario: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    color: '#2a3d6c',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderColor: '#b6c6e0',
    borderWidth: 1.3,
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    fontSize: 15,
    color: '#2a3d6c',
  },
  textArea: {
    height: 110,
    minHeight: 110,
  },
  inputError: {
    borderColor: '#e53935',
  },
  errorText: {
    color: '#e53935',
    fontSize: 12,
    marginBottom: 10,
  },
  dropdown: {
    backgroundColor: '#f9f9f9',
    borderColor: '#b6c6e0',
    borderWidth: 1.3,
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  dropdownText: {
    fontSize: 15,
    color: '#2a3d6c',
  },
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  boton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 2,
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  botonAgregar: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
  },
  botonLimpiar: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
  },
  botonDeshabilitado: {
    opacity: 0.6,
    backgroundColor: '#cccccc',
    borderColor: '#999999',
  },
  botonTexto: {
    color: '#2a3d6c',
    fontWeight: 'bold',
    fontSize: 15,
  },
});