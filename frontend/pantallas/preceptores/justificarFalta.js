import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Platform, Alert, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { obtenerAlumnosAusentes, actualizarJustificarFalta, obtenerEstadoAlumnos, obtenerAlumnosConFaltasSuperadas, actualizarEstadoAlumno } from '../../scripts/preceptor/scriptGestionJustificarFalta';
import { CertificadoSelector, EstadoFaltaAlumnosSelector } from '../../componente/ListasDesplegables';
import { obtenerCertificado, obtenerEstadoFalta } from '../../scripts/listasDesplegables/listaDesplegable';
import React, { useState, useEffect } from "react";
import bg from '../../assets/bg1.jpg';

const formatFecha = (fechaISO) => {
    if (!fechaISO) return '--/--/----';
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
};

export default function JustificarFalta() {
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [estadoFalta, setEstadoFalta] = useState([]);
    const [certificado, setCertificado] = useState([]);
    const [estadoFaltaPorAlumno, setEstadoFaltaPorAlumno] = useState({});
    const [certificadoPorAlumno, setCertificadoPorAlumno] = useState({});
    const [alumnos, setAlumnos] = useState([]);

    // Cargar estados y certificados
    useEffect(() => {
        const cargarListaDesplegables = async () => {
            try {
                const datos = await obtenerEstadoFalta();
                setEstadoFalta(datos);
                const certs = await obtenerCertificado();
                setCertificado(Array.isArray(certs) ? certs : []);
            } catch (error) {
                Alert.alert('Error', error.message);
            }
        };
        cargarListaDesplegables();
    },[]);
    

    

    // Validar y convertir fechas
    const validarYConvertirFechas = (fechaDesde, fechaHasta) => {
        const convertirFormatoFecha = (fecha) => {
            const [dia, mes, año] = fecha.split('/');
            return `${año}-${mes}-${dia}`;
        };
        const fechaDesdeConvertida = convertirFormatoFecha(fechaDesde);
        const fechaHastaConvertida = convertirFormatoFecha(fechaHasta);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaDesdeConvertida) || !/^\d{4}-\d{2}-\d{2}$/.test(fechaHastaConvertida)) {
            return { valido: false, mensaje: "Las fechas deben estar en formato DD/MM/YYYY." };
        }
        if (new Date(fechaDesdeConvertida) > new Date(fechaHastaConvertida)) {
            return { valido: false, mensaje: "La fecha 'Desde' no puede ser mayor que la fecha 'Hasta'." };
        }
        return {
            valido: true,
            fechas: {
                desde: fechaDesdeConvertida,
                hasta: fechaHastaConvertida
            }
        };
    };

    // Consultar alumnos
    const handleConsultar = async () => {
        const resultado = validarYConvertirFechas(fechaDesde, fechaHasta);
        if (!resultado.valido) {
            Alert.alert("Error", resultado.mensaje);
            return;
        }
        try {
            const datosObtenidos = await obtenerAlumnosAusentes(resultado.fechas.desde, resultado.fechas.hasta);
            setAlumnos(Array.isArray(datosObtenidos.alumnos) ? datosObtenidos.alumnos : []);
            // Inicializar los estados por alumno
            const estadoInicial = {};
            const certificadoInicial = {};
            (datosObtenidos.alumnos || []).forEach(alumno => {
                estadoInicial[alumno.dni_alumno] = alumno.id_estado_falta_alumno || undefined;
                certificadoInicial[alumno.dni_alumno] = alumno.id_certificado || undefined;
            });
            setEstadoFaltaPorAlumno(estadoInicial);
            setCertificadoPorAlumno(certificadoInicial);
        } catch (error) {
            setAlumnos([]);
        }
    };

    // Actualizar selección
        const actualizarSeleccionadoAlumno = (tipo, valor, dni_alumno, fecha) => {
        let nuevoEstado = estadoFaltaPorAlumno[dni_alumno];
        let nuevoCertificado = certificadoPorAlumno[dni_alumno];

        if (tipo === 'estadoFalta') {
            nuevoEstado = valor;
            setEstadoFaltaPorAlumno(prev => ({
                ...prev,
                [dni_alumno]: valor
            }));
        } else if (tipo === 'certificado') {
            nuevoCertificado = valor;
            setCertificadoPorAlumno(prev => ({
                ...prev,
                [dni_alumno]: valor
            }));
        }

        if (
            nuevoEstado !== undefined &&
            nuevoEstado !== null &&
            nuevoCertificado !== undefined &&
            nuevoCertificado !== null
        ) {
            actualizarDatosEnBaseDeDatos(nuevoEstado, nuevoCertificado, dni_alumno, fecha);
        }
    };

    // Actualizar en base de datos
    const actualizarDatosEnBaseDeDatos = async (id_estado_falta_alumno, id_certificado, dni_alumno, fecha) => {
        
        
        const datosForm = {
            id_estado_falta_alumno,
            dni_alumno,
            id_certificado,
            fecha,
        };

        console.log(datosForm)
        try {
            // Ver
            await actualizarJustificarFalta(datosForm);
        } catch (error) {
            // Manejo de error opcional
            console.log("Error")
        }
    };

    return (
        <View style={styles.padre}>
            <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
                <View style={styles.contenido}>
                    <View style={styles.contenidoFecha}>
                        <View style={styles.filaInputs}>
                            <Text style={styles.label}>Fecha desde:</Text>
                            <TextInput
                                placeholder="DD/MM/AAAA"
                                style={Platform.OS === 'web' ? styles.inputPequeño : styles.input}
                                value={fechaDesde}
                                onChangeText={setFechaDesde}
                            />
                        </View>
                        <View style={styles.filaInputs}>
                            <Text style={styles.label}>Fecha hasta:</Text>
                            <TextInput
                                placeholder="DD/MM/AAAA"
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
                            <View style={[styles.fila, styles.encabezados]}>
                                <Text style={styles.encabezado}>Alumno</Text>
                                <Text style={styles.encabezado}>DNI</Text>
                                <Text style={styles.encabezado}>Fecha</Text>
                                <Text style={styles.encabezado}>Estado de la Falta</Text>
                                <Text style={styles.encabezado}>Certificado Médico</Text>
                            </View>
                            {alumnos.length > 0 ? (
                                alumnos.map((alumno, index) => (
                                    <View key={index} style={styles.fila}>
                                        <Text style={styles.celda}>{alumno.nombreapellido}</Text>
                                        <Text style={styles.celda}>{alumno.dni_alumno}</Text>
                                        <Text style={styles.celda}>{formatFecha(alumno.fecha)}</Text>
                                        <Picker
                                            style={styles.celda}
                                            selectedValue={
                                                estadoFaltaPorAlumno[alumno.dni_alumno] !== undefined
                                                    ? estadoFaltaPorAlumno[alumno.dni_alumno]
                                                    : undefined
                                            }
                                            onValueChange={(itemValue) => {
                                                actualizarSeleccionadoAlumno(
                                                    "estadoFalta",
                                                    itemValue,
                                                    alumno.dni_alumno,
                                                    alumno.fecha
                                                );
                                            }}
                                        >
                                            <Picker.Item label="Seleccione estado de falta" value={undefined} />
                                            {estadoFalta.map((estado) => (
                                                <Picker.Item
                                                    key={estado.id_estado_falta_alumno}
                                                    label={estado.detalle}
                                                    value={Number(estado.id_estado_falta_alumno)}
                                                />
                                            ))}
                                        </Picker>
                                        <Picker
                                            style={styles.celda}
                                            selectedValue={
                                                certificadoPorAlumno[alumno.dni_alumno] !== undefined
                                                    ? certificadoPorAlumno[alumno.dni_alumno]
                                                    : undefined
                                            }
                                            onValueChange={(itemValue) => {
                                                actualizarSeleccionadoAlumno(
                                                    "certificado",
                                                    itemValue,
                                                    alumno.dni_alumno,
                                                    alumno.fecha
                                                );
                                            }}
                                        >
                                            <Picker.Item label="Seleccione certificado médico" value={undefined} />
                                            {certificado.map((cert) => (
                                                <Picker.Item
                                                    key={cert.id_certificado}
                                                    label={cert.detalle}
                                                    value={Number(cert.id_certificado)}
                                                />
                                            ))}
                                        </Picker>
                                    </View>
                                ))
                            ) : (
                                <View style={styles.fila}>
                                    <Text style={styles.celda}>No hay datos disponibles</Text>
                                    <Text style={styles.celda}></Text>
                                    <Text style={styles.celda}></Text>
                                    <Text style={styles.celda}></Text>
                                    <Text style={styles.celda}></Text>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    padre: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f7fa',
    },
    bg: {
        alignItems: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: -1,
    },
    contenido: {
        width: '95%',
        maxWidth: 1100,
        backgroundColor: '#fff',
        padding: 32,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10,
        shadowRadius: 12,
        elevation: 6,
        alignItems: 'center',
        marginTop: 36,
        marginBottom: 36,
    },
    contenidoFecha: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 18,
        width: '100%',
        gap: 24,
    },
    filaInputs: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        minWidth: 180,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        textAlign: 'center',
        color: '#2a3d6c',
    },
    input: {
        width: 160,
        padding: 10,
        borderWidth: 1.5,
        borderColor: '#b6c6e0',
        borderRadius: 8,
        marginBottom: 0,
        backgroundColor: '#f9f9f9',
        textAlign: 'center',
        fontSize: 16,
    },
    inputPequeño: {
        width: 140,
        padding: 8,
        borderWidth: 1.5,
        borderColor: '#b6c6e0',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        textAlign: 'center',
        fontSize: 15,
    },
    boton: {
        backgroundColor: '#f0f7ff',
        borderColor: '#746BC8',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignSelf: 'center',
        elevation: 2,
        shadowColor: '#CED9EF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 4,
        minWidth: 120,
        marginLeft: 12,
    },
    botonTexto: {
        color: '#2a3d6c',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    tabla: {
        marginTop: 18,
        minWidth: 900,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e1e8ed',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
        overflow: 'hidden',
    },
    encabezados: {
        flexDirection: 'row',
        backgroundColor: '#f0f7ff',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e8ed',
        paddingVertical: 12,
        paddingHorizontal: 6,
    },
    encabezado: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#2a3d6c',
        textAlign: 'center',
        minWidth: 180,
        flex: 1,
        paddingHorizontal: 4,
    },
    fila: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        backgroundColor: '#fff',
    },
    celda: {
        flex: 1,
        minWidth: 180,
        marginLeft: 10,
        marginTop: 10,
        textAlign: 'center',
        fontSize: 15,
        color: '#374151',
        paddingHorizontal: 4,
        paddingVertical: 4,
        backgroundColor: '#fff',
    },
    picker: {
        flex: 1,
        minWidth: 180,
        height: 38,
        backgroundColor: '#f9f9f9',
        borderRadius: 7,
        borderWidth: 1,
        borderColor: '#b6c6e0',
        color: '#2a3d6c',
        fontSize: 15,
        marginHorizontal: 0,
    },
});
