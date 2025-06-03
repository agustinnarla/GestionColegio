import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList, TextInput,Alert } from 'react-native';
import React, { useState, useEffect } from "react";
import bg from '../../assets/bg1.jpg';
import { obtenerLibroMatriz, obtenerLetra,imprimirLibroMatriz } from '../../scripts/secretaria/scriptLibroMatriz';

export default function LibroMatriz() {

    
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
            <Image source={bg} style={styles.bg} />
            
            <View style={styles.contenido}>
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
    contenido: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: 20,
        width: '90%',
        paddingHorizontal: 10,
    },
    contenidoBoton:{
        flexDirection: 'row', 
        justifyContent: 'space-between'
    },
    filtroContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    textInput: {
        height: 40,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        width: 150,
        marginTop: 5,
        textAlign: 'center',
    },
    botonConsultar: {
        backgroundColor: '#CED9EF',
        borderColor: '#0500FF',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginHorizontal: 10, 
        alignItems: 'center',
    },
    botonImprimir: {
        backgroundColor: '#DADADA',
        borderColor: '#000000',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    textoBoton: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
    grilla: {
        marginTop: 20,
        width: '90%',
    },
    encabezado: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#ccc',
    },
    fila: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    celdaEncabezado: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    celdaEncabezadoPrincipal: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
        minWidth: 50, 
    },
    celda: {
        flex: 1,
        textAlign: 'center',
    },
    cursosContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    botonCurso: {
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
        marginHorizontal: 10,
    },
    botonCursoSeleccionado: {
        backgroundColor: '#0056b3',
    },
    textoBotonCurso: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,
    },
    contenedorBotonesAño: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    botonAño: {
        padding: 10,
        backgroundColor: '#CED9EF',
        borderRadius: 5,
        marginHorizontal: 20,
    },
    textoBotonAño: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0500FF',
    },
    botonDeshabilitado: {
        backgroundColor: '#D3D3D3', // Color para el botón deshabilitado
        borderColor: '#A9A9A9', // Color del borde para el botón deshabilitado
    },
});
