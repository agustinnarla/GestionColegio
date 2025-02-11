import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, ScrollView, Platform, Alert} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { obtenerAlumnosAusentes, obtenerEstadoFalta, obtenerCertificado, actualizarJustificarFalta, obtenerEstadoAlumnos, obtenerAlumnosConFaltasSuperadas, actualizarEstadoAlumno} from '../../scripts/preceptor/scriptGestionJustificarFalta';

import React, {useState, useEffect} from "react";
import bg from '../../assets/bg1.jpg';

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
            const datos = await obtenerEstadoFalta();
            setEstadoFalta(datos); // Guarda los datos en el estado
        } catch (error) {
            console.error("Error al cargar los estados de falta:", error.message);
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
    
    const actualizarSeleccionadoAlumno = (tipo, valor, dnialumno) => {
        if (tipo === 'estadoFalta') {
            setEstadoFaltaPorAlumno(prevState => ({
                ...prevState,
                [dnialumno]: valor,  // Asocia el valor con el dnialumno
            }));
        } else if (tipo === 'certificado') {
            setCertificadoPorAlumno(prevState => ({
                ...prevState,
                [dnialumno]: valor,  // Asocia el valor con el dnialumno
            }));
        }
    };

    const actualizarDatosEnBaseDeDatos = async (tipo, valor, dnialumno, fecha) => {
        console.log("Datos para actualizar:", tipo, valor, dnialumno);
        console.log("estadoFaltaSeleccionado:", estadoFaltaSeleccionado);
        console.log("certificadoSeleccionado:", certificadoSeleccionado);
        
        const datosForm = {
            idestadofalta: tipo === 'estadoFalta' ? valor : estadoFaltaSeleccionado,
            dnialumno: dnialumno, 
            idcertificado: tipo === 'certificado' ? valor : certificadoSeleccionado,
            fecha: fecha,
        };
    
        console.log("datosForm:", datosForm);
    
        // Llamamos a la función para obtener los alumnos con faltas superadas
        const datosFaltas = await obtenerDatosFaltasSuperadas();
    
        // Si obtenemos datos de faltas superadas, procesamos cada uno
        if (Array.isArray(datosFaltas) && datosFaltas.length > 0) {
            for (const dnialumnoFalta of datosFaltas) {
                // Llamamos a la función actualizarEstadoAlumno para cada dnialumno
                await actualizarEstadoAlumno(dnialumnoFalta);
                console.log(`Estado actualizado para el alumno ${dnialumnoFalta}`);
            }
        } else {
            console.error("No se encontraron datos de faltas superadas.");
        }
    };
    

    const obtenerDatosFaltasSuperadas = async () => {
        try {
            const response = await obtenerAlumnosConFaltasSuperadas();
            console.log("✅ Respuesta obtenida:", response);
    
            if (Array.isArray(response)) {
                const dnialumnoArray = response.map((item) => item.dnialumno);
    
                setFaltasSuperadas(dnialumnoArray); // Actualizamos el estado con el array
                return dnialumnoArray; // 🔥 Ahora devuelve un array de dnialumno
            } else {
                console.error("Error al obtener datos:", response.error);
                return [];
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
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
                    estadoMap[item.dnialumno] = item.idestadofalta;
                    certificadoMap[item.dnialumno] = item.idcertificado;
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
            <Image source={bg} style={styles.bg}></Image>
            <View style={styles.contenido}>
                <View style={styles.contenidoFecha}>
                    <View style={styles.filaInputs}>
                        <Text style={styles.label}>Fecha desde:</Text>
                        <TextInput
                            placeholder="----/--/--"
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

                <ScrollView horizontal>
                    <View style={styles.tabla}>
                        <View style={styles.fila}>
                            <Text style={styles.encabezado}>Alumno</Text>
                            <Text style={styles.encabezado}>DNI</Text>
                            <Text style={styles.encabezado}>Fecha</Text>
                            <Text style={styles.encabezado}>Estado de la Falta</Text>
                            <Text style={styles.encabezado}>Certificado Médico</Text>
                        </View>

                        {/* Mostrar una fila para cada alumno */}
                        {Array.isArray(alumnos) && alumnos.length > 0 && alumnos.map((alumno, index) => (
                            <View style={styles.fila} key={index}>
                                <Text style={styles.celda}>{alumno.nombreapellido}</Text>
                                <Text style={styles.celda}>{alumno.dnialumno}</Text>
                                <Text style={styles.celda}>{convertirFecha(alumno.fecha.slice(0, 10))}</Text>

                                {/* Picker para estadoFalta */}
                                <Picker
                                    style={styles.celda}
                                    selectedValue={estadoFaltaPorAlumno[alumno.dnialumno] ?? ""}
                                    onValueChange={(itemValue) => {
                                        actualizarSeleccionadoAlumno('estadoFalta', itemValue, alumno.dnialumno);
                                        actualizarDatosEnBaseDeDatos('estadoFalta', itemValue, alumno.dnialumno, alumno.fecha);
                                    }}
                                >
                                    {/* Si no tiene un estado registrado, se muestra la opción por defecto */}
                                    {!estadoFaltaPorAlumno[alumno.dnialumno] && (
                                        <Picker.Item label="Seleccionar estado" value="" enabled={false} />
                                    )}

                                    {/* Lista de estados */}
                                    {Array.isArray(estadoFalta?.estadofalta) && estadoFalta.estadofalta.map((estado) => (
                                        <Picker.Item 
                                            key={estado.idestadofalta} 
                                            label={estado.detalle} 
                                            value={estado.idestadofalta} 
                                        />
                                    ))}
                                </Picker>
                                {/* Picker para certificado */}
                                <Picker
                                    style={styles.celda}
                                    selectedValue={certificadoPorAlumno[alumno.dnialumno] ?? ""}
                                    onValueChange={(itemValue) => {
                                        actualizarSeleccionadoAlumno('certificado', itemValue, alumno.dnialumno);
                                        actualizarDatosEnBaseDeDatos('certificado', itemValue, alumno.dnialumno, alumno.fecha);
                                    }}
                                >
                                    {/* Si no tiene un certificado registrado, se muestra la opción por defecto */}
                                    {!certificadoPorAlumno[alumno.dnialumno] && (
                                        <Picker.Item label="Seleccionar certificado" value="" enabled={false} />
                                    )}

                                    {/* Lista de certificados */}
                                    {Array.isArray(certificado?.sexo) && certificado.sexo.map((cert) => (
                                        <Picker.Item 
                                            key={cert.idcertificado} 
                                            label={cert.detalle} 
                                            value={cert.idcertificado} 
                                        />
                                    ))}
                                </Picker>
                            </View>
                        ))}

                    </View>
                </ScrollView>
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
        alignItems: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: -1,
    },
    contenido: {
        width: '40%',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    contenidoFecha: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    filaInputs: {
        flexDirection: 'column',
        flex: 1,
        marginRight: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        width: '40%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    inputPequeño: {
        width: '40%',
        padding: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
    },
    boton: {
        backgroundColor: '#CED9EF',
        borderColor: '#0500FF',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    botonTexto: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
    tabla: {
        marginTop: 20,
    },
    fila: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    encabezado: {
        fontWeight: 'bold',
        width: 120,
        marginRight: 10,
        textAlign: 'center',
    },
    celda: {
        width: 120,
        textAlign: 'center',
        borderWidth: 1,
        marginRight: 10,
        borderColor: '#ccc',
        padding: 8,
    },
});
