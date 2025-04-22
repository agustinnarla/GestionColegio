import { Router } from 'express'
import multer from 'multer'
import { 
    agregarAlumno, agregarLegajo, deshabilitarAlumno, modificarAlumno, obtenerAlumno, 
    obtenerAlumnoCurso, obtenerAlumnoFiltrado, obtenerLegajoAlumnoFiltrado, 
    obtenerAlumnoNombreApellido, obtenerLegajoAlumno, modificarAdjuntoLegajo 
} from '../metodos/metodosGestionAlumno.mjs'

import { obtenerSexo } from '../metodos/metodosSexo.mjs'
import { obtenerCurso, obtenerCursoFiltrado, registrarCursoPorMateria } from '../metodos/metodosCurso.mjs'
import { obtenerEstadoAlumno } from '../metodos/metodosEstadoAlumno.mjs'
import { obtenerLocalidad } from '../metodos/metodosLocalidad.mjs'
import { obtenerSolicitante } from '../metodos/metodosSolicitante.mjs'
import { registrarObservacion } from '../metodos/metodosObservacion.mjs'
import { registrarAmonestacion, obtenerCantidadAmonestaciones } from '../metodos/metodosAmonestacion.mjs'
import { 
    modificarAsistencia, registrarAsistenciaBackend, validarFechaAsistencia, 
    obtenerModificacionAlumnosAusentes, obtenerFaltasSuperadas 
} from '../metodos/metodosAsistencia.mjs'
import { obtenerNotas, registrarNota } from '../metodos/metodosCargarNotas.mjs'
import { obtenerMateriaPorDni } from '../metodos/metodosMateria.mjs'
import { obtenerEtapaEvaluativa } from '../metodos/metodosEtapaEvaluativa.mjs'
import { obtenerAlumnoFinal, registrarCursoNuevo } from '../metodos/metodosPasarCurso.mjs'
import {  
    obtenerAlumnosAusentes, obtenerEstadosFalta, obtenerJustificarFalta, 
    registrarJustificacion, ActualizarEstadoLibreAlumno 
} from '../metodos/metodosJustificarFalta.mjs'
import { obtenerEstadoCertificado } from '../metodos/metodosCertificados.mjs'
import { obtenerEstadoInasistencia } from '../metodos/metodosEstado.mjs'
import { cargarGrilla } from '../metodos/metodosLibroMatriz.mjs'
import { obtenerMaterias, obtenerProfesor, registrarMateriaProfesor, obtenerProfesorXMateria, eliminarMateriaProfesor, deshabilitarMateria, insertarMateria, obtenerMateriasDeshabilitadas, habilitarMateria} from '../metodos/metodosGestionMateria.mjs'
import {registrarRol, obtenerRolesDeshabilitados, deshabilitarRol, habilitarRol} from '../metodos/metodosRoles.mjs'
import { agregarTarea, deshabilitarTarea, obtenerTareasDeshabilitadas, habilitarTarea} from '../metodos/metodosCargarTarea.mjs'
import { obtenerTareas,obtenerRoles, obtenerTareasDeRoles, registrarTareaRol, eliminaRolTarea, eliminarTareaRol, obtenerRolesDeTarea} from '../metodos/metodosTareasRoles.mjs'
import { registrarUsuario, restablecerContrasena, consultarUsuario, modificarUsuario, deshabilitarUsuario} from '../metodos/metodosRegistrarUsuario.mjs'
import { enviarEmail, ingresarUsuario} from '../metodos/metodosLogin.mjs'
import { obtenerEspecialidad } from '../metodos/metodosEspecialidad.mjs'
import { obtenerUsuario } from '../metodos/metodosPerfil.mjs'
import { obtenerAvisosGenerales, obtenerAvisosCurso } from '../metodos/metodosAvisos.mjs'
import { obtenerMateriaPorProfesor, obtenerCaracteristicasUnidas, obtenerCursoPorMateria, registrarLibroAula } from '../metodos/metodosLibroAula.mjs'
import { obtenerTipoDeEvaluacion, registrarEvaluacion } from '../metodos/metodosAsignarEvaluacion.mjs'
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Creación del router
export const ruta = Router()

// =====================================
//         GESTIÓN DE ALUMNOS
// =====================================
ruta.get('/alumnos', obtenerAlumno)
ruta.get('/alumnos/:dni_alumno', obtenerAlumnoFiltrado)
ruta.get('/alumnosNombreApellido', obtenerAlumnoNombreApellido)
ruta.get('/alumnosPorCurso/:id_curso', obtenerAlumnoCurso)
ruta.get('/alumnosLegajo', obtenerLegajoAlumno)
ruta.get('/alumnosLegajo/:dni_alumno/:imagenTipo', obtenerLegajoAlumnoFiltrado)

ruta.post('/alumnos', agregarAlumno)

// Subida de archivos para legajos de alumnos
ruta.post('/alumnosLegajo', upload.fields([
    { name: 'dni_foto', maxCount: 1 },
    { name: 'fichamedica', maxCount: 1 },
    { name: 'partidanacimiento', maxCount: 1 }
]), agregarLegajo)

ruta.put('/alumnos/deshabilitar/:dni_alumno', deshabilitarAlumno)
ruta.put('/alumnos/modificar/:dni_alumno', modificarAlumno)

// Modificación de documentos adjuntos en el legajo del alumno
ruta.put('/alumnosLegajo/modificar/:dni_alumno', upload.fields([
    { name: 'dnifoto', maxCount: 1 },
    { name: 'fichamedica', maxCount: 1 },
    { name: 'partidanacimiento', maxCount: 1 }
]), modificarAdjuntoLegajo)

ruta.put('/alumnos/actualizarEstadoAlumno', ActualizarEstadoLibreAlumno) // TODO: Mover a métodosAlumno

// =====================================
//               SEXO
// =====================================
ruta.get('/sexo', obtenerSexo)

// =====================================
//               CURSOS
// =====================================
ruta.get('/curso', obtenerCurso)
ruta.get('/curso/:id_curso', obtenerCursoFiltrado)
ruta.post('/curso', registrarCursoPorMateria)

// =====================================
//        ESTADO DEL ALUMNO
// =====================================
ruta.get('/estadoAlumno', obtenerEstadoAlumno)

// =====================================
//            LOCALIDADES
// =====================================
ruta.get('/localidad', obtenerLocalidad)

// =====================================
//          SOLICITANTES
// =====================================
ruta.get('/solicitante', obtenerSolicitante)

// =====================================
//         OBSERVACIONES
// =====================================
ruta.post('/observacion', registrarObservacion)

// =====================================
//         AMONESTACIONES
// =====================================
ruta.post('/amonestacion', registrarAmonestacion)
ruta.get('/amonestacion/:dni_alumno', obtenerCantidadAmonestaciones)

// =====================================
//            ASISTENCIA
// =====================================
ruta.post('/asistencia', registrarAsistenciaBackend)
ruta.put('/asistencia', modificarAsistencia)
ruta.get('/asistencia/curso/:id_curso/fecha/:fecha', validarFechaAsistencia)
ruta.get('/asistencia/curso/:id_curso/fecha/:fecha/ausentes', obtenerModificacionAlumnosAusentes)
ruta.get('/asistencia/ausenciaSuperadas', obtenerFaltasSuperadas) 

// =====================================
//               NOTAS
// =====================================
ruta.get('/notas/:id_curso/:id_materia', obtenerNotas)
ruta.post('/notas', registrarNota)

// =====================================
//              MATERIAS
// =====================================
ruta.get('/materia', obtenerMaterias)
ruta.get('/materia/materiasDeshabilitadas', obtenerMateriasDeshabilitadas)
ruta.put('/materia/:id_materia', deshabilitarMateria)
ruta.put('/materia/habilitarMateria/:id_materia', habilitarMateria)
ruta.post('/materia', insertarMateria)
// =====================================
//       ETAPAS EVALUATIVAS
// =====================================
ruta.get('/etapas', obtenerEtapaEvaluativa)

// =====================================
//       PASAJE DE CURSO
// =====================================
ruta.get('/pasajeCurso/:id_curso', obtenerAlumnoFinal)
ruta.post('/pasajeCurso', registrarCursoNuevo)

// =====================================
//       JUSTIFICACIÓN DE FALTAS
// =====================================
ruta.get('/justificarFalta/:fechadesde/:fechahasta', obtenerAlumnosAusentes) 
ruta.get('/justificarFalta/estadoalumnos/:fechadesde/:fechahasta', obtenerJustificarFalta)
ruta.get('/justificarFalta/estadofalta', obtenerEstadosFalta)
ruta.get('/justificarFalta', obtenerJustificarFalta)
ruta.post('/justificarFalta', registrarJustificacion)

// =====================================
//          CERTIFICADOS
// =====================================
ruta.get('/certificado', obtenerEstadoCertificado)

// =====================================
//       ESTADO INASISTENCIA
// =====================================
ruta.get('/estado', obtenerEstadoInasistencia)

// =====================================
//       LIBRO MATRIZ
// =====================================
ruta.get('/libroMatriz/:dnialumno', cargarGrilla)

// =====================================
//       GESTION MATERIAS
// =====================================
ruta.post('/materiaprofesor', registrarMateriaProfesor)
ruta.delete('/materiaprofesor', eliminarMateriaProfesor)
ruta.get('/materiaprofesor/:id_materia', obtenerProfesorXMateria);
// =====================================
//       GESTION PROFESOR
// =====================================
ruta.get('/profesor', obtenerProfesor)
ruta.get('/libroMatriz/:dni_alumno', cargarGrilla)

// =====================================
//       OBTENER USUARIO
// =====================================
ruta.get('/usuario/:dni_usuario', obtenerUsuario)
ruta.get('/registrarUsuario/consultarUsuario/:dni_usuario', consultarUsuario)
// =====================================
//       REGISTRAR USUARIO
// =====================================
ruta.post('/registrarUsuario', registrarUsuario)
ruta.post('/restablecerContrasena/:dni_usuario', restablecerContrasena)
ruta.put('/deshabilitarUsuario/:dni_usuario',deshabilitarUsuario)
ruta.put('/modificarUsuario/:dni_usuario', modificarUsuario)
// =====================================
//       INGRESAR USUARIO
// =====================================
ruta.post('/ingresarUsuario', ingresarUsuario)
ruta.post('/recuperarContrasena', enviarEmail)
// =====================================
//       OBTENER ROLES 
// =====================================
ruta.get('/roles', obtenerRoles)
ruta.get('/roles/rolesdeshabilitados', obtenerRolesDeshabilitados)
ruta.post('/roles', registrarRol)
ruta.get('/tarearol/rol/:id_rol', obtenerTareasDeRoles)
ruta.delete('/tarearol/rol', eliminaRolTarea)
ruta.put('/roles/deshabilitarol/:id_rol',deshabilitarRol)
ruta.put('/roles/habilitarrol/:id_rol', habilitarRol)
// =====================================
//       TAREAS
// =====================================
ruta.get('/tareas', obtenerTareas)
ruta.get('/tareas/tareasDeshabilitadas', obtenerTareasDeshabilitadas)
ruta.post('/tarearol', registrarTareaRol)
ruta.delete('/tarearol/tarea', eliminarTareaRol)
ruta.get('/tarearol/obtenerTareasDeRoles/:id_rol', obtenerTareasDeRoles)
ruta.get('/tarearol/obtenerRolesDeTarea/:id_tarea', obtenerRolesDeTarea)
ruta.post('/tareas', agregarTarea)
ruta.put('/tareas/deshabilitartarea/:id_tarea', deshabilitarTarea)
ruta.put('/tareas/habilitartarea/:id_tarea', habilitarTarea)
// =====================================
//       OBTENER ESPECIALIDAD
// =====================================
ruta.get('/especialidad', obtenerEspecialidad)
// =====================================
//       AVISOS 
// =====================================
ruta.get('/alumno/avisos', obtenerAvisosGenerales)
ruta.get('/alumno/avisos/:id_curso', obtenerAvisosCurso)
// =====================================
//       OBTENER MATERIAS POR CURSO
// =====================================
ruta.get('/alumno/materia/dni_alumno/:dni_alumno', obtenerMateriaPorDni)
// =====================================
//       LIBRO DE AULA
// =====================================
ruta.get('/profesor/libroaula/materia/:id_profesor', obtenerMateriaPorProfesor)
ruta.get('/profesor/libroaula/caracteristicas', obtenerCaracteristicasUnidas)
ruta.get('/profesor/libroaula/curso_materia/:id_materia', obtenerCursoPorMateria)
ruta.post('/profesor/libroaula/registrar_libro_aula', registrarLibroAula)
// =====================================
//       ASIGNAR EVALUACIÓN
// =====================================
ruta.get('/profesor/tipo_de_evaluacion', obtenerTipoDeEvaluacion)
ruta.post('/profesor/asignar_evaluacion/:dni_profesor', registrarEvaluacion)