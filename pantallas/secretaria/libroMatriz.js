import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList, TextInput,Alert } from 'react-native';
import React, { useState, useEffect } from "react";
import bg from '../../assets/bg1.jpg';
import { obtenerLibroMatriz, obtenerLetra } from '../../scripts/secretaria/scriptLibroMatriz';

export default function LibroMatriz() {
    const [datos, setDatos] = useState([]);
    const [añoActual, setAñoActual] = useState(6);
    
    const [formData, setFormData] = useState({
        dnialumno: '',
        idcurso: '',
        idmateria: '',
        idestadoevaluativo: '',
        promedio: '',
    });

    const cambiarAño = (cambio) => {
        setAñoActual(prevAño => Math.min(6, Math.max(1, prevAño + cambio)));
    };

    const handleConsultar = async () => {
    try {
        const alumno = await obtenerLibroMatriz(formData.dnialumno);
        console.log('Alumno consultado:', alumno);

        if (alumno && alumno.length > 0) {
            setFormData({
                ...formData,
                dnialumno: parseInt(alumno[0].dnialumno), 
                idestadoevaluativo: alumno[0].idestadoevaluativo || '',
                idmateria: alumno[0].idmateria || '',
                promedio: alumno[0].promedio || '',
            });

            setDatos(alumno);
            setAñoActual(alumno[0].idcurso); // Asume que el año está en el primer registro
        } else {
            Alert.alert('Error', 'Alumno no encontrado');
        }
    } catch (error) {
        console.error('Error al consultar alumno:', error.message);
        Alert.alert('Error', error.message);
    }
};

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
    const datosFiltrados = datos.filter(item => item.idcurso === añoActual);
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
                        value={formData.dnialumno}
                        onChangeText={(text) => setFormData({...formData, dnialumno: text})}
                    />
                </View>
                
                <View style={styles.contenidoBoton}>
                    <TouchableOpacity style={styles.botonConsultar} onPress={handleConsultar}>
                        <Text style={styles.textoBoton}>Consultar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botonImprimir}>
                        <Text style={styles.imprimir}>Imprimir</Text>
                    </TouchableOpacity>
                </View>
            </View>
    
            {/* Grilla */}
            {datos.length > 0 && (
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
                        keyExtractor={(item) => item.dnialumno.toString()}
                    />
                    <View style={styles.contenedorBotonesAño}>
                        <TouchableOpacity 
                            style={[styles.botonAño, añoActual <= 1 && styles.botonDeshabilitado]} 
                            onPress={() => cambiarAño(-1)} 
                            disabled={añoActual <= 1}>
                            <Text style={styles.textoBotonAño}>{"<"}</Text>
                        </TouchableOpacity>
                        <Text style={styles.textoAño}>{añoActual} Curso</Text>
                        <TouchableOpacity 
                            style={[styles.botonAño, añoActual >= 6 && styles.botonDeshabilitado]} 
                            onPress={() => cambiarAño(1)} 
                            disabled={añoActual >= 6}>
                            <Text style={styles.textoBotonAño}>{">"}</Text>
                        </TouchableOpacity>
                    </View>
                    
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
    textoAño: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    botonDeshabilitado: {
        backgroundColor: '#D3D3D3', // Color para el botón deshabilitado
        borderColor: '#A9A9A9', // Color del borde para el botón deshabilitado
    },
});
