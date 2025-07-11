import { useState, useEffect, useMemo } from "react";
import { Alert, Platform } from "react-native";
import { obtenerCurso, obtenerAlumnoCurso, obtenerProfesionales } from '../scripts/listasDesplegables/listaDesplegable.js';
import { registrarAmonestacion, imprimirArchivo, obtenerCantidadAmonestaciones } from '../scripts/preceptor/scriptGestionAmonestacion.js';

export default function useAmonestacion() {
    // Formulario
    const [formData, setFormData] = useState({
        dni_alumno: '',
        dni_profesional: '',
        cantidad: '',
        fecha: '',
        motivo: '',
        id_curso: ''
    });

    // Listas desplegables
    const [cursos, setCursos] = useState([]);
    const [profesionales, setProfesionales] = useState([]);
    const [alumnos, setAlumnos] = useState([]);
    const [totalAmonestaciones, setTotalAmonestaciones] = useState('0');

    // Modal y mensajes
    const [modalVisible, setModalVisible] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const mostrarMensaje = (titulo, mensaje) => {
        setAlertTitle(titulo);
        setAlertMessage(mensaje);
        setAlertVisible(true);
    };

    // Validaciones y helpers
    const validarNumeroPositivo = (numero) => !isNaN(numero) && parseInt(numero) > 0;

    const validarFecha = (fecha) => {
        const regex = /^\d{2}-\d{2}-\d{4}$/;
        if (!regex.test(fecha)) return false;
        const [dia, mes, año] = fecha.split('-').map(Number);
        const fechaValida = new Date(año, mes - 1, dia);
        if (
            fechaValida.getFullYear() !== año ||
            fechaValida.getMonth() !== mes - 1 ||
            fechaValida.getDate() !== dia
        ) return false;
        if (año <= 2024) return false;
        const inicioRango = new Date(año, 1, 21);
        const finRango = new Date(año, 11, 21);
        if (fechaValida < inicioRango || fechaValida > finRango) return false;
        return true;
    };

    const formatearFecha = (fecha) => {
        const [dia, mes, año] = fecha.split('-');
        return `${año}-${mes}-${dia}`;
    };

    const validarCampos = () => {
        const fechaEsValida = validarFecha(formData.fecha);
        return formData.dni_alumno &&
            formData.dni_profesional &&
            formData.cantidad.length >= 1 &&
            formData.fecha.length >= 10 &&
            formData.motivo.length >= 3 &&
            formData.id_curso &&
            fechaEsValida &&
            validarNumeroPositivo(formData.cantidad);
    };

    const validarFomulario = useMemo(() => validarCampos(), [formData]);

    // Cargar cursos y solicitantes
    useEffect(() => {
        const cargarListaDesplegables = async () => {
            try {
                const cursosData = await obtenerCurso();
                const profesionalData = await obtenerProfesionales();
                if (formData.id_curso) {
                try {
                    const alumnosData = await obtenerAlumnoCurso(formData.id_curso);
                    setAlumnos(alumnosData);
                } catch (error) {
                    console.error('Error al cargar alumnos:', error);
                }
                }    
                setCursos(cursosData);
                setProfesionales(profesionalData)
            } catch (error) {
                Alert.alert('Error', error.message);
            }
        };
        cargarListaDesplegables();
    }, [formData.id_curso]);

    
    // Cargar cantidad de amonestaciones de acuerdo al DNI
    useEffect(() => {
        const cargarAmonestacion = async () => {
            if (formData.dni_alumno) {
                try {
                    const total = await obtenerCantidadAmonestaciones(formData.dni_alumno);
                    setTotalAmonestaciones(total ? total.toString() : "0");
                } catch (error) {
                    console.error('Error al obtener total de amonestaciones:', error);
                    setTotalAmonestaciones("0");
                }
            }
        };
        cargarAmonestacion();
    }, [formData.dni_alumno]);

    // Acciones
    const handleRegistrar = async () => {
        try {
            const alumnoData = {
                dni_alumno: parseInt(formData.dni_alumno),
                dni_profesional: parseInt(formData.dni_profesional),
                cantidad: parseInt(formData.cantidad),
                fecha: formatearFecha(formData.fecha),
                motivo: formData.motivo
            };

            if (!validarCampos()) {
                mostrarMensaje('Error', 'Por favor complete todos los campos correctamente');
                return;
            }

            // Hacer lo del spiner 

            const respuesta = await registrarAmonestacion(alumnoData);
            mostrarMensaje('¡Éxito!', 'La amonestación se registró correctamente');
            setModalVisible(true);
        } catch (error) {
            //console.error('Error al registrar la amonestación:', error.message);
            mostrarMensaje('Error', 'No se pudo registrar la amonestación');
        }
    };

    const limpiarInterfaz = () => {
        setFormData({
            dni_alumno: '',
            dni_profesional: '',
            cantidad: '',
            fecha: '',
            motivo: '',
            id_curso: ''
        });
        setTotalAmonestaciones('0');
        setModalVisible(false);
    };


    const handleImprimir = async () => {
        try {
            const alumnoSeleccionado = alumnos.find(a => parseInt(a.dni_alumno) === parseInt(formData.dni_alumno));
            const profesionalSeleccionado = profesionales.find(p => parseInt(p.dni_profesional) === parseInt(formData.dni_profesional));
            const rutaPDF = await imprimirArchivo(formData, alumnoSeleccionado, profesionalSeleccionado);
            mostrarMensaje('Éxito', `PDF generado correctamente`);
            if (Platform.OS === 'web') window.open(rutaPDF);
            limpiarInterfaz();
            setModalVisible(false);
        } catch (error) {
            console.error('Error al imprimir:', error);
            mostrarMensaje('Error', 'No se pudo generar el PDF');
        }
    };

    // Cambio de valor en una lista desplegable 
    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    return {
        formData,
        setFormData,
        cursos,
        profesionales,
        alumnos,
        totalAmonestaciones,
        modalVisible,
        setModalVisible,
        alertVisible,
        setAlertVisible,
        alertTitle,
        alertMessage,
        mostrarMensaje,
        validarFomulario,
        handleRegistrar,
        limpiarInterfaz,
        handleImprimir,
        handleChange,
    };
}