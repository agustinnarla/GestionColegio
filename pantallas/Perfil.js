import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import bg from '../assets/bg1.jpg';


export default function Perfil() {
  return (
    <View style={styles.padre}>
      <Image source={bg} style={styles.bg} />
      <View style={styles.contenido}>
        <Text style={styles.nombre}>Agustín Arla</Text>
        <Text style={styles.titulo}>Datos Personales</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.info}>arlaagustin1@gmail.com</Text>
          <Text style={styles.label}>DNI:</Text>
          <Text style={styles.info}>45086990</Text>
          <Text style={styles.label}>Teléfono:</Text>
          <Text style={styles.info}>3518006018</Text>
        </View>
       
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  padre: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    zIndex: -1,
  },
  contenido: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  nombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 20,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  info: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
});
