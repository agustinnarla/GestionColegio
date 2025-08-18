import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import bg from '../../assets/bg1.jpg'; 
import { obtenerMateriasPorDni } from '../../scripts/alumno/scripMaterias'; // Importar la función

const Materia = ({ nombre, profesor, dia_semana, notas, promedio, trabajo_practico, aulico }) => {
  const [expandido, setExpandido] = useState(false);

  //🟢 Funcion para expandir
  const expandirMateria = () => {
    setExpandido(!expandido);
  };

  //🟢 Agrupar las notas en etapas
  const etapas = [
    { nombre: 'Etapa 1', notas: notas.slice(0, 3) }, // nota1, nota2, nota3
    { nombre: 'Etapa 2', notas: notas.slice(3, 6) }, // nota4, nota5, nota6
  ];

  //🟢 Vista 
  return (
    <View style={styles.cardMateria}>
      <TouchableOpacity onPress={expandirMateria} style={styles.materiaHeader} activeOpacity={0.8}>
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
  //🟢 Estado 
  const [materias, setMaterias] = useState([]); 
  const [curso, setCurso] = useState(''); 
  
  //🟢 Capturar Parametros 
  const { dni_usuario } = route.params; 


  //🟢 Cargar materias 
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

  //🟢 Vista 
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
    color: '#2a3d6c', 
  }, 
  cardMateria: {
    width:'100%',
    alignSelf:'center',
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
    color: '#2a3d6c',
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
     color: '#2a3d6c',
    marginBottom: 5,
    fontWeight: '500'
  },
  negrita: {
    fontWeight: 'bold',
     color: '#2a3d6c',
  },
  chipsDiasContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginVertical: 6,
  },
  chipDia: {
    backgroundColor: '#eef7ffff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginHorizontal: 4,
    marginTop: 4,
  },
  chipDiaTexto: {
    color: '#2a3d6c',
    fontWeight: '500',
    fontSize: 14,
  },
  separador: {
    borderBottomWidth: 1,
    borderColor: '#eef7ffff',
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
    color: '#2a3d6c',
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
    backgroundColor: '#eef7ffff',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 4,
  },
  notaChipTexto: {
    color: '#1d3557',
    fontSize: 14,
    fontWeight: '500'
  },
  tpChip: {
    backgroundColor: '#eef7ffff',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 4,
  },
  tpChipTexto: {
    color: '#2a3d6c',
    fontSize: 14,
    fontWeight: '500'
  },
  aulicoChip: {
    
    backgroundColor: '#eef7ffff',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
    marginTop:4
  },
  aulicoChipTexto: {
     color: '#2a3d6c',
    fontSize: 14,
    fontWeight: '500'
  },
  promedioDestacado: {  
    width: '60%',
    backgroundColor: '#eef7ffff',
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 14,
    alignItems: 'center',
    alignSelf:'center',
    borderWidth: 1,
    borderColor: '#746BC8',
  },
  promedioTexto: {
    fontSize: 20,
    fontWeight: '500',
    color: '#2a3d6c',
    
  },
  textoAviso: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
    fontWeight: '500'
  },
});

export default Materias;