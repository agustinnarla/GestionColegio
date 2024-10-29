import React, { useState } from 'react';
import { StyleSheet, View, Text,Image } from 'react-native';
import { Calendar } from 'react-native-calendars';
import bg from '../assets/bg1.jpg'


//Ver la importacion de google calendar -- Probar como funciona 
export default function Calendario() {
  const [selectedDate, setSelectedDate] = useState('');

  // Función que se ejecuta cuando se selecciona un día
  const onDayPress = (dia) => {
    setSelectedDate(dia.dateString);
  };

  return (
    <View style={styles.padre}>
        <Image source={bg} style={styles.bg} />
      <Text style={styles.titulo}>Calendario Academico</Text>
      <Calendar
        onDayPress={onDayPress}
        // Marcar fechas específicas con eventos
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
          todayTextColor: '#DADADA',
          arrowColor: '#DADADA',
        }}
      />
      <Text style={styles.eventoTexto}>Viernes 20 de septiembre: Evaluación de Lengua</Text>
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  fechaSeleccionada: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  eventoTexto: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6347',
  },
});
