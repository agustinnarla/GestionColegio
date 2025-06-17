const api_urlSexo = 'http://localhost:5000/listaDesplegable/sexo';
const api_urlCurso = 'http://localhost:5000/listaDesplegable/curso';
const api_urlCursoFiltrado = 'http://localhost:5000/listaDesplegable/curso';
const api_urlEstadoGeneral = 'http://localhost:5000/listaDesplegable/estadoGeneral';
const api_urlLocalidad = 'http://localhost:5000/listaDesplegable/localidad';
const api_urlMateria = 'http://localhost:5000/listaDesplegable/materia';
const api_urlMateriasDeshabilitadas = 'http://localhost:5000/listaDesplegable/materia/deshabilitada';
const api_urlCertificado = 'http://localhost:5000/listaDesplegable/certificado';
const api_urlEstadoAsistencia = 'http://localhost:5000/listaDesplegable/estadoAsistencia';
const api_urlProfesorPorMateria = 'http://localhost:5000/listaDesplegable/profesor/materia';
const api_urlProfesor = 'http://localhost:5000/listaDesplegable/profesor';
const api_urlRoles = 'http://localhost:5000/listaDesplegable/roles';
const api_urlRolesDeshabilitados = 'http://localhost:5000/listaDesplegable/roles/deshabilitados';
const api_urlTareasDeRoles = 'http://localhost:5000/listaDesplegable/rol/tarea';
const api_urlTareas = 'http://localhost:5000/listaDesplegable/tareas';
const api_urlTareasDeshabilitadas = 'http://localhost:5000/listaDesplegable/tareas/deshabilitadas';
const api_urlTareaRol = 'http://localhost:5000/listaDesplegable/tarea/rol';
const api_urlRolesDeTarea = 'http://localhost:5000/listaDesplegable/tarea/rol';
const api_urlEspecialidad = 'http://localhost:5000/listaDesplegable/especialidad';
const api_urlMateriaPorDni = 'http://localhost:5000/listaDesplegable/alumno/materia';
const api_urlMateriaPorProfesor = 'http://localhost:5000/listaDesplegable/materia/profesor';
const api_urlCaracteristicasUnidad = 'http://localhost:5000/listaDesplegable/caracteristicas';
const api_urlCursoPorMateria = 'http://localhost:5000/listaDesplegable/curso/materia';
const api_urlTipoDeEvaluacion = 'http://localhost:5000/listaDesplegable/tipo_de_evaluacion';
const api_urlCursosPorProfesor = 'http://localhost:5000/listaDesplegable/profesor/curso';
const api_urlMateriasPorProfesor = 'http://localhost:5000/listaDesplegable/profesor/curso/materia';
const api_urlAlumnosNoRegulares = 'http://localhost:5000/listaDesplegable/profesor/curso/alumnos';
const api_urlProfesores = 'http://localhost:5000/listaDesplegable/profesores';
const api_urlCursoPorProfesor = 'http://localhost:5000/listaDesplegable/curso/profesor';
const api_urlMateriaPorCurso = 'http://localhost:5000/listaDesplegable/materia/curso';
const api_urlProfesionalesAsistencia = 'http://localhost:5000/listaDesplegable/profesionales/asistencia';
const api_urlEstadosFaltaProfesionales = 'http://localhost:5000/listaDesplegable/justificar/profesional/estadoFalta';
const api_urlAlumnoCurso = 'http://localhost:5000/listaDesplegable/alumnos/curso'
const api_urlAsistencia = 'http://localhost:5000/alumno/justificarFalta/estado_falta'
const api_urlProfesionales = 'http://localhost:5000/listaDesplegable/profesionales'

export const obtenerSexo = async () => {
    try {
        const response = await fetch(`${api_urlSexo}`);
        const data = await response.json();
        return data.sexo || [];
    } catch (error) {
        console.error('Error al obtener sexo:', error);
        return [];
    }
};

export const obtenerCurso = async () => {
    try {
        const response = await fetch(`${api_urlCurso}`);
        const data = await response.json();
        return data.curso || [];
    } catch (error) {
        console.error('Error al obtener curso:', error);
        return [];
    }
};

export const obtenerCursoFiltrado = async (id_curso) => {
    try {
        const response = await fetch(`${api_urlCursoFiltrado}/${id_curso}`);
        const data = await response.json();
        return data.curso || [];
    } catch (error) {
        console.error('Error al obtener curso filtrado:', error);
        return { curso: [] };
    }
};

export const obtenerEstadoGeneral = async () => {
    try {
        const response = await fetch(`${api_urlEstadoGeneral}`);
        const data = await response.json();
        return data.estadoGeneral || [];
    } catch (error) {
        console.error('Error al obtener estado general:', error);
        return { estadoGeneral: [] };
    }
};

export const obtenerLocalidad = async () => {
    try {
        const response = await fetch(`${api_urlLocalidad}`);
        const data = await response.json();
        return data.localidad || [];
    } catch (error) {
        console.error('Error al obtener localidad:', error);
        return { localidad: [] };
    }
};

export const obtenerMateria = async () => {
    try {
        const response = await fetch(`${api_urlMateria}`);
        const data = await response.json();
        return data.materias || [];
    } catch (error) {
        console.error('Error al obtener materia:', error);
        return { materia: [] };
    }
};

export const obtenerMateriasDeshabilitadas = async () => {
    try {
        const response = await fetch(`${api_urlMateriasDeshabilitadas}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener materias deshabilitadas:', error);
        return { materias: [] };
    }
};

export const obtenerCertificado = async () => {
    try {
        const response = await fetch(`${api_urlCertificado}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener certificado:', error);
        return { certificado: [] };
    }
};

export const obtenerEstadoAsistencia = async () => {
    try {
        const response = await fetch(`${api_urlEstadoAsistencia}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener estado asistencia:', error);
        return { estadoAsistencia: [] };
    }
};

export const obtenerProfesorPorMateria = async (id_materia) => {
    try {
        const response = await fetch(`${api_urlProfesorPorMateria}/${id_materia}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener profesor por materia:', error);
        return { profesores: [] };
    }
};

export const obtenerProfesor = async () => {
    try {
        const response = await fetch(`${api_urlProfesor}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener profesor:', error);
        return { profesor: [] };
    }
};

export const obtenerRoles = async () => {
    try {
        const response = await fetch(`${api_urlRoles}`);
        const data = await response.json();
        return data.roles || [];
    } catch (error) {
        console.error('Error al obtener roles:', error);
        return { roles: [] };
    }
};

export const obtenerTareasDeRoles = async (id_rol) => {
    try {
        const response = await fetch(`${api_urlTareasDeRoles}/${id_rol}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener tareas de roles:', error);
        return { tareas: [] };
    }
};

export const obtenerTareas = async () => {
    try {
        const response = await fetch(`${api_urlTareas}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        return { tareas: [] };
    }
};

export const obtenerTareasDeshabilitadas = async () => {
    try {
        const response = await fetch(`${api_urlTareasDeshabilitadas}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener tareas deshabilitadas:', error);
        return { tareas: [] };
    }
};

export const obtenerTareaRol = async (id_rol) => {
    try {
        const response = await fetch(`${api_urlTareaRol}/${id_rol}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener tarea rol:', error);
        return { tareas: [] };
    }
};

export const obtenerRolesDeTarea = async (id_tarea) => {
    try {
        const response = await fetch(`${api_urlRolesDeTarea}/${id_tarea}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener roles de tarea:', error);
        return { roles: [] };
    }
};

export const obtenerEspecialidad = async () => {
    try {
        const response = await fetch(`${api_urlEspecialidad}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener especialidad:', error);
        return { especialidad: [] };
    }
};

export const obtenerMateriaPorDni = async (dni_alumno) => {
    try {
        const response = await fetch(`${api_urlMateriaPorDni}/${dni_alumno}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener materia por dni:', error);
        return { materias: [] };
    }
};

export const obtenerMateriaPorProfesor = async (dni_profesional) => {
    try {
        const response = await fetch(`${api_urlMateriaPorProfesor}/${dni_profesional}`);
        const data = await response.json();
        return data.materia || [];
    } catch (error) {
        console.error('Error al obtener materia por profesor:', error);
        return [];
    }
};

export const obtenerCaracteristicasUnidad = async () => {
    try {
        const response = await fetch(`${api_urlCaracteristicasUnidad}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener caracteristicas unidad:', error);
        return { caracteristicas: [] };
    }
};

export const obtenerCursoPorMateria = async (id_materia) => {
    try {
        const response = await fetch(`${api_urlCursoPorMateria}/${id_materia}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener curso por materia:', error);
        return { cursos: [] };
    }
};

export const obtenerTipoDeEvaluacion = async () => {
    try {
        const response = await fetch(`${api_urlTipoDeEvaluacion}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener tipo de evaluacion:', error);
        return { tipoDeEvaluacion: [] };
    }
};

export const obtenerCursosPorProfesor = async (dni_profesional) => {
    try {
        const response = await fetch(`${api_urlCursosPorProfesor}/${dni_profesional}`);
        const data = await response.json();
        return data.cursos || [];
    } catch (error) {
        console.error('Error al obtener cursos por profesor:', error);
        return { cursos: [] };
    }
};

export const obtenerMateriasPorProfesor = async (dni_profesional) => {
    try {
        const response = await fetch(`${api_urlMateriasPorProfesor}/${dni_profesional}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener materias por profesor:', error);
        return { materias: [] };
    }
};

export const obtenerAlumnosNoRegulares = async (dni_profesional) => {
    try {
        const response = await fetch(`${api_urlAlumnosNoRegulares}/${dni_profesional}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener alumnos no regulares:', error);
        return { alumnos: [] };
    }
};

export const obtenerProfesores = async () => {
    try {
        const response = await fetch(`${api_urlProfesores}`);
        const data = await response.json();
        return data.profesores || [];
    } catch (error) {
        console.error('Error al obtener profesores:', error);
        return { profesores: [] };
    }
};

export const obtenerCursoPorProfesor = async (dni_profesional) => {
    try {
        const response = await fetch(`${api_urlCursoPorProfesor}/${dni_profesional}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener curso por profesor:', error);
        return { cursos: [] };
    }
};

export const obtenerMateriaPorCurso = async (id_curso) => {
    try {
        const response = await fetch(`${api_urlMateriaPorCurso}/${id_curso}`);
        const data = await response.json();
        return data.materias || [];
    } catch (error) {
        console.error('Error al obtener materia por curso:', error);
        return { materias: [] };
    }
};

export const obtenerProfesionalesAsistencia = async () => {
    try {
        const response = await fetch(`${api_urlProfesionalesAsistencia}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener profesionales asistencia:', error);
        return { profesionales: [] };
    }
};

export const obtenerEstadosFaltaProfesionales = async () => {
    try {
        const response = await fetch(`${api_urlEstadosFaltaProfesionales}`);
        const data = await response.json();
        return data.estado || [];
    } catch (error) {
        console.error('Error al obtener estados falta profesionales:', error);
        return { estado: [] };
    }
};

export const obtenerRolesDeshabilitados = async () => {
    try {
        const response = await fetch(`${api_urlRolesDeshabilitados}`);
        const data = await response.json();
        console.log('Respuesta de la API:', data);
        return data;
    } catch (error) {
        console.error('Error al obtener roles:', error);
        return { roles: [] }; 
    }
};

export const obtenerAlumnoCurso = async (id_curso) => {
    try {
        const response = await fetch(`${api_urlAlumnoCurso}/${id_curso}`);
        const data = await response.json();
        return data.alumnos || [];
    } catch (error) {
        console.error('Error al obtener alumnos:', error);
        return { sexo: [] };
    }
};

export const obtenerEstadoFalta = async () => {
    try {
        const url = `${api_urlAsistencia}`

        const respuesta = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await respuesta.json();
        console.log('Respuesta de la API:', data); // Verifica la respuesta de la API
        return data;  // Devuelve la respuesta completa
    } catch (error) {
        console.error("Error al obtener el estado de falta:", error.message);
        throw new Error("Error al obtener el estado de falta");
    }
};

export const obtenerProfesionales = async () => {
    try {
        const response = await fetch(`${api_urlProfesionales}`);
        const data = await response.json();
        return data.profesionales || [];
    } catch (error) {
        console.error('Error al obtener sexo:', error);
        return [];
    }
};
