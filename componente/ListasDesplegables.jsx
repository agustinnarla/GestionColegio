import React, { useState, useEffect } from 'react';
import CustomPicker from './CustomPicker';
import { obtenerCurso } from '../scripts/secretaria/scriptGestionAlumno';
import { obtenerEtapasEvaluativas, obtenerMateria } from '../scripts/secretaria/scriptCargarNotas';
import { Alert } from 'react-native';

export const CursoPicker = ({ value, onValueChange, style }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const data = await obtenerCurso();
                setItems(data);
            } catch (error) {
                Alert.alert('Error', 'Error al cargar los cursos');
            }
        };
        cargarDatos();
    }, []);

    return (
        <CustomPicker 
            label="Curso"
            style={style}
            selectedValue={value}
            onValueChange={onValueChange}
            items={[
                { label: 'Seleccione el curso', value: '' },
                ...items.map(item => ({ 
                    label: item.detalle, 
                    value: item.idcurso, 
                    key: item.idcurso 
                }))
            ]}
        />
    );
};

export const EtapaPicker = ({ value, onValueChange, style }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const data = await obtenerEtapasEvaluativas();
                setItems(data);
            } catch (error) {
                Alert.alert('Error', 'Error al cargar las etapas');
            }
        };
        cargarDatos();
    }, []);

    return (
        <CustomPicker 
            label="Etapa evaluativa"
            style={style}
            selectedValue={value}
            onValueChange={onValueChange}
            items={[
                { label: 'Seleccione una etapa', value: '' },
                ...items.map(item => ({ 
                    label: item.detalle, 
                    value: item.idetapas, 
                    key: item.idetapas 
                }))
            ]}
        />
    );
};

export const MateriaPicker = ({ value, onValueChange, style }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const data = await obtenerMateria();
                setItems(data);
            } catch (error) {
                Alert.alert('Error', 'Error al cargar las materias');
            }
        };
        cargarDatos();
    }, []);

    return (
        <CustomPicker 
            label="Materias"
            style={style}
            selectedValue={value}
            onValueChange={onValueChange}
            items={[
                { label: 'Seleccione una materia', value: '' },
                ...items.map(item => ({ 
                    label: item.detalle, 
                    value: item.idmateria, 
                    key: item.idmateria 
                }))
            ]}
        />
    );
};