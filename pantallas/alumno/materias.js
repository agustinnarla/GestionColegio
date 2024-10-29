import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import bg from '../../assets/bg1.jpg'; 

const Materia = ({ nombre, docente, dias, notas }) => {
  const [expandido, setExpandido] = useState(false);

  const toggleExpandir = () => {
    setExpandido(!expandido);
  };

  const calcularPromedio = (notas) => {
    const notasValidas = notas.slice(0, 2).concat(notas[2]).filter(nota => !isNaN(nota));
    if (notasValidas.length === 0) return '-'; 
    
    const sum = notasValidas.reduce((a, b) => a + b, 0);
    return (sum / notasValidas.length).toFixed(1); 
  };

  return (
    <View style={styles.contenidoMaterias}>
      <TouchableOpacity onPress={toggleExpandir} style={styles.materiaHeader}>
        <Text style={styles.materiaNombre}>{nombre}</Text>
        <Text style={styles.expandirIcon}>{expandido ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {expandido && (
        <View style={styles.contenidoDetalles}>
          <Text style={styles.texto}><Text style={styles.negrita}>Docente:</Text> {docente}</Text>
          <Text style={styles.texto}><Text style={styles.negrita}>Días:</Text></Text>
          <View style={styles.contenidoDias}>
            {dias.map((dia, index) => (
              <Text key={index} style={styles.dia}>{dia}</Text>
            ))}
          </View>

          <View style={styles.contenidoNotas}>
            <Text style={styles.texto}><Text style={styles.negrita}>Notas:</Text></Text>

            {notas.slice(0, 2).map((nota, index) => (
              <View key={index} style={styles.nota}>
                <Text>Etapa {index + 1}: {nota}</Text>
              </View>
            ))}

            <View style={styles.nota}>
              <Text>TP: {notas[2]}</Text>
            </View>
            <View style={styles.nota}>
              <Text>Áulico: {notas[2]}</Text>
            </View>

            <View style={styles.notaPromedio}>
              <Text style={styles.promedioTexto}>Promedio: {calcularPromedio(notas)}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const App = () => {
  const materias = [
    {
      nombre: 'Biología',
      docente: 'Alguien',
      dias: ['Lunes', 'Viernes'],
      notas: [8, 7, 9],  
    },
    {
      nombre: 'Matemáticas',
      docente: 'Profesor X',
      dias: ['Martes', 'Jueves'],
      notas: [6, 5, 7], 
    },
  ];

  return (
    <View style={styles.container}>
      <Image source={bg} style={styles.bg} />
      <View style={styles.overlay}>
        <Text style={styles.titulo}>6 Año b</Text>
        <ScrollView>
          {materias.map((materia, index) => (
            <Materia
              key={index}
              nombre={materia.nombre}
              docente={materia.docente}
              dias={materia.dias}
              notas={materia.notas}
            />
          ))}
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
});

export default App;
