import React, { useEffect, useState } from "react";
import {  obtenerProfesores, obtenerCursoPorProfesor, obtenerMateriaPorCursoYProfesor } from '../scripts/listasDesplegables/listaDesplegable.js'
import { obtenerLibroAula } from '../scripts/profesor/scriptLibroAula.js';



export default function useConsultarLibroAula(){

    const [datos, setDatos] = useState([]);

    //🟢 Formularios
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

    //🟢 Estados de Mensajes 
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    //🟢 Mensajes
    const mostrarMensaje = (titulo, mensaje) => {
        setAlertTitle(titulo);
        setAlertMessage(mensaje);
        setAlertVisible(true);
    };

    //🟢 Estados y Listas desplegables 
    const [materia, setMateria] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [curso, setCurso] = useState([]);

    //🟢Cargamos las listas desplegables  
    useEffect(() => {
        const cargarListaDesplegable = async () => {
            try {
                const profesoresData = await obtenerProfesores();
                setProfesores(profesoresData);

                if (formData.dni_profesional) {
                    const cursoData = await obtenerCursoPorProfesor(formData.dni_profesional);
                    setCurso(cursoData);
                } else {
                    setCurso([]);
                }

                if (formData.id_curso,formData.dni_profesional) {
                    const materiaData = await obtenerMateriaPorCursoYProfesor(formData.id_curso,formData.dni_profesional);
                    setMateria(materiaData);
                } else {
                    setMateria([]);
                }

            } catch{
                mostrarMensaje('Error', 'Error al cargar las listas desplegables, consulte con el administrador')
            }
        };
        cargarListaDesplegable();
    }, [formData.dni_profesional, formData.id_curso]);
    

    //🟢 Consultamos el libro de aula
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

    
    //🟢 Reiniciamos valores 
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

    //🟢 Validamos los campos para habilitar el boton 
    const validarCampo = () => {
        return (
            formData.dni_profesional &&
            formData.id_materia &&
            formData.id_curso 
        );
    };

    //🟢 Cambiamos el estado de las listas desplegables 
    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    

    return {
        handleChange,
        handleConsultar,
        mostrarMensaje,
        reiniciarFiltro,
        validarCampo,
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
