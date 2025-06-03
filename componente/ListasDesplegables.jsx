import { View } from 'react-native';
import PickerField from './PickerField';

export function CursoSelector({ formData, handleChange, curso, styles, showLabel = true }) {
    const selectorConfig = {
        // Solo incluye el label si showLabel es true
        ...(showLabel && { label: 'Seleccione un Curso:' }),
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

export function SexoSelector({ formData, handleChange, sexo, styles }) {
    const selectorConfig = {
        label: 'Seleccione un Sexo',
        selectedValue: formData.id_sexo,
        onValueChange: (value) => handleChange('id_sexo', value),
        items: [
            { label: 'Seleccione sexo:', value: '' },
            ...(sexo || []).map(item => ({
                label: item.detalle,
                value: item.id_sexo,
                key: item.id_sexo
            }))
        ]
    };

    return <PickerField {...selectorConfig} style={styles} />;
}

export function MateriaPorProfesor({ formData, handleChange, materia, styles, showLabel }) {
    const selectorConfig = {
        ...(showLabel && { label: 'Seleccione una Materia:' }),
        selectedValue: formData.id_materia,
        onValueChange: (value) => handleChange('id_materia', value),
        items: [
            { label: 'Seleccione materia', value: '' },
            ...(materia || []).map(item => ({
                label: item.detalle,
                value: item.id_materia,
                key: item.id_materia
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

export function MateriaSelector({ formData, handleChange, materias, styles, showLabel }) {
    const selectorConfig = {
        ...(showLabel && { label: 'Seleccione una Materia:' }),
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
        label: 'Seleccione un Alumno:',
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

export function ProfesionalSelector({ formData, handleChange, profesionales, styles }) {
    const selectorConfig = {
        label: 'Seleccione un Profesional:',
        selectedValue: formData.dni_profesional,
        onValueChange: (value) => handleChange('dni_profesional', value),
        items: [
            { label: 'Seleccione profesional', value: '' },
            ...(profesionales || []).map(item => ({
                label: item.nombre_apellido,
                value: item.dni_profesional,
                key: item.dni_profesional
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

export function EstadoSelector({ formData, handleChange, estado_general, styles }) {
    const selectorConfig = {
        label: 'Estado General',
        selectedValue: formData.id_estado_general,
        onValueChange: (value) => handleChange('id_estado_general', value),
        items: [
            { label: 'Seleccione estado', value: '' },
            ...(estado_general || []).map(item => ({
                label: item.detalle,
                value: item.id_estado_general,
                key: item.id_estado_general
            }))
        ]
    };
    return <PickerField {...selectorConfig} style={styles} />;
}

export function RolesSelector({ formData, handleChange, roles, styles }) {
    const selectorConfig = {
        label: 'Roles',
        selectedValue: formData.id_rol,
        onValueChange: (value) => handleChange('id_rol', value),
        items: [
            { label: 'Seleccione rol', value: '' },
            ...(roles || []).map(item => ({
                label: item.detalle,
                value: item.id_rol,
                key: item.id_rol
            }))
        ]
    };
    return <PickerField {...selectorConfig} style={styles} />;
}

export function LocalidadSelector({ formData, handleChange, localidad, styles }) {
    const selectorConfig = {
        label: 'Localidad',
        selectedValue: formData.id_localidad,
        onValueChange: (value) => handleChange('id_localidad', value),
        items: [
            { label: 'Seleccione localidad', value: '' },
            ...(localidad || []).map(item => ({
                label: item.detalle,
                value: item.id_localidad,
                key: item.id_localidad
            }))
        ]
    };
    return <PickerField {...selectorConfig} style={styles} />;
}

export function CaracteristicaSelector({ formData, handleChange, caracteristica_unidad, styles }) {
    const selectorConfig = {
        label: 'Características de la unidad',
        selectedValue: formData.id_caracteristica_unidad,
        onValueChange: (value) => handleChange('id_caracteristica_unidad', value),
        items: [
            { label: 'Seleccione la característica de la unidad', value: '' },
            ...(caracteristica_unidad || []).map(item => ({
                label: item.detalle,
                value: item.id_caracteristica_unidad,
                key: item.id_caracteristica_unidad
            }))
        ]
    };
    return <PickerField {...selectorConfig} style={styles} />;
}

export function TipoDeEvaluacionSelector({ formData, handleChange, tipo_de_evaluacion, styles }) {
    const selectorConfig = {
        label: 'Seleccion un Tipo de evaluación',
        selectedValue: formData.id_tipo_de_evaluacion,
        onValueChange: (value) => handleChange('id_tipo_de_evaluacion', value),
        items: [
            { label: 'Seleccione el tipo de evaluación', value: '' },
            ...(tipo_de_evaluacion || []).map(item => ({
                label: item.detalle,
                value: item.id_tipo_de_evaluacion,
                key: item.id_tipo_de_evaluacion
            }))
        ]
    };
    return <PickerField {...selectorConfig} style={styles} />;
}

export function ProfesorSelector({ formData, handleChange, profesores, styles }) {
    const selectorConfig = {
        label: 'Seleccione un profesor',
        selectedValue: formData.dni_profesional,
        onValueChange: (value) => handleChange('dni_profesional', value),
        items: [
            { label: 'Seleccione un profesor', value: '' },
            ...(profesores || []).map(item => ({
                label: item.nombre,
                value: item.dni_profesional,
                key: item.dni_profesional
            }))
        ]
    };
    return <PickerField {...selectorConfig} style={styles} />;
}



// Componente principal que combina todos los selectores
function ListasDesplegables({
    formData,
    handleChange,
    curso,
    etapaEscolar,
    materias,
    alumnos,
    solicitantes,
    roles,
    styles,
    caracteristica_unidad,
    profesores,
    materia,
    tipo_de_evaluacion,
    sexo,
    estado_general,
    localidad,
    profesionales,
    showLabel
}) {
    return (
        <View style={styles.filtrosContainer}>
            {curso && (
                <CursoSelector
                    formData={formData}
                    handleChange={handleChange}
                    curso={curso}
                    styles={styles}
                    showLabel={showLabel}
                />
            )}
            {etapaEscolar && (
                <EtapaSelector
                    formData={formData}
                    handleChange={handleChange}
                    etapaEscolar={etapaEscolar}
                    styles={styles}
                />
            )}
            {materias && (
                <MateriaSelector
                    formData={formData}
                    handleChange={handleChange}
                    materias={materias}
                    styles={styles}
                    showLabel={showLabel}
                />
            )}
            {materia && (
                <MateriaPorProfesor
                    formData={formData}
                    handleChange={handleChange}
                    materias={materia}
                    styles={styles}
                    showLabel={showLabel}
                />
            )}
            {alumnos && (
                <AlumnoSelector
                    formData={formData}
                    handleChange={handleChange}
                    alumnos={alumnos}
                    styles={styles}
                />
            )}
            {profesores && (
                <ProfesorSelector
                    formData={formData}
                    handleChange={handleChange}
                    profesores={profesores}
                    styles={styles}
                />
            )}
            {tipo_de_evaluacion && (
                <TipoDeEvaluacionSelector
                    formData={formData}
                    handleChange={handleChange}
                    tipo_de_evaluacion={tipo_de_evaluacion}
                    styles={styles}
                />
            )}
            {caracteristica_unidad && (
                <CaracteristicaSelector
                    formData={formData}
                    handleChange={handleChange}
                    caracteristica_unidad={caracteristica_unidad}
                    styles={styles}
                />
            )}
            {solicitantes && (
                <SolicitanteSelector
                    formData={formData}
                    handleChange={handleChange}
                    solicitantes={solicitantes}
                    styles={styles}
                />
            )}
            {roles && (
                <RolesSelector
                    formData={formData}
                    handleChange={handleChange}
                    roles={roles}
                    styles={styles}
                />
            )}
            {sexo && (
                <SexoSelector
                    formData={formData}
                    handleChange={handleChange}
                    sexo={sexo}
                    styles={styles}
                />
            )}
            {estado_general && (
                <EstadoSelector
                    formData={formData}
                    handleChange={handleChange}
                    estado_general={estado_general}
                    styles={styles}
                />
            )}
            {localidad && (
                <LocalidadSelector
                    formData={formData}
                    handleChange={handleChange}
                    localidad={localidad}
                    styles={styles}
                />
            )}
            {profesionales && (
                <ProfesionalSelector
                    formData={formData}
                    handleChange={handleChange}
                    profesionales={profesionales}
                    styles={styles}
                />
            )}
        </View>
    );
}


export default ListasDesplegables;