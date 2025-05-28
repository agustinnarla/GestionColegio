import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import bg from '../../assets/bg1.jpg';
import { obtenerCurso } from '../../scripts/listasDesplegables/listaDesplegable';
import { CursoSelector } from '../../componente/ListasDesplegables';
import {  registrarCursoNuevo, obtenerAlumnoFinal } from '../../scripts/secretaria/scriptPasarCurso';

export default function PasarDeAño() {
  //Formulario
  const [formData, setFormData] = useState({
    dni_alumno: '',
    id_curso: ''
  });
  
  //Cargamos datos 
  const [alumnos, setAlumnos] = useState([]);
  const [curso, setCursos] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
        try {
            const cursosData = await obtenerCurso();
            setCursos(cursosData); 
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    cargarDatos();
    }, []);
    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    // Cargar alumnos cuando se selecciona un curso
    const cargarAlumnos = async () => {
      try {
        const alumnosData = await obtenerAlumnoFinal(formData.id_curso);
        if (alumnosData) {
          console.log('Alumnos cargados:', alumnosData);
          setAlumnos(alumnosData);
        }
      } catch (error) {
        console.error('Error al cargar alumnos:', error);
        Alert.alert('Error', 'No se pudieron cargar los alumnos');
        setAlumnos([]);
      } 
    };
  
    //Registramos curso nuevo 
    const handleRegistrar = async() => {
      try {
        const alumnosData = alumnos.map(alumno => ({
          dni_alumno: alumno.dnialumno,
          id_curso: parseInt(formData.id_curso) 
        }));

        console.log("Datos a enviar:", alumnosData);

        const respuesta = await registrarCursoNuevo(alumnosData);
        
        console.log("Alumnos Asignados al curso nuevo perfectamente",respuesta)
        setAlumnos([]);
        setFormData({
          dni_alumno: '',
          id_curso:'',
      });
      } catch(error) {
        console.error("Error completo:", error);
        Alert.alert('Error', 'Hubo un problema al actualizar los alumnos: ' + error.message);
      }
    }
  return (
    <View style={styles.container}>
      <Image source={bg} style={styles.bg} resizeMode="cover" />
      <CursoSelector 
          formData={formData}
          handleChange={handleChange}
          curso={curso}
          styles={styles}
      />
      <TouchableOpacity style={styles.botonConsultar} onPress={cargarAlumnos} >
                            <Text style={styles.textoBoton}>Consultar</Text>
                        </TouchableOpacity>
      <View style={styles.headerRow}>
            <Text style={styles.headerCell}>Alumnos</Text>
        </View>
        <View style={{ height: 650 }}>
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
            >
                {alumnos.map((item) => (
                    <View key={item.dni_alumno} style={styles.row}>
                        <Text style={styles.cellNombre}>{item.nombrecompleto}</Text>
                    </View>
                ))}
                <TouchableOpacity style={styles.botonConsultar} onPress={cargarAlumnos} >
                            <Text style={styles.textoBoton} onPress={handleRegistrar}>Confirmar</Text>
                </TouchableOpacity>
            </ScrollView>
                </View>
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
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginTop: 20,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollView: {
    width: '100%',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cellNombre: {
    flex: 1,
    textAlign: 'center',
  },
  botonConsultar: {
    backgroundColor: '#CFEFCE',
    borderColor: '#33FF00',
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
});
