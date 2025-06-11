import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList, TextInput,Alert, Dimensions,Platform, ImageBackground } from 'react-native';
import React, { useState, useEffect } from "react";
import bg from '../../assets/bg1.jpg';
import { obtenerLibroMatriz, obtenerLetra,imprimirLibroMatriz } from '../../scripts/secretaria/scriptLibroMatriz';


const { width } = Dimensions.get('window');
const isDesktop = width >= 768;
const isWeb = Platform.OS === 'web';

export default function LibroMatriz() {

     useEffect(() => {
            if (isWeb) {
            document.body.style.overflow = 'auto'; // Activar scroll en web
          } else {
            document.body.style.overflow = 'hidden'; // Desactivarlo en otras plataformas
          }
          }, []);
    
    //Formulario
        const [formData, setFormData] = useState({
        dni_alumno: '',
        id_curso: '',
        id_materia: '',
        id_estado_evaluativo: '',
        promedio: '',
    });

    const [datos, setDatos] = useState([]);
    const [cursoActual, setCursoActual] = useState('');
    const [cursosDisponibles, setCursosDisponibles] = useState([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState(null);

    useEffect(() => {
        console.log('cursosDisponibles actualizado:', cursosDisponibles);
        console.log('cursoSeleccionado actualizado:', cursoSeleccionado);
    }, [cursosDisponibles, cursoSeleccionado]);

    //Función para consultar un alumno 
    const handleConsultar = async () => {
        try {
            const respuesta = await obtenerLibroMatriz(formData.dni_alumno);
            const alumno = respuesta.libroMatriz || [];
            console.log('Alumno consultado:', alumno);

            if (alumno.length > 0) {
                setFormData({
                    ...formData,
                    dni_alumno: parseInt(alumno[0].dni_alumno),
                    id_curso: alumno[0].id_curso || '',
                    id_estado_evaluativo: alumno[0].id_estado_evaluativo || '',
                    id_materia: alumno[0].id_materia || '',
                    promedio: alumno[0].promedio || '',
                });

                // Array de objetos únicos por id_curso
                const cursos = [];
                const ids = new Set();
                alumno.forEach(item => {
                    if (!ids.has(item.id_curso)) {
                        cursos.push({ id_curso: item.id_curso, curso_detalle: String(item.curso_detalle).trim() });
                        ids.add(item.id_curso);
                    }
                });
                setDatos(alumno);
                setCursosDisponibles(cursos);
                setCursoSeleccionado(cursos[0]);
                setCursoActual(cursos[0]);
            } else {
                Alert.alert('Error', 'Alumno no encontrado');
            }
        } catch (error) {
            console.error('Error al consultar alumno:', error.message);
            Alert.alert('Error', error.message);
        }
    };

    //Función para cambiar de curso
    const cambiarCurso = (direccion) => {
        const indiceActual = cursosDisponibles.findIndex(c => c.id_curso === cursoSeleccionado.id_curso);
        if (direccion === 'anterior' && indiceActual > 0) {
            setCursoSeleccionado(cursosDisponibles[indiceActual - 1]);
        } else if (direccion === 'siguiente' && indiceActual < cursosDisponibles.length - 1) {
            setCursoSeleccionado(cursosDisponibles[indiceActual + 1]);
        }
    };

    //Renderizamos en la grilla los datos 
    const renderItem = ({ item }) => {
        const hoy = new Date();
        const dia = hoy.getDate();
        const mes = hoy.getMonth() + 1;
        const año = hoy.getFullYear();

        return (
            <View style={styles.fila}>
                <Text style={styles.celda}>{item.materia_detalle}</Text>
                <Text style={styles.celda}>{item.estado_detalle}</Text>
                <Text style={styles.celda}>{item.promedio}</Text>
                <Text style={styles.celda}>{obtenerLetra(item.promedio)}</Text>
                <Text style={styles.celda}>{dia}</Text>
                <Text style={styles.celda}>{mes}</Text>
                <Text style={styles.celda}>{año}</Text>
                <Text style={styles.celda}>Este establecimiento</Text>
            </View>
        );
    };

    // Filtrar datos por id_curso
    const datosFiltrados = cursoSeleccionado
        ? datos.filter(item => item.id_curso === cursoSeleccionado.id_curso)
        : [];

    //Función para imprimir el libro matriz
    const handleImprimir = async () => {
        try {
            const cursos = cursosDisponibles.map(curso => ({
                curso_detalle: curso.curso_detalle,
                datos: datos.filter(item => item.id_curso === curso.id_curso)
            }));
            await imprimirLibroMatriz(formData, cursos);
            Alert.alert('Éxito', 'Documento listo para imprimir');
        } catch (error) {
            console.error('Error al imprimir:', error.message);
            Alert.alert('Error', 'No se pudo generar el documento');
        }
    };

    return (
        <View style={styles.padre}>
            <ImageBackground source={bg} style={styles.bg}>
            
            <View style={isDesktop ? styles.scrollContainerDesktop : styles.scrollContainerMobile}>
                <View style={styles.filtroContainer}>
                    <Text>DNI:</Text>
                    <TextInput 
                        style={styles.textInput} 
                        placeholder='dni' 
                        keyboardType='numeric' 
                        accessibilityLabel="Ingrese su DNI"
                        value={formData.dni_alumno}
                        onChangeText={(text) => setFormData({...formData, dni_alumno: text})}
                    />
                </View>
                
                <View style={styles.contenidoBoton}>
                    <TouchableOpacity style={styles.botonConsultar} onPress={handleConsultar}>
                        <Text style={styles.textoBoton}>Consultar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botonImprimir}>
                        <Text style={styles.imprimir} onPress={handleImprimir}>Imprimir</Text>
                    </TouchableOpacity>
                </View>
            </View>
    
            {/* Grilla */}
            {datosFiltrados.length > 0 && (
                <View style={styles.grilla}>
                    <View style={styles.encabezado}>
                        <Text style={styles.celdaEncabezado}>Espacio Curricular</Text>
                        <Text style={styles.celdaEncabezado}>Condición</Text>
                        <Text style={styles.celdaEncabezado}>N°</Text>
                        <Text style={styles.celdaEncabezado}>Letra</Text>
                        <Text style={styles.celdaEncabezado}>D</Text>
                        <Text style={styles.celdaEncabezado}>M</Text>
                        <Text style={styles.celdaEncabezado}>A</Text>
                        <Text style={styles.celdaEncabezado}>Establecimiento</Text>
                    </View>
                    <FlatList
                        data={datosFiltrados}
                        renderItem={renderItem}
                        keyExtractor={(item, idx) => `${item.dni_alumno || item.dnialumno || idx}-${item.id_materia || item.idmateria || idx}`}
                    />
                </View>
            )}

            {/* Botones para cambiar de curso */}
            {cursosDisponibles.length > 0 && cursoSeleccionado && (
                <View style={styles.contenedorBotonesAño}>
                    <TouchableOpacity 
                        style={[
                            styles.botonAño, 
                            cursosDisponibles.findIndex(c => c.id_curso === cursoSeleccionado.id_curso) === 0 && styles.botonDeshabilitado
                        ]} 
                        onPress={() => cambiarCurso('anterior')}
                        disabled={cursosDisponibles.findIndex(c => c.id_curso === cursoSeleccionado.id_curso) === 0}
                    >
                        <Text style={styles.textoBotonAño}>{"<"}</Text>
                    </TouchableOpacity>
                    <Text style={styles.textoAño}>{cursoSeleccionado.curso_detalle} </Text>
                    <TouchableOpacity 
                        style={[
                            styles.botonAño, 
                            cursosDisponibles.findIndex(c => c.id_curso === cursoSeleccionado.id_curso) === cursosDisponibles.length - 1 && styles.botonDeshabilitado
                        ]} 
                        onPress={() => cambiarCurso('siguiente')}
                        disabled={cursosDisponibles.findIndex(c => c.id_curso === cursoSeleccionado.id_curso) === cursosDisponibles.length - 1}
                    >
                        <Text style={styles.textoBotonAño}>{">"}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ImageBackground>
        </View>
    );
}


const styles = StyleSheet.create({
  padre: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    width: '100%',
    height: '100%',  
  },
  bg: {
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  scrollViewDesktop: {
    width: '100%',
    flex: 1,

  },
  scrollViewMobile: {
    width: '100%',
    flex: 1,
  },
  scrollContainerDesktop: {
    width: '100%',
    alignItems: 'center'
  },
  scrollContainerMobile: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 80,
  },
  filtroContainer: {
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 18,
  marginTop: 30,
  marginBottom: 18,
  borderWidth: 1,
  borderColor: '#e1e8ed',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 6,
  elevation: 2,
  },
  textInput: {
   marginTop: 10,
    height: 40,
    borderColor: '#746BC8',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    width: 170,
    marginTop: 8,
    backgroundColor: '#f9fafb',
    fontSize: 16,
    textAlign: 'center',
  },
  contenidoBoton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center', 
  gap: 16,
  marginBottom: 18,
},
  botonConsultar: {
    backgroundColor: '#f0f7ff',
    borderColor: '#746BC8',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: 'center',
    minWidth: 110,
    elevation: 2,
    shadowColor: '#CED9EF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
  },
  botonImprimir: {
    backgroundColor: '#f0f7ff',
    borderColor: '#746BC8',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 110,
    elevation: 2,
    shadowColor: '#CED9EF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
  },
  textoBoton: {
    color: '#2c3e50',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  imprimir: {
    color: '#2c3e50',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  grilla: {
    marginTop: 24,
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    shadowColor: '#000',
      maxWidth: 1200,
    alignSelf: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    paddingBottom: 10,
    marginBottom: 18,
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 6,
    backgroundColor: '#f0f7ff',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  celdaEncabezado: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2a3d6c',
    fontSize: 15,
  },
  celda: {
    flex: 1,
    textAlign: 'center',
    color: '#374151',
    fontSize: 14,
  },
  contenedorBotonesAño: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 18,
    gap: 18,
  },
  botonAño: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#746BC8',
    marginHorizontal: 10,
    elevation: 2,
    shadowColor: '#CED9EF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
  },
  textoBotonAño: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#746BC8',
    textAlign: 'center',
  },
  textoAño: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2a3d6c',
    marginHorizontal: 8,
    textAlign: 'center',
  },
  botonDeshabilitado: {
    backgroundColor: '#e5e7eb',
    borderColor: '#cbd5e1',
    opacity: 0.7,
  },
});