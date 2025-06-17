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
    <View style={styles.cardMateria}>
      <TouchableOpacity onPress={toggleExpandir} style={styles.materiaHeader} activeOpacity={0.8}>
        <Text style={styles.materiaNombre}>{nombre}</Text>
        <Text style={styles.expandirIcon}>{expandido ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {expandido && (
        <View style={styles.contenidoDetalles}>
          <Text style={styles.texto}><Text style={styles.negrita}>Profesor:</Text> {profesor}</Text>
          <View style={styles.chipsDiasContainer}>
            <Text style={styles.negrita}>Días:</Text>
            {Array.isArray(dia_semana) ? dia_semana.map((dia, i) => (
              <View key={i} style={styles.chipDia}><Text style={styles.chipDiaTexto}>{dia}</Text></View>
            )) : <Text style={styles.chipDiaTexto}>{dia_semana}</Text>}
          </View>
          <View style={styles.separador} />
          <View style={styles.contenidoNotas}>
            <Text style={styles.texto}><Text style={styles.negrita}>Notas:</Text></Text>
            {etapas.map((etapa, index) => (
              <View key={index} style={styles.notaEtapaContainer}>
                <Text style={styles.etapaTitulo}>{etapa.nombre}:</Text>
                <View style={styles.notaFila}>
                  {etapa.notas.map((nota, i) => (
                    <View key={i} style={styles.notaChip}><Text style={styles.notaChipTexto}>Nota {i + 1}: {nota}</Text></View>
                  ))}
                </View>
              </View>
            ))}
            <View style={styles.separador} />
            <View>
              <Text style={styles.etapaTitulo}>Trabajos Prácticos:</Text>
              <View style={styles.notaFila}>
                {trabajo_practico.map((tp, i) => (
                  <View key={i} style={styles.tpChip}><Text style={styles.tpChipTexto}>TP {i + 1}: {tp}</Text></View>
                ))}
              </View>
            </View>
            <View style={styles.separador} />
            <View style={styles.notaFila}>
              <Text style={styles.etapaTitulo}>Aúlico:</Text>
              <View style={styles.aulicoChip}><Text style={styles.aulicoChipTexto}>{aulico}</Text></View>
            </View>
            <View style={styles.promedioDestacado}>
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
        <Text style={styles.titulo}>{curso}</Text> 
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
    width: '100%',
    height: '100%',
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
  cardMateria: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  materiaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  materiaNombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d6a4f',
  },
  expandirIcon: {
    fontSize: 20,
    color: '#999',
  },
  contenidoDetalles: {
    marginTop: 12,
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
  chipsDiasContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginVertical: 6,
  },
  chipDia: {
    backgroundColor: '#e9f5ef',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginHorizontal: 4,
    marginTop: 4,
  },
  chipDiaTexto: {
    color: '#2d6a4f',
    fontWeight: '600',
    fontSize: 14,
  },
  separador: {
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    marginVertical: 10,
  },
  contenidoNotas: {
    marginTop: 10,
  },
  notaEtapaContainer: {
    marginBottom: 8,
  },
  etapaTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#457b9d',
    marginTop: 10,
    marginBottom: 4,
  },
  notaFila: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 4,
  },
  notaChip: {
    backgroundColor: '#f1faee',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 4,
  },
  notaChipTexto: {
    color: '#1d3557',
    fontSize: 14,
  },
  tpChip: {
    backgroundColor: '#ffe5d9',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 4,
  },
  tpChipTexto: {
    color: '#e76f51',
    fontSize: 14,
  },
  aulicoChip: {
    backgroundColor: '#e0e7ff',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 6,
  },
  aulicoChipTexto: {
    color: '#3b5bdb',
    fontSize: 14,
  },
  promedioDestacado: {
    backgroundColor: '#d1fae5',
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#34d399',
  },
  promedioTexto: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
  },
  textoAviso: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
});

export default Materias;