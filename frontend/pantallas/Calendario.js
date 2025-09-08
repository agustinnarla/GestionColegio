import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, useWindowDimensions, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import bg from '../assets/bg1.jpg'
import { obtenerEvaluaciones, obtenerEvaluacionesProfesor } from '../scripts/navegacion/scriptCalendario.js';
import CustomAlert from '../componente/CustomAlerts.js';


export default function Calendario({route}) {

//🟢 Estados y Formulario
const [selectedDate, setSelectedDate] = useState('');
const [evaluaciones, setEvaluaciones] = useState([]);
const [markedDates, setMarkedDates] = useState({});
const [eventosDia, setEventosDia] = useState([]);
const { width } = useWindowDimensions();

//🟢 Mensajes
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

//🟢 Captura de Parametros 
const { dni_usuario, id_rol } = route.params;

//🟢 Obtener Evaluaciones 
useEffect(() => {
  const cargarEvaluaciones = async () => {
    try {
      let data;

      if (id_rol === 4) {
        // Alumno
        data = await obtenerEvaluaciones(dni_usuario);
      } else if (id_rol === 2) {
        // Profesor
        data = await obtenerEvaluacionesProfesor(dni_usuario);
      } else {
        console.log('Rol no reconocido:', id_rol);
        return;
      }

      if (data?.evaluaciones) {
        setEvaluaciones(data.evaluaciones);

        // Construir fechas marcadas
        const fechasMarcadas = {};
        data.evaluaciones.forEach(e => {
          const fecha = e.fecha.replace(/\//g, "-"); // YYYY/MM/DD -> YYYY-MM-DD

          let colores = {};
          switch (e.id_tipo_de_evaluacion) {
            case 1:
              colores = { dotColor: '#FF6347', selectedColor: '#FF6347' };
              break;
            case 2:
              colores = { dotColor: '#5947ff', selectedColor: '#4753ff' };
              break;
            case 3:
              colores = { dotColor: '#ff47d1', selectedColor: '#f947ff' };
              break;
            case 4:
              colores = { dotColor: '#63cfdd', selectedColor: '#47d4ff' };
              break;
          }

          fechasMarcadas[fecha] = {
            ...(fechasMarcadas[fecha] || {}), // conservar si ya había otra marca
            marked: true,
            ...colores
          };
        });

        setMarkedDates(fechasMarcadas);
      }
    } catch (error) {
      console.error('Error al cargar evaluaciones:', error);
    }
  };

  cargarEvaluaciones();
}, [dni_usuario, id_rol]);

//🟢 Cuando se selecciona un día
const seleccionarDia = (dia) => {
  console.log('Día seleccionado:', dia);
  setSelectedDate(dia.dateString);

 
  const eventosDelDia = evaluaciones.filter(e => {
    const fecha = e.fecha.replace(/\//g, "-");
    return fecha === dia.dateString;
  });

  console.log('Eventos del día:', eventosDelDia);
  setEventosDia(eventosDelDia);
};

//🟢 Vistas 
return (
  <View style={[styles.padre, isSmallScreen && styles.padreSmall]}>
    <Image source={bg} style={styles.bg} />
    <View style={[styles.calendarioContainer, isSmallScreen && styles.calendarioContainerSmall]}>
      <Calendar
        onDayPress={seleccionarDia}
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
    marginTop: -4,
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 15,
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
