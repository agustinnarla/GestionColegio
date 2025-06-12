import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, useWindowDimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import bg from '../assets/bg1.jpg'

//Ver la importacion de google calendar -- Probar como funciona 
export default function Calendario() {
  const [selectedDate, setSelectedDate] = useState('');
  const { width } = useWindowDimensions();

  // Responsive styles
  const isSmallScreen = width < 1300;

  // Función que se ejecuta cuando se selecciona un día
  const onDayPress = (dia) => {
    setSelectedDate(dia.dateString);
  };

  return (
    <View style={[styles.padre, isSmallScreen && styles.padreSmall]}>
      <Image source={bg} style={styles.bg} />
      <Text style={[styles.titulo, isSmallScreen && styles.tituloSmall]}>Calendario Académico</Text>
      <View style={[styles.calendarioContainer, isSmallScreen && styles.calendarioContainerSmall]}>
        <Calendar
          onDayPress={onDayPress}
          markedDates={{
            '2024-09-20': {
              selected: true,
              marked: true,
              selectedColor: '#FF6347', 
              dotColor: '#FF6347', 
              customStyles: {
                container: {
                  backgroundColor: '#FF6347',
                },
                text: {
                  color: 'white', 
                  fontWeight: 'bold',
                },
              },
            },
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
      <Text style={[styles.eventoTexto, isSmallScreen && styles.eventoTextoSmall]}>Viernes 20 de septiembre: Evaluación de Lengua</Text>
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
  fechaSeleccionada: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#2A3D6C',
  },
  eventoTexto: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6347',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  eventoTextoSmall: {
    fontSize: 12,
    marginTop: 5,
    marginHorizontal: 2,
  },
});
