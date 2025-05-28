import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, FlatList, Image, ScrollView } from 'react-native';
import bg from '../../assets/bg1.jpg';
import { obtenerProfesores, obtenerCursosPorProfesor, obtenerMateriaPorCurso} from '../../scripts/listasDesplegables/listaDesplegable.js'
import {  obtenerHorasProfesor, asignacionDeHoras } from '../../scripts/secretaria/scriptAsignacionHoras';
import ListasDesplegables from '../../componente/ListasDesplegables';

export default function AsignacionHoras() {
    const [profesores, setProfesor] = useState([]);
    const [curso, setCurso] = useState([]);
    const [materias, setMateria] = useState([]);
    const [horas, setHoras] = useState([]);
    const [selectedDay, setSelectedDay] = useState('');
    const [horariosAsignados, setHorariosAsignados] = useState({});

    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const rangosHorarios = [
        '08:00 - 09:00',
        '09:00 - 10:00',
        '10:00 - 11:00',
        '11:00 - 12:00',
        '12:00 - 13:00',
        '13:00 - 14:00',
    ];

    const [formData, setFormData] = useState({
        id_materia: '',
        id_curso: '',
        dni_profesional: '',
        dia_semana: '',
        hora_inicio: '',
        hora_final: '',
    });

    useEffect(() => {
        const inicializarHorarios = () => {
            const inicial = {};
            diasSemana.forEach((dia) => {
                inicial[dia] = [];
            });
            setHorariosAsignados(inicial);
        };
        inicializarHorarios();
    }, []);

    const handleReiniciar = () => {
        setProfesor([]);
        setCurso([]);
        setMateria([]);
        setHoras([]);
        setFormData({
            id_materia: '',
            id_curso: '',
            dni_profesional: '',
            dia_semana: '',
            hora_inicio: '',
            hora_final: '',
        });
    };

   const handleConsultar = async () => {
        try {
            if (formData.dni_profesional && formData.id_curso) {
                console.log('Enviando parámetros:', formData.dni_profesional, formData.id_curso);
                const data = await obtenerHorasProfesor(formData.dni_profesional, formData.id_curso);
                setHoras(data.horas);
                console.log('Horas traídas exitosamente:', data.horas);

                const nuevosHorarios = {};
                data.horas.forEach((hora) => {
                    const rango = hora.horario;
                    if (!nuevosHorarios[hora.dia_semana]) {
                        nuevosHorarios[hora.dia_semana] = [];
                    }
                    nuevosHorarios[hora.dia_semana].push(rango);
                });
                setHorariosAsignados(nuevosHorarios);
            } else {
                console.log('Debe seleccionar un profesor y un curso');
            }
        } catch (error) {
            console.error('Error en obtenerHorasProfesor:', error);
        }
    };

    const toggleHorario = (dia, rango) => {
            setHorariosAsignados((prev) => {
                const horariosDia = prev[dia] || [];
                if (horariosDia.includes(rango)) {
                    // Si el rango ya está asignado, lo eliminamos
                    return {
                        ...prev,
                        [dia]: horariosDia.filter((h) => h !== rango),
                    };
                } else {
                    // Si el rango no está asignado, lo agregamos
                    return {
                        ...prev,
                        [dia]: [...horariosDia, rango],
                    };
                }
            });

            // Actualiza el formData con el día y el rango seleccionado
            const [hora_inicio, hora_final] = rango.split(' - ');
            setFormData((prev) => ({
                ...prev,
                dia_semana: dia,
                hora_inicio,
                hora_final,
            }));
        };

    const handleAsignarHora = async () => {
        try {
            try {
                const profeData = {
                    id_materia: formData.id_materia,
                    id_curso: formData.id_curso,
                    dni_profesional: formData.dni_profesional,
                    dia_semana: formData.dia_semana,
                    hora_inicio: formData.hora_inicio,
                    hora_final: formData.hora_final,
                };


                console.log('Datos de la asignación de horas', profeData);

                const respuesta = await asignacionDeHoras(profeData);

                console.log('Respuesta del servidor:', respuesta);
    
            } catch (error) {
                console.error('Error al registrar la asignación de horas:', error.message);
                //mostrarMensaje('Error', 'No se pudo registrar la asignación de horas');
            }
        } catch (error) {
            console.error('Error al asignar la hora:', error);
        }
    };

    useEffect(() => {
        const cargarProfesores = async () => {
            try {
                const data = await obtenerProfesores();
                setProfesor(data.profesores);
            } catch (error) {
                console.log('Error al cargar los profesores:', error);
            }
        };
        cargarProfesores();
    }, []);

    useEffect(() => {
        const cargarCursos = async () => {
            try {
                
                if (formData.dni_profesional) {
                    const data = await obtenerCursosPorProfesor(formData.dni_profesional);
                    setCurso(data);
                    console.log('Cursos traídos exitosamente');
                }
            } catch (error) {
                console.log('Error al cargar los cursos', error);
            }
        };
        cargarCursos();
    }, [formData.dni_profesional]);

    useEffect(() => {
        const cargarMaterias = async () => {
            try {
                if (formData.id_curso) {
                    const data = await obtenerMateriaPorCurso(formData.id_curso);
                    setMateria(data);
                    console.log('Materias traídas exitosamente');
                }
            } catch (error) {
                console.log('Error al cargar las materias', error);
            }
        };
        cargarMaterias();
    }, [formData.id_curso]);

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };



    return (
        <View style={styles.container}>
            <Image source={bg} style={styles.bg} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.selectorContainer}>
                    <View style={styles.selector}>
                        <ListasDesplegables
                            formData={formData}
                            handleChange={handleChange}
                            profesores={profesores}
                            curso={curso}
                            materias={materias}
                            styles={styles}
                        />
                    </View>
                </View>
                <TouchableOpacity onPress={handleConsultar} style={{ marginBottom: 20 }}>
                    <Text>Consultar</Text>
                </TouchableOpacity>

                <View style={styles.horariosContainer}>
                    {diasSemana.map((dia) => (
                        <View key={dia} style={styles.diaContainer}>
                            <Text style={styles.diaTitulo}>{dia}</Text>
                            {rangosHorarios.map((rango) => (
                                <TouchableOpacity
                                    key={`${dia}-${rango}`}
                                    style={[
                                        styles.horarioCuadro,
                                        horariosAsignados[dia]?.includes(rango) && styles.horarioAsignado,
                                    ]}
                                    onPress={() => toggleHorario(dia, rango)}
                                >
                                    <Text style={styles.horarioTexto}>{rango}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </View>
                <TouchableOpacity onPress={handleAsignarHora} style={{ marginBottom: 20 }}>
                    <Text>Asignar Horas</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContainer: { flexGrow: 1, alignItems: 'center', paddingBottom: 20 },
    bg: { position: 'absolute', width: '100%', height: '100%', opacity: 0.2 },
    selectorContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '90%', marginBottom: 20, marginTop: 10 },
    selector: { flex: 1, marginHorizontal: 5 },
    horariosContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 },
    diaContainer: { flex: 1, marginHorizontal: 5, marginBottom: 20 },
    diaTitulo: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
    horarioCuadro: { padding: 10, marginVertical: 5, backgroundColor: '#f0f0f0', borderRadius: 5, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#ccc' },
    horarioAsignado: { backgroundColor: '#4CAF50', borderColor: '#388E3C' },
    horarioTexto: { color: '#333' },
    grilla: { marginTop: 20, width: '90%', backgroundColor: '#fff', borderRadius: 8, padding: 10 },
    grillaEncabezado: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: '#4CAF50', borderRadius: 8 },
    grillaEncabezadoCelda: { flex: 1, textAlign: 'center', fontWeight: 'bold', color: '#fff' },
    grillaFila: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
    grillaCelda: { flex: 1, textAlign: 'center', color: '#333' },
});