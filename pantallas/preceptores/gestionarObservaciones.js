
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import bg from '../../assets/bg1.jpg';
import { obtenerCurso } from '../../scripts/secretaria/scriptGestionAlumno.js';
import { obtenerAlumnoCurso, obtenerSolicitante, registrarObservacion,mostrarMensaje, imprimirArchivo } from '../../scripts/preceptor/scriptGestionarObservacion.js';

export default function GestionarObservaciones() {
    // Formulario
    const [formData, setFormData] = useState({
        dni_alumno: '',
        id_solicitante: '',
        fecha: '',
        motivo: '',
        id_curso: ''
    });

    // Listas desplegables
    const [cursos, setCursos] = useState([]);
    const [solicitantes, setSolicitante] = useState([]);
    const [alumnos, setAlumnos] = useState([]);

    // Validamos que los datos tengan contenido
    const validarCampos = () => {
        return formData.dni_alumno && 
            formData.id_solicitante && 
            formData.fecha.length >= 10 && 
            formData.motivo.length >= 3 &&
            formData.id_curso; 
    };

    // Metodo para limpiar la interfaz al apretar el boton cancelar o registrar
    const limpiarInterfaz = () => {
        setFormData({
            dni_alumno: '',
            id_solicitante: '',
            fecha: '',
            motivo: '',
            id_curso: ''
        });
    };

    // RegistrarObservación()
    const handleRegistrar = async () => {
        try {
            const alumnoData = {
                dni_alumno: parseInt(formData.dni_alumno),
                id_solicitante: parseInt(formData.id_solicitante),
                fecha: formData.fecha,
                motivo: formData.motivo
            };

            if (!validarCampos()) {
                await mostrarMensaje('Error', 'Por favor complete todos los campos');
                return;
            }

            console.log('Datos de la observación', alumnoData); 
            
            const respuesta = await registrarObservacion(alumnoData);
            await mostrarMensaje('Observación registrada correctamente');
            console.log('Observación Registrada:', respuesta);
            
            limpiarInterfaz();
        } catch (error) {
            console.error('Error al registrar la observación:', error.message);
            await mostrarMensaje('Error', 'No se pudo registrar la observación');
        }
    };

    // ImprimirArchivo()
    const handleImprimir = async () => {
        try {
            const alumnoSeleccionado = alumnos.find(a => parseInt(a.dni_alumno) === parseInt(formData.dni_alumno));
            const solicitanteSeleccionado = solicitantes.find(s => parseInt(s.id_solicitante) === parseInt(formData.id_solicitante));

            const rutaPDF = await imprimirArchivo(formData, alumnoSeleccionado, solicitanteSeleccionado);
            await mostrarMensaje('Éxito', `PDF generado correctamente\nUbicación: ${rutaPDF}`);
            
            if (Platform.OS === 'web') {
                window.open(rutaPDF);
            }
        } catch (error) {
            console.error('Error al imprimir:', error);
            await mostrarMensaje('Error', 'No se pudo generar el PDF');
        }
    };

    // Cargar cursos y solicitantes
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const cursosData = await obtenerCurso();
                const solicitanteData = await obtenerSolicitante();
                setCursos(cursosData);
                setSolicitante(solicitanteData);
            } catch (error) {
                Alert.alert('Error', error.message);
            }
        };
        cargarDatos();
    }, []);

    // Cargar alumnos cuando se selecciona un curso
    useEffect(() => {
        const cargarAlumnos = async () => {
            if (formData.id_curso) {
                try {
                    const alumnosData = await obtenerAlumnoCurso(formData.id_curso);
                    setAlumnos(alumnosData);
                } catch (error) {
                    console.error('Error al cargar alumnos:', error);
                }
            }
        };
        cargarAlumnos();
    }, [formData.id_curso]);

    // Manejar cambios en el formulario
    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    // Componente reutilizable para Picker
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

    const Content = (
        <View style={styles.contenido}>
            <PickerField 
                label="Curso"
                selectedValue={formData.id_curso} 
                onValueChange={(value) => handleChange('id_curso', value)} 
                items={[
                    { label: 'Seleccione el curso', value: '' },
                    ...cursos.map(curso => ({ label: curso.detalle, value: curso.id_curso, key: curso.id_curso})) 
                ]} 
            />

            <Text style={styles.label}>Fecha:</Text>
            <TextInput 
                style={styles.input} 
                placeholder="AAAA-MM-DD" 
                keyboardType="number-pad" 
                value={formData.fecha}  
                onChangeText={(value) => handleChange('fecha', value)}
            />
           <PickerField 
                label="Alumno"
                selectedValue={formData.dni_alumno} 
                onValueChange={(value) => handleChange('dni_alumno', value)} 
                items={[
                    { label: 'Seleccione el alumno', value: '' },
                    ...alumnos.map(alumno => ({ label: alumno.nombrecompleto, value: parseInt(alumno.dni_alumno), key: alumno.dni_alumno }))
                ]} 
            />

            <PickerField 
                label="Solicitado Por"
                selectedValue={formData.id_solicitante} 
                onValueChange={(value) => handleChange('id_solicitante', value)} 
                items={[
                    { label: 'Seleccione el solicitante', value: '' },
                    ...solicitantes.map(solicitante => ({ label: solicitante.nombre_apellido, value: solicitante.id_solicitante, key: solicitante.id_solicitante })) 
                ]} 
            />

            <Text style={styles.label}>Motivo:</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Motivo de las observaciones" 
                value={formData.motivo}  
                onChangeText={(value) => handleChange('motivo', value)}
            />
            <View style={styles.botonesContainer}>
                <TouchableOpacity style={[styles.botonRegistrar, !validarCampos() && styles.botonDeshabilitado]} onPress={handleRegistrar}>
                    <Text style={styles.textoBoton}>Registrar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botonCancelar} onPress={limpiarInterfaz}>
                    <Text style={styles.textoBoton}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.botonImprimir, !validarCampos() && styles.botonDeshabilitado]} onPress={handleImprimir} disabled={!validarCampos()}>
                    <Text style={styles.textoBoton}>Imprimir</Text>
                </TouchableOpacity>
            </View>
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
    scroll:{
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
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
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
    lista: {
        width: '100%',
        marginBottom: 30,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
    },
    botonesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    botonRegistrar: {
        backgroundColor: '#CFEFCE',
        borderColor: '#33FF00',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
    },
    botonCancelar: {
        backgroundColor: '#F3B9B9',
        borderColor: '#FF0000',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 1,
    },
    botonImprimir:{
        flex: 1,
        backgroundColor: '#CED9EF',
        paddingVertical: 12, 
        paddingHorizontal: 20,
        borderRadius: 5,
        borderColor: '#0500FF',
        borderWidth: 0.4,
        marginRight: 15,
        marginLeft: 15,
        alignItems: 'center',
    },
    textoBoton: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    botonDeshabilitado: {
        opacity: 0.5,
        backgroundColor: '#cccccc',
        borderColor: '#999999',
    },
});
