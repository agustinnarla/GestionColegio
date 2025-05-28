import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList, TextInput,Alert,ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState,useEffect } from "react";
import bg from '../../assets/bg1.jpg';

import { obtenerMateria, obtenerCurso  } from '../../scripts/listasDesplegables/listaDesplegable.js';
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
        nota6: ''
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
             
                const materiasData = await obtenerMateria();
                setCursos(cursosData);
                setMaterias(materiasData);
            } catch (error) {
                Alert.alert('Error', error.message);
            }
        };
        cargarDatos();
    }, []);

    
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
                    nota6: alumno.nota6 ? parseInt(alumno.nota6) : null
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

    const handleNotaChange = (dni_alumno, campo, valor) => {
        // Validar que el valor sea un número entre 0 y 10
        if (valor === '' || (parseInt(valor) >= 0 && parseInt(valor) <= 10)) {
            setAlumnos(prevAlumnos => 
                prevAlumnos.map(alumno => 
                    alumno.dnialumno === dni_alumno 
                        ? { ...alumno, [campo]: valor === '' ? '' : valor }
                        : alumno
                )
            );
        }
    };


    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg} />
            
                <View style={styles.contenedorSuperior}>
                    <View style={styles.filtrosContainer}>
                        <ListasDesplegables 
                        formData={formData}
                        handleChange={handleChange}
                        curso={curso}
                        materias={materias}
                        styles={styles}
                        />
                </View>
                    <View  style={styles.botonesContainer}>
                        <TouchableOpacity style={styles.botonConsultar} onPress={cargarAlumnos} >
                            <Text style={styles.textoBoton}>Consultar</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.botonReiniciar} >
                            <Text style={styles.textoBoton}>Reiniciar Filtro</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.botonReiniciar} >
                        <Text style={styles.textoBoton}>📁</Text>
                    </TouchableOpacity>
                </View>
                
                        {/* Contenedor de la grilla */}
                        <View style={styles.grillaContainer}>
                            
        <View style={styles.headerRow}>
            <Text style={styles.headerCell}>Alumno</Text>
            <Text style={styles.headerCell}>Nota 1</Text>
            <Text style={styles.headerCell}>Nota 2</Text>
            <Text style={styles.headerCell}>Nota 3</Text>
            <Text style={styles.headerCell}>Nota 4</Text>
            <Text style={styles.headerCell}>Nota 5</Text>
            <Text style={styles.headerCell}>Nota 6</Text>
        </View>
        <View style={{ height: 650 }}>
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
            >
                {alumnos.map((item) => (
                    <View key={item.dni_alumno} style={styles.row}>
                        <Text style={styles.cellNombre}>{item.nombre_completo}</Text>
                        {[1,2,3,4,5,6].map((num) => (
                            <TextInput 
                                key={num}
                                style={styles.inputNota}
                                value={item[`nota${num}`]?.toString() || ''}
                                inputMode="numeric"
                                maxLength={2}
                                onChangeText={(text) => handleNotaChange(item.dni_alumno, `nota${num}`, text)}
                            />
                        ))}
                    </View>
                ))}
                <TouchableOpacity 
                    style={styles.botonConsultar} 
                    onPress={handleRegistrar}
                >
                    <Text style={styles.textoBoton}>Confirmar</Text>
                </TouchableOpacity>
            </ScrollView>
                </View>
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
    },
    filtrosContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    picker: {
        flex: 1,
        marginHorizontal: 10,
    },
    botonesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
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
        height: '70%',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        alignItems: 'center',
    },
    cellNombre: {
        flex: 2,
        paddingHorizontal: 5,
    },
    inputNota: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        textAlign: 'center',
        marginHorizontal: 2,
        backgroundColor: 'white',
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },
    scrollViewContent: {
        flexGrow: 1,
    },
});
