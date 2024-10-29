import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList, TextInput } from 'react-native';
import React, { useState } from "react";
import bg from '../../assets/bg1.jpg';

export default function LibroMatriz() {
    const [datos, setDatos] = useState([]);
    const [añoActual, setAñoActual] = useState(6); // Cambiar a número

    const consultarDatos = () => {
        try {
            const datosSimulados = [
                { id: '1', materia: 'Biología', condicion: 'Regular', letra: 'nueve', n: '9', m: '11', a: '24', establecimiento: 'Este establecimiento'},
                { id: '2', materia: 'Química', condicion: 'Regular', letra: 'seis', n: '6', m: '11', a: '24', establecimiento: 'Este establecimiento'},
            ];
            setDatos(datosSimulados);
        } catch (error) {
            console.error("Error al consultar datos:", error);
            // Manejo de errores (puedes mostrar un mensaje al usuario)
        }
    };

    const cambiarAño = (cambio) => {
        const nuevoAño = añoActual + cambio; // Sumar o restar correctamente
        setAñoActual(nuevoAño);
        consultarDatos(); 
    
    };

    const renderItem = ({ item }) => (
        <View style={styles.fila}>
            <Text style={styles.celda}>{item.materia}</Text>
            <Text style={styles.celda}>{item.condicion}</Text>
            <Text style={styles.celda}>{item.letra}</Text>
            <Text style={styles.celda}>{item.n}</Text>
            <Text style={styles.celda}>{item.m}</Text>
            <Text style={styles.celda}>{item.a}</Text>
            <Text style={styles.celda}>{item.establecimiento}</Text>
        </View>
    );

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
                    />
                </View>
                
                <View style={styles.contenidoBoton}>
                    <TouchableOpacity style={styles.botonConsultar} onPress={consultarDatos}>
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
                        <Text style={styles.celdaEncabezado}>Letra</Text>
                        <Text style={styles.celdaEncabezado}>N°</Text>
                        <Text style={styles.celdaEncabezado}>M</Text>
                        <Text style={styles.celdaEncabezado}>A</Text>
                        <Text style={styles.celdaEncabezado}>Establecimiento</Text>
                    </View>
                    <FlatList
                        data={datos}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    />
                     <View style={styles.contenedorBotonesAño}>
                        <TouchableOpacity 
                            style={[styles.botonAño, añoActual <= 1 && styles.botonDeshabilitado]} 
                            onPress={() => cambiarAño(-1)} 
                            disabled={añoActual <= 1} // Deshabilitar si el año es 1
                        >
                            <Text style={styles.textoBotonAño}>{"<"}</Text>
                        </TouchableOpacity>
                        <Text style={styles.textoAño}>{añoActual} año</Text>
                        <TouchableOpacity 
                            style={[styles.botonAño, añoActual >= 6 && styles.botonDeshabilitado]} 
                            onPress={() => cambiarAño(1)} 
                            disabled={añoActual >= 6} // Deshabilitar si el año es 6
                        >
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
