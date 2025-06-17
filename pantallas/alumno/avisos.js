import { StyleSheet, View, Image, TextInput, Text, ScrollView, Alert } from 'react-native';
import { obtenerCurso } from '../../scripts/listasDesplegables/listaDesplegable.js';
import React, { useState, useEffect } from "react";
import bg from '../../assets/bg1.jpg';
import ListasDesplegables from '../../componente/ListasDesplegables';
import { obtenerAvisosGenerales, obtenerAvisosCurso } from '../../scripts/alumno/scriptAvisos';

export default function Avisos() {
    const [formData, setFormData] = useState({
        id_curso: ''
    });

    const [datos, setDatos] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [fechaFiltro, setFechaFiltro] = useState(''); // Estado para la fecha de filtro

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const cursoData = await obtenerCurso();
                const avisoDatos = await obtenerAvisosGenerales();
                // Combina los avisos generales y los específicos del curso
                const todosLosAvisos = [
                    ...(Array.isArray(avisoDatos) ? avisoDatos : []),
                ];

                setDatos(todosLosAvisos); // Establece los avisos combinados
                setCursos(Array.isArray(cursoData) ? cursoData : []);
            } catch (error) {
                Alert.alert('Error', error.message);
            }
        };

        cargarDatos();
    }, []);

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    // Filtra los avisos por curso y fecha
    const avisosFiltrados = datos.filter((aviso) => {
        const coincideCurso = !formData.id_curso || aviso.curso === formData.id_curso; // Filtra por curso
        const coincideFecha = !fechaFiltro || aviso.fecha.includes(fechaFiltro); // Filtra por fecha
        return coincideCurso && coincideFecha; // Devuelve los avisos que coincidan con ambos filtros
    });

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg} />

            <View style={styles.contenedor}>
                <Text style={styles.titulo}>Avisos</Text>
                
                <View style={styles.filaFiltros}>
                    <ListasDesplegables
                        formData={formData}
                        handleChange={handleChange}
                        curso={cursos}
                        styles={styles}
                        showLabel={false}
                        label="Curso"
                    />
                    <TextInput
                        style={styles.filtroInput}
                        placeholder="Buscar por fecha (DD-MM-AAAA)"
                        value={fechaFiltro}
                        onChangeText={(text) => setFechaFiltro(text)}
                    />
                </View>

                <ScrollView style={styles.scrollAvisos}>
                    {avisosFiltrados.length > 0 ? (
                        avisosFiltrados.map((aviso, index) => (
                            <View key={index} style={styles.tarjeta}>
                                <View style={styles.encabezadoTarjeta}>
                                    <Text style={styles.fecha}>{aviso.fecha}</Text>
                                    <Text style={styles.curso}>{aviso.curso || 'General'}</Text>
                                </View>
                                <Text style={styles.textoAviso}>{aviso.informacion || 'No disponible'}</Text>
                                <View style={styles.detallesContainer}>
                                    <View style={styles.detalleItem}>
                                        <Text style={styles.detalleLabel}>Motivo:</Text>
                                        <Text style={styles.detalleTexto}>{aviso.detalle || 'No disponible'}</Text>
                                    </View>
                                    <View style={styles.detalleItem}>
                                        <Text style={styles.detalleLabel}>Profesor:</Text>
                                        <Text style={styles.detalleTexto}>{aviso.nombre || 'General'}</Text>
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
        color: '#1a365d',
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
    filtroInput: {
        flex: 1,
        height: 48,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        backgroundColor: 'white',
        fontSize: 16,
        paddingHorizontal: 16,
        color: '#2d3748',
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
        color: '#718096',
        fontWeight: '500',
    },
    curso: {
        fontSize: 14,
        color: '#4a5568',
        fontWeight: '600',
        backgroundColor: '#edf2f7',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
    },
    textoAviso: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2d3748',
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
        color: '#2d3748',
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
        color: '#718096',
        textAlign: 'center',
    },
});