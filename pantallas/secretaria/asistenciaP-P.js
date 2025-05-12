import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { obtenerProfesoresAsistencia, registrarEntradaProfesor, registrarSalidaProfesor } from '../../scripts/secretaria/scriptAsistenciaProfesor';

export default function RegistroAsistencia() {
  const [profesores, setProfesores] = useState([]); // Estado para almacenar los profesores
  const [busqueda, setBusqueda] = useState(''); // Estado para la búsqueda
  const [seleccionado, setSeleccionado] = useState(null); // Profesor seleccionado
  const [entrada, setEntrada] = useState(false); // Estado para entrada/salida

  const [formData, setFormData] = useState({
    dni_profesor: '',
    fecha: '',
    hora_entrada: '',
    hora_salida: '',
  });

  // Cargar los profesores al montar el componente
  useEffect(() => {
    const cargarProfesores = async () => {
      try {
        const data = await obtenerProfesoresAsistencia(); // Llama a la función para obtener los profesores
        setProfesores(data.profesor); // Actualiza el estado con los profesores obtenidos
      } catch (error) {
        console.log('Error al cargar los profesores:', error);
        Alert.alert('Error', 'No se pudieron cargar los profesores');
      }
    };
    cargarProfesores();
  }, []);

  // Actualizar `formData` al seleccionar un profesor
  const handleSeleccionarProfesor = (profesor) => {
    setSeleccionado(profesor);
    setFormData({
      ...formData,
      dni_profesor: profesor.dni_profesor, // Actualiza el DNI del profesor seleccionado
      fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
    });
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (name, value) => {
    console.log(`Actualizando ${name}:`, value); // Depuración
    setFormData({ ...formData, [name]: value });
};

 const handleRegistrar = async () => {
    try {
        const profesorData = {
            dni_profesor: parseInt(formData.dni_profesor),
            fecha: formData.fecha,
            hora_entrada: entrada ? formData.hora_entrada : null,
            hora_salida: !entrada ? formData.hora_salida : null,
        };

        console.log("Datos enviados al servidor:", profesorData);

        if (entrada) {
            const respuesta = await registrarEntradaProfesor(profesorData);
            console.log("Registro de entrada exitoso:", respuesta);
        } else {
            const respuesta = await registrarSalidaProfesor(profesorData);
            console.log("Registro de salida exitoso:", respuesta);
        }

        Alert.alert("Éxito", `Se registró la ${entrada ? "entrada" : "salida"} correctamente.`);

        // Reiniciar el formulario después del registro
        setFormData({
            dni_profesor: "",
            fecha: "",
            hora_entrada: "",
            hora_salida: "",
        });
        setSeleccionado(null);
    } catch (error) {
        console.error("Error al registrar la entrada/salida:", error.message);
        Alert.alert("Error", "No se pudo registrar la asistencia.");
    }
};

  // Filtrar los profesores según la búsqueda
  const profesoresFiltrados = profesores.filter((profesor) =>
    profesor.nombre_apellido.toLowerCase().includes(busqueda.toLowerCase())
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

      {/* Campo de búsqueda */}
      <TextInput
        style={styles.input}
        placeholder="Buscar profesor/preceptor"
        value={busqueda}
        onChangeText={setBusqueda}
      />

      {/* Lista de profesores */}
      <FlatList
        data={profesoresFiltrados} // Muestra los profesores filtrados
        keyExtractor={(item, index) => index.toString()} // Usa el índice como clave
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.profesor, item.registrado ? styles.profesorRegistrado : styles.profesorNoRegistrado]}
            onPress={() => handleSeleccionarProfesor(item)} // Selecciona el profesor al presionar
          >
            <Text style={styles.profesorTexto}>{item.nombre_apellido}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Formulario para registrar asistencia */}
      {seleccionado && (
        <View style={styles.formulario}>
          <Text>Registro de {entrada ? 'Entrada' : 'Salida'} para {seleccionado.nombre_apellido}</Text>

          <TextInput
              style={styles.input}
              placeholder={`Hora de ${entrada ? 'entrada' : 'salida'} (ej: 08:30)`}
              onChangeText={(text) => handleChange(entrada ? 'hora_entrada' : 'hora_salida', text)}
              value={entrada ? formData.hora_entrada : formData.hora_salida}
          />

          <TouchableOpacity
            style={styles.botonRegistrar}
            onPress={handleRegistrar}
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
    marginHorizontal: 10,
  },
  botonActivoEntrada: {
    backgroundColor: '#CED9EF',
    borderColor: '#746BC8',
  },
  botonActivoSalida: {
    backgroundColor: '#F3B9B9',
    borderColor: '#FF0000',
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
  botonRegistrar: {
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#CFEFCE',
    borderColor: '#33FF00',
  },
});