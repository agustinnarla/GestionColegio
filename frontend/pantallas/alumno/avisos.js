import { StyleSheet, View, Image, TextInput, Text, ScrollView, Alert, useWindowDimensions } from 'react-native';
import { obtenerCurso } from '../../scripts/listasDesplegables/listaDesplegable.js';
import React, { useState, useEffect } from "react";
import bg from '../../assets/bg1.jpg';
import ListasDesplegables from '../../componente/ListasDesplegables';
import { obtenerAvisosGenerales, obtenerAvisosCurso } from '../../scripts/alumno/scriptAvisos';

export default function Avisos({ route }) {
    //🟢 Formulario
    const [formData, setFormData] = useState({
        id_curso: ''
    });

    //🟢 Fecha formateada 
    const formatearFechaYHora = (fechaISO) => {
        if (!fechaISO) return '';

        const fecha = new Date(fechaISO);
        if (isNaN(fecha.getTime())) return '';

        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const anio = fecha.getFullYear();
        const horas = fecha.getHours().toString().padStart(2, '0');
        const minutos = fecha.getMinutes().toString().padStart(2, '0');

        return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
    };

    //🟢 Estados 
    const [datos, setDatos] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [fechaFiltro, setFechaFiltro] = useState('');
    
    //🟢 Responsivo 
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    //🟢 Capturar Parametros 
    const { dni_usuario } = route.params || {}; 
    const { id_rol } = route.params || {};

    //🟢 Obtener Avisos 
    useEffect(() => {

    const cargarAvisos = async () => {
        try {
            const dni_alumno = dni_usuario
            const cursoData = await obtenerCurso();
            const avisoDatos = await obtenerAvisosGenerales();
            const avisoCursoData = await obtenerAvisosCurso(dni_alumno);
            // Combina los avisos generales y los avisos por curso
            if (!Array.isArray(avisoDatos) || !Array.isArray(avisoCursoData)) {
                throw new Error('Error al obtener los datos de avisos');
            }
            // Combina los avisos generales y los avisos por curso
            if (avisoCursoData.length > 0) {
                avisoDatos.push(...avisoCursoData);
            }
            
            const todosLosAvisos = [
                ...(Array.isArray(avisoDatos) ? avisoDatos : []),
            ];

            setDatos(todosLosAvisos); // Establece los avisos combinados
            setCursos(Array.isArray(cursoData) ? cursoData : []);
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

        cargarAvisos();
    }, []);

    //🟢 Cambios de estado en las listas 
    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    //🟢 Filtra los avisos por curso y fecha
    const filtrarAvisos = datos.filter((aviso) => {
    // Si el aviso es general, no tiene id_curso (o es null/undefined)
        const coincideCurso =
            !formData.id_curso ||
            (aviso.id_curso && aviso.id_curso.toString() === formData.id_curso.toString());

        const coincideFecha =
            !fechaFiltro || (aviso.fecha_registro && aviso.fecha_registro.includes(fechaFiltro));

        return coincideCurso && coincideFecha;
    });

    //🟢 Obtención de la fecha actual
    const obtenerFechaActual = (fechaStr) => {
        if (!fechaStr) return false;
        const fecha = new Date(fechaStr);
        if (isNaN(fecha.getTime())) return false;
        const hoy = new Date();
        return (
            fecha.getDate() === hoy.getDate() &&
            fecha.getMonth() === hoy.getMonth() &&
            fecha.getFullYear() === hoy.getFullYear()
        );
    };

    //🟢 Vista 
    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg} />

            <View style={styles.contenedor}>
               
                <View style={[styles.filaFiltros, isMobile && styles.filaFiltrosMobile]}>
                    <View style={isMobile ? styles.filtroItemMobile : styles.filtroItem}>
                        <ListasDesplegables
                            formData={formData}
                            handleChange={handleChange}
                            curso={cursos}
                            styles={styles}
                            showLabel={false}
                            label="Curso"
                        />
                    </View>
                    <TextInput
                        style={[styles.filtroInput, isMobile && styles.filtroInputMobile]}
                        placeholder="Buscar por fecha (DD/MM/AAAA)"
                        value={fechaFiltro}
                        onChangeText={(text) => setFechaFiltro(text)}
                    />
                </View>

                <ScrollView style={styles.scrollAvisos}>
                    {filtrarAvisos.length > 0 ? (
                        filtrarAvisos.map((aviso, index) => (
                            <View key={index} style={styles.tarjeta}>
                                <View style={styles.encabezadoTarjeta}>
                                    <Text style={styles.fecha}>{formatearFechaYHora(aviso.fecha_aviso)}</Text>
                                    <Text style={styles.curso}>{aviso.curso || 'General'}</Text>
                                    {obtenerFechaActual(aviso.fecha) && (
                                        <View style={styles.badgeNuevo}>
                                            <Text style={styles.badgeTexto}>Hoy</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.textoAviso}>{aviso.informacion || 'No disponible'}</Text>
                                <View style={styles.detallesContainer}>
                                    <View style={styles.detalleItem}>
                                        <Text style={styles.detalleLabel}>Motivo:</Text>
                                        <Text style={styles.detalleTexto}>{aviso.detalle || 'No disponible'}</Text>
                                    </View>
                                    <View style={styles.detalleItem}>
                                        <Text style={styles.detalleLabel}>Profesor:</Text>
                                        <Text style={styles.detalleTexto}>{aviso.profesional || 'General'}</Text>
                                    </View>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.sinAvisos}>
                            <Text style={styles.textoSinAvisos}>No hay avisos disponibles para los filtros seleccionados.</Text>
                        </View>
                    )}
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
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        zIndex: -1, 
    },
    contenedor: {
        flex: 1,
        padding: 20,
        maxWidth: 1000,
        width: '100%',
        alignSelf: 'center',
    },
    titulo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2a3d6c',
        marginBottom: 24,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    filaFiltros: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        marginBottom: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    filaFiltrosMobile: {
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 12,
    },
    filtroItem: {
        flex: 1,
    },
    filtroItemMobile: {
        width: '100%',
    },
    filtroInput: {
        flex: 1,
        height: 48,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        backgroundColor: 'white',
        fontSize: 16,
        paddingHorizontal: 16,
        color: '#2a3d6c',
    },
    filtroInputMobile: {
        flex: undefined,
        width: '100%',
    },
    scrollAvisos: {
        flex: 1,
    },
    tarjeta: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    encabezadoTarjeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    fecha: {
        fontSize: 14,
        color: '#2a3d6c',
        fontWeight: '500',
    },
    curso: {
        fontSize: 14,
        color: '#2a3d6c',
        fontWeight: '600',
        backgroundColor: '#edf2f7',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
    },
    textoAviso: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2a3d6c',
        marginBottom: 16,
        lineHeight: 24,
    },
    detallesContainer: {
        backgroundColor: '#f7fafc',
        borderRadius: 8,
        padding: 12,
    },
    detalleItem: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    detalleLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4a5568',
        width: 80,
    },
    detalleTexto: {
        fontSize: 14,
       color: '#2a3d6c',
        flex: 1,
    },
    sinAvisos: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 24,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    textoSinAvisos: {
        fontSize: 16,
        color: '#2a3d6c',
        textAlign: 'center',
    },
    badgeNuevo: {
        backgroundColor: '#38a169',
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginLeft: 8,
    },
    badgeTexto: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});