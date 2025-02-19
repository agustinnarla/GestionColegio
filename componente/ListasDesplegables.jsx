import { View } from 'react-native';
import PickerField from './PickerField';

export function CursoSelector({ formData, handleChange, curso, styles }) {
    const selectorConfig = {
        label: 'Curso',
        selectedValue: formData.id_curso,
        onValueChange: (value) => handleChange('id_curso', value),
        items: [
            { label: 'Seleccione curso', value: '' },
            ...(curso || []).map(item => ({
                label: item.detalle,
                value: item.id_curso,
                key: item.id_curso
            }))
        ]
    };

    return <PickerField {...selectorConfig} style={styles} />;
}

export function EtapaSelector({ formData, handleChange, etapaEscolar, styles }) {
    const selectorConfig = {
        label: 'Etapas evaluativa',
        selectedValue: formData.id_etapas,
        onValueChange: (value) => handleChange('id_etapas', value),
        items: [
            { label: 'Seleccione etapa evaluativa', value: '' },
            ...(etapaEscolar || []).map(item => ({
                label: item.detalle,
                value: item.id_etapas,
                key: item.id_etapas
            }))
        ]
    };

    return <PickerField {...selectorConfig} style={styles} />;
}

export function MateriaSelector({ formData, handleChange, materias, styles }) {
    const selectorConfig = {
        label: 'Materias',
        selectedValue: formData.id_materia,
        onValueChange: (value) => handleChange('id_materia', value),
        items: [
            { label: 'Seleccione materia', value: '' },
            ...(materias || []).map(item => ({
                label: item.detalle,
                value: item.id_materia,
                key: item.id_materia
            }))
        ]
    };

    return <PickerField {...selectorConfig} style={styles} />;
}

export function AlumnoSelector({ formData, handleChange, alumnos, styles }) {
    const selectorConfig = {
        label: 'Alumnos',
        selectedValue: formData.dni_alumno,
        onValueChange: (value) => handleChange('dni_alumno', value),
        items: [
            { label: 'Seleccione alumno', value: '' },
            ...(alumnos || []).map(item => ({
                label: item.nombrecompleto,
                value: item.dni_alumno,
                key: item.dni_alumno
            }))
        ]
    };
    return <PickerField {...selectorConfig} style={styles} />;
}

export function SolicitanteSelector({ formData, handleChange, solicitantes, styles }) {
    const selectorConfig = {
        label: 'Solicitante',
        selectedValue: formData.id_solicitante,
        onValueChange: (value) => handleChange('id_solicitante', value),
        items: [
            { label: 'Seleccione solicitante', value: '' },
            ...(solicitantes || []).map(item => ({
                label: item.nombre_apellido,
                value: item.id_solicitante,
                key: item.id_solicitante
            }))
        ]
    };
    return <PickerField {...selectorConfig} style={styles} />;
}

// Componente principal que combina todos los selectores
function ListasDesplegables({ formData, handleChange, curso, etapaEscolar, materias, alumnos, solicitantes, styles }) {
    return (
        <View style={styles.filtrosContainer}>
            {curso && <CursoSelector formData={formData} handleChange={handleChange} curso={curso} styles={styles} />}
            {etapaEscolar && <EtapaSelector formData={formData} handleChange={handleChange} etapaEscolar={etapaEscolar} styles={styles} />}
            {materias && <MateriaSelector formData={formData} handleChange={handleChange} materias={materias} styles={styles} />}
            {alumnos && <AlumnoSelector formData={formData} handleChange={handleChange} alumnos={alumnos} styles={styles} />}
            {solicitantes && <SolicitanteSelector formData={formData} handleChange={handleChange} solicitantes={solicitantes} styles={styles} />}
        </View>
    );
}

export default ListasDesplegables;