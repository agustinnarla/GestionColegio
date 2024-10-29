import React, { useState } from 'react';
import { StyleSheet, View, Image, TextInput, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import bg from '../../assets/bg1.jpg';

export default function Avisos() {
  const [informacion, setInformacion] = useState('');
  const [motivo, setMotivo] = useState('');
  const [profesor, setProfesor] = useState('');
  const [cursosAfectados, setCursosAfectados] = useState('');
  const [fecha, setFecha] = useState('');
  const [avisos, setAvisos] = useState([
    {
      id: 1,
      informacion: 'Información: Mañana no habrá clases',
      motivo: 'Motivo: Día del maestro',
      fecha: '08/09/2021 -- 11:21pm',
    },
    {
      id: 2,
      informacion: 'Información: Mañana no habrá clases de biología',
      motivo: 'Motivo: Licencia del docente',
      profesor: 'Profesor Afectado: Alguien',
      cursos: 'Cursos Afectados: 1b, 2b',
      fecha: '08/09/2021 -- 11:21pm',
    },
  ]);

  const agregarAviso = () => {
    if (informacion && motivo && fecha) {
      const nuevoAviso = {
        id: avisos.length + 1,
        informacion: `Información: ${informacion}`,
        motivo: `Motivo: ${motivo}`,
        profesor: profesor ? `Profesor Afectado: ${profesor}` : null,
        cursos: cursosAfectados ? `Cursos Afectados: ${cursosAfectados}` : null,
        fecha,
      };
      setAvisos([...avisos, nuevoAviso]);
      Alert.alert('Aviso agregado', 'El aviso ha sido agregado correctamente.');
      limpiarFormulario();
    } else {
      Alert.alert('Error', 'Debe completar todos los campos obligatorios.');
    }
  };

  const limpiarFormulario = () => {
    setInformacion('');
    setMotivo('');
    setProfesor('');
    setCursosAfectados('');
    setFecha('');
  };

  return (
    <View style={styles.padre}>
      <Image source={bg} style={styles.bg} />

      {/* Formulario para agregar aviso */}
      <View style={styles.formulario}>
        <TextInput
          style={styles.input}
          placeholder="Información"
          value={informacion}
          onChangeText={setInformacion}
        />
        <TextInput
          style={styles.input}
          placeholder="Motivo"
          value={motivo}
          onChangeText={setMotivo}
        />
        <TextInput
          style={styles.input}
          placeholder="Período de Tiempo"
          value={motivo}
          onChangeText={setMotivo}
        />
        
        <MultipleSelectList
          setSelected={setProfesor} 
          data={['Profesor A', 'Profesor B', 'Profesor C']}
          save="value"
          label="Profesor"
          placeholder="Seleccionar profesor (opcional)"
          boxStyles={styles.dropdown}
          dropdownTextStyles={styles.dropdownText}
        />

        <MultipleSelectList
          setSelected={setCursosAfectados} 
          data={['1A', '1B', '2A']} 
          save="value"
          label="Curso"
          placeholder="Seleccionar curso (opcional)"
          boxStyles={styles.dropdown}
          dropdownTextStyles={styles.dropdownText}
        />

        <TextInput
          style={styles.input}
          placeholder="--/--/----"
          value={fecha}
          onChangeText={setFecha}
        />
        <TouchableOpacity style={styles.boton} onPress={agregarAviso}>
          <Text style={styles.botonTexto}>Agregar Aviso</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  padre: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.1,
  },
  formulario: {
    width: '90%',
    marginBottom: 20,
  },
  input: {
    marginTop:10,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  boton: {
    backgroundColor: '#CFEFCE',
    borderColor: '#33FF00',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  botonTexto: {
    color: 'black',
    fontWeight: 'bold',
  },
  scrollAvisos: {
    width: '90%',
  },
  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  textoAviso: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textoMotivo: {
    fontSize: 14,
    marginBottom: 2,
  },
  textoDH: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 10,
    color: '#777',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
});
