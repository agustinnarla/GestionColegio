import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState,useEffect } from "react";
import bg from '../../assets/bg1.jpg';
import { obtenerCurso } from '../../scripts/secretaria/scriptGestionAlumno';
import { obtenerEtapasEvaluativas, obtenerMateria } from '../../scripts/secretaria/scriptCargarNotas';

export default function CargarNotas() {
    
     //Formulario
    const [formData, setFormData] = useState({
        dnialumno: '',
        idmateria: '',
        idetapas: '',
        nota1: '',
        nota2: '',
        nota3: '',
        nota4: '',
        nota5: '',
        nota6: ''
    });
    
    const [curso,setCursos] = useState([]);
    const [etapaEscolar, setEtapaEscolar] = useState([]);
    const [materias,setMaterias] = useState([]);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const cursosData = await obtenerCurso();
                const etapaEscolarData = await obtenerEtapasEvaluativas();
                const materiasData = await obtenerMateria();
                setCursos(cursosData);
                setEtapaEscolar(etapaEscolarData);
                setMaterias(materiasData);
            } catch (error) {
                Alert.alert('Error', error.message);
            }
        };
        cargarDatos();
    }, []);

      //Ver reutilización
    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    //Ver reutilización
    const PickerField = React.memo(({ label, selectedValue, onValueChange, items }) => {
        return (
            <>
                <Text style={styles.label}>{label}</Text>
                <Picker
                    style={styles.input}
                    selectedValue={selectedValue}
                    onValueChange={onValueChange}
                >
                    {items.length > 0 ? (
                        items.map((item) => (
                            <Picker.Item key={item.key || item.value} label={item.label} value={item.value} />
                        ))
                    ) : (
                        <Picker.Item label="Cargando..." value="" />
                    )}
                </Picker>
            </>
        );
    });

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg} />
            
            <View style={styles.contenido}>
                <View style={styles.filtroContainer}>
                    <PickerField 
                    label="Curso"
                    style={styles.lista}
                    selectedValue={formData.idcurso} 
                    onValueChange={(value) => handleChange('idcurso', value)} 
                    items={[
                        { label: 'Seleccione el curso', value: '' },
                        ...curso.map(curso => ({ label: curso.detalle, value: curso.idcurso, key: curso.idcurso })) 
                    ]} 
                    />
                </View>
                
                <View style={styles.filtroContainer}>
                    <PickerField 
                        label="Etapas evaluativa"
                        style={styles.lista}
                        selectedValue={formData.idetapas} 
                        onValueChange={(value) => handleChange('idetapas', value)} 
                        items={[
                            { label: 'Seleccione una etapa', value: '' },
                            ...etapaEscolar.map(etapa => ({ label: etapa.detalle, value: etapa.idetapas, key: etapa.idetapas })) 
                        ]} 
                    />
                </View>

                <View style={styles.materia}>
                    <PickerField 
                        label="Materias"
                        style={styles.lista}
                        selectedValue={formData.idmateria} 
                        onValueChange={(value) => handleChange('idmateria', value)} 
                        items={[
                            { label: 'Seleccione una materia', value: '' },
                            ...materias.map(materia => ({ label: materia.detalle, value: materia.idmateria, key: materia.idmateria })) 
                        ]} 
                    />
                </View>
                
                <TouchableOpacity style={styles.botonConsultar} >
                    <Text style={styles.textoBoton}>Consultar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.botonReiniciar} >
                    <Text style={styles.textoBoton}>Reiniciar Filtro</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botonReiniciar} >
                    <Text style={styles.textoBoton}>📁</Text>
                </TouchableOpacity>
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
    curso: {
        height: 50,
        width: 300, 
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
    },
    etapa: {
        height: 50,
        width: 200,
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
    },
    materia: {
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
    notasContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flex: 1,
    },
    inputNota: {
        width: 50,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        textAlign: 'center',
        marginHorizontal: 5,
    },
    promedioText: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    lista: {
        width: '100%',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
    },
});
