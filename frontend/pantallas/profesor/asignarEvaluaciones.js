import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TextInput,
  Text,
  ImageBackground,
  TouchableOpacity,
  Platform,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { useState, useEffect } from "react";
import bg from "../../assets/bg1.jpg";
import {
  obtenerCursoPorMateria,
  obtenerMateriaPorProfesor,
  obtenerTipoDeEvaluacion,
} from "../../scripts/listasDesplegables/listaDesplegable";
import { registrarEvaluacion } from "../../scripts/profesor/scriptAsignarEvaluacion";
import ListasDesplegables from "../../componente/ListasDesplegables";
import CustomAlert from "../../componente/CustomAlerts.js";
import ScrollContainer from '../../componente/ScrollContainer.jsx'

export default function AsignarEvaluaciones({ route }) {
  //🟢 Formulario
  const [formData, setFormData] = useState({
    id_materia: "",
    id_curso: "",
    id_tipo_de_evaluacion: "",
    fecha: "",
    tema_abarcado: "",
  });

  //🟢 Estado del Mensaje
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [enviando, setEnviando] = useState(false);

  //🟢 Mensaje
  const mostrarMensaje = (titulo, mensaje) => {
    setAlertTitle(titulo);
    setAlertMessage(mensaje);
    setAlertVisible(true);
  };

  //🟢 Estado listas desplegables
  const [materiaPorProfesor, setMateriaPorProfesor] = useState([]);
  const [tipo_de_evaluacion, setTipoEvaluacion] = useState("");
  const [loading, setLoading] = useState(true);
  const [cursoPorMateria, setCursoPorMateria] = useState([]);

  //🟢 Capturamos Parametro
  const { dni_usuario } = route.params;

  if (!dni_usuario) {
    console.error("DNI Usuario no definido");
    return <Text>Error: DNI Usuario no definido</Text>;
  }

  console.log("DNI Usuario:", dni_usuario);
  const dni_profesional = dni_usuario;

  //🟢 Cargamos lista desplegable curso
  useEffect(() => {
    const cargarCursosPorMateria = async () => {
      if (formData.id_materia) {
        try {
          const cursoData = await obtenerCursoPorMateria(formData.id_materia);
          console.log("cursos" + cursoData);
          setCursoPorMateria(cursoData);
        } catch (error) {
          console.error("Error al cargar cursos:", error);
        }
      }
    };
    cargarCursosPorMateria();
  }, [formData.id_materia]);

  //🟢 Cargamos lista desplegable materia
  useEffect(() => {
    const cargarMateriasPorProfesor = async () => {
      try {
        const data = await obtenerMateriaPorProfesor(
          
          dni_profesional
        );
        setMateriaPorProfesor(data);
      } catch (error) {
        console.error("Error al cargar las materias:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarMateriasPorProfesor();
  }, [dni_profesional]);

  //🟢 Cargamos lista desplegable tipo de evaluación
  useEffect(() => {
    const cargarTipoDeEvaluacion = async () => {
      try {
        const data = await obtenerTipoDeEvaluacion();
        setTipoEvaluacion(data);
      } catch (error) {
        console.log("Error al cargar las características de la unidad", error);
      }
    };
    cargarTipoDeEvaluacion();
  }, []);

  //🟢 Formateamos fecha
  const validarFormatoFecha = (fecha) => {
    const regex = /^\d{4}\/\d{2}\/\d{2}$/;
        if (!regex.test(fecha)) return false;
        const [año, mes, dia] = fecha.split('/').map(Number);
        const fechaValida = new Date(año, mes - 1, dia);
        if (
            fechaValida.getFullYear() !== año ||
            fechaValida.getMonth() !== mes - 1 ||
            fechaValida.getDate() !== dia
        ) return false;
        if (año <= 2024) return false;
        const inicioRango = new Date(año, 1, 21);
        const finRango = new Date(año, 11, 21);
        if (fechaValida < inicioRango || fechaValida > finRango) return false;
        return true;
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  //🟢 Validamos campos para habilitar botones
  const validarCampos = () => {
    return (
      formData.id_materia &&
      formData.id_curso &&
      formData.id_tipo_de_evaluacion &&
      formData.fecha &&
      formData.tema_abarcado
    );
  };

  //🟢 Registramos evaluacion
  const handleRegistrar = async () => {
    try {
      if (!validarFormatoFecha(formData.fecha)) {
        mostrarMensaje(
          "Error",
          "Ingrese una fecha válida con formato AAAA/MM/DD"
        );
        return;
      }

      const asignarEvaluacionData = {
        id_curso: formData.id_curso,
        id_materia: formData.id_materia,
        id_tipo_de_evaluacion: formData.id_tipo_de_evaluacion,
        fecha: formData.fecha,
        tema_abarcado: formData.tema_abarcado,
        dni_profesional: dni_usuario,
      };

      if (!validarCampos()) {
        mostrarMensaje(
          "Error",
          "Por favor complete todos los campos correctamente"
        );
        return;
      }

      setEnviando(true);
      console.log("Datos de la evaluación", asignarEvaluacionData);
      mostrarMensaje("Enviando", "Enviando aviso de la evaluación al email...");

      const respuesta = await registrarEvaluacion(asignarEvaluacionData);

      setTimeout(() => {
        setAlertVisible(false);
        setTimeout(() => {
          mostrarMensaje("¡Éxito!", "Se asigno la evaluación correctamente");
          limpiarInterfaz();
          setEnviando(false);
        }, 300); 
      }, 500);
    } catch (error) {
      if (error.message === "Failed to fetch") {
        mostrarMensaje("Error de red", "No se pudo conectar con el servidor");
        return;
      }

      switch (error.code) {
        case "FECHA_INVALIDA":
          mostrarMensaje(
            "Fecha inválida",
            "La fecha debe ser al menos 2 días posterior a la actual."
          );
          break;
        case "LIMITE_EVALUACIONES":
          mostrarMensaje(
            "Límite alcanzado",
            "Ya hay 3 evaluaciones asignadas para este curso en esa fecha."
          );
          break;
        default:
          mostrarMensaje(
            "Error",
            error.message || "No se pudo asignar la evaluación"
          );
          break;
      }
      setEnviando(false);
    }
  };

  //🟢 Limpiar interfaz
  const limpiarInterfaz = () => {
    setFormData({
      id_materia: "",
      id_curso: "",
      id_tipo_de_evaluacion: "",
      fecha: "",
      tema_abarcado: "",
      dni_profesional: "",
    });
  };

  //🟢 Manejar cambios en el formulario
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  //🟢 Vista
  return (
    <View style={styles.padre}>
       <ScrollContainer />
       <ImageBackground source={bg} style={styles.bg} resizeMode="cover"> 
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            <ListasDesplegables
              formData={formData}
              handleChange={handleChange}
              materias={materiaPorProfesor}
              showLabel={true}
              styles={styles}
            />
            <ListasDesplegables
              formData={formData}
              handleChange={handleChange}
              cursos={cursoPorMateria}
              showLabel={true}
              styles={styles}
            />
            <ListasDesplegables
              formData={formData}
              handleChange={handleChange}
              tipo_de_evaluacion={tipo_de_evaluacion}
              showLabel={true}
              styles={styles}
            />

            <Text style={styles.label}>Fecha:</Text>
            <TextInput
              style={styles.input}
              placeholder="AAAA/MM/DD"
              onChangeText={(value) => handleChange("fecha", value)}
              value={formData.fecha}
            />
            <Text style={styles.label}>Temas:</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ingrese los temas abarcados separados con - o ,"
              multiline={true}
              numberOfLines={4}
              value={formData.tema_abarcado}
              onChangeText={(value) => handleChange("tema_abarcado", value)}
            />

            <View style={styles.contenidoBoton}>
              <TouchableOpacity
                style={[
                  styles.botonRegistrar,
                  !validarCampos() && styles.botonDeshabilitado,
                ]}
                onPress={handleRegistrar}
                disabled={!validarCampos()}
              >
                <Text style={styles.textoBoton}>Registrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botonCancelar}
                onPress={limpiarInterfaz}
              >
                <Text style={styles.textoBoton}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>

      <CustomAlert
        isVisible={alertVisible}
        onClose={() => setAlertVisible(false)}
        title={alertTitle}
        message={alertMessage}
        showSpinner={enviando}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  padre: {
    flex: 1,
  },
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  card: {
    width: "90%",
    maxWidth: 500,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  botonDeshabilitado: {
    opacity: 0.5,
    backgroundColor: "#cccccc",
    borderColor: "#999999",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2a3d6c",
  },
  input: {
    borderWidth: 1,
    borderColor: "#bdc3c7",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: "#fafafa",
    fontSize: 16,
    width: "100%",
    color: "#2a3d6c",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  contenidoBoton: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  botonRegistrar: {
    backgroundColor: "#CFEFCE",
    borderColor: "#33FF00",
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  botonCancelar: {
    backgroundColor: "#F3B9B9",
    borderColor: "#FF0000",
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    flex: 1,
  },
  textoBoton: {
    color: "#2a3d6c",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
