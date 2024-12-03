import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, ScrollView, Platform,Alert } from 'react-native';
import React, {useState,useEffect} from "react";
import { Picker } from '@react-native-picker/picker';
import bg from '../../assets/bg1.jpg';
import { obtenerCurso } from '../../scripts/secretaria/scriptGestionAlumno.js';
import { obtenerAlumnoCurso, obtenerSolicitante } from '../../scripts/preceptor/scriptGestionarObservacion.js';
import { registrarAmonestacion,mostrarMensaje,imprimirArchivo,obtenerCantidadAmonestaciones } from '../../scripts/preceptor/scriptGestionAmonestacion.js';

export default function GestionarAmonestaciones() {

    //Formulario
    const [formData, setFormData] = useState({
        dnialumno: '',
        idsolicitante: '',
        cantidad: '',
        fecha: '',
        motivo: ''
    });

    //
    const validarCampos = () => {
        return formData.dnialumno && 
            formData.idsolicitante && 
            formData.cantidad.length >= 1 && 
            formData.fecha.length >= 10 && 
            formData.motivo.length >= 3 &&
            formData.idcurso; 
    };

    // Listas desplegables
    const [cursos, setCursos] = useState([]);
    const [solicitantes, setSolicitante] = useState([]);
    const [alumnos, setAlumnos] = useState([]);
    const [totalAmonestaciones, setTotalAmonestaciones] = useState('0');

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
            if (formData.idcurso) {
                try {
                    const alumnosData = await obtenerAlumnoCurso(formData.idcurso);
                    setAlumnos(alumnosData);
                } catch (error) {
                    console.error('Error al cargar alumnos:', error);
                }
            }
        };
        cargarAlumnos();
    }, [formData.idcurso]); // Solo se ejecuta cuando cambia el curso

    //Cargamos la cantidad de amonestaciones de acuerdo al dni
    useEffect(() => {
        const cargarAmonestacion = async () => {
            if (formData.dnialumno) {
                try {
                    const total = await obtenerCantidadAmonestaciones(formData.dnialumno);
                    // Aseguramos que total sea un número antes de convertirlo a string
                    setTotalAmonestaciones(total ? total.toString() : "0");
                } catch (error) {
                    console.error('Error al obtener total de amonestaciones:', error);
                    setTotalAmonestaciones("0");
                }
            }
        };
        cargarAmonestacion();
    }, [formData.dnialumno]);

    //Registramos la observación
    const handleRegistrar = async () => {
        try {
            // Crear el objeto alumnoData, omitiendo campos no obligatorios
            const alumnoData = {
                dnialumno: parseInt(formData.dnialumno),
                idsolicitante: parseInt(formData.idsolicitante),
                cantidad: parseInt(formData.cantidad),
                fecha: formData.fecha,
                motivo: formData.motivo
            }

            // Validar que todos los campos estén completos
            if (!alumnoData.dnialumno || !alumnoData.idsolicitante || !alumnoData.fecha || !alumnoData.motivo || !alumnoData.cantidad) {
                await mostrarMensaje('Error', 'Por favor complete todos los campos');
                return;
            }
            console.log('Datos de la amonesatción', alumnoData); 
            
            const respuesta = await registrarAmonestacion(alumnoData);
            await mostrarMensaje('¡Éxito!', 'La amonestación se registró correctamente');
            console.log('Amonestación Registrado:', respuesta)
            
            setFormData({
                dnialumno: '',
                cantidad: '',
                idsolicitante: '',
                fecha: '',
                motivo: ''
            });
            setTotalAmonestaciones('0'); 
            
        } catch (error) {
            console.error('Error al registrar la amonestación:', error.message);
            await mostrarMensaje('Error', 'No se pudo registrar la amonestación');
        }
    }

    const limpiarInterfaz = () => {
        setFormData({
            dnialumno: '',
            idsolicitante: '',
            cantidad: '',
            fecha: '',
            motivo: '',
        });
        setTotalAmonestaciones('0'); 
    };

    const handleImprimir = async () => {
        try {
        
            const alumnoSeleccionado = alumnos.find(a => parseInt(a.dnialumno) === parseInt(formData.dnialumno));
            const solicitanteSeleccionado = solicitantes.find(s => parseInt(s.idsolicitante) === parseInt(formData.idsolicitante));

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

    const Content = (
        <View style={styles.contenido}>
            <PickerField 
                label="Curso"
                style={styles.lista}
                selectedValue={formData.idcurso} 
                onValueChange={(value) => handleChange('idcurso', value)} 
                items={[
                    { label: 'Seleccione el curso', value: '' },
                    ...cursos.map(curso => ({ label: curso.detalle, value: curso.idcurso, key: curso.idcurso })) 
                ]} 
            />

            <Text style={styles.label}>Fecha:</Text>
            <TextInput 
                style={styles.input} 
                placeholder="AAAA-MM-DD" 
                keyboardType="number-pad" 
                value={formData.fecha}  
                onChangeText={(value) => handleChange('fecha',value)}
            />

            <PickerField 
                label="Alumno"
                style={styles.lista}
                selectedValue={formData.dnialumno} 
                onValueChange={(value) => handleChange('dnialumno', value)} 
                items={[
                    { label: 'Seleccione el alumno', value: '' },
                    ...alumnos.map(alumno => ({ label: alumno.nombrecompleto, value: parseInt(alumno.dnialumno), key: alumno.dnialumno }))
                ]} 
            />

            <PickerField 
                label="Solicitado Por"
                style={styles.lista}
                selectedValue={formData.idsolicitante} 
                onValueChange={(value) => handleChange('idsolicitante', value)} 
                items={[
                    { label: 'Seleccione el solicitante', value: '' },
                    ...solicitantes.map(solicitante => ({ label: solicitante.nombre_apellido, value: solicitante.idsolicitante, key: solicitante.idsolicitante })) 
                ]} 
            />

            <Text style={styles.label}>Cantidad:</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Cantidad de amonestación del dia" 
                value={formData.cantidad}  
                onChangeText={(value) => handleChange('cantidad',value)}
            />

            <Text style={styles.label}>Cantidad de amonestaciones totales:</Text>
            <TextInput style={styles.input} placeholder="x" keyboardType="numeric" editable={false} value={totalAmonestaciones}/>

            <Text style={styles.label}>Motivo:</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Motivo de las observaciones" 
                value={formData.motivo}  
                onChangeText={(value) => handleChange('motivo',value)}
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
        width: '90%',
        maxWidth: 500,
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
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
    },
    botonesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    
        marginTop: 20,
        marginBottom: 60,
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
