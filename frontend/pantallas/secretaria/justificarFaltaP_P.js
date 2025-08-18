import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import bg from '../../assets/bg1.jpg';
import { obtenerFaltasPP, registrarJustificacionPP } from '../../scripts/secretaria/scriptJustificarFaltaPP.js';
import { obtenerCertificado, obtenerEstadosFaltaProfesionales } from '../../scripts/listasDesplegables/listaDesplegable.js';
import { ImageBackground } from 'react-native-web';
import ScrollContainer from '../../componente/ScrollContainer.jsx';


export default function JustificarFaltaP_P() {
    
    const [formData, setFormData] = useState({
        id_certificado: '',
        id_estado_falta_profesionales: ''
    })

    const [estado_falta_profesional, setEstadosFalta] = useState([]);
    const [certificados, setCertificados] = useState([]);
    const [faltas, setFaltas] = useState([]);
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [estadoFaltaPorProfesor, setEstadoFaltaPorProfesor] = useState({});
    const [certificadoPorProfesor, setCertificadoPorProfesor] = useState({});

    const cargarEstadosFaltaPP = async () => {
        try {
            const estados = await obtenerEstadosFaltaProfesionales();
            console.log("Estados de falta cargados:", estados);
            if (Array.isArray(estados)) {
                setEstadosFalta(estados);
            } else {
                console.error("Los estados de falta no son un array:", estados);
                setEstadosFalta([]);
            }
        } catch (error) {
            console.error('Error al cargar estados de falta:', error.message);
            Alert.alert('Error', 'No se pudieron cargar los estados de falta');
            setEstadosFalta([]);
        }
    };

    const cargarCertificados = async () => {
        try {
            const certificados = await obtenerCertificado();
            console.log("Certificados cargados:", certificados);
            if (Array.isArray(certificados)) {
                setCertificados(certificados);
            } else {
                console.error("Los certificados no son un array:", certificados);
                setCertificados([]);
            }
        } catch (error) {
            console.error('Error al cargar certificados:', error.message);
            Alert.alert('Error', 'No se pudieron cargar los certificados');
            setCertificados([]);
        }
    };

    const cargarFaltas = async (fechaDesdeParam, fechaHastaParam) => {
        try {
            console.log('Consultando faltas con fechas:', fechaDesdeParam, 'hasta', fechaHastaParam);
            const faltasData = await obtenerFaltasPP(fechaDesdeParam, fechaHastaParam);
            console.log('Datos recibidos del backend:', faltasData);
            setFaltas(Array.isArray(faltasData) ? faltasData : []);
            
            // Inicializar los estados por profesor
            const estadoInicial = {};
            const certificadoInicial = {};
            
            faltasData.forEach(falta => {
                estadoInicial[falta.dni_profesional] = falta.id_estado_falta_profesionales || undefined;
                certificadoInicial[falta.dni_profesional] = falta.id_certificado || undefined;
            });
            
            setEstadoFaltaPorProfesor(estadoInicial);
            setCertificadoPorProfesor(certificadoInicial);
            
        } catch (error) {
            console.error('Error al cargar faltas:', error.message);
            Alert.alert('Error', 'No se pudieron cargar las faltas');
        }
    };

    useEffect(() => {
        cargarEstadosFaltaPP();
        cargarCertificados();
    }, []);

    const formatearFecha = (fechaISO) => {
        if (!fechaISO) return '--/--/----';
        const fecha = new Date(fechaISO);
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const año = fecha.getFullYear();
        return `${dia}/${mes}/${año}`;
    };

    const validarYConvertirFechas = (fechaDesde, fechaHasta) => {
        // Validar formato DD/MM/AAAA
        const formatoValido = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!formatoValido.test(fechaDesde) || !formatoValido.test(fechaHasta)) {
            return { valido: false, mensaje: "Las fechas deben estar en formato DD/MM/AAAA." };
        }
        // Validar existencia real de la fecha
        const esFechaValida = (fecha) => {
            const [dia, mes, año] = fecha.split('/').map(Number);
            const date = new Date(año, mes - 1, dia);
            return (
                date.getFullYear() === año &&
                date.getMonth() === mes - 1 &&
                date.getDate() === dia
            );
        };
        if (!esFechaValida(fechaDesde) || !esFechaValida(fechaHasta)) {
            return { valido: false, mensaje: "Alguna de las fechas ingresadas no existe." };
        }
        const convertirFormatoFecha = (fecha) => {
            const [dia, mes, año] = fecha.split('/');
            return `${año}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
        };
        const fechaDesdeConvertida = convertirFormatoFecha(fechaDesde);
        const fechaHastaConvertida = convertirFormatoFecha(fechaHasta);
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
    
    const handleConsultar = async () => {
        const resultado = validarYConvertirFechas(fechaDesde, fechaHasta);
        if (!resultado.valido) {
            setMensajeError(resultado.mensaje); 
            if (Platform.OS === 'web') 
            {
                window.alert("Fechas incorrectas: " + resultado.mensaje);
            } else {
                Alert.alert("Fechas incorrectas", resultado.mensaje);
            }
            return;
        }

        try {

            await cargarFaltas(resultado.fechas.desde, resultado.fechas.hasta);
        } catch (error) {
            console.error('Error al cargar faltas:', error);
            setMensajeError('Error al cargar las faltas');
        } finally {
            setCargando(false);
        }
    };  

    // Cambiar a profesional
    const actualizarProfesionalSeleccionado = (tipo, valor, dni_profesional, fecha) => {
        // Actualizar el estado local
        if (tipo === 'estadoFalta') {
            setEstadoFaltaPorProfesor(prev => ({
                ...prev,
                [dni_profesional]: valor
            }));
        } else if (tipo === 'certificado') {
            setCertificadoPorProfesor(prev => ({
                ...prev,
                [dni_profesional]: valor
            }));
        }

       
        const datosParaEnviar = {
            dni_profesional,
            fecha,
            id_estado_falta_profesionales: tipo === 'estadoFalta' 
                ? (valor !== undefined && valor !== null ? parseInt(valor, 10) : undefined)
                : (estadoFaltaPorProfesor[dni_profesional] !== undefined && estadoFaltaPorProfesor[dni_profesional] !== null 
                    ? parseInt(estadoFaltaPorProfesor[dni_profesional], 10) 
                    : undefined),
            id_certificado: tipo === 'certificado'
                ? (valor !== undefined && valor !== null ? parseInt(valor, 10) : undefined)
                : (certificadoPorProfesor[dni_profesional] !== undefined && certificadoPorProfesor[dni_profesional] !== null 
                    ? parseInt(certificadoPorProfesor[dni_profesional], 10) 
                    : undefined)
        };

        console.log('Datos a enviar:', datosParaEnviar);

        // Solo enviar si tenemos al menos el estado de falta
        if (datosParaEnviar.id_estado_falta_profesionales !== undefined && !isNaN(datosParaEnviar.id_estado_falta_profesionales)) {
            handleRegistrarJustificacion(datosParaEnviar);
        }
    };

   
    const validarCampos = () => {
        return fechaDesde.length >= 10 && fechaHasta.length >= 10
    }

    const handleRegistrarJustificacion = async ({ dni_profesional, fecha, id_estado_falta_profesionales, id_certificado }) => {
        if (!dni_profesional || !fecha) {
            console.log('Faltan datos requeridos');
            return;
        }

        try {
            // Preparar los datos para enviar
            const formData = {
                dni_profesional,
                fecha: formatearFecha(fecha),
                id_estado_falta_profesionales: id_estado_falta_profesionales !== undefined ? id_estado_falta_profesionales : undefined,
                id_certificado: id_certificado !== undefined ? id_certificado : undefined
            };

            console.log('Enviando datos:', formData);

            const resultado = await registrarJustificacionPP(formData);
            console.log('Respuesta del servidor:', resultado);
            
            if (resultado.justificado === "No se realizaron cambios") {
                Alert.alert('Información', 'No se realizaron cambios en la justificación');
            } else {
                Alert.alert('Éxito', 'Justificación registrada correctamente');
            }
        } catch (error) {
            console.error('Error al registrar justificación:', error);
            Alert.alert('Error', error.response?.data?.error || 'No se pudo registrar la justificación');
        }
    };

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    return (
        <View style={styles.padre}>
            <ScrollContainer />
            <ImageBackground source={bg} style={styles.bg} resizeMode="cover"> 
            <View style={styles.contenido}>
                <View style={styles.contenidoFecha}>
                    <View style={styles.filaInputs}>
                        <Text style={styles.label}>Fecha desde:</Text>
                        <TextInput 
                            placeholder='DD/MM/YYYY' 
                            style={Platform.OS === 'web' ? styles.inputPequeño : styles.input}
                            value={fechaDesde}
                            onChangeText={setFechaDesde}
                        />
                    </View>
                    <View style={styles.filaInputs}>
                        <Text style={styles.label}>Fecha hasta:</Text>
                        <TextInput 
                            placeholder='DD/MM/YYYY' 
                            style={Platform.OS === 'web' ? styles.inputPequeño : styles.input}
                            value={fechaHasta}
                            onChangeText={setFechaHasta}
                        />
                    </View>
                    <TouchableOpacity style={[styles.boton, !validarCampos() && styles.botonDeshabilitado]} onPress={handleConsultar} disabled={!validarCampos()}>
                        <Text style={styles.botonTexto}>Consultar</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal>
                    <View style={styles.tabla}>
                        <View style={[styles.fila, styles.encabezados]}>
                            <Text style={styles.encabezado}>DNI</Text>
                            <Text style={styles.encabezado}>Fecha</Text>
                            <Text style={styles.encabezado}>Estado de la Falta</Text>
                            <Text style={styles.encabezado}>Certificado Médico</Text>
                        </View>
                        
                        {faltas.length > 0 ? (
                            faltas.map((falta, index) => (
                                <View key={index} style={styles.fila}>
                                    <Text style={styles.celda}>{falta.dni_profesional}</Text>
                                    <Text style={styles.celda}>{formatearFecha(falta.fecha)}</Text>
                                    <Picker
                                        style={styles.celda}
                                        selectedValue={
                                            estadoFaltaPorProfesor[falta.dni_profesional] !== undefined
                                                ? estadoFaltaPorProfesor[falta.dni_profesional]
                                                : undefined
                                        }
                                        onValueChange={(itemValue) => {
                                            actualizarProfesionalSeleccionado(
                                                "estadoFalta",
                                                itemValue,
                                                falta.dni_profesional,
                                                falta.fecha
                                            );
                                        }}
                                    >
                                        <Picker.Item
                                            label="Seleccione estado de falta"
                                            value={undefined}
                                        />
                                        {estado_falta_profesional.map((estado) => (
                                            <Picker.Item
                                                key={estado.id_estado_falta_profesionales}
                                                label={estado.detalle}
                                                value={Number(estado.id_estado_falta_profesionales)}
                                            />
                                        ))}
                                    </Picker>
                                    <Picker
                                        style={styles.celda}
                                        selectedValue={
                                            certificadoPorProfesor[falta.dni_profesional] !== undefined
                                                ? certificadoPorProfesor[falta.dni_profesional]
                                                : undefined
                                        }
                                        onValueChange={(itemValue) => {
                                            actualizarProfesionalSeleccionado(
                                                "certificado",
                                                itemValue,
                                                falta.dni_profesional,
                                                falta.fecha
                                            );
                                        }}
                                    >
                                        <Picker.Item
                                            label="Seleccione certificado médico"
                                            value={undefined}
                                        />
                                        {certificados.map((certificado) => (
                                            <Picker.Item
                                                key={certificado.id_certificado}
                                                label={certificado.detalle}
                                                value={Number(certificado.id_certificado)}
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
    botonDeshabilitado: {
        opacity: 0.5,
        backgroundColor: '#cccccc',
        borderColor: '#999999',
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
    archivo: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    archivoInfo: {
        fontSize: 18,
        textAlign: 'center',
    },
});