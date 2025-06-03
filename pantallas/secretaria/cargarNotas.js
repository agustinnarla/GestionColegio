import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList, TextInput,Alert,ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState,useEffect } from "react";
import bg from '../../assets/bg1.jpg';

import { obtenerMateriaPorCurso, obtenerCurso  } from '../../scripts/listasDesplegables/listaDesplegable.js';
import ListasDesplegables from '../../componente/ListasDesplegables';
import { registrarNotas, obtenerNotas } from '../../scripts/secretaria/scriptCargarNotas';



export default function CargarNotas() {
    
    /*
        FORMULARIO
    */

    const [formData, setFormData] = useState({
        dni_alumno: '',
        id_materia: '',
        id_curso:'',
        nota1: '',
        nota2: '',
        nota3: '',
        nota4: '',
        nota5: '',
        nota6: '',
        tp1: '',
        tp2: '',
        tp3: '',
        aulico: ''
    });
    
    /*
        CARGAMOS LAS LISTAS DESPLEGABLES
    */
    const [curso,setCursos] = useState([]);
    const [materias,setMaterias] = useState([]);
    const [alumnos, setAlumnos] = useState([]); 
    
    useEffect(() => {
        const cargarDatos = async () => {
        
            try {
                const cursosData = await obtenerCurso();
            
                setCursos(cursosData);
                if (formData.id_curso) {
                        const materiasData = await obtenerMateriaPorCurso(formData.id_curso);;
                    setMaterias(materiasData);
                } else {
                    setMaterias([]); 
                }
            } catch (error) {
                Alert.alert('Error', error.message);
            }
        };
        cargarDatos();
    }, [formData.id_curso]);

    
    /*
        CARGAMOS ALUMNOS SEGÚN EL CURSO Y MATERIA SELECCIONADOS
    */
   
    const cargarAlumnos = async () => {
        if (formData.id_curso && formData.id_materia) {  
            try {
                const alumnosData = await obtenerNotas(formData.id_curso, formData.id_materia);
                if (alumnosData) {
                    setAlumnos(alumnosData);
                    console.log('Alumnos cargados:', alumnosData);
                }
            } catch (error) {
                console.error('Error al cargar alumnos:', error);
                Alert.alert('Error', 'No se pudieron cargar los alumnos');
            }
        } else {
            Alert.alert('Aviso', 'Por favor seleccione un curso y una materia');
        }
    };

    /*
        REGISTRAMOS NUEVAS NOTAS 
    */
    const handleRegistrar = async () => {
        try {
            

            // Validar que haya alumnos seleccionados
            if (!alumnos || alumnos.length === 0) {
                return Alert.alert('Error', 'No hay alumnos para registrar notas');
            }

            // Validar campos del formulario
            if (!formData.id_materia) {
                return Alert.alert('Error', 'Por favor seleccione una materia');
            }
            if (!formData.id_curso) {
                return Alert.alert('Error', 'Por favor seleccione un curso');
            }

            // Crear array de notas para registrar
            const notasParaRegistrar = alumnos.map(alumno => {
                if (!alumno.dni_alumno) {
                    throw new Error("DNI de alumno no encontrado");
                }

                return {
                    dni_alumno: parseInt(alumno.dni_alumno),
                    id_materia: parseInt(formData.id_materia),
                    id_curso: parseInt(formData.id_curso),
                    nota1: alumno.nota1 ? parseInt(alumno.nota1) : null,
                    nota2: alumno.nota2 ? parseInt(alumno.nota2) : null,
                    nota3: alumno.nota3 ? parseInt(alumno.nota3) : null,
                    nota4: alumno.nota4 ? parseInt(alumno.nota4) : null,
                    nota5: alumno.nota5 ? parseInt(alumno.nota5) : null,
                    nota6: alumno.nota6 ? parseInt(alumno.nota6) : null,
                    tp1: alumno.tp1 ? parseInt(alumno.tp1) : null,
                    tp2: alumno.tp2 ? parseInt(alumno.tp2) : null,
                    tp3: alumno.tp3 ? parseInt(alumno.tp3) : null,
                    aulico: alumno.aulico ? parseInt(alumno.aulico) : null
       
                };
            });

            console.log("Datos a registrar:", notasParaRegistrar);

            // Llamar al backend para registrar las notas
            const respuesta = await registrarNotas(notasParaRegistrar);
            console.log('Respuesta del servidor:', respuesta);
            Alert.alert('Éxito', 'Las notas se registraron correctamente');

        } catch (error) {
            console.log("Error detallado:", error);
            Alert.alert('Error', `Error al registrar las notas: ${error.message}`);
        }
    };

    const validarNota = (dni_alumno, campo, valor) => {
        // Validar que el valor sea un número entre 0 y 10
        if (valor === '' || (parseInt(valor) >= 1 && parseInt(valor) <= 10)) {
            setAlumnos(prevAlumnos => 
                prevAlumnos.map(alumno => 
                    alumno.dni_alumno === dni_alumno 
                        ? { ...alumno, [campo]: valor === '' ? '' : valor }
                        : alumno
                )
            );
        }
    };

    const limpiarInterfaz = () => {
        setFormData({
            dni_alumno: '',
            id_materia: '',
            id_curso: '',
            nota1: '',
            nota2: '',
            nota3: '',
            nota4: '',
            nota5: '',
            nota6: '',
            tp1: '',
            tp2: '',
            tp3: '',
            aulico: ''
        });
        setAlumnos([]); // <--- Esto limpia la grilla
    };


    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg} />

            {/* Filtros y acciones */}
            <View style={styles.contenedorSuperior}>
                <View style={styles.filtrosRow}>
                    <View style={styles.filtrosContainer}>
                        <ListasDesplegables 
                            formData={formData}
                            handleChange={handleChange}
                            curso={curso}
                            showLabel={false}
                            materias={materias}
                            styles={{ ...styles, input: styles.inputDesplegable }}
                        />
                    </View>
                    <View style={styles.botonesContainer}>
                        <TouchableOpacity style={styles.botonConsultar} onPress={cargarAlumnos}>
                            <Text style={styles.textoBoton}>Consultar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botonReiniciar} onPress={limpiarInterfaz}>
                            <Text style={styles.textoBoton}>Reiniciar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botonConsultar}>
                            <Text style={styles.textoBoton}>📄</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Grilla de alumnos y notas */}
            <View style={styles.grillaContainer}>
                <ScrollView horizontal>
                    <View>
                        <View style={styles.headerRow}>
                            <Text style={[styles.headerCell, {minWidth: 120}]}>Alumno</Text>
                            {[1,2,3,4,5,6].map(num => (
                                <Text key={`hnota${num}`} style={styles.headerCell}>{`Nota ${num}`}</Text>
                            ))}
                            {[1,2,3].map(num => (
                                <Text key={`htp${num}`} style={styles.headerCell}>{`Tp ${num}`}</Text>
                            ))}
                            <Text style={styles.headerCell}>Aulico</Text>
                        </View>
                        <ScrollView style={{maxHeight: 400}}>
                            {alumnos.map((item) => (
                                <View key={item.dni_alumno} style={styles.row}>
                                    <Text style={[styles.cellNombre, {minWidth: 120}]} numberOfLines={1}>{item.nombre_completo}</Text>
                                    {[1,2,3,4,5,6].map((num) => (
                                        <TextInput 
                                            key={num}
                                            style={styles.inputNota}
                                            value={item[`nota${num}`]?.toString() || ''}
                                            inputMode="numeric"
                                            maxLength={2}
                                            onChangeText={(text) => validarNota(item.dni_alumno, `nota${num}`, text)}
                                        />
                                    ))}
                                    {[1,2,3].map((num) => (
                                        <TextInput 
                                            key={`tp${num}`}
                                            style={styles.inputNota}
                                            value={item[`tp${num}`]?.toString() || ''}
                                            inputMode="numeric"
                                            maxLength={2}
                                            onChangeText={(text) => validarNota(item.dni_alumno, `tp${num}`, text)}
                                        />
                                    ))}
                                    <TextInput 
                                        style={styles.inputNota}
                                        value={item.aulico?.toString() || ''}
                                        inputMode="numeric"
                                        maxLength={2}
                                        onChangeText={(text) => validarNota(item.dni_alumno, 'aulico', text)}
                                    />
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </ScrollView>
                <TouchableOpacity 
                    style={[styles.botonConsultar, {alignSelf: 'center', marginTop: 10, width: 180}]}
                    onPress={handleRegistrar}
                >
                    <Text style={styles.textoBoton}>Confirmar Notas</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    padre: {
        flex: 1,
        backgroundColor: 'white',
    },
    bg: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    contenedorSuperior: {
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        margin: 20
        
    },
    botonesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    botonConsultar: {
        backgroundColor: '#CED9EF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#0500FF',
    },
    botonGuardar: {
        backgroundColor: '#90EE90',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#006400',
    },
    botonReiniciar: {
        backgroundColor: '#DADADA',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#000000',
    },
    textoBoton: {
        color: 'black',
        fontWeight: 'bold',
    },
    grillaContainer: {
    flex: 1,
    backgroundColor: 'white',
    margin: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10, // más redondeado
    paddingBottom: 10,
    minHeight: 200,
    overflow: 'hidden',
},
    headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
},
    headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    minWidth: 50,
    paddingHorizontal: 2,
    fontSize: 14,
},
    row: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
    backgroundColor: '#fff',
},
   cellNombre: {
    flex: 2,
    paddingHorizontal: 5,
    minWidth: 120,
    textAlign: 'center',
    fontSize: 14,
    alignSelf: 'center', // agrega esto si ves que no está centrado
},
    inputNota: {
    flex: 1,
    height: 32,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 5,
    textAlign: 'center',
    marginHorizontal: 1,
    backgroundColor: 'white',
    minWidth: 32, // antes 40
    fontSize: 14,
    padding: 0,
},
    scrollView: {
        flex: 1,
        width: '100%',
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    filtrosRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
    },
    inputDesplegable: {
    flex: 1,
    minWidth: 150,
    maxWidth: 220,
    height: 40,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 5,
    backgroundColor: '#fafafa',
    marginRight: 10,
    paddingHorizontal: 8,
},
filtrosContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    minWidth: 350,
    maxWidth: 500,
},
});
