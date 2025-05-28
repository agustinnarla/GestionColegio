import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { obtenerMateriaPorProfesor, obtenerProfesor } from '../../scripts/listasDesplegables/listaDesplegable.js'
import ListasDesplegables from '../../componente/ListasDesplegables';
import React, { useEffect, useState } from "react";
import bg from '../../assets/bg1.jpg';

export default function ConsultarLibro() {
    const [datos, setDatos] = useState([]);
    const [materia, setMateria] = useState([])
    const [profesores, setProfesores] = useState([])

    const [formData, setFormData] = useState({
        id_materia: '',
        dni_profesional:''
    })

    useEffect(() => {
            const cargarDatos = async () => {
                try {
                    const profesoresData = await obtenerProfesor();
                    const materiaData = await obtenerMateriaPorProfesor(formData.dni_profesional);
                    setProfesores(profesoresData)
                    setMateria(materiaData.materia || []);
                    //setSolicitante(solicitanteData);
                } catch (error) {
                    Alert.alert('Error', error.message);
                }
            };
            cargarDatos();
        }, []);

    const reiniciarFiltro = () => {
        setDatos([]);
    };

     // Manejar cambios en el formulario
    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const renderItem = ({ item }) => (
        <View style={styles.fila}>
            <Text style={styles.celda}>{item.materia}</Text>
            <Text style={styles.celda}>{item.nombre}</Text>
            <Text style={styles.celda}>{item.categoria}</Text>
            <Text style={styles.celda}>{item.queSeDio}</Text>
        </View>
    );


    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg} />
            
            <View style={styles.contenido}>
                <View style={styles.filtroContainer}>
                    <ListasDesplegables 
                        formData={formData} 
                        handleChange={handleChange} 
                        materias={materia} 
                        profesores={profesores}
                        styles={styles}
                    />
                </View>
                
                
                <TouchableOpacity style={styles.botonConsultar} >
                    <Text style={styles.textoBoton}>Consultar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.botonReiniciar} onPress={reiniciarFiltro}>
                    <Text style={styles.textoBoton}>Reiniciar Filtro</Text>
                </TouchableOpacity>
            </View>
            
            {/* Grilla */}
            {datos.length > 0 && (
                <View style={styles.grilla}>
                    <View style={styles.encabezado}>
                        <Text style={styles.celdaEncabezado}>Materia</Text>
                        <Text style={styles.celdaEncabezado}>Nombre</Text>
                        <Text style={styles.celdaEncabezado}>Categoría</Text>
                        <Text style={styles.celdaEncabezado}>Qué se dio</Text>
                    </View>
                    <FlatList
                        data={datos}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    />
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
        justifyContent: 'space-around',  
        alignItems: 'center',
        marginTop: 20,
        width: '80%', 
        paddingHorizontal: 10,
    },
    filtroContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    materias: {
        height: 50,
        width: 300, 
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
    },
    profesores: {
        height: 50,
        width: 200,
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
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
    botonReiniciar: {
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
    celda: {
        flex: 1,
        textAlign: 'center',
    },
});
