import React, { useState } from 'react';
import { View, Text, Picker, TouchableOpacity, FlatList, StyleSheet, Alert,Image } from 'react-native';
import bg from '../../assets/bg1.jpg';

export default function PromocionAlumnos() {
  const [cursoSeleccionado, setCursoSeleccionado] = useState('');
  const [alumnos, setAlumnos] = useState([]);
  
  // Cursos simulados
  const cursos = ['1º Año', '2º Año', '3º Año', '4º Año', '5º Año', '6º Año'];

  // Datos simulados de alumnos
  const todosLosAlumnos = [
    { id: '1', nombre: 'Juan Pérez', curso: '1º Año', finalesPendientes: 1 },
    { id: '1', nombre: 'Roberto Pérez', curso: '1º Año', finalesPendientes: 0 },
    { id: '1', nombre: 'Agustin Pérez', curso: '1º Año', finalesPendientes: 0 },
    { id: '1', nombre: 'Carlos Pérez', curso: '1º Año', finalesPendientes: 0 },
    { id: '1', nombre: 'Carla Pérez', curso: '1º Año', finalesPendientes: 0 },
    { id: '1', nombre: 'Roberta Pérez', curso: '1º Año', finalesPendientes: 1 },
    { id: '2', nombre: 'María Gómez', curso: '6º Año', finalesPendientes: 2 },
    { id: '3', nombre: 'Carlos Ruiz', curso: '5º Año', finalesPendientes: 0 },
    { id: '4', nombre: 'Laura Diaz', curso: '6º Año', finalesPendientes: 1 },
  ];

  // Filtra los alumnos del curso seleccionado
  const filtrarAlumnos = (curso) => {
    const alumnosFiltrados = todosLosAlumnos.filter(alumno => 
      alumno.curso === curso && alumno.finalesPendientes <= 3 // Alumnos con 3 o menos finales
    );
    setAlumnos(alumnosFiltrados);
  };

  const handleCursoSeleccionado = (curso) => {
    setCursoSeleccionado(curso);
    filtrarAlumnos(curso);
  };

  const pasarDeAño = () => {
    if (cursoSeleccionado === '6º Año') {
      Alert.alert('Promoción', 'Los alumnos de 6º año han sido marcados como "Recibidos".');
      const alumnosActualizados = alumnos.map(alumno => ({
        ...alumno,
        estado: 'Recibido'
      }));
      setAlumnos(alumnosActualizados);
    } else {
      Alert.alert('Promoción', 'Los alumnos han sido promovidos al siguiente año.');
      const alumnosPromovidos = alumnos.map(alumno => ({
        ...alumno,
        curso: (parseInt(alumno.curso) + 1) + 'º Año'
      }));
      setAlumnos(alumnosPromovidos);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={bg} style={styles.bg} resizeMode="cover" />

      {/* Dropdown de cursos */}
      <Picker
        selectedValue={cursoSeleccionado}
        style={styles.picker}
        onValueChange={(itemValue) => handleCursoSeleccionado(itemValue)}
      >
        <Picker.Item label="Selecciona un curso" value="" />
        {cursos.map((curso, index) => (
          <Picker.Item key={index} label={curso} value={curso} />
        ))}
      </Picker>

      {/* Lista de alumnos */}
      <FlatList
        data={alumnos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.alumno}>
            <Text>{item.nombre} - Finales pendientes: {item.finalesPendientes}</Text>
          </View>
        )}
      />

      {/* Botón "Pasar de Año" */}
      {cursoSeleccionado ? (
        <TouchableOpacity
          style={styles.boton}
          onPress={pasarDeAño}
        >
          <Text style={styles.textoBoton}>Pasar de Año</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1, 
  },
  bg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1, 
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  alumno: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  boton: {
    backgroundColor: '#CFEFCE',
    borderColor: '#33FF00',
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBoton: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
