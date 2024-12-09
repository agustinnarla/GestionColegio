import React, { useEffect, useState } from 'react';
import { View, Text, Picker, TouchableOpacity, FlatList, StyleSheet, Alert,Image } from 'react-native';
import bg from '../../assets/bg1.jpg';

export default function PasarDeAño() {
  
  const[cursos,setCursos] = useState([])
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

  
  const PickerField = React.memo(({ label, selectedValue, onValueChange, items }) => {
    useEffect(() => {
        console.log("Items en PickerField: ", items);
    }, [items]);

    return (
        <>
            <Text style={styles.label}>{label}</Text>
            <Picker
                style={styles.input}
                selectedValue={selectedValue}
                onValueChange={onValueChange}
            >
                {items.length > 0 ? (
                    items.map((item) => (
                        <Picker.Item key={item.key || item.value} label={item.label} value={item.value} />
                    ))
                ) : (
                    <Picker.Item label="Cargando..." value="" />
                )}
            </Picker>
        </>
    );
  });
  
  return (
    <View style={styles.container}>
      <Image source={bg} style={styles.bg} resizeMode="cover" />


      <PickerField  
          label="Curso" 
          selectedValue={formData.idcurso} 
          onValueChange={(value) => handleChange('idcurso', value)} 
          items={[
              { label: 'Seleccione el curso', value: '' },
              ...cursos.map(curso => ({ label: curso.detalle, value: curso.idcurso, key: curso.idcurso })) 
          ]} 
      />

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
