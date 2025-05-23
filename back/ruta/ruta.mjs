import { Router } from 'express'
import multer from 'multer'
import { 
    registrarAlumno, registrarLegajo, deshabilitarAlumno, modificarAlumno, obtenerAlumno, 
    obtenerAlumnoCurso, obtenerAlumnoFiltrado, obtenerLegajoAlumnoFiltrado, 
    obtenerAlumnoNombreApellido, obtenerLegajoAlumno, modificarAdjuntoLegajo 
} from '../metodos/metodosGestionAlumno.mjs'

import { crearAviso} from '../metodos/metodosCrearAvisos.mjs'
import { obtenerSexo } from '../metodos/metodosSexo.mjs'
import { obtenerCurso, obtenerCursoFiltrado, registrarCursoPorMateria } from '../metodos/metodosCurso.mjs'
import { obtenerEstadoGeneral } from '../metodos/metodosEstadoGeneral.mjs'
import { obtenerLocalidad } from '../metodos/metodosLocalidad.mjs'
import { registrarObservacion } from '../metodos/metodosObservacion.mjs'
import { registrarAmonestacion, obtenerCantidadAmonestaciones } from '../metodos/metodosAmonestacion.mjs'
import { 
    modificarAsistencia, registrarAsistencia, validarFechaAsistencia, 
    obtenerModificacionAlumnosAusentes, obtenerFaltasSuperadas 
} from '../metodos/metodosAsistenciaAlumnos.mjs'
import { obtenerNotas, registrarNota } from '../metodos/metodosCargarNotas.mjs'
import { obtenerMateriaPorDni } from '../metodos/metodosMateria.mjs'
import { obtenerAlumnoFinal, registrarCursoNuevo } from '../metodos/metodosPasarAno.mjs'
import {  
    obtenerAlumnosAusentes, obtenerEstadosFalta, obtenerJustificarFalta, 
    registrarJustificacion, actualizarEstadoAlumno
} from '../metodos/metodosJustificarFalta.mjs'
import { obtenerEstadoCertificado } from '../metodos/metodosCertificados.mjs'
import { obtenerEstadoAsistencia } from '../metodos/metodosEstadoAsistencia.mjs'
import { obtenerLibroMatriz } from '../metodos/metodosLibroMatriz.mjs'
import { obtenerMaterias, obtenerProfesor, registrarMateriaProfesor, obtenerProfesorPorMateria, deshabilitarMateriaProfesor, deshabilitarMateria, agregarMateria, obtenerMateriasDeshabilitadas, habilitarMateria} from '../metodos/metodosGestionMateria.mjs'
import {registrarRol, obtenerRolesDeshabilitados, deshabilitarRol, habilitarRol} from '../metodos/metodosRoles.mjs'
import { agregarTarea, deshabilitarTarea, obtenerTareasDeshabilitadas, habilitarTarea} from '../metodos/metodosCargarTarea.mjs'
import { obtenerTareas,obtenerRoles, obtenerTareasDeRoles, registrarTareaRol, deshabilitarRolTarea, deshabilitarTareaRol, obtenerRolesDeTarea} from '../metodos/metodosTareasRoles.mjs'
import { registrarUsuario, consultarUsuario, modificarUsuario, deshabilitarUsuario} from '../metodos/metodosRegistrarUsuario.mjs'
import { enviarNuevaContrasena, ingresarUsuario} from '../metodos/metodosLogin.mjs'
import { obtenerEspecialidad } from '../metodos/metodosEspecialidad.mjs'
import { obtenerUsuario, restablecerContrasena } from '../metodos/metodosPerfil.mjs'
import { obtenerAvisosGenerales, obtenerAvisosCurso } from '../metodos/metodosAvisos.mjs'
import { obtenerMateriaPorProfesor, obtenerCaracteristicasUnidad, obtenerCursoPorMateria, registrarLibroAula } from '../metodos/metodosLibroAula.mjs'
import { obtenerTipoDeEvaluacion, registrarEvaluacion } from '../metodos/metodosAsignarEvaluacion.mjs'
import { obtenerCursosPorProfesor, obtenerMateriasPorProfesor, obtenerAlumnosSinFiltro, registrarNotaFinal, modificarEstadoEvaluativo} from '../metodos/metodosCargarNotasFinal.mjs'
import { asignacionDeHoras, obtenerProfesores, obtenerCursoPorProfesor, obtenerMateriaPorCurso, obtenerHorasProfesor } from '../metodos/metodosAsignarHoras.mjs'
import { obtenerProfesoresAsistencia, registrarEntradaProfesor, registrarSalidaProfesor } from '../metodos/metodosAsistenciaProfesores.mjs'
import { registrarProfesional, deshabilitarProfesional, obtenerProfesional, modificarProfesional } from '../metodos/metodosGestionProfesionales.mjs'
import { obtenerEstadosFaltaProfesionales, obtenerFaltasProfesionales, registrarJustificacionProfesionales} from '../metodos/metodosJustificarFaltaProfesionales.mjs'
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Creación del router
export const ruta = Router()

// =====================================
//         GESTIÓN DE ALUMNOS
// =====================================


ruta.get('/alumno/:dni_alumno', obtenerAlumno) // 🟢
//SACAR
ruta.get('/alumnos/:dni_alumno', obtenerAlumnoFiltrado)
ruta.get('/alumnos', obtenerAlumnoNombreApellido) // 🟢
ruta.get('/alumnos/curso/:id_curso', obtenerAlumnoCurso) // 🟢
ruta.get('/alumno/legajo/:dni_alumno', obtenerLegajoAlumno) // 🟢
//SACAR
ruta.get('/alumno/legajo/:dni_alumno/:imagenTipo', obtenerLegajoAlumnoFiltrado)  // 🔵
ruta.post('/alumno/alta', registrarAlumno) // 🟢 
ruta.put('/alumno/deshabilitar/:dni_alumno', deshabilitarAlumno)// 🟢 
ruta.put('/alumno/modificar/:dni_alumno', modificarAlumno)// 🟢 

// Subida de archivos para legajos de alumnos
ruta.post('/alumno/legajo', upload.fields([
    { name: 'dni_foto', maxCount: 1 },
    { name: 'ficha_medica', maxCount: 1 },
    { name: 'partida_nacimiento', maxCount: 1 }
]), registrarLegajo)





// Modificación de documentos adjuntos en el legajo del alumno
ruta.put('/alumnosLegajo/modificar/:dni_alumno', upload.fields([
    { name: 'dnifoto', maxCount: 1 },
    { name: 'fichamedica', maxCount: 1 },
    { name: 'partidanacimiento', maxCount: 1 }
]), modificarAdjuntoLegajo)

ruta.put('/alumnos/actualizarEstadoAlumno', actualizarEstadoAlumno)

// Listas Desplegables
ruta.get('/listaDesplegable/sexo', obtenerSexo) // 🟢 
ruta.get('/listaDesplegable/curso', obtenerCurso)   // 🟢 
ruta.get('/listaDesplegable/curso/:id_curso', obtenerCursoFiltrado) // 🔵
ruta.get('/listaDesplegable/estadoGeneral', obtenerEstadoGeneral)  // 🟢 
ruta.get('/listaDesplegable/localidad', obtenerLocalidad) // 🟢
ruta.get('/listaDesplegable/materia', obtenerMaterias) // 🟢
ruta.get('/listaDesplegable/materia/deshabilitada', obtenerMateriasDeshabilitadas) // 🟢
ruta.get('/listaDesplegable/certificado', obtenerEstadoCertificado) // 🟢
ruta.get('/listaDesplegable/estadoAsistencia', obtenerEstadoAsistencia) // 🟢 
ruta.get('/listaDesplegable/profesor/materia/:id_materia', obtenerProfesorPorMateria); // 🟢 
ruta.get('/listaDesplegable/profesor', obtenerProfesor) // 🟢

// curso/matieria/alta
ruta.post('/curso', registrarCursoPorMateria)


// == OBSERVACION 

ruta.post('/alumno/observacion/alta', registrarObservacion)// 🟢

// == AMONESTACION
ruta.post('/alumno/amonestacion/alta', registrarAmonestacion) // 🔴
ruta.get('/alumno/amonestacion/cantidad/:dni_alumno', obtenerCantidadAmonestaciones) // 🟢

// == ASISTENCIA 

ruta.post('/alumno/asistencia/alta', registrarAsistencia)  // 🔴
ruta.put('/alumno/asistencia/modificar/:id_asistencia', modificarAsistencia) // 🔴
ruta.get('/alumno/asistencia/curso/:id_curso/fecha/:fecha', validarFechaAsistencia) // 🔴 
ruta.get('/alumno/asistencia/curso/:id_curso/fecha/:fecha/ausentes', obtenerModificacionAlumnosAusentes) // 🔴
ruta.get('/alumno/asistencia/ausenciaSuperadas', obtenerFaltasSuperadas) // 🔴

// == NOTAS
ruta.get('/alumno/notas/:id_curso/:id_materia', obtenerNotas) // 🟢
ruta.post('/alumno/notas/alta', registrarNota) // 🔵

// == MATERIA

ruta.put('/materia/deshabilitar/:id_materia', deshabilitarMateria) // 🟢
ruta.put('/materia/habilitar/:id_materia', habilitarMateria) // 🟢
ruta.post('/materia/alta', agregarMateria) // 🟢

// == PASAR AÑO
ruta.get('/alumno/pasarAno/:id_curso', obtenerAlumnoFinal)  // 🔵
ruta.post('/alumno/pasarAno', registrarCursoNuevo) // 🟢

// == JUSTIFICAR FALTA

ruta.get('/justificarFalta/:fechadesde/:fechahasta', obtenerAlumnosAusentes) // 🔴
ruta.get('/justificarFalta/estadoalumnos/:fechadesde/:fechahasta', obtenerJustificarFalta) // 🔴
ruta.get('/justificarFalta/estadofalta', obtenerEstadosFalta)// 🔴
ruta.get('/justificarFalta', obtenerJustificarFalta)// 🔴
// justificarFalta/alta
ruta.post('/justificarFalta', registrarJustificacion)// 🔴

// == LIBRO MATRIZ
ruta.get('/alumno/libroMatriz/:dnialumno', obtenerLibroMatriz) // 🔵

// == Gestionar Materias

ruta.post('/profesor/materia/alta', registrarMateriaProfesor) // 🟢
ruta.put('/profesor/materia/deshabilitar/:id_materia', deshabilitarMateriaProfesor) // 🔵



// == USUARIOS 
ruta.get('/usuario/:dni_usuario', obtenerUsuario) // 🟢
ruta.get('/usuario/registrar/consultar/:dni_usuario', consultarUsuario) // 🟢

// =====================================
//       REGISTRAR USUARIO
// =====================================
// usuario/alta
ruta.post('/registrarUsuario', registrarUsuario)
ruta.post('/restablecerContrasena/:dni_usuario', restablecerContrasena)
// usuario/deshabilitar/:dni_usuario
ruta.put('/deshabilitarUsuario/:dni_usuario',deshabilitarUsuario)
// usuario/modificar/:dni_usuario
ruta.put('/modificarUsuario/:dni_usuario', modificarUsuario)
// =====================================
//       INGRESAR USUARIO
// =====================================
// usuario/ingresarUsuario
ruta.post('/ingresarUsuario', ingresarUsuario)
// usuario/recuperarContrasena Enviar Nueva contrasena 
ruta.post('/recuperarContrasena', enviarNuevaContrasena)
// =====================================
//       OBTENER ROLES 
// =====================================
ruta.get('/roles', obtenerRoles)
ruta.get('/roles/rolesdeshabilitados', obtenerRolesDeshabilitados)
// roles/alta
ruta.post('/roles', registrarRol)
ruta.get('/tarearol/rol/:id_rol', obtenerTareasDeRoles)
// roles/tarea -> PUT NO DELETE
ruta.put('/tarearol/rol', deshabilitarRolTarea)
// roles/deshabilitarRol
ruta.put('/roles/deshabilitarol/:id_rol',deshabilitarRol)
// roles/habilitarRol
ruta.put('/roles/habilitarrol/:id_rol', habilitarRol)
// =====================================
//       TAREAS
// =====================================
ruta.get('/tareas', obtenerTareas)
ruta.get('/tareas/tareasDeshabilitadas', obtenerTareasDeshabilitadas)
// tarea/rol/alta
ruta.post('/tarearol', registrarTareaRol)
// tarea/rol/deshabilitar -> PUT NO DELETE
ruta.put('/tarearol/tarea', deshabilitarTareaRol)
ruta.get('/tarearol/obtenerTareasDeRoles/:id_rol', obtenerTareasDeRoles)
ruta.get('/tarearol/obtenerRolesDeTarea/:id_tarea', obtenerRolesDeTarea)
// tarea/alta
ruta.post('/tareas', agregarTarea)
// tarea/deshabilitar
ruta.put('/tareas/deshabilitartarea/:id_tarea', deshabilitarTarea)
// tarea/habilitar
ruta.put('/tareas/habilitartarea/:id_tarea', habilitarTarea)
// =====================================
//       OBTENER ESPECIALIDAD
// =====================================
ruta.get('/especialidad', obtenerEspecialidad)
// =====================================
//       AVISOS 
// =====================================
ruta.post('/avisos', crearAviso)
ruta.get('/alumno/avisos', obtenerAvisosGenerales)
ruta.get('/alumno/avisos/:id_curso', obtenerAvisosCurso)
// =====================================
//       OBTENER MATERIAS POR CURSO
// =====================================
//ruta.get('/alumno/materia/dni_alumno/:dni_alumno', obtenerMateriaPorDni)
// =====================================
//       LIBRO DE AULA
// =====================================
ruta.get('/profesor/libroaula/materia/:dni_usuario', obtenerMateriaPorProfesor)
ruta.get('/profesor/libroaula/caracteristicas', obtenerCaracteristicasUnidad)
ruta.get('/profesor/libroaula/curso_materia/:id_materia', obtenerCursoPorMateria)
ruta.post('/profesor/libroaula/registrar_libro_aula', registrarLibroAula)
// =====================================
//       ASIGNAR EVALUACIÓN
// =====================================
ruta.get('/profesor/tipo_de_evaluacion', obtenerTipoDeEvaluacion)
ruta.post('/profesor/asignar_evaluacion/:dni_profesor', registrarEvaluacion)
// =====================================
//       OBTENER CURSOS POR PROFESORES
// =====================================
ruta.get('/profesor/curso_profesor/:dni_profesor', obtenerCursosPorProfesor)
ruta.get('/profesor/curso_materia/:dni_profesor', obtenerMateriasPorProfesor)
ruta.get('/profesor/curso_materia/alumnos/:dni_profesor', obtenerAlumnosSinFiltro)
ruta.post('/profesor/nota', registrarNotaFinal);
ruta.put('/profesor/estadoevaluativo', modificarEstadoEvaluativo);
// =====================================
//       ASIGNAR HORAS
// =====================================
ruta.post('/secretaria/profesor/horas', asignacionDeHoras)
// =====================================
//       OBTENER PROFESORES
// =====================================
ruta.get('/profesores', obtenerProfesores)
ruta.get('/profesores/cursos/:dni_profesor', obtenerCursoPorProfesor)
ruta.get('/profesores/materias/:id_curso', obtenerMateriaPorCurso)
ruta.get('/profesores/horario/:dni_profesor/:id_curso', obtenerHorasProfesor)
// =====================================
//       ASISTENCIA PROFESORES -> Profesionales
// =====================================
ruta.get('/profesores/asistencia', obtenerProfesoresAsistencia)
ruta.post('/profesores/asistencia/entrada', registrarEntradaProfesor)
ruta.put('/profesores/asistencia/salida', registrarSalidaProfesor)
// =====================================
//       PROFESIONAL
// =====================================

// Cambiar dni por dni_profesional
ruta.get('/profesional/:dni_profesional', obtenerProfesional)
ruta.post('/profesional/alta', registrarProfesional)
ruta.put('/profesional/modificar/:dni_profesional', modificarProfesional)
ruta.put('/profesional/deshabilitar/:dni_profesional', deshabilitarProfesional) 
//       JUSTIFICAR FALTA PP
// =====================================
ruta.get('/justificarFaltaPP/estadoFalta', obtenerEstadosFaltaProfesionales)
ruta.get('/justificarFaltaPP/faltas/:fechaInicio/:fechaFin', obtenerFaltasProfesionales);
ruta.post('/justificarFaltaPP/registrar', registrarJustificacionProfesionales);
