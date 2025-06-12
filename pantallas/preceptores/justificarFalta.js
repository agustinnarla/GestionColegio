import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, ScrollView, Platform, Alert, ImageBackground} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { obtenerAlumnosAusentes, actualizarJustificarFalta, obtenerEstadoAlumnos, obtenerAlumnosConFaltasSuperadas, actualizarEstadoAlumno} from '../../scripts/preceptor/scriptGestionJustificarFalta';
import { CertificadoSelector, EstadoFaltaAlumnosSelector} from '../../componente/ListasDesplegables';
import { obtenerCertificado ,obtenerEstadoFalta} from '../../scripts/listasDesplegables/listaDesplegable';
import React, {useState, useEffect} from "react";
import bg from '../../assets/bg1.jpg';
import ScrollContainer from '../../componente/ScrollContainer';



export default function JustificarFalta() {

    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [estadoFalta, setEstadoFalta] = useState([]);
    const [certificado, setCertificado] = useState([]);
    const [estadoFaltaSeleccionado, setEstadoFaltaSeleccionado] = useState(null); // o el valor inicial que prefieras
    const [certificadoSeleccionado, setCertificadoSeleccionado] = useState(null);
    const [estadoFaltaPorAlumno, setEstadoFaltaPorAlumno] = useState({});
    const [certificadoPorAlumno, setCertificadoPorAlumno] = useState({});
    const [faltasSuperadas, setFaltasSuperadas] = useState({});



    const [alumnos, setAlumnos] = useState([]); // Definimos el estado para almacenar los alumnos


    const validarYConvertirFechas = (fechaDesde, fechaHasta) => {
        // Función para convertir DD/MM/YYYY a YYYY-MM-DD
        const convertirFormatoFecha = (fecha) => {
            const [dia, mes, año] = fecha.split('/');
            return `${año}-${mes}-${dia}`;
        };
    
        // Convertir fechas al formato YYYY-MM-DD antes de validar
        const fechaDesdeConvertida = convertirFormatoFecha(fechaDesde);
        const fechaHastaConvertida = convertirFormatoFecha(fechaHasta);
    
        // Validar formato de las fechas (YYYY-MM-DD)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaDesdeConvertida) || !/^\d{4}-\d{2}-\d{2}$/.test(fechaHastaConvertida)) {
            return { valido: false, mensaje: "Las fechas deben estar en formato DD/MM/YYYY." };
        }
    
        // Comprobar si la fechaDesdeConvertida es mayor que la fechaHastaConvertida
        if (new Date(fechaDesdeConvertida) > new Date(fechaHastaConvertida)) {
            return { valido: false, mensaje: "La fecha 'Desde' no puede ser mayor que la fecha 'Hasta'." };
        }
    
        return { 
            valido: true, 
            mensaje: "Fechas válidas.", 
            fechas: {
                desde: fechaDesdeConvertida,
                hasta: fechaHastaConvertida
            }
        };
    };

    const obtenerAlumnosAusentesPorFecha = async () => {
        // Validar y convertir las fechas
        const resultado = validarYConvertirFechas(fechaDesde, fechaHasta);
    
        // Si las fechas no son válidas, mostrar el mensaje de error
        if (!resultado.valido) {
            console.log("Error:", resultado.mensaje);
            Alert.alert("Error", resultado.mensaje);  // Mostrar mensaje de error
            return;
        }
    
        // Si las fechas son válidas, se obtienen los datos
        const datosObtenidos = await obtenerAlumnosAusentes(resultado.fechas.desde, resultado.fechas.hasta);
        setAlumnos(datosObtenidos.alumnos);  // Accedemos a la propiedad 'alumnos' del objeto
    };
    

    useEffect(() => {
        console.log("Alumnos actualizados:", alumnos);
        cargarEstadoFalta();
        cargarCertificado();  // Deja esto, pero asegúrate de que esté esperando la respuesta si es necesario
    }, [alumnos ,estadoFaltaPorAlumno, certificadoPorAlumno]);
    
    useEffect(() => {
        obtenerDatosJustificacion();
    }, [fechaDesde, fechaHasta]);
    

    const convertirFecha = (fecha) => {
        const [año, mes, dia] = fecha.split('-');
        return `${dia}-${mes}-${año}`;
    };

    const cargarEstadoFalta = async () => {
        try {
            const datos = await obtenerEstadoFalta(); // Llama a la API para obtener los estados de falta
            console.log("Datos obtenidos de la API:", datos);
    
            if (Array.isArray(datos)) {
                setEstadoFalta(datos); // Guarda los datos en el estado
            } else {
                console.error("La respuesta no contiene un array válido:", datos);
                setEstadoFalta([]); // Asegúrate de que el estado sea un array vacío en caso de error
            }
        } catch (error) {
            console.error("Error al cargar los estados de falta:", error.message);
            setEstadoFalta([]); // En caso de error, inicializa como un array vacío
        }
    };

    const cargarCertificado = async () => {
        try {
            const certificado = await obtenerCertificado();
            setCertificado(certificado); // Guarda los datos en el estado
            console.log("Certificados actualizados:", certificado);
        } catch (error) {
            console.error("Error al cargar los certificados:", error.message);
        }
    };
    
    const actualizarSeleccionadoAlumno = (tipo, valor, dni_alumno) => {
        if (tipo === 'estadoFalta') {
            setEstadoFaltaPorAlumno(prevState => {
                const nuevoEstado = {
                    ...prevState,
                    [dni_alumno]: valor, // Actualiza solo el estado de falta del alumno correspondiente
                };
                console.log("Nuevo estadoFaltaPorAlumno:", nuevoEstado);
                return nuevoEstado;
            });
        } else if (tipo === 'certificado') {
            setCertificadoPorAlumno(prevState => {
                const nuevoEstado = {
                    ...prevState,
                    [dni_alumno]: valor, // Actualiza solo el certificado del alumno correspondiente
                };
                console.log("Nuevo certificadoPorAlumno:", nuevoEstado);
                return nuevoEstado;
            });
        }
    };

    

    const actualizarDatosEnBaseDeDatos = async (tipo, valor, dni_alumno, fecha) => {
        console.log("Datos para actualizar:", tipo, valor, dni_alumno, fecha);
    
        // Determina los valores basados en el tipo de cambio
        const id_estado_falta = tipo === 'estadoFalta' ? valor : estadoFaltaPorAlumno[dni_alumno] ?? null;
        const id_certificado = tipo === 'certificado' ? valor : certificadoPorAlumno[dni_alumno] ?? null;
    
        console.log("id_estado_falta:", id_estado_falta);
        console.log("id_certificado:", id_certificado);
    
        if (!id_estado_falta || !id_certificado) {
            console.log("Faltan datos para actualizar. Esperando selección...");
            return;
        }
    
        const datosForm = {
            id_estado_falta: id_estado_falta,
            dni_alumno: dni_alumno,
            id_certificado: id_certificado,
            fecha: fecha,
        };
    
        console.log("Datos a enviar:", datosForm);
    
        try {
            await actualizarJustificarFalta(datosForm);
            console.log("Datos actualizados correctamente");
    
            // Opcional: Verificar faltas superadas después de actualizar
            const datosFaltas = await obtenerDatosFaltasSuperadas();
            if (Array.isArray(datosFaltas) && datosFaltas.length > 0) {
                for (const dnialumnoFalta of datosFaltas) {
                    await actualizarEstadoAlumno(dnialumnoFalta);
                    console.log(`Estado actualizado para el alumno ${dnialumnoFalta}`);
                }
            }
        } catch (error) {
            console.error("Error al actualizar datos:", error);
        }
    };
    

    const obtenerDatosFaltasSuperadas = async () => {
        try {
            const response = await obtenerAlumnosConFaltasSuperadas();
            console.log("✅ Respuesta obtenida:", response);
    
            if (Array.isArray(response) && response.length > 0) {
                const dnialumnoArray = response.map((item) => item.dni_alumno);
                setFaltasSuperadas(dnialumnoArray); // Actualizamos el estado con el array
                return dnialumnoArray;
            } else {
                console.error("No se encontraron datos de faltas superadas.");
                return [];
            }
        } catch (error) {
            console.error("Error en la solicitud:", error.message);
            return [];
        }
    };
    
    const obtenerDatosJustificacion = async () => {
        if (!fechaDesde || !fechaHasta) return;
    
        const resultadoValidacion = validarYConvertirFechas(fechaDesde, fechaHasta);
    
        if (!resultadoValidacion.valido) {
            console.error(resultadoValidacion.mensaje);
            return;
        }
        try {
            const { desde, hasta } = resultadoValidacion.fechas;
            const response = await obtenerEstadoAlumnos(desde, hasta); 
    
            // Aquí response YA es un objeto JSON, no hace falta hacer response.json()
            console.log("Respuesta obtenida:", response);
    
            if (response.estadofalta) {
                const estadoMap = {};
                const certificadoMap = {};
    
                response.estadofalta.forEach((item) => {
                    estadoMap[item.dni_alumno] = item.id_estado_falta_alumnos;
                    certificadoMap[item.dni_alumno] = item.id_certificado;
                });
                setEstadoFaltaPorAlumno(estadoMap);
                setCertificadoPorAlumno(certificadoMap);
            } else {
                console.error("Error al obtener datos:", response.error);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };
    
    const handleConsultar = () => {
        const resultado = validarYConvertirFechas(fechaDesde, fechaHasta);
    
        if (!resultado.valido) {
            console.log("Error", resultado.mensaje);
            Alert.alert("Error", resultado.mensaje); // Mostrar mensaje de error
            return;
        }
    
        // Las fechas convertidas están disponibles en resultado.fechas
        const { desde, hasta } = resultado.fechas;
    
        Alert.alert("Éxito", "Las fechas son válidas.");
        console.log("Fecha Desde (convertida):", desde);
        console.log("Fecha Hasta (convertida):", hasta);
        obtenerAlumnosAusentesPorFecha();
    };
    

    return (
        <View style={styles.padre}>
            <ImageBackground source={bg} style={styles.bg}> 
                <ScrollView style={styles.scrollView}>
                    <View style={styles.contenido}>
                        <View style={styles.contenidoFecha}>
                            <View style={styles.filaInputs}>
                                <Text style={styles.label}>Fecha desde:</Text>
                                <TextInput
                                    placeholder="DD-MM-AAAA"
                                    style={Platform.OS === 'web' ? styles.inputPequeño : styles.input}
                                    value={fechaDesde}
                                    onChangeText={setFechaDesde}
                                />
                            </View>
                            <View style={styles.filaInputs}>
                                <Text style={styles.label}>Fecha hasta:</Text>
                                <TextInput
                                    placeholder="----/--/--"
                                    style={Platform.OS === 'web' ? styles.inputPequeño : styles.input}
                                    value={fechaHasta}
                                    onChangeText={setFechaHasta}
                                />
                            </View>
                            <TouchableOpacity style={styles.boton} onPress={handleConsultar}>
                                <Text style={styles.botonTexto}>Consultar</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{width: '100%'}}>
                            <View style={styles.tabla}>
                                <View style={styles.headerRow}>
                                    <Text style={styles.headerCellNombre}>Alumno</Text>
                                    <Text style={styles.headerCell}>DNI</Text>
                                    <Text style={styles.headerCell}>Fecha</Text>
                                    <Text style={styles.headerCell}>Estado de la Falta</Text>
                                    <Text style={styles.headerCell}>Certificado Médico</Text>
                                </View>
                                {Array.isArray(alumnos) && alumnos.length > 0 ? (
                                    alumnos.map((alumno, index) => (
                                        <View style={styles.fila} key={index}>
                                            <Text style={styles.celdaNombre}>{alumno.nombreapellido}</Text>
                                            <Text style={styles.celda}>{alumno.dni_alumno}</Text>
                                            <Text style={styles.celda}>{convertirFecha(alumno.fecha.slice(0, 10))}</Text>
                                            <View style={styles.celda}>
                                                <EstadoFaltaAlumnosSelector
                                                    formData={{
                                                        id_estado_falta: estadoFaltaPorAlumno[alumno.dni_alumno] ?? "",
                                                    }}
                                                    handleChange={(field, value) => {
                                                        actualizarSeleccionadoAlumno('estadoFalta', value, alumno.dni_alumno);
                                                        actualizarDatosEnBaseDeDatos('estadoFalta', value, alumno.dni_alumno, alumno.fecha);
                                                    }}
                                                    estadoFalta={estadoFalta || []}
                                                    styles={styles.celda}
                                                />
                                            </View>
                                            <View style={styles.celda}>
                                                <CertificadoSelector
                                                    formData={{
                                                        id_certificado: certificadoPorAlumno[alumno.dni_alumno] ?? "",
                                                    }}
                                                    handleChange={(field, value) => {
                                                        actualizarSeleccionadoAlumno('certificado', value, alumno.dni_alumno);
                                                        actualizarDatosEnBaseDeDatos('certificado', value, alumno.dni_alumno, alumno.fecha);
                                                    }}
                                                    certificado={certificado || []}
                                                    styles={styles.celda}
                                                />
                                            </View>
                                        </View>
                                    ))
                                ) : (
                                    <View style={styles.fila}>
                                        <Text style={styles.celdaNombre}>Sin datos</Text>
                                        <Text style={styles.celda}></Text>
                                        <Text style={styles.celda}></Text>
                                        <Text style={styles.celda}></Text>
                                        <Text style={styles.celda}></Text>
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                    </View>
                </ScrollView>
            </ImageBackground>
        </View>
    );
}


const styles = StyleSheet.create({
    padre: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    bg: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: -1,
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },
    contenido: {
        width: '95%',
        maxWidth: 1200,
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
        marginTop: 36,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#e1e8ed',
        alignSelf: 'center',
    },
    contenidoFecha: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#f9fafb',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    filaInputs: {
        flexDirection: 'column',
        flex: 1,
        marginRight: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
        letterSpacing: 0.3,
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        backgroundColor: '#fff',
        color: '#374151',
        fontSize: 14,
    },
    inputPequeño: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        backgroundColor: '#fff',
        color: '#374151',
        fontSize: 14,
    },
    boton: {
        backgroundColor: '#f0f7ff',
        borderColor: '#746BC8',
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 120,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    botonTexto: {
        color: '#2c3e50',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#f1f5f9',
        paddingVertical: 12,
        borderBottomWidth: 1.5,
        borderBottomColor: '#e2e8f0',
    },
    headerCell: {
        flex: 1,
        textAlign: 'center',
        fontWeight: '700',
        fontSize: 15,
        color: '#334155',
        paddingHorizontal: 4,
    },
    headerCellNombre: {
        flex: 2,
        textAlign: 'left',
        fontWeight: '700',
        fontSize: 15,
        color: '#334155',
        paddingHorizontal: 8,
    },
    fila: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        backgroundColor: '#fff',
        minHeight: 48,
    },
    celda: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    celdaNombre: {
        flex: 2,
        textAlign: 'left',
        fontSize: 15,
        color: '#2a3d6c',
        paddingHorizontal: 8,
    },
});
