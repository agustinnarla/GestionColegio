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
    const [asignaciones, setAsignaciones] = useState([]);
    const [horariosAsignados, setHorariosAsignados] = useState({});

    const diasSemana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
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
            if (formData.dni_profesional && formData.id_curso && formData.id_materia) {
                console.log('Enviando parámetros:', formData.dni_profesional, formData.id_curso, formData.id_materia);
                const data = await obtenerHorasProfesor(formData.dni_profesional, formData.id_curso, formData.id_materia);
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

    const alternarHorario = (dia, rango) => {
        setHorariosAsignados((prev) => {
            const horariosDia = prev[dia] || [];
            let nuevosHorariosDia;
            let nuevaAsignaciones = [...asignaciones];

            const [hora_inicio, hora_final] = rango.split(' - ');

            if (horariosDia.includes(rango)) {
                // Quitar rango
                nuevosHorariosDia = horariosDia.filter((h) => h !== rango);
                nuevaAsignaciones = nuevaAsignaciones.filter(
                    (a) => !(a.dia_semana === dia && a.hora_inicio === hora_inicio && a.hora_final === hora_final)
                );
            } else {
                // Agregar rango
                nuevosHorariosDia = [...horariosDia, rango];
                nuevaAsignaciones.push({
                    id_materia: formData.id_materia,
                    id_curso: formData.id_curso,
                    dni_profesional: formData.dni_profesional,
                    dia_semana: dia,
                    hora_inicio,
                    hora_final,
                });
            }

            setAsignaciones(nuevaAsignaciones);

            return {
                ...prev,
                [dia]: nuevosHorariosDia,
            };
        });
    };

    
            const handleAsignarHora = async () => {
            try {
                if (asignaciones.length === 0) {
                    console.log('No hay asignaciones para enviar');
                    return;
                }
                console.log('Datos de la asignación de horas', asignaciones);
                const respuesta = await asignacionDeHoras(asignaciones); // Ajusta tu backend para recibir un array
                console.log('Respuesta del servidor:', respuesta);
            } catch (error) {
                console.error('Error al asignar la hora:', error);
            }
        };
    

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const profesoresData = await obtenerProfesores();

                if (formData.dni_profesional) {
                    const data = await obtenerCursosPorProfesor(formData.dni_profesional);
                    setCurso(data);
                    console.log('Cursos traídos exitosamente');
                }else{
                    console.log('error')
                }
                if (formData.id_curso) {
                    const materiaData = await obtenerMateriaPorCurso(formData.id_curso);
                    setMateria(materiaData);
                    console.log('Materias traídas exitosamente');
                }else{
                    console.log('error')
                }
                setProfesor(profesoresData.profesores);
            } catch (error) {
                console.log('Error al cargar los profesores:', error);
            }
        };
        cargarDatos();
    }, [formData.dni_profesional, formData.id_curso]);

   

    

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };



return (
    <View style={styles.container}>
        <Image source={bg} style={styles.bg} />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Título */}
          

            {/* Selectores */}
           <View style={styles.filtrosContainer}>
                 <ListasDesplegables
                    formData={formData}
                    handleChange={handleChange}
                    profesores={profesores}
                    curso={curso}
                    materias={materias}
                    styles={styles}
                />
            </View>
           
            

            {/* Botones de acción */}
            <View style={styles.botonesContainer}>
                <TouchableOpacity onPress={handleConsultar} style={styles.botonPrimario}>
                    <Text style={styles.textoBoton}>Consultar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleReiniciar} style={styles.botonSecundario}>
                    <Text style={styles.textoBoton}>Reiniciar</Text>
                </TouchableOpacity>
            </View>

            {/* Horarios */}
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
                                onPress={() => alternarHorario(dia, rango)}
                            >
                                <Text style={[
                                    styles.horarioTexto,
                                    horariosAsignados[dia]?.includes(rango) && styles.horarioTextoActivo
                                ]}>
                                    {rango}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>

            {/* Botón de asignar */}
            <TouchableOpacity onPress={handleAsignarHora} style={styles.botonConfirmar}>
                <Text style={styles.textoBotonGrande}>Asignar Horas</Text>
            </TouchableOpacity>
        </ScrollView>
    </View>
);
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    scrollContainer: { flexGrow: 1, alignItems: 'center', paddingBottom: 30 },
    bg: { position: 'absolute', width: '100%', height: '100%', opacity: 0.15 },
    selectorContainer: {
        width: '95%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 18,
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowRadius: 4,
    },
    selector: { flex: 1, marginHorizontal: 7 },
    horariosContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 18,
        width: '95%',
        alignSelf: 'center',
    },
    diaContainer: {
        flex: 1,
        minWidth: 140,
        marginHorizontal: 6,
        marginBottom: 22,
        backgroundColor: '#e9f0fa',
        borderRadius: 10,
        padding: 10,
        elevation: 1,
    },
    diaTitulo: {
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: '#2a3d6c',
        letterSpacing: 0.5,
    },
    horarioCuadro: {
        paddingVertical: 12,
        marginVertical: 6,
        backgroundColor: '#f0f0f0',
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#b0b0b0',
        elevation: 1,
    },
    horarioAsignado: {
        backgroundColor: '#4CAF50',
        borderColor: '#388E3C',
    },
    horarioTexto: {
        color: '#333',
        fontSize: 15,
        fontWeight: '500',
    },
    horarioTextoActivo: {
        color: '#fff',
        fontWeight: 'bold',
    },
    botonesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
        marginBottom: 10,
    },
    botonPrimario: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 8,
        marginHorizontal: 5,
        elevation: 2,
    },
    botonSecundario: {
        backgroundColor: '#f0ad4e',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 8,
        marginHorizontal: 5,
        elevation: 2,
    },
    botonConfirmar: {
        backgroundColor: '#2a3d6c',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        marginTop: 25,
        alignSelf: 'center',
        elevation: 3,
    },
    textoBoton: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    textoBotonGrande: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        letterSpacing: 1,
    },
    grilla: {
        marginTop: 20,
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
    },
    grillaEncabezado: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
    },
    grillaEncabezadoCelda: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#fff',
    },
    grillaFila: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    grillaCelda: {
        flex: 1,
        textAlign: 'center',
        color: '#333',
    }
});