import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList, ScrollView, Platform, Alert } from 'react-native';
import { obtenerMateriaPorProfesor, obtenerProfesor, obtenerCursoPorMateria } from '../../scripts/listasDesplegables/listaDesplegable.js'
import { obtenerLibroAula } from '../../scripts/profesor/scriptLibroAula.js';
import ListasDesplegables from '../../componente/ListasDesplegables';
import React, { useEffect, useState } from "react";
import bg from '../../assets/bg1.jpg';

export default function ConsultarLibro() {
    const [datos, setDatos] = useState([]);
    const [materia, setMateria] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [curso, setCurso] = useState([]);

    const [formData, setFormData] = useState({
        id_materia: '',
        id_curso: '',
        dni_profesional: '',
        fecha: '',
        numero_clase: '',
        unidad: '',
        caracteristica_unidad: '',
        tema_abarcado: ''
    });

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const profesoresData = await obtenerProfesor();
                setProfesores(profesoresData);

                if (formData.dni_profesional) {
                    const materiaData = await obtenerMateriaPorProfesor(formData.dni_profesional);
                    setMateria(materiaData);
                } else {
                    setMateria([]);
                }

                if (formData.id_materia) {
                    const cursoData = await obtenerCursoPorMateria(formData.id_materia);
                    setCurso(cursoData);
                } else {
                    setCurso([]);
                }
            } catch (error) {
                Alert.alert('Error', error.message);
            }
        };
        cargarDatos();
    }, [formData.dni_profesional, formData.id_materia]);

    const handleConsultar = async () => {
        try {
            const respuesta = await obtenerLibroAula(formData.dni_profesional, formData.id_curso, formData.id_materia);
            const libroAula = respuesta.libro_aula || [];
            setDatos(libroAula);
        } catch (error) {
            Alert.alert('Error', error.message || 'No se pudo consultar el libro de aula');
        }
    };

    const reiniciarFiltro = () => {
        setDatos([]);
        setFormData({
            id_materia: '',
            id_curso: '',
            dni_profesional: '',
            fecha: '',
            numero_clase: '',
            unidad: '',
            caracteristica_unidad: '',
            tema_abarcado: ''
        });
    };

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const renderItem = ({ item }) => (
        <View style={styles.fila}>
            <Text style={styles.celda}>{item.fecha}</Text>
            <Text style={styles.celda}>{item.numero_clase}</Text>
            <Text style={styles.celda}>{item.unidad}</Text>
            <Text style={styles.celda}>{item.caracteristica_unidad}</Text>
            <Text style={styles.celda}>{item.tema_abarcado}</Text>
        </View>
    );

    const Content = (
        <View style={styles.contenido}>
            <ListasDesplegables
                formData={formData}
                handleChange={handleChange}
                profesores={profesores}
                styles={styles}
            />
            <ListasDesplegables
                formData={formData}
                handleChange={handleChange}
                materias={materia}
                styles={styles}
            />
            <ListasDesplegables
                formData={formData}
                handleChange={handleChange}
                curso={curso}
                styles={styles}
            />

            <View style={styles.botonesContainer}>
                <TouchableOpacity style={styles.botonConsultar} onPress={handleConsultar}>
                    <Text style={styles.textoBoton}>Consultar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botonReiniciar} onPress={reiniciarFiltro}>
                    <Text style={styles.textoBoton}>Reiniciar Filtro</Text>
                </TouchableOpacity>
            </View>

            {datos.length > 0 && (
                <View style={styles.grilla}>
                    <View style={styles.encabezado}>
                        <Text style={styles.celdaEncabezado}>Fecha</Text>
                        <Text style={styles.celdaEncabezado}>Clase N°</Text>
                        <Text style={styles.celdaEncabezado}>Unidad</Text>
                        <Text style={styles.celdaEncabezado}>Característica</Text>
                        <Text style={styles.celdaEncabezado}>Tema abarcado</Text>
                    </View>
                    <FlatList
                        data={datos}
                        renderItem={renderItem}
                        keyExtractor={(_, idx) => idx.toString()}
                    />
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg} />
            {Platform.OS === 'web' ? Content : <ScrollView contentContainerStyle={styles.scroll}>{Content}</ScrollView>}
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
    scroll: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    contenido: {
        width: '100%',
        maxWidth: 700,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: '#fafafa',
        fontSize: 16,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    botonesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 10,
    },
    botonConsultar: {
        backgroundColor: '#CED9EF',
        borderColor: '#0500FF',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    botonReiniciar: {
        backgroundColor: '#DADADA',
        borderColor: '#000000',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
    },
    textoBoton: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    grilla: {
        marginTop: 20,
        width: '100%',
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
    celda: {
        flex: 1,
        textAlign: 'center',
    },
    filtrosContainer: {
        marginBottom: 10,
        gap: 10,
    },
    pickerContainer: {
        marginBottom: 5,
        borderRadius: 5,
        padding: 5,
    },
    pickerLabel: {
        fontWeight: 'bold',
        marginBottom: 2,
        color: '#333',
    },
    picker: {
        borderColor: '#ccc',
        backgroundColor: '#fff',
        borderRadius: 5,
        height: 40,
    },
});