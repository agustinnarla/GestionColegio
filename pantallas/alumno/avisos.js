import { StyleSheet, View, Image, TextInput, Text, ScrollView, Alert } from 'react-native';
import { obtenerCurso } from '../../scripts/secretaria/scriptGestionAlumno.js';
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

            <View style={styles.filtro}>
                <ListasDesplegables
                    formData={formData}
                    handleChange={handleChange}
                    curso={cursos}
                    styles={styles}
                />
                <TextInput
                    style={styles.fechaInput}
                    placeholder="Fecha (YYYY-MM-DD)"
                    value={fechaFiltro}
                    onChangeText={(text) => setFechaFiltro(text)} // Actualiza el estado con el texto ingresado
                />
            </View>

            <ScrollView style={styles.scrollAvisos}>
                {avisosFiltrados.length > 0 ? (
                    avisosFiltrados.map((aviso, index) => (
                        <View key={index} style={styles.tarjeta}>
                            <Text style={styles.textoAviso}>Información: {aviso.informacion || 'No disponible'}</Text>
                            <Text style={styles.textoMotivo}>Motivo: {aviso.motivo || 'No disponible'}</Text>
                            <Text style={styles.textoMotivo}>Profesor Afectado: {aviso.nombre || 'General'}</Text>
                            <Text style={styles.textoMotivo}>Cursos Afectados: {aviso.curso || 'General'}</Text>
                            <Text style={styles.textoDH}>{aviso.fecha}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.textoAviso}>No hay avisos disponibles para los filtros seleccionados.</Text>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    padre: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    bg: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.1,
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
        color: '#fff',
        backgroundColor: '#1E88E5',
        width: '100%',
        padding: 10,
    },
    filtro: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '90%',
        marginVertical: 20,
    },
    lista: {
        height: 50,
        width: '45%',
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
    },
    fechaInput: {
        height: 50,
        width: '45%',
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    scrollAvisos: {
        width: '90%',
    },
    tarjeta: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        borderColor: '#ddd',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 3,
    },
    textoAviso: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    textoMotivo: {
        fontSize: 14,
        marginBottom: 2,
    },
    textoDH: {
        fontSize: 12,
        textAlign: 'right',
        marginTop: 10,
        color: '#777',
    },
});
