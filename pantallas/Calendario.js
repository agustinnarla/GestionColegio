import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, useWindowDimensions, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import bg from '../assets/bg1.jpg'
import { obtenerEvaluaciones, obtenerEvaluacionesProfesor } from '../scripts/alumno/scriptCalendario';
import CustomAlert from '../componente/CustomAlerts.js';

//Ver la importacion de google calendar -- Probar como funciona 
export default function Calendario({route}) {

  const [selectedDate, setSelectedDate] = useState('');
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [eventosDia, setEventosDia] = useState([]);
  const { width } = useWindowDimensions();

  // Mensajes 
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  
  const mostrarMensaje = (titulo, mensaje) => {
    setAlertTitle(titulo);
    setAlertMessage(mensaje);
    setAlertVisible(true);
  };

  

  // Responsive styles
  const isSmallScreen = width < 1300;
  const { dni_usuario } = route.params;
  const { id_rol } = route.params;


  useEffect(() => {
  const cargarEvaluaciones = async () => {
    try {
      if (id_rol === 4) {
        const dni_alumno = dni_usuario;
        console.log('DNI del alumno:', dni_alumno);
        const data = await obtenerEvaluaciones(dni_alumno);
        if (data?.evaluaciones) {
          setEvaluaciones(data.evaluaciones);
          const fechasMarcadas = {};
          data.evaluaciones.forEach(e => {
            const [d, m, a] = e.fecha.split('-');
            const fecha = `${a}-${m}-${d}`;
            fechasMarcadas[fecha] = {
              marked: true,
              dotColor: '#FF6347',
              selectedColor: '#FF6347',
            };
          });
          setMarkedDates(fechasMarcadas);
        }
      } else if (id_rol === 2) {
        const dni_profesional = dni_usuario;
        console.log('DNI del profesional:', dni_profesional);
        const data = await obtenerEvaluacionesProfesor(dni_profesional);
        if (data?.evaluaciones) {
          setEvaluaciones(data.evaluaciones);
          const fechasMarcadas = {};
          data.evaluaciones.forEach(e => {
            const [d, m, a] = e.fecha.split('-');
            const fecha = `${a}-${m}-${d}`;
            fechasMarcadas[fecha] = {
              marked: true,
              dotColor: '#FF6347',
              selectedColor: '#FF6347',
            };
          });
          setMarkedDates(fechasMarcadas);
        }
      } else {
        console.log('Rol no reconocido:', id_rol);
      }
    } catch (error) {
      console.error('Error al cargar evaluaciones:', error);
    }
  };

  cargarEvaluaciones();
}, [dni_usuario]);

  
  // Función que se ejecuta cuando se selecciona un día
  const onDayPress = (dia) => {
    console.log('Día seleccionado:', dia);
    setSelectedDate(dia.dateString);
    
    // Filtrar evaluaciones para el día seleccionado
    const eventosDelDia = evaluaciones.filter(evaluacion => {
      // Convertir formato de fecha de DD-MM-YYYY a YYYY-MM-DD directamente
      const [diaEvaluacion, mesEvaluacion, anioEvaluacion] = evaluacion.fecha.split('-');
      const fechaFormateadaEvaluacion = `${anioEvaluacion}-${mesEvaluacion}-${diaEvaluacion}`;
      return fechaFormateadaEvaluacion === dia.dateString;
    });
    console.log('Eventos del día:', eventosDelDia);
    setEventosDia(eventosDelDia);
  };

  return (
    <View style={[styles.padre, isSmallScreen && styles.padreSmall]}>
      <Image source={bg} style={styles.bg} />
      <Text style={[styles.titulo, isSmallScreen && styles.tituloSmall]}>Calendario Académico</Text>
      <View style={[styles.calendarioContainer, isSmallScreen && styles.calendarioContainerSmall]}>
        <Calendar
          onDayPress={onDayPress}
          markedDates={{
            ...markedDates,
            [selectedDate]: {
              selected: true,
              marked: true,
              selectedColor: '#DADADA',
            },
          }}
          theme={{
            todayTextColor: '#2A3D6C',
            arrowColor: '#2A3D6C',
            textDayFontSize: isSmallScreen ? 12 : 14,
            textMonthFontSize: isSmallScreen ? 14 : 16,
            textDayHeaderFontSize: isSmallScreen ? 10 : 12,
          }}
          style={[styles.calendario, isSmallScreen && styles.calendarioSmall]}
        />
      </View>

      {selectedDate && (
        <View style={[styles.eventosContainer, isSmallScreen && styles.eventosContainerSmall]}>
          <Text style={styles.fechaSeleccionada}>
            {(() => {
             const [year, month, day] = selectedDate.split('-');
             return new Intl.DateTimeFormat('es-ES', {
               weekday: 'long',
               year: 'numeric',
               month: 'long',
               day: 'numeric',
               timeZone: 'UTC'
             }).format(new Date(`${year}-${month}-${day}T00:00:00Z`));
            })()}
          </Text>
          
          {eventosDia.length > 0 ? (
            <ScrollView style={styles.eventosLista}>
              {eventosDia.map((evento, index) => (
              <View key={index} style={styles.eventoItem}>
                <Text style={styles.eventoMateria}>{evento.detalle}</Text>
                <Text style={styles.eventoMateria}>{evento.materia_detalle}</Text>
                <Text style={styles.eventoDetalle}>Tema abarcados: {evento.tema_abarcado}</Text>
                <Text style={styles.eventoDetalle}>{id_rol === 2 ? evento.curso_detalle : ""}</Text>
              </View>
            ))}
            </ScrollView>
          ) : (
            <Text style={styles.sinEventos}>No hay evaluaciones programadas para este día</Text>
          )}
        </View>
      )}

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
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  padreSmall: {
    paddingTop: 10,
    justifyContent: 'flex-start',
  },
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    zIndex: -1,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#2A3D6C',
    textAlign: 'center',
    marginTop: 30,
  },
  tituloSmall: {
    fontSize: 15,
    marginTop: 10,
    marginBottom: 6,
  },
  calendarioContainer: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 10,
    minWidth: 260,
    maxWidth: 340,
    alignSelf: 'center',
  },
  calendarioContainerSmall: {
    minWidth: 180,
    maxWidth: 240,
    padding: 4,
    borderRadius: 10,
  },
  calendario: {
    borderRadius: 12,
    overflow: 'hidden',
    minWidth: 240,
    maxWidth: 320,
    alignSelf: 'center',
  },
  calendarioSmall: {
    minWidth: 150,
    maxWidth: 210,
    borderRadius: 8,
  },
  eventosContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventosContainerSmall: {
    width: '95%',
    padding: 12,
  },
  eventosLista: {
    maxHeight: 200,
  },
  eventoItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6347',
  },
  eventoMateria: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A3D6C',
    marginBottom: 4,
  },
  eventoDetalle: {
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 4,
  },
  eventoHora: {
    fontSize: 12,
    color: '#718096',
    fontStyle: 'italic',
  },
  sinEventos: {
    textAlign: 'center',
    color: '#718096',
    fontStyle: 'italic',
    marginTop: 10,
  },
  fechaSeleccionada: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A3D6C',
    marginBottom: 12,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
});
