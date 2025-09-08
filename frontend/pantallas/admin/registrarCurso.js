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
        const materiasTransformadas = Array.isArray(materiasData)
          ? materiasData.map((materia) => ({
              id: materia.id_materia,
              name: materia.detalle,
            }))
          : [];
        setMaterias(materiasTransformadas);

        // Cargar especialidades
        const especialidadesData = await obtenerEspecialidad();
        setEspecialidades(especialidadesData);

        const estadoGeneral = await obtenerEstadoGeneral();
        setEstadoGeneral(estadoGeneral);
      } catch (error) {
        mostrarMensaje("Error", "No se pudieron cargar los datos.");
      }
    };
    cargarListaDesplegable();
  }, []);

  const validarCampos = (...campos) =>
    campos.every((campo) => formData[campo]?.length > 0);

  const habilitarConsultar = () => validarCampos("detalle");

  const habilitarBotones = () =>
    validarCampos("detalle", "id_especialidad", "id_estado_general", "id_materia");

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
      mostrarMensaje("Error", "No se pudo registrar el curso");
    }
  };

  const limpiarInterfaz = () => {
    setFormData({
      detalle: "",
      id_especialidad: "",
      id_materia: [],
      id_estado_general: "",
    });
    setMateriasSeleccionadas([]);
  };

  const handleConsultar = async () => {
    if (!formData.detalle) {
      mostrarMensaje("Error", "Por favor ingrese el nombre del curso a consultar");
      return;
    }
    try {
      const data = await consultarCurso(formData.detalle);

      if (data.curso) {
        const curso = data.curso;

        setFormData({
          ...formData,
          detalle: curso.curso,
          id_estado_general: String(curso.id_estado_general),
          id_especialidad: String(curso.id_especialidad),
          id_materia: curso.id_materia,
          id_curso: curso.id_curso,
        });

        setMateriasSeleccionadas(curso.id_materia || []);
        mostrarMensaje("Éxito", "Curso encontrado");
      } else {
        mostrarMensaje("Error", "Curso no encontrado");
      }
    } catch (error) {
      mostrarMensaje("Error", "No se pudo consultar el curso");
    }
  };

  const handleDeshabilitar = async () => {
    try {
      const respuesta = await deshabilitarCurso(formData.id_curso);
      mostrarMensaje("Éxito", "Curso deshabilitado exitosamente");
      limpiarInterfaz();
    } catch (error) {
      mostrarMensaje("Error", "No se pudo deshabilitar el curso");
    }
  };

  const handleModificar = async () => {
    try {
      const cursoData = {
        detalle: formData.detalle,
        id_especialidad: parseInt(formData.id_especialidad),
        id_estado_general: parseInt(formData.id_estado_general),
        id_materia: materiasSeleccionadas.map(Number),
      };
      const respuesta = await modificarCurso(formData.id_curso, cursoData);
      if (respuesta) {
        mostrarMensaje("Exito", "El curso se modifico correctamente");
        limpiarInterfaz();
      }
    } catch (error) {
      mostrarMensaje("Error", "Error al modificar el curso");
    }
  };

  return (
    <View style={styles.padre}>
      <Image source={bg} style={styles.bg} />
      <View style={styles.formulario}>
      
        <View style={styles.fila}>
          {/* Columna izquierda: datos del curso */}
          <View style={styles.columna}>
            <Text style={styles.label}>Nombre del curso</Text>
            <TextInput
              placeholder="0° Año - División"
              placeholderTextColor="#888"
              style={styles.input}
              value={formData.detalle}
              onChangeText={(text) => handleChange("detalle", text)}
            />
            <TouchableOpacity
              onPress={handleConsultar}
              style={[
                styles.botonConsultar,
                !habilitarConsultar() && styles.botonDeshabilitado,
              ]}
              disabled={!habilitarConsultar()}
            >
              <Text style={styles.textoBoton}>Consultar</Text>
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
              submitButtonColor="#6c7ae0"
              submitButtonText="Aceptar"
              styleDropdownMenuSubsection={styles.multiSelect}
            />
          </View>
          {/* Columna derecha: acciones */}
          <View style={styles.columna}>
            <TouchableOpacity
              style={[
                styles.botonAlta,
                !habilitarBotones() && styles.botonDeshabilitado,
              ]}
              onPress={handleRegistrar}
              disabled={!habilitarBotones()}
            >
              <Text style={styles.textoBoton}>Registrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.botonBaja,
                !habilitarBotones() && styles.botonDeshabilitado,
              ]}
              onPress={handleDeshabilitar}
              disabled={!habilitarBotones()}
            >
              <Text style={styles.textoBoton}>Deshabilitar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.botonModificar,
                !habilitarBotones() && styles.botonDeshabilitado,
              ]}
              onPress={handleModificar}
              disabled={!habilitarBotones()}
            >
              <Text style={styles.textoBoton}>Modificar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.botonLimpiar,
                
              ]}
              onPress={limpiarInterfaz}
            >
              <Text style={styles.textoBoton}>Limpiar</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  formulario: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    marginTop: 32,
    marginBottom: 24,
    padding: 30,
    backgroundColor: "#fff",
    borderRadius: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2a3d6c",
    marginBottom: 18,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 24,
  },
  columna: {
    width: "48%",
    minWidth: 260,
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
    height: 44,
    fontSize: 15,
  },
  botonAlta: {
    backgroundColor: "#e8f5e9",
    borderColor: "#4caf50",
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 7,
    alignItems: "center",
    marginBottom: 10,
  },
  botonBaja: {
    backgroundColor: "#ffebee",
    borderColor: "#f44336",
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 7,
    alignItems: "center",
    marginBottom: 10,
  },
  botonModificar: {
    backgroundColor: "#e3f2fd",
    borderColor: "#746BC8",
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 7,
    alignItems: "center",
    marginBottom: 10,
  },
  botonLimpiar: {
    backgroundColor: "#f5f5f5",
    borderColor: "#9e9e9e",
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 7,
    alignItems: "center",
    marginBottom: 10,
  },
  botonConsultar: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196F3",
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 7,
    alignItems: "center",
    marginBottom: 10,
    width: "50%",
  },
  botonDeshabilitado: {
    opacity: 0.5,
    backgroundColor: "#cccccc",
    borderColor: "#999999",
  },
  textoBoton: {
    color: "#2c3e50",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  multiSelect: {
    marginBottom: 10,
    marginTop:10, 
  },
});