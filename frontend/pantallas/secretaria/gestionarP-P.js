import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Picker, CheckBox, Alert, ImageBackground } from 'react-native';
import bg from '../../assets/bg1.jpg';
import { obtenerSexo, obtenerEstadoGeneral, obtenerLocalidad,obtenerRoles} from '../../scripts/listasDesplegables/listaDesplegable.js'
import ListasDesplegables from '../../componente/ListasDesplegables.jsx';
import { obtenerProfesional, registrarProfesional, deshabilitarProfesional, modificarProfesional } from '../../scripts/secretaria/scriptGestionPP.js';
import CustomAlert from '../../componente/CustomAlerts.js';
import ScrollContainer from '../../componente/ScrollContainer.jsx';


export default function GestionarProfesional() {
 const [viveEnDepto, setViveEnDepto] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const mostrarMensaje = (titulo, mensaje) => {
    setAlertTitle(titulo);
    setAlertMessage(mensaje);
    setAlertVisible(true);
  };

  const [rol, setRol] = useState([]);
  const [localidad, setLocalidad] = useState([]);
  const [sexo, setSexos] = useState([]);
  const [estado_general, setEstadoGeneral] = useState([]);

  const [formData, setFormData] = useState({
    dni_profesional: '',
    nombre: '',
    apellido: '',
    cuit: '',
    id_sexo: '',
    id_rol: '',
    email: '',
    fecha_nacimiento: '',
    telefono_personal: '',
    telefono_alternativo: '',
    id_estado_general: '',
    id_localidad: '',
    domicilio: '',
    edificio: false,
    piso: '',
    departamento: ''
  });

  // Función para calcular CUIT
  const calcularCuit = (dni, sexoId) => {
    let prefijo = sexoId === '1' || sexoId === 1 ? '20' : '27';
    let dniStr = dni.toString().padStart(8, '0');
    let cuitBase = prefijo + dniStr;

    const multiplicadores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let suma = 0;

    for (let i = 0; i < multiplicadores.length; i++) {
      suma += parseInt(cuitBase[i]) * multiplicadores[i];
    }

    let resto = suma % 11;
    let digitoVerificador = 11 - resto;

    if (digitoVerificador === 11) digitoVerificador = 0;
    else if (digitoVerificador === 10) {
      prefijo = prefijo === '20' ? '23' : '24';
      return calcularCuit(dni, sexoId); // Recalcular
    }

    return `${prefijo}-${dniStr}-${digitoVerificador}`;
  };

  const validarCampos = () => {
    return (
      formData.dni_profesional &&
      formData.nombre &&
      formData.apellido &&
      formData.cuit &&
      formData.id_sexo &&
      formData.id_rol &&
      formData.email &&
      formData.fecha_nacimiento &&
      formData.telefono_personal &&
      formData.telefono_alternativo &&
      formData.id_estado_general &&
      formData.id_localidad &&
      formData.domicilio &&
      formData.edificio != null &&
      formData.piso != null &&
      formData.departamento != null
    );
  };

  const validarDni = () => formData.dni_profesional;

  useEffect(() => {
    const cargarListaDesplegable = async () => {
      try {
        const localidadData = await obtenerLocalidad();
        const sexosData = await obtenerSexo();
        const estadoData = await obtenerEstadoGeneral();
        const rolData = await obtenerRoles();
        setRol(rolData);
        setSexos(sexosData);
        setLocalidad(localidadData);
        setEstadoGeneral(estadoData);
      } catch (error) {
        mostrarMensaje('Error', error.message);
        console.log(error);
      }
    };
    cargarListaDesplegable();
  }, []);

const validarFechaNacimiento = (fecha) => {
    const fechaIngresada = new Date(fecha);
    const fechaActual = new Date();

    if (isNaN(fechaIngresada.getTime())) {
        Alert.alert('Error', 'La fecha de nacimiento no es válida.');
        console.log('Fecha de nacimiento no válida:', fecha);
        return false;
    }

    if (fechaIngresada > fechaActual) {
        Alert.alert('Error', 'La fecha de nacimiento no puede ser mayor a la fecha actual.');
        console.log('Fecha futura:', fecha);
        return false;
    }

    // Calcular la edad
    const edad = fechaActual.getFullYear() - fechaIngresada.getFullYear();
    const mesActual = fechaActual.getMonth();
    const mesNacimiento = fechaIngresada.getMonth();

   
    if (
        mesActual < mesNacimiento ||
        (mesActual === mesNacimiento && fechaActual.getDate() < fechaIngresada.getDate())
    ) {
        edad--;
    }

    if (edad <= 21) {
        Alert.alert('Error', 'El profesional debe tener más de 21 años.');
        console.log('Edad menor o igual a 21:', edad);
        return false;
    }

    return true;
};
  const handleChange = (name, value) => {
    let updatedForm = { ...formData, [name]: value };

    // Calcular CUIT automáticamente si están presentes DNI y sexo
    if (
      (name === 'dni_profesional' || name === 'id_sexo') &&
      updatedForm.dni_profesional &&
      updatedForm.id_sexo
    ) {
      const cuitCalculado = calcularCuit(updatedForm.dni_profesional, updatedForm.id_sexo);
      updatedForm.cuit = cuitCalculado;
    }

    setFormData(updatedForm);
  };

  const handleRegistrar = async () => {
    try {
      const profesionalData = {
        ...formData,
        dni_profesional: parseInt(formData.dni_profesional),
        cuit: formData.cuit,
        telefono_personal: parseInt(formData.telefono_personal),
        telefono_alternativo: parseInt(formData.telefono_alternativo),
        piso: formData.edificio ? formData.piso : null,
        departamento: formData.edificio ? formData.departamento : null,
      };

      const respuesta = await registrarProfesional(profesionalData);
      if (respuesta) {
        mostrarMensaje('Éxito', 'Profesional registrado correctamente');
        limpiarInterfaz();
      }
    } catch (error) {
      mostrarMensaje('Error', 'Error al registrar el profesional');
    }
  };

  const handleConsultar = async () => {
    try {
      const profesional = await obtenerProfesional(formData.dni_profesional);
      if (profesional) {
        setFormData({ ...formData, ...profesional });
      } else {
        mostrarMensaje('Error', 'El profesional no existe, verifique el DNI');
      }
    } catch (error) {
      mostrarMensaje('Error', 'Error al consultar el profesional');
    }
  };

  const limpiarInterfaz = () => {
    setFormData({
      dni_profesional: '',
      nombre: '',
      apellido: '',
      cuit: '',
      id_sexo: '',
      id_rol: '',
      email: '',
      fecha_nacimiento: '',
      telefono_personal: '',
      telefono_alternativo: '',
      id_estado_general: '',
      id_localidad: '',
      domicilio: '',
      edificio: false,
      piso: '',
      departamento: ''
    });
  };

  const handleDeshabilitar = async () => {
    try {
      const respuesta = await deshabilitarProfesional(formData.dni_profesional);
      if (respuesta) {
        mostrarMensaje('Éxito', 'El profesional se deshabilitó correctamente');
        limpiarInterfaz();
      }
    } catch (error) {
      mostrarMensaje('Error', 'Error al deshabilitar el profesional');
    }
  };

  const handleModificar = async () => {
    try {
      const profesionalData = {
        ...formData,
        dni_profesional: parseInt(formData.dni_profesional),
        telefono_personal: parseInt(formData.telefono_personal),
        telefono_alternativo: parseInt(formData.telefono_alternativo),
        piso: formData.edificio ? formData.piso : null,
        departamento: formData.edificio ? formData.departamento : null,
      };

      const respuesta = await modificarProfesional(formData.dni_profesional, profesionalData);
      if (respuesta) {
        mostrarMensaje('Éxito', 'El profesional se modificó correctamente');
        limpiarInterfaz();
      }
    } catch (error) {
      mostrarMensaje('Error', 'Error al modificar el profesional');
    }
  };

  return (
    <View style={styles.padre}>
      <ScrollContainer />
      <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
        <View style={styles.formulario}>
          <View style={styles.dniContainer}>
            <Text style={styles.label}>DNI:</Text>
            <TextInput
              style={styles.inputDni}
              placeholder="DNI"
              value={formData.dni_profesional}
              onChangeText={(value) => handleChange('dni_profesional', value)}
            />
            <TouchableOpacity
              style={[styles.consultarButton, !validarDni() && styles.botonDeshabilitado]}
              onPress={handleConsultar}
              disabled={!validarDni()}
            >
              <Text style={styles.consultarText}>Consultar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.fila}>
            {/* Primera columna */}
            <View style={styles.columna}>
              <Text style={styles.label}>Nombre:</Text>
              <TextInput style={styles.input} placeholder="Nombre" value={formData.nombre} onChangeText={(value) => handleChange('nombre', value)} />
              <Text style={styles.label}>Apellido:</Text>
              <TextInput style={styles.input} placeholder="Apellido" value={formData.apellido} onChangeText={(value) => handleChange('apellido', value)} />

              <Text style={styles.label}>CUIT (autogenerado):</Text>
              <TextInput style={[styles.input, { backgroundColor: '#e0e0e0' }]} value={formData.cuit} editable={false} />

              <Text style={styles.label}>Correo:</Text>
              <TextInput style={styles.input} placeholder="Correo" value={formData.email} onChangeText={(value) => handleChange('email', value)} />

              <ListasDesplegables formData={formData} handleChange={handleChange} roles={rol} sexo={sexo} styles={styles} />
            </View>

            {/* Segunda columna */}
            <View style={styles.columna}>
              <ListasDesplegables formData={formData} handleChange={handleChange} estado_general={estado_general} localidad={localidad} styles={styles} showLabel={true} />
              <Text style={styles.label}>Fecha de Nacimiento:</Text>
              <TextInput style={styles.input} placeholder="DD/MM/AAAA" value={formData.fecha_nacimiento} onChangeText={(value) => handleChange('fecha_nacimiento', value)} />
              <Text style={styles.label}>Teléfono Personal:</Text>
              <TextInput style={styles.input} placeholder="Teléfono Personal" value={formData.telefono_personal} onChangeText={(value) => handleChange('telefono_personal', value)} />
              <Text style={styles.label}>Teléfono Alternativo:</Text>
              <TextInput style={styles.input} placeholder="Teléfono Alternativo" value={formData.telefono_alternativo} onChangeText={(value) => handleChange('telefono_alternativo', value)} />
            </View>

            {/* Tercera columna */}
            <View style={styles.columna}>
              <Text style={styles.label}>Domicilio:</Text>
              <TextInput style={styles.input} placeholder="Domicilio" value={formData.domicilio} onChangeText={(value) => handleChange('domicilio', value)} />
              <View style={styles.checkboxContainer}>
                <Text style={styles.label}>¿Vive en un departamento?</Text>
                <CheckBox value={formData.edificio} onValueChange={() => handleChange('edificio', !formData.edificio)} style={styles.check} />
              </View>

              {formData.edificio && (
                <View style={styles.filaPisoDepto}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.label}>Piso:</Text>
                    <TextInput style={styles.input} placeholder="Piso" value={formData.piso} onChangeText={(value) => handleChange('piso', value)} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.label}>Departamento:</Text>
                    <TextInput style={styles.input} placeholder="Departamento" value={formData.departamento} onChangeText={(value) => handleChange('departamento', value)} />
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.contenidoBotones}>
          <TouchableOpacity style={[styles.botonAlta, !validarCampos() && styles.botonDeshabilitado]} onPress={handleRegistrar} disabled={!validarCampos()}><Text style={styles.textoBoton}>Alta</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.botonBaja, !validarCampos() && styles.botonDeshabilitado]} onPress={handleDeshabilitar} disabled={!validarCampos()}><Text style={styles.textoBoton}>Baja</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.botonModificar, !validarCampos() && styles.botonDeshabilitado]} onPress={handleModificar} disabled={!validarCampos()}><Text style={styles.textoBoton}>Modificar</Text></TouchableOpacity>
          <TouchableOpacity style={styles.botonLimpiar} onPress={limpiarInterfaz}><Text style={styles.textoBoton}>Limpiar</Text></TouchableOpacity>
        </View>
      </ImageBackground>

      <CustomAlert isVisible={alertVisible} onClose={() => setAlertVisible(false)} title={alertTitle} message={alertMessage} />
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
        width: '100%',
        height: '100%',
    },
    botonDeshabilitado: {
        opacity: 0.5,
        backgroundColor: '#cccccc',
        borderColor: '#999999',
    },
    formulario: {
        marginTop: 8,
        alignSelf: 'center',
        width: '100%',
        maxWidth: 1200,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    dniContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        width: '100%',
    },
    label: {
        fontSize: 15,
        marginBottom: 8,
        fontWeight: '600',
        color: '#2c3e50',
        width: 80,
    },
    inputDni: {
        flex: 1,
        height: 38,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 8,
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
        marginRight: 10,
        fontSize: 15,
        marginLeft: 10,
    },
    consultarButton: {
        backgroundColor: '#f0f7ff',
        borderColor: '#746BC8',
        borderWidth: 1,
        paddingVertical: 0,
        paddingHorizontal: 14,
        borderRadius: 5,
        height: 38,
        justifyContent: 'center',
        marginLeft: 10,
    },
    consultarText: {
        color: '#746BC8',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    botonDeshabilitado: {
        opacity: 0.5,
        backgroundColor: '#cccccc',
        borderColor: '#999999',
    },
    fila: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 0,
    },
    columna: {
        flex: 1,
        paddingHorizontal: 10,
        maxWidth: '33.33%',
    },
    label: {
        fontSize: 15,
        marginBottom: 8,
        fontWeight: '600',
        color: '#2c3e50',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        borderRadius: 5,
        marginBottom: 13,
        backgroundColor: '#f9f9f9',
        height: 38,
        fontSize: 15,
    },
    filaPisoDepto: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 0,
        marginBottom: 5,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 13,
    },
    check: {
        marginLeft: 10,
    },
    contenidoBotones: {
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: 18,
        width: '80%',
        gap: 8,
    },
    botonAlta: {
        backgroundColor: '#e8f5e9',
        borderColor: '#4caf50',
        borderWidth: 1,
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 5,
        flex: 1,
        maxWidth: 200,
        height: 40,
        justifyContent: 'center',
        marginRight: 6,
    },
    botonBaja: {
        backgroundColor: '#ffebee',
        borderColor: '#f44336',
        borderWidth: 1,
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 5,
        flex: 1,
        maxWidth: 200,
        height: 40,
        justifyContent: 'center',
        marginLeft: 6,
        marginRight: 6,
    },
    botonModificar: {
        backgroundColor: '#e3f2fd',
        borderColor: '#746BC8',
        borderWidth: 1,
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 5,
        flex: 1,
        maxWidth: 200,
        height: 40,
        justifyContent: 'center',
        marginRight: 6,
    },
    botonLimpiar: {
        backgroundColor: '#f5f5f5',
        borderColor: '#9e9e9e',
        borderWidth: 1,
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 5,
        flex: 1,
        maxWidth: 200,
        height: 40,
        justifyContent: 'center',
    },
    textoBoton: {
        color: '#2c3e50',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
    },
});