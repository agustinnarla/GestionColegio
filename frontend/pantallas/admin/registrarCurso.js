import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import MultiSelect from "react-native-multiple-select";
import bg from "../../assets/bg1.jpg";
import {
  obtenerMateria,
  obtenerEspecialidad,
  obtenerEstadoGeneral,
} from "../../scripts/listasDesplegables/listaDesplegable.js";
import {
  registrarCursoPorMateria,
  consultarCurso,
  deshabilitarCurso,
  modificarCurso,
} from "../../scripts/admin/scriptRegistrarCurso.js";
import ListasDesplegables from "../../componente/ListasDesplegables.jsx";
import CustomAlert from "../../componente/CustomAlerts.js";

export default function RegistrarCurso() {
  const [materias, setMaterias] = useState([]);
  const [especialidad, setEspecialidades] = useState([]);
  const [estado_general, setEstadoGeneral] = useState([]);
  const [materiasSeleccionadas, setMateriasSeleccionadas] = useState([]);

  const [formData, setFormData] = useState({
    id_curso: "",
    detalle: "",
    id_especialidad: "",
    id_materia: [],
    id_estado_general: "",
  });

  // Mensajes
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState(null);

  const mostrarMensaje = (titulo, mensaje) => {
    setAlertTitle(titulo);
    setAlertMessage(mensaje);
    setAlertVisible(true);
  };

  useEffect(() => {
    const cargarListaDesplegable = async () => {
      try {
        // Cargar materias
        const materiasData = await obtenerMateria();
        console.log("Datos obtenidos de la API (Materias):", materiasData);

        const materiasTransformadas = Array.isArray(materiasData)
          ? materiasData.map((materia) => ({
              id: materia.id_materia, // Cambia `id_materia` a `id`
              name: materia.detalle, // Cambia `detalle` a `name`
            }))
          : [];

        console.log("Materias transformadas:", materiasTransformadas);
        setMaterias(materiasTransformadas);

        // Cargar especialidades
        const especialidadesData = await obtenerEspecialidad();
        console.log(
          "Datos obtenidos de la API (Especialidades):",
          especialidadesData
        );

        const estadoGeneral = await obtenerEstadoGeneral();
        console.log(
          "Datos obtenidos de la API (Estado General):",
          estadoGeneral
        );
        setEstadoGeneral(estadoGeneral);

        console.log("Especialidades transformadas:", especialidadesData);
        setEspecialidades(especialidadesData);
      } catch (error) {
        console.error("Error al cargar los datos:", error.message);
        mostrarMensaje("Error", "No se pudieron cargar los datos.");
      }
    };
    cargarListaDesplegable();
  }, []);

  const validarDetalle = () => {
    return formData.detalle;
  };
  const validarCampos = () => {
    return (
      formData.detalle &&
      formData.id_especialidad &&
      formData.id_estado_general &&
      formData.id_materia.length > 0
    );
  };

  // Manejar cambios en el formulario
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleRegistrar = async () => {
    if (!formData.detalle) {
      mostrarMensaje("Error", "Por favor ingrese el nombre del curso");
      return;
    }
    if (materiasSeleccionadas.length === 0) {
      mostrarMensaje("Error", "Por favor seleccione al menos una materia");
      return;
    }

    const cursoData = {
      detalle: formData.detalle,
      id_especialidad: parseInt(formData.id_especialidad),
      id_materia: materiasSeleccionadas.map(Number),
      id_estado_general: formData.id_estado_general,
    };

    try {
      const respuesta = await registrarCursoPorMateria(cursoData);
      if (respuesta && respuesta.message === "El curso ya está registrado") {
        mostrarMensaje("Error", "Ya existe un curso con ese nombre");
        return;
      }

      limpiarInterfaz();
      mostrarMensaje("Éxito", "Curso registrado exitosamente");
    } catch (error) {
      console.error("Error al registrar el curso:", error);
      mostrarMensaje("Error", "No se pudo registrar el curso");
    }
  };

  const limpiarInterfaz = () => {
    try {
      setFormData({
        detalle: "",
        id_especialidad: "",
        id_materia: [],
      });
      setMateriasSeleccionadas([]);
      console.log("Interfaz limpiada correctamente");
    } catch (error) {
      console.error("Error al limpiar la interfaz:", error.message);
    }
  };

  const handleConsultar = async () => {
    if (!formData.detalle) {
      mostrarMensaje(
        "Error",
        "Por favor ingrese el nombre del curso a consultar"
      );
      return;
    }
    try {
      const data = await consultarCurso(formData.detalle);

      if (data.curso) {
        const curso = data.curso;

        setFormData({
          ...formData,
          detalle: curso.curso,
          id_estado_general: curso.id_estado_general,
          id_especialidad: curso.id_especialidad,
          id_materia: curso.id_materia,
          id_curso: curso.id_curso,
        });

        setMateriasSeleccionadas(curso.id_materia || []);
        console.log("Curso consultado:", data.curso);
        mostrarMensaje("Éxito", "Curso encontrado");
      } else {
        mostrarMensaje("Error", "Curso no encontrado");
      }
    } catch (error) {
      console.error("Error al consultar el curso:", error);
      mostrarMensaje("Error", "No se pudo consultar el curso");
    }
  };

  const handleDeshabilitar = async () => {
    try {
      const respuesta = await deshabilitarCurso(formData.id_curso);
      console.log("Curso deshabilitado:", respuesta);
      mostrarMensaje("Éxito", "Curso deshabilitado exitosamente");
      limpiarInterfaz();
    } catch (error) {
      console.error("Error al deshabilitar el curso:", error.message);
      mostrarMensaje("Error", "No se pudo deshabilitar el curso");
    }
  };

  const handleModificar = async () => {
    try {
      const cursoData = {
        detalle: formData.detalle,
        id_especialidad: parseInt(formData.id_especialidad),
        id_materia: materiasSeleccionadas.map(Number),
      };
      console.log(cursoData);
      const respuesta = await modificarCurso(formData.id_curso, cursoData);
      if (respuesta) {
        mostrarMensaje("Exito", "El curso se modifico correctamente");
        console.log("El curso fue modificado correctamente");
        limpiarInterfaz();
      }
    } catch (error) {
      mostrarMensaje("Error", "Error al modificar el curso");
      console.log(error.message);
    }
  };

  return (
    <View style={styles.padre}>
      <Image source={bg} style={styles.bg} />
      <View style={styles.contenido}>
        <Text style={styles.titulo}>Registrar Curso</Text>
        <Text style={styles.label}>Nombre del curso</Text>
        <TextInput
          placeholder="0° Año - Division"
          placeholderTextColor="#888"
          style={styles.input}
          value={formData.detalle}
          onChangeText={(text) => handleChange("detalle", text)}
        />
        <TouchableOpacity
          onPress={handleConsultar}
          style={[
            styles.botonModificar,
            !validarDetalle() && styles.botonDeshabilitado,
          ]}
          disabled={!validarDetalle()}
        >
          <Text>Consultar</Text>
        </TouchableOpacity>

        <ListasDesplegables
          formData={formData}
          handleChange={handleChange}
          especialidad={especialidad}
          estado_general={estado_general}
          showLabel={true}
          styles={styles}
        />

        <Text style={styles.label}>Materias asignables:</Text>
        <MultiSelect
          items={materias}
          uniqueKey="id"
          onSelectedItemsChange={(selectedItems) => {
            setMateriasSeleccionadas(selectedItems);
            handleChange("id_materia", selectedItems);
          }}
          selectedItems={materiasSeleccionadas}
          selectText="Seleccione las materias"
          searchInputPlaceholderText="Buscar materias..."
          displayKey="name"
          searchInputStyle={{ color: "#000" }}
          submitButtonColor="#48d22b"
          submitButtonText="Aceptar"
          styleDropdownMenuSubsection={styles.multiSelect}
        />
        <TouchableOpacity
          style={[styles.botonAlta, !validarCampos() && styles.botonDeshabilitado]}
          onPress={handleRegistrar}
          disabled={!validarCampos()}
        >
          <Text style={styles.textoBoton}>Registrar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botonBaja, !validarCampos() && styles.botonDeshabilitado]}
          onPress={handleDeshabilitar}
          disabled={!validarCampos()}
        >
          <Text style={styles.textoBoton}>Deshabilitar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botonModificar, !validarCampos() && styles.botonDeshabilitado]}
          onPress={handleModificar}
        >
          <Text style={styles.textoBoton}>Modificar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botonModificar, !validarCampos() && styles.botonDeshabilitado]}
          onPress={limpiarInterfaz}
          disabled={!validarCampos()}
        >
          <Text style={styles.textoBoton}>Limpiar</Text>
        </TouchableOpacity>
      </View>
      <CustomAlert
        isVisible={alertVisible}
        onClose={() => {
          setAlertVisible(false);
          setOnConfirm(null);
        }}
        title={alertTitle}
        message={alertMessage}
        showConfirm={!!onConfirm}
        onConfirm={onConfirm}
        confirmText="Confirmar"
        cancelText="Cancelar"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  padre: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6f8fa",
  },
  bg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  contenido: {
    width: "95%",
    maxWidth: 600,
    alignSelf: "center",
    marginTop: 32,
    marginBottom: 24,
    padding: 30,
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2a3d6c",
    marginBottom: 18,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  label: {
    fontSize: 15,
    marginBottom: 6,
    fontWeight: "500",
    color: "#2a3d6c",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 10,
    borderRadius: 7,
    marginBottom: 13,
    backgroundColor: "#f3f4f6",
    height: 38,
    fontSize: 15,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 8,
  },
  inputPicker: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 7,
    backgroundColor: "#f3f4f6",
    fontSize: 15,
    height: 38,
    paddingHorizontal: 10,
  },
  botonAlta: {
    backgroundColor: "#e8f5e9",
    borderColor: "#4caf50",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 7,
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  botonBaja: {
    backgroundColor: "#ffebee",
    borderColor: "#f44336",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 7,
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  botonModificar: {
    backgroundColor: "#e3f2fd",
    borderColor: "#746BC8",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 7,
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  botonLimpiar: {
    backgroundColor: "#f5f5f5",
    borderColor: "#9e9e9e",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 7,
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  botonDeshabilitado: {
    opacity: 0.5,
  },
  textoBoton: {
    color: "#2c3e50",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
});
