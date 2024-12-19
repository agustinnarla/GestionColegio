import { View } from 'react-native';
import PickerField from './PickerField';

export function CursoSelector({ formData, handleChange, curso, styles }) {
    const selectorConfig = {
        label: 'Curso',
        selectedValue: formData.idcurso,
        onValueChange: (value) => handleChange('idcurso', value),
        items: [
            { label: 'Seleccione curso', value: '' },
            ...(curso || []).map(item => ({
                label: item.detalle,
                value: item.idcurso,
                key: item.idcurso
            }))
        ]
    };

    return <PickerField {...selectorConfig} style={styles} />;
}

export function EtapaSelector({ formData, handleChange, etapaEscolar, styles }) {
    const selectorConfig = {
        label: 'Etapas evaluativa',
        selectedValue: formData.idetapas,
        onValueChange: (value) => handleChange('idetapas', value),
        items: [
            { label: 'Seleccione etapa evaluativa', value: '' },
            ...etapaEscolar.map(item => ({
                label: item.detalle,
                value: item.idetapas,
                key: item.idetapas
            }))
        ]
    };

    return <PickerField {...selectorConfig} style={styles} />;
}

export function MateriaSelector({ formData, handleChange, materias, styles }) {
    const selectorConfig = {
        label: 'Materias',
        selectedValue: formData.idmateria,
        onValueChange: (value) => handleChange('idmateria', value),
        items: [
            { label: 'Seleccione materia', value: '' },
            ...materias.map(item => ({
                label: item.detalle,
                value: item.idmateria,
                key: item.idmateria
            }))
        ]
    };

    return <PickerField {...selectorConfig} style={styles} />;
}

// Componente principal que combina todos los selectores
function ListasDesplegables({ formData, handleChange, curso, etapaEscolar, materias, styles }) {
    return (
        <View style={styles.filtrosContainer}>
            <CursoSelector formData={formData} handleChange={handleChange} curso={curso} styles={styles} />
            <EtapaSelector formData={formData} handleChange={handleChange} etapaEscolar={etapaEscolar} styles={styles} />
            <MateriaSelector formData={formData} handleChange={handleChange} materias={materias} styles={styles} />
        </View>
    );
}

export default ListasDesplegables; 