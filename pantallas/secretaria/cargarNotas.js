import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList, TextInput,Alert,ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState,useEffect } from "react";
import bg from '../../assets/bg1.jpg';
import { obtenerCurso } from '../../scripts/secretaria/scriptGestionAlumno';
import { obtenerAlumnoPorCurso, obtenerEtapasEvaluativas, obtenerMateria, obtenerNotas } from '../../scripts/secretaria/scriptCargarNotas';



export default function CargarNotas() {
    
     //Formulario
    const [formData, setFormData] = useState({
        dnialumno: '',
        idmateria: '',
        idcurso:'',
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
    const [alumnos, setAlumnos] = useState([]); 

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

    // Cargar alumnos cuando se selecciona un curso y materia 
    const cargarAlumnos = async () => {
        if (formData.idcurso && formData.idmateria) {  
            try {
                const alumnosData = await obtenerNotas(formData.idcurso, formData.idmateria);
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

    const handleNotaChange = (dnialumno, campo, valor) => {
        // Validar que el valor sea un número entre 0 y 10
        if (valor === '' || (parseInt(valor) >= 0 && parseInt(valor) <= 10)) {
            setAlumnos(prevAlumnos => 
                prevAlumnos.map(alumno => 
                    alumno.dnialumno === dnialumno 
                        ? { ...alumno, [campo]: valor }
                        : alumno
                )
            );
        }
    };

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
            
                <View style={styles.contenedorSuperior}>
                    <View style={styles.filtrosContainer}>
                    <PickerField 
                    label="Curso"
                    style={styles.picker}
                    selectedValue={formData.idcurso} 
                    onValueChange={(value) => handleChange('idcurso', value)} 
                    items={[
                        { label: 'Seleccione el curso', value: '' },
                        ...curso.map(curso => ({ label: curso.detalle, value: curso.idcurso, key: curso.idcurso })) 
                    ]} 
                    />
                
                    <PickerField 
                        label="Etapas evaluativa"
                        style={styles.picker}
                        selectedValue={formData.idetapas} 
                        onValueChange={(value) => handleChange('idetapas', value)} 
                        items={[
                            { label: 'Seleccione una etapa', value: '' },
                            ...etapaEscolar.map(etapa => ({ label: etapa.detalle, value: etapa.idetapas, key: etapa.idetapas })) 
                        ]} />

                    <PickerField 
                        label="Materias"
                        style={styles.picker}
                        selectedValue={formData.idmateria} 
                        onValueChange={(value) => handleChange('idmateria', value)} 
                        items={[
                            { label: 'Seleccione una materia', value: '' },
                            ...materias.map(materia => ({ label: materia.detalle, value: materia.idmateria, key: materia.idmateria })) 
                        ]} 
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
        <ScrollView style={styles.scrollView}>
            {alumnos.map((item) => (
                <View key={item.dnialumno} style={styles.row}>
                    <Text style={styles.cellNombre}>{item.nombre_completo}</Text>
                    {[1,2,3,4,5,6].map((num) => (
                        <TextInput 
                            key={num}
                            style={styles.inputNota}
                            value={item[`nota${num}`]?.toString()}
                            inputMode="numeric"
                            maxLength={2}
                            onChangeText={(text) => handleNotaChange(item.dnialumno, `nota${num}`, text)}
                        />
                    ))}
                </View>
            ))}
        </ScrollView>
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
        padding: 20,
        backgroundColor: 'white',
        overflowY: 'auto',
        height: '70vh',
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        position: 'sticky',
        top: 0,
        zIndex: 1,
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
        width: '100%',
    }
});
