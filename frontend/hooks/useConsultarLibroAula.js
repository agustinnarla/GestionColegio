import React, { useEffect, useState } from "react";
import { obtenerMateriaPorProfesor, obtenerProfesores, obtenerCursoPorMateria } from '../scripts/listasDesplegables/listaDesplegable.js'
import { obtenerLibroAula } from '../scripts/profesor/scriptLibroAula.js';



export default function useConsultarLibroAula(){

    const [datos, setDatos] = useState([]);
    // Formularios
    const [formData, setFormData] = useState({
        id_materia: '',
        id_curso: '',
        dni_profesional: '',
        fecha: '',
        numero_clase: '',
        unidad: '',
        caracteristica_unidad: '',
        tema_abarcado: ''
    });

    // Mensajes 
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const mostrarMensaje = (titulo, mensaje) => {
        setAlertTitle(titulo);
        setAlertMessage(mensaje);
        setAlertVisible(true);
    };

    // Listas desplegables 
    const [materia, setMateria] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [curso, setCurso] = useState([]);

    // Cargamos las listas desplegables a partir del backend 
    useEffect(() => {
        const cargarListaDesplegable = async () => {
            try {
                const profesoresData = await obtenerProfesores();
                setProfesores(profesoresData);

                if (formData.dni_profesional) {
                    const materiaData = await obtenerMateriaPorProfesor(formData.dni_profesional);
                    setMateria(materiaData);
                } else {
                    setMateria([]);
                }

                if (formData.id_materia) {
                    const cursoData = await obtenerCursoPorMateria(formData.id_materia);
                    setCurso(cursoData);
                } else {
                    setCurso([]);
                }
            } catch{
                mostrarMensaje('Error', 'Error al cargar las listas desplegables, consulte con el administrador')
            }
        };
        cargarListaDesplegable();
    }, [formData.dni_profesional, formData.id_materia]);
    

    // Consultamos el libro de aula
    const handleConsultar = async () => {
        try {
            const respuesta = await obtenerLibroAula(formData.dni_profesional, formData.id_curso, formData.id_materia);
            const libroAula = respuesta.libro_aula || [];
            if(!libroAula.length){
                mostrarMensaje('Advertencia', 'No hay registros de acuerdo a los filtros proporcionados')
            }
            setDatos(libroAula);
        } catch{
            mostrarMensaje('Error', 'Error al consultar el libro de aula')
        }
    };

    // Reiniciamos valores 
    const reiniciarFiltro = () => {
        setDatos([]);
        setFormData({
            id_materia: '',
            id_curso: '',
            dni_profesional: '',
            fecha: '',
            numero_clase: '',
            unidad: '',
            caracteristica_unidad: '',
            tema_abarcado: ''
        });
    };

    // Validamos que los datos tengan contenido
    const validarDatos = () => {
        return (
            formData.dni_profesional &&
            formData.id_materia &&
            formData.id_curso 
        );
    };

    // Cambiamos el valor de las listas desplegables 
    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    

    return {
        handleChange,
        handleConsultar,
        mostrarMensaje,
        reiniciarFiltro,
        validarDatos,
        setAlertVisible,
        setFormData,
        formData,
        alertVisible,
        alertTitle,
        alertMessage,
        curso,
        profesores,
        materia,
        datos
        }
}
