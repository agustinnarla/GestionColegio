import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import bg from '../../assets/bg1.jpg'; 
import { obtenerMateriasPorDni } from '../../scripts/alumno/scripMaterias'; // Importar la función

const Materia = ({ nombre, profesor, dia_semana, notas, promedio, trabajo_practico, aulico }) => {
  const [expandido, setExpandido] = useState(false);

  const toggleExpandir = () => {
    setExpandido(!expandido);
  };

  // Agrupar las notas en etapas
  const etapas = [
    { nombre: 'Etapa 1', notas: notas.slice(0, 3) }, // nota1, nota2, nota3
    { nombre: 'Etapa 2', notas: notas.slice(3, 6) }, // nota4, nota5, nota6
  ];

  return (
    <View style={styles.contenidoMaterias}>
      <TouchableOpacity onPress={toggleExpandir} style={styles.materiaHeader}>
        <Text style={styles.materiaNombre}>{nombre}</Text>
        <Text style={styles.expandirIcon}>{expandido ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {expandido && (
        <View style={styles.contenidoDetalles}>
          <Text style={styles.texto}>
            <Text style={styles.negrita}>Profesor:</Text> {profesor}
          </Text>
          <Text style={styles.texto}>
            <Text style={styles.negrita}>Días:</Text> {dia_semana}
          </Text>
          <View style={styles.contenidoNotas}>
            <Text style={styles.texto}>
              <Text style={styles.negrita}>Notas:</Text>
            </Text>
            {etapas.map((etapa, index) => (
              <View key={index} style={styles.nota}>
                <Text style={styles.etapaTitulo}>{etapa.nombre}:</Text>
                {etapa.notas.map((nota, i) => (
                  <Text key={i} style={styles.notaTexto}>
                    Nota {i + 1}: {nota}
                  </Text>
                ))}
              </View>
            ))}
            <View>
              <Text style={styles.etapaTitulo}>Trabajos Prácticos:</Text>
                {trabajo_practico.map((tp, i) => (
                  <Text key={i} style={styles.notaTexto}>
                    TP {i + 1}: {tp}
                  </Text>
                ))}
            </View>
            <View style={styles.nota}>
              <Text style={styles.etapaTitulo}>Aúlico:</Text>
              <Text style={styles.notaTexto}>{aulico}</Text>
            </View>
            <View style={styles.notaPromedio}>
              <Text style={styles.promedioTexto}>Promedio: {promedio}</Text>
            </View>
          </View>
      </View> 
      )}
    </View>
  );
};

const Materias = ({ route }) => {
  const [materias, setMaterias] = useState([]); 
  const [curso, setCurso] = useState(''); // Estado para almacenar el curso
  const { dni_usuario } = route.params; 

  useEffect(() => {
    const cargarMaterias = async () => {
      try {
        console.log("DNI recibido en el componente Materias:", dni_usuario); 
        
        const data = await obtenerMateriasPorDni(dni_usuario);
        console.log('Datos recibidos en Materias:', data);

        setMaterias(data.materias || []); 
        if (data.materias.length > 0) {
          setCurso(data.materias[0].curso); 
        }
      } catch (error) {
        console.error("Error al obtener materias:", error);
        Alert.alert('Error', 'No se pudieron cargar las materias.');
      }
    };

    if (dni_usuario) {
      cargarMaterias();
    }
  }, [dni_usuario]);

  return (
    <View style={styles.container}>
      <Image source={bg} style={styles.bg} />
      <View style={styles.overlay}>
        <Text style={styles.titulo}>{curso}</Text> {/* Muestra el curso dinámicamente */}
        <ScrollView>
          {materias.length > 0 ? (
            materias.map((materia, index) => (
              <Materia
                key={index}
                nombre={materia.materia}
                profesor={materia.profesor}
                dia_semana={materia.dias_semana || []}
                notas={[
                  materia.nota1,
                  materia.nota2,
                  materia.nota3,
                  materia.nota4,
                  materia.nota5,
                  materia.nota6
                ]}
                trabajo_practico={[
                  materia.tp1,
                  materia.tp2,
                  materia.tp3
                ]}
                aulico={materia.aulico}
                promedio={materia.promedio}
              />
            ))
          ) : (
            <Text style={styles.textoAviso}>No hay materias disponibles.</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  overlay: {
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333', 
  }, 
  etapaTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d6a4f',
    marginTop: 10,
  },
  notaTexto: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
  
  contenidoMaterias: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3, 
  },
  materiaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  materiaNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d6a4f',
  },
  expandirIcon: {
    fontSize: 18,
    color: '#999',
  },
  contenidoDetalles: {
    marginTop: 10,
  },
  texto: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  negrita: {
    fontWeight: 'bold',
    color: '#2d6a4f',
  },
  contenidoDias: {
    flexDirection: 'row',
    marginTop: 5,
  },
  dia: {
    marginRight: 10,
    fontSize: 16,
    backgroundColor: '#f0f4f8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  contenidoNotas: {
    marginTop: 10,
  },
  nota: {
    marginBottom: 5,
  },
  notaPromedio: {
    marginTop: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  promedioTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1d3557',
  },
  textoAviso: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
});

export default Materias;