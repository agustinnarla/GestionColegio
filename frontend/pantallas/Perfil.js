import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import bg from '../assets/bg1.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage'; // React Native
import { obtenerUsuario, obtenerUsuarioAlumno, restablecerContrasena } from '../scripts/navegacion/scriptPerfil.js';
import CustomAlert from '../componente/CustomAlerts.js';

export default function Perfil({ route, navigation }) {
  const [datos, setDatos] = useState(null);
  const [datosAlumno, setDatosAlumno] = useState(null)
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const mostrarMensaje = (titulo, mensaje) => {
    setAlertTitle(titulo);
    setAlertMessage(mensaje);
    setAlertVisible(true);
  };

  const { dni_usuario, id_rol } = route.params;
  

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        if( id_rol === 4){
          const alumnoDatos = await obtenerUsuarioAlumno(dni_usuario);
          console.log(alumnoDatos)
          setDatosAlumno(alumnoDatos)
        }else{
          const usuarioDatos = await obtenerUsuario(dni_usuario);
          console.log(usuarioDatos)
          setDatos(usuarioDatos);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos del usuario');
      }
    };
    
    cargarDatos();
  }, [dni_usuario, id_rol]);

  const handleRestablecerContrasena = async () => {
    if (nuevaContrasena !== confirmarContrasena) {
      mostrarMensaje("¡Advertencia!", 'No coinciden las contraseñas');
      return;
    }

    try {
      const respuesta = await restablecerContrasena(dni_usuario, nuevaContrasena);
      mostrarMensaje("¡Exito!", 'Contraseña restablecida exitosamente');
      setNuevaContrasena('');
      setConfirmarContrasena('');
      setModalVisible(false);
    } catch (error) {
      mostrarMensaje("¡Error!", 'Error al restablecer contraseña');
    }
  };
  

  const cerrarSesion = async () => {
    try {
      await AsyncStorage.removeItem('token'); 
      navigation.navigate('Login'); 
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar la sesión');
    }
  };



  return (
    <View style={styles.padre}>
      <Image source={bg} style={styles.bg} />
      <View style={styles.contenido}>
        <Text style={styles.titulo}>Datos Personales</Text>
        <View style={styles.infoContainer}>
          { id_rol !== 4 && datos && (
            <>
              <Text style={styles.label}>DNI:</Text>
              <Text style={styles.info}>{datos.dni_usuario || 'No disponible'}</Text>

              <Text style={styles.label}>Email:</Text>
              <Text style={styles.info}>{datos.email || 'No disponible'}</Text>
            </>
          )}

          { id_rol === 4 && datosAlumno && (
            <>
              <Text style={styles.label}>DNI:</Text>
              <Text style={styles.info}>{datosAlumno.dni_usuario || 'No disponible'}</Text>

              <Text style={styles.label}>Email:</Text>
              <Text style={styles.info}>{datosAlumno.email || 'No disponible'}</Text>

              <Text style={styles.label}>Total Amonestaciones:</Text>
              <Text style={styles.info}>{datosAlumno.total_amonestaciones || 'No disponible' } </Text>

              <Text style={styles.label}>Total Inasistencias:</Text>
              <Text style={styles.info}>{datosAlumno.total_inasistencias}</Text>
            </>
          )}
          <TouchableOpacity style={styles.botonModificar} onPress={() => setModalVisible(true)}>
            <Text style={styles.textoContraseña}>Modificar Contraseña</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botonModificar} onPress={cerrarSesion}>
            <Text style={styles.textoSesion}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.titulo}>Nueva contraseña</Text>
              <TextInput
                style={styles.inputModal}
                placeholder="Ingrese la nueva contraseña"
                secureTextEntry
                value={nuevaContrasena}
                onChangeText={setNuevaContrasena}
              />
              <TextInput
                style={styles.inputModal}
                placeholder="Confirme la nueva contraseña"
                secureTextEntry
                value={confirmarContrasena}
                onChangeText={setConfirmarContrasena}
              />
              <View style={styles.botonesModal}>
                <TouchableOpacity
                  style={[styles.botonModal, (nuevaContrasena === '' || confirmarContrasena === '') && styles.botonDeshabilitado]}
                  onPress={handleRestablecerContrasena}
                  disabled={nuevaContrasena === '' || confirmarContrasena === ''}
                >
                  <Text style={styles.textoBotonModal}>Registrar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botonModalCancelar} onPress={() => setModalVisible(false)}>
                  <Text style={styles.textoBotonModal}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <CustomAlert
          isVisible={alertVisible}
          onClose={() => setAlertVisible(false)}
          title={alertTitle}
          message={alertMessage}
        />
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
    elevation: 5, 
    shadowColor: '#000',
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
  textoContraseña: {
    fontSize: 16,
    color: '#3498db',
    textAlign: 'center',
  },
  textoSesion: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
  },
  botonModificar: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '40%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  inputModal: {
    width: '50%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 20,
  },
  botonesModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
  },
  botonModal: {
    backgroundColor: '#CFEFCE',
    borderColor: '#33FF00',
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  botonDeshabilitado: {
        opacity: 0.5,
        backgroundColor: '#cccccc',
        borderColor: '#999999',
  },
  botonModalCancelar: {
    backgroundColor: '#F3B9B9',
    borderColor: '#FF0000',
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
  },
  textoBotonModal: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});