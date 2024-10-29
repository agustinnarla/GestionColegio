import React, { useState } from 'react';
import { View, Text, TextInput, Picker, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';

const profesores = [
  { id: '1', nombre: 'Juan Pérez', registrado: false },
  { id: '2', nombre: 'María Gómez', registrado: true },
  { id: '3', nombre: 'Carlos Ruiz', registrado: false },
];

export default function RegistroAsistencia() {
  const [seleccionado, setSeleccionado] = useState(null);
  const [asistencia, setAsistencia] = useState({});
  const [busqueda, setBusqueda] = useState('');
  const [entrada, setEntrada] = useState(false);

  // Función para registrar entrada o salida
  const registrarAsistencia = () => {
    if (seleccionado && asistencia.hora) {
      Alert.alert('Asistencia registrada', `Asistencia de ${seleccionado.nombre} registrada correctamente.`);
      // Se actualiza el estado del profesor como registrado
      const nuevosProfesores = profesores.map(prof =>
        prof.id === seleccionado.id ? { ...prof, registrado: true } : prof
      );
      setSeleccionado(null); // Reiniciar selección
      setAsistencia({}); // Reiniciar formulario
    } else {
      Alert.alert('Error', 'Debe completar todos los campos para registrar la asistencia.');
    }
  };

  // Filtro de búsqueda
  const profesoresFiltrados = profesores.filter(prof =>
    prof.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <View style={styles.container}>
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

      {/* Búsqueda rápida de profesor */}
      <TextInput
        style={styles.input}
        placeholder="Buscar profesor/preceptor"
        value={busqueda}
        onChangeText={setBusqueda}
      />

      {/* Lista de profesores */}
      <FlatList
        data={profesoresFiltrados}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.profesor, item.registrado ? styles.profesorRegistrado : styles.profesorNoRegistrado]}
            onPress={() => setSeleccionado(item)}
          >
            <Text style={styles.profesorTexto}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Formulario de asistencia */}
      {seleccionado && (
        <View style={styles.formulario}>
          <Text>Registro de {entrada ? 'Entrada' : 'Salida'} para {seleccionado.nombre}</Text>

          <TextInput
            style={styles.input}
            placeholder="Hora de asistencia (ej: 08:30)"
            value={asistencia.hora}
            onChangeText={(text) => setAsistencia({ ...asistencia, hora: text })}
          />


          {/* Botón de registro */}
          <TouchableOpacity
            style={[styles.botonRegistrar, (asistencia.hora) ? styles.botonActivoRegistrar : styles.botonInactivo]}
            onPress={registrarAsistencia}
            disabled={!asistencia.hora}
          >
            <Text>Aceptar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  boton: {
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginLeft:10
  },
  botonRegistrar:{
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  botonActivoSalida:{
    backgroundColor: '#F3B9B9',
    borderColor: '#FF0000',
  },
  botonActivoRegistrar: {
    backgroundColor: '#CFEFCE',
    borderColor: '#33FF00',
  },
  botonActivoEntrada:{
    backgroundColor: '#CED9EF',
    borderColor: '#746BC8',
  },
  botonInactivo: {
    backgroundColor: '#ccc',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  profesor: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 5,
  },
  profesorRegistrado: {
    backgroundColor: '#d4edda',
  },
  profesorNoRegistrado: {
    backgroundColor: '#f8d7da',
  },
  profesorTexto: {
    fontSize: 16,
  },
  formulario: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
