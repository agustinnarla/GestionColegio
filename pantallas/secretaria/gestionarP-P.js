import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Picker, CheckBox } from 'react-native';
import bg from '../../assets/bg1.jpg';

export default function GestionarAlumno() {
    const [viveEnDepto, setViveEnDepto] = useState(false); // Estado para la checkbox
    const [piso, setPiso] = useState('');
    const [depto, setDepto] = useState('');

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg}></Image>
            <View style={styles.formulario}>
                <View style={styles.dniContainer}>
                    <Text style={styles.label}>DNI:</Text>
                    <TextInput style={styles.inputDni} placeholder='DNI' />
                    <TouchableOpacity style={styles.consultarButton}>
                        <Text style={styles.consultarText}>Consultar</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.fila}>
                    {/* Primera columna */}
                    <View style={styles.columna}>
                        <Text style={styles.label}>Nombre:</Text>
                        <TextInput style={styles.input} placeholder='Nombre' />
                        <Text style={styles.label}>Apellido:</Text>
                        <TextInput style={styles.input} placeholder='Apellido' />
                        <Text style={styles.label}>Correo:</Text>
                        <TextInput style={styles.input} placeholder='Correo' />
                        <Text style={styles.label}>Fecha de Nacimiento:</Text>
                        <TextInput style={styles.input} placeholder='--/--/----' />
                        <Text style={styles.label}>CUIT:</Text>
                        <TextInput style={styles.input} placeholder='CUIT' />
                        <Text style={styles.label}>Rol:</Text>
                        <Picker style={styles.input}>
                            <Picker.Item label='Selecciona un rol' value='' />
                            <Picker.Item label='Profesor' value='profesor' />
                            <Picker.Item label='Preceptor' value='preceptor' />
                        </Picker>
                        <Text style={styles.label}>Sexo:</Text>
                        <Picker style={styles.input}>
                            <Picker.Item label='Selecciona el sexo' value='' />
                            <Picker.Item label='Masculino' value='m' />
                            <Picker.Item label='Femenino' value='f' />
                        </Picker>
                    </View>

                    {/* Segunda columna */}
                    <View style={styles.columna}>
                        <Text style={styles.label}>País:</Text>
                        <Picker style={styles.input}>
                            <Picker.Item label='Seleccione el país' value='' />
                            <Picker.Item label='Argentina' value='Arg' />
                            <Picker.Item label='Brasil' value='B' />
                        </Picker>
                        <Text style={styles.label}>Localidad:</Text>
                        <Picker style={styles.input}>
                            <Picker.Item label='Seleccione la localidad' value='' />
                            <Picker.Item label='Córdoba' value='Cba' />
                            <Picker.Item label='Brasil' value='Br' />
                        </Picker>
                        <Text style={styles.label}>Domicilio:</Text>
                        <TextInput style={styles.input} placeholder='Domicilio' />
                        <Text style={styles.label}>Número:</Text>
                        <TextInput style={styles.input} placeholder='Número' />

                        <View style={styles.checkboxContainer}>
                            <Text style={styles.label}>¿Vives en un departamento?</Text>
                            <CheckBox
                                value={viveEnDepto}
                                onValueChange={setViveEnDepto}
                                style={styles.check}
                            />
                        </View>

                        {/* Inputs adicionales si vive en un departamento */}
                        {viveEnDepto && (
                            <>
                                <Text style={styles.label}>Piso:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder='Piso'
                                    value={piso}
                                    onChangeText={setPiso}
                                />
                                <Text style={styles.label}>Departamento:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder='Departamento'
                                    value={depto}
                                    onChangeText={setDepto}
                                />
                            </>
                        )}
                    </View>

                    {/* Tercera columna */}
                    <View style={styles.columna}>
                        <Text style={styles.label}>Teléfono Personal:</Text>
                        <TextInput style={styles.input} placeholder='Teléfono Personal' />
                        <Text style={styles.label}>Teléfono Alternativo:</Text>
                        <TextInput style={styles.input} placeholder='Teléfono Alternativo' />
                        <Text style={styles.label}>N° de Legajo:</Text>
                        <TextInput style={styles.input} placeholder='Teléfono Padre/Tutor' />
                        <Text style={styles.label}>Fecha apto:</Text>
                        <TextInput style={styles.input} placeholder='--/--/----' />
                        <Text style={styles.label}>Otorgado por:</Text>
                        <TextInput style={styles.input} placeholder='Otorgado por' />
                    </View>
                </View>
            </View>

            <View style={styles.contenidoBotones}>
                <TouchableOpacity style={styles.botonAlta}><Text style={styles.textoBoton}>Alta</Text></TouchableOpacity>
                <TouchableOpacity style={styles.botonBaja}><Text style={styles.textoBoton}>Baja</Text></TouchableOpacity>
                <TouchableOpacity style={styles.botonModificar}><Text style={styles.textoBoton}>Modificar</Text></TouchableOpacity>
                <TouchableOpacity style={styles.botonLimpiar}><Text style={styles.textoBoton}>Limpiar</Text></TouchableOpacity>
            </View>
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
    formulario: {
        width: '90%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    dniContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10, 
    },
    consultarButton: {
        backgroundColor: '#CED9EF',
        borderColor: '#746BC8',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginLeft:10
    },
    consultarText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
    fila: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    columna: {
        flex: 1,
        marginRight: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    inputDni: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
        width: 200,
        marginLeft:10
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    check:{
        marginLeft:10
    },
    contenidoBotones: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '50%',
    },
    botonAlta:{
        backgroundColor: '#CFEFCE',
        borderColor: '#33FF00',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
    },
    botonBaja:{
        backgroundColor: '#F3B9B9',
        borderColor: '#FF0000',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        flex: 1,
        marginLeft: 10,
        marginRight:10
    },
    botonModificar:{
        backgroundColor: '#CED9EF',
        borderColor: '#746BC8',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
    },
    botonLimpiar:{
        backgroundColor: '#DADADA',
        borderColor: '#000000',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        flex: 1,
    },
    textoBoton:{
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    }
    
});
