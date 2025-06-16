import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground,TextInput, FlatList, Platform, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-web';
import bg from '../../assets/bg1.jpg';
import { obtenerProfesores, obtenerCursosPorProfesor, obtenerMateriaPorCurso} from '../../scripts/listasDesplegables/listaDesplegable.js'
import {  obtenerHorasProfesor, asignacionDeHoras, obtenerHorariosProfesional, obtenerHorariosCurso } from '../../scripts/secretaria/scriptAsignacionHoras';
import ListasDesplegables from '../../componente/ListasDesplegables';
import CustomAlert from '../../componente/CustomAlerts.js';

// Obtén el ancho de la ventana
const { width } = Dimensions.get('window');
const isDesktop = width >= 768;
const isWeb = Platform.OS === 'web';

export default function AsignacionHoras() {

  
    useEffect(() => {
      if (isWeb) {
      document.body.style.overflow = 'auto'; // Activar scroll en web
    } else {
      document.body.style.overflow = 'hidden'; // Desactivarlo en otras plataformas
    }
    }, []);

    const [profesores, setProfesor] = useState([]);
    const [curso, setCurso] = useState([]);
    const [materias, setMateria] = useState([]);
    const [horas, setHoras] = useState([]);
    const [asignaciones, setAsignaciones] = useState([]);
    const [horariosAsignados, setHorariosAsignados] = useState({});
    const [vistaActual, setVistaActual] = useState('asignar'); // 'asignar', 'profesor', 'curso'
    const [horariosOcupados, setHorariosOcupados] = useState({});

    const diasSemana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
    const rangosHorarios = [
        '08:00 - 09:00',
        '09:00 - 10:00',
        '10:00 - 11:00',
        '11:00 - 12:00',
        '12:00 - 13:00',
        '13:00 - 14:00',
    ];

    const [formData, setFormData] = useState({
        id_materia: '',
        id_curso: '',
        dni_profesional: '',
        dia_semana: '',
        hora_inicio: '',
        hora_final: '',
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

    useEffect(() => {
        const inicializarHorarios = () => {
            const inicial = {};
            diasSemana.forEach((dia) => {
                inicial[dia] = [];
            });
            setHorariosAsignados(inicial);
        };
        inicializarHorarios();
    }, []);

    const limpiarInterfaz = () => {
        setProfesor([]);
        setCurso([]);
        setMateria([]);
        setHoras([]);
        setFormData({
            id_materia: '',
            id_curso: '',
            dni_profesional: '',
            dia_semana: '',
            hora_inicio: '',
            hora_final: '',
        });
        setHorariosAsignados([]);
    };

   const handleConsultar = async () => {
        try {
            if (formData.dni_profesional && formData.id_curso && formData.id_materia) {
                console.log('Enviando parámetros:', formData.dni_profesional, formData.id_curso, formData.id_materia);
                const data = await obtenerHorasProfesor(formData.dni_profesional, formData.id_curso, formData.id_materia);
                setHoras(data.horas);
                console.log('Horas traídas exitosamente:', data.horas);

                const nuevosHorarios = {};
                data.horas.forEach((hora) => {
                    const rango = hora.horario;
                    if (!nuevosHorarios[hora.dia_semana]) {
                        nuevosHorarios[hora.dia_semana] = [];
                    }
                    nuevosHorarios[hora.dia_semana].push(rango);
                });
                setHorariosAsignados(nuevosHorarios);
            } else {
                console.log('Debe seleccionar un profesor y un curso');
            }
        } catch (error) {
            console.error('Error en obtenerHorasProfesor:', error);
            mostrarMensaje('¡Error!', 'No hay horas asignadas al profesional');
        }
    };

    const alternarHorario = (dia, rango) => {
        setHorariosAsignados((prev) => {
            const horariosDia = prev[dia] || [];
            let nuevosHorariosDia;
            let nuevaAsignaciones = [...asignaciones];

            const [hora_inicio, hora_final] = rango.split(' - ');

            if (horariosDia.includes(rango)) {
                // Quitar rango
                nuevosHorariosDia = horariosDia.filter((h) => h !== rango);
                nuevaAsignaciones = nuevaAsignaciones.filter(
                    (a) => !(a.dia_semana === dia && a.hora_inicio === hora_inicio && a.hora_final === hora_final)
                );
            } else {
                // Agregar rango
                nuevosHorariosDia = [...horariosDia, rango];
                nuevaAsignaciones.push({
                    id_materia: formData.id_materia,
                    id_curso: formData.id_curso,
                    dni_profesional: formData.dni_profesional,
                    dia_semana: dia,
                    hora_inicio,
                    hora_final,
                });
            }

            setAsignaciones(nuevaAsignaciones);

            return {
                ...prev,
                [dia]: nuevosHorariosDia,
            };
        });
    };

    
            const handleAsignarHora = async () => {
            try {
                if (asignaciones.length === 0) {
                    console.log('No hay asignaciones para enviar');
                    return;
                }
                console.log('Datos de la asignación de horas', asignaciones);
                const respuesta = await asignacionDeHoras(asignaciones); 
                console.log('Respuesta del servidor:', respuesta);
                mostrarMensaje('¡Éxito!', 'Se registro el horario exitosamente');
                limpiarInterfaz()
            } catch (error) {
                console.error('Error al asignar la hora:', error);
                mostrarMensaje('¡Error!', 'Error al asignar el horario');
            }
        };
    

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const profesoresData = await obtenerProfesores();
                setProfesor(profesoresData);
                
                if (formData.dni_profesional) {
                    const data = await obtenerCursosPorProfesor(formData.dni_profesional);
                    setCurso(data);
                    console.log('Cursos traídos exitosamente');
                }else{
                    console.log('error')
                }
                if (formData.id_curso) {
                    const materiaData = await obtenerMateriaPorCurso(formData.id_curso);
                    setMateria(materiaData);
                    console.log('Materias traídas exitosamente');
                }else{
                    console.log('error')
                }
                
            } catch (error) {
                console.log('Error al cargar los profesores:', error);
            }
        };
        cargarDatos();
    }, [formData.dni_profesional, formData.id_curso]);


    const volverAAsignar = () => {
        setVistaActual('asignar');
        setHorariosOcupados({});
    };

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };



return (
  <View style={styles.padre}>
    <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
      
        <View style={isDesktop ? styles.scrollContainerDesktop : styles.scrollContainerMobile}>
          <View style={styles.filtrosScroll}>
            <View style={styles.filaFiltros}>
              <View style={styles.filtrosHorizontales}>
                <ListasDesplegables formData={formData} handleChange={handleChange} profesores={profesores} showLabel={true} styles={styles} label="Profesor" />
                <ListasDesplegables formData={formData} handleChange={handleChange} curso={curso} showLabel={true} styles={styles} label="Curso" />
                <ListasDesplegables formData={formData} handleChange={handleChange} materias={materias} showLabel={true} styles={styles} label="Materia" />
              </View>
            
            </View>
              <View style={styles.botonesFiltrosAbajo}>
                {vistaActual === 'asignar' ? (
                    <>
                        <TouchableOpacity onPress={handleConsultar} style={styles.botonPrimario}>
                            <Text style={styles.textoBoton}>Consultar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={limpiarInterfaz} style={styles.botonSecundario}>
                            <Text style={styles.textoBoton}>Reiniciar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleVerHorariosProfesor} style={styles.botonInfo}>
                            <Text style={styles.textoBoton}>Ver Horarios Profesor</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleVerHorariosCurso} style={styles.botonInfo}>
                            <Text style={styles.textoBoton}>Ver Horarios Curso</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity onPress={volverAAsignar} style={styles.botonSecundario}>
                        <Text style={styles.textoBoton}>Volver a Asignar</Text>
                    </TouchableOpacity>
                )}
              </View>
            {vistaActual !== 'asignar' && (
                <View style={styles.tituloVista}>
                    <Text style={styles.textoTituloVista}>
                        {vistaActual === 'profesor' ? 'Horarios Ocupados del Profesor' : 'Horarios Ocupados del Curso'}
                    </Text>
                </View>
            )}
            <View style={styles.horariosContainer}>
              {diasSemana.map((dia) => (
                <View key={dia} style={styles.diaContainer}>
                  <Text style={styles.diaTitulo}>{dia}</Text>
                  {rangosHorarios.map((rango) => {
                    const estaOcupado = vistaActual !== 'asignar' && horariosOcupados[dia]?.includes(rango);
                    console.log(`Día: ${dia}, Rango: ${rango}, Horarios ocupados para este día:`, horariosOcupados[dia]);
                    return (
                      <TouchableOpacity
                        key={`${dia}-${rango}`}
                        style={[
                          styles.horarioCuadro,
                          horariosAsignados[dia]?.includes(rango) && styles.horarioAsignado,
                          estaOcupado && styles.horarioOcupado
                        ]}
                        onPress={() => vistaActual === 'asignar' && alternarHorario(dia, rango)}
                      >
                        <Text style={[
                          styles.horarioTexto,
                          horariosAsignados[dia]?.includes(rango) && styles.horarioTextoActivo,
                          estaOcupado && styles.horarioTextoOcupado
                        ]}>
                          {rango}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
          {vistaActual === 'asignar' && (
            <TouchableOpacity onPress={handleAsignarHora} style={styles.botonConfirmar}>
              <Text style={styles.textoBotonGrande}>Asignar Horas</Text>
            </TouchableOpacity>
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

// ---
// Ajustes en los estilos
// ---
const styles = StyleSheet.create({
 
    padre: {
    flex: 1,
    width: '100%',
    height: '100%', 
    alignItems: 'center',
    backgroundColor: 'white',
  },
  bg: {
    width: '100%',
    height: '100%',
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
  botonesFiltrosAbajo:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  // Sección de filtros mejorada
  filaFiltros: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 20,
    marginVertical: 15,
    width: '95%',
    maxWidth: 1200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    gap: 20,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    overflow: 'visible',
  },

  filtrosHorizontales: {
    flex: 1,
  minWidth: 500,
  gap: 20,
  flexDirection: 'column'
  },

  botonesFiltros: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginTop: 10,
    marginBottom: 10,
  },

  // Botones con el estilo consistente
  botonPrimario: {
    backgroundColor: '#f0f7ff',
    borderColor: '#746BC8',
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 5,
    flex: 1,
    maxWidth: 250,
    height: 40,
    justifyContent: 'center',
  },

  botonSecundario: {
    backgroundColor: '#f5f5f5',
    borderColor: '#9e9e9e',
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 5,
    flex: 1,
    maxWidth: 250,
    height: 40,
    justifyContent: 'center',
  },

  botonConfirmar: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
    borderWidth: 1,
    paddingVertical: 16,      
    paddingHorizontal: 32,   
    borderRadius: 8,          
    maxWidth: 350,            
    minWidth: 220,            
    height: 40,              
    justifyContent: 'center',
    alignSelf: 'center',      
    marginTop: 12,            
    elevation: 4,
    shadowColor: '#CED9EF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },

  // Textos de botones
  textoBoton: {
    color: '#2c3e50',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },

  textoBotonGrande: {
    color: '#2c3e50',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Contenedor de horarios mejorado
  horariosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginTop: 10,
    paddingHorizontal: 15,
    width: '100%',
    maxWidth: 1400,
  },

  // Contenedor de cada día
  diaContainer: {
    minWidth: 160,
    maxWidth: 200,
    flexGrow: 1,
    margin: 3,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },

  // Título del día
  diaTitulo: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 15,
    color: '#1f2937',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
  },

  // Cuadros de horario
  horarioCuadro: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginVertical: 6,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    // transition: 'all 0.2s ease', // Esto es más CSS web directo, puede no aplicar 1:1 en RN.
  },

  // Horario seleccionado/asignado
  horarioAsignado: {
    backgroundColor: '#10b981',
    borderColor: '#059669',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  // Texto de horario
  horarioTexto: {
    color: '#4b5563',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },

  horarioTextoActivo: {
    color: 'white',
    fontWeight: '600',
  },

  // Estados adicionales para horarios
  horarioHover: {
    backgroundColor: '#e5e7eb',
    borderColor: '#9ca3af',
  },

  horarioDisponible: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },

  horarioOcupado: {
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5',
    opacity: 0.6,
  },

  // Labels para los filtros
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    letterSpacing: 0.3,
  },

  // Indicadores de estado
  estadoIndicador: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    gap: 20,
  },

  estadoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  estadoColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  estadoTexto: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },

  botonInfo: {
    backgroundColor: '#e0f2fe',
    borderColor: '#0ea5e9',
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 5,
    flex: 1,
    maxWidth: 250,
    height: 40,
    justifyContent: 'center',
  },

  horarioTextoOcupado: {
    color: '#dc2626',
    fontWeight: '600',
  },

  tituloVista: {
    backgroundColor: '#f3f4f6',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  textoTituloVista: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
});

  
// Constantes de colores para mantener consistencia
export const HORARIOS_COLORS = {
  primary: '#4f46e5',
  secondary: '#6366f1',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  disponible: '#10b981',
  ocupado: '#ef4444',
  seleccionado: '#059669',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  white: '#ffffff',
  background: '#f5f7fa',
};