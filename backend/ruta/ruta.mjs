import { Router } from 'express'
import { authMiddleware } from '../auth/auth.mjs';

import multer from 'multer'
import { 
    registrarAlumno, registrarLegajo, deshabilitarAlumno, modificarAlumno, obtenerAlumno, 
    obtenerAlumnoCurso, obtenerAlumnoFiltrado, obtenerLegajoAlumnoFiltrado, 
    obtenerAlumnoNombreApellido, obtenerLegajoAlumno, modificarAdjuntoLegajo 
} from '../metodos/secretaria/metodosGestionAlumno.mjs'

import { registrarAviso, obtenerMotivos} from '../metodos/secretaria/metodosCrearAvisos.mjs'
import { obtenerSexo } from '../metodos/listasDesplegables/metodosSexo.mjs'
import { obtenerCurso, obtenerCursoFiltrado, obtenerCursoConAlumnos} from '../metodos/listasDesplegables/metodosCurso.mjs'
import { registrarCursoPorMateria, consultarCurso, registrarCurso, deshabilitarCurso,modificarCurso } from '../metodos/administrador/metodosRegistrarCurso.mjs'
import { obtenerEstadoGeneral } from '../metodos/listasDesplegables/metodosEstadoGeneral.mjs'
import { obtenerLocalidad } from '../metodos/listasDesplegables/metodosLocalidad.mjs'
import { registrarObservacion } from '../metodos/preceptor/metodosObservacion.mjs'
import { registrarAmonestacion, obtenerCantidadAmonestaciones, obtenerProfesionales } from '../metodos/preceptor/metodosAmonestacion.mjs'
import { 
    modificarAsistenciaAlumnos, registrarAsistenciaAlumnos, validarFechaAsistencia, 
    obtenerModificacionAlumnosAusentes, obtenerFaltasSuperadas 
} from '../metodos/preceptor/metodosAsistenciaAlumnos.mjs'
import { obtenerNotas, registrarNota } from '../metodos/secretaria/metodosCargarNotas.mjs'
import { obtenerMateriaPorDni } from '../metodos/alumno/metodosMateria.mjs'
import { obtenerAlumnoFinal, registrarCursoNuevo } from '../metodos/secretaria/metodosPasarAno.mjs'
import {  
    obtenerAlumnosAusentes, obtenerEstadosFalta, obtenerJustificarFalta, 
    registrarJustificacion, actualizarEstadoAlumno
} from '../metodos/preceptor/metodosJustificarFalta.mjs'
import { obtenerEstadoCertificado } from '../metodos/listasDesplegables/metodosCertificados.mjs'
import { obtenerEstadoAsistencia } from '../metodos/listasDesplegables/metodosEstadoAsistencia.mjs'
import { obtenerLibroMatriz } from '../metodos/secretaria/metodosLibroMatriz.mjs'
import { obtenerMaterias, obtenerProfesor, registrarMateriaProfesor, obtenerProfesorPorMateria, deshabilitarMateriaProfesor, deshabilitarMateria, registrarMateria, obtenerMateriasDeshabilitadas, habilitarMateria, consultarMateria, modificarMateria} from '../metodos/administrador/metodosGestionMateria.mjs'
import {registrarRol, obtenerRolesDeshabilitados, deshabilitarRol, habilitarRol, consultarRol, modificarRol} from '../metodos/listasDesplegables/metodosRoles.mjs'
import { agregarTarea, deshabilitarTarea, obtenerTareasDeshabilitadas, habilitarTarea, consultarTarea} from '../metodos/administrador/metodosCargarTarea.mjs'
import { obtenerTareas,obtenerRoles, obtenerTareasDeRoles, registrarTareaRol, registrarRolTarea, deshabilitarRolTarea, deshabilitarTareaRol, obtenerRolesDeTarea, modificarTarea} from '../metodos/administrador/metodosTareasRoles.mjs'
import { registrarUsuario, consultarUsuario, modificarUsuario, deshabilitarUsuario} from '../metodos/administrador/metodosRegistrarUsuario.mjs'
import { enviarNuevaContrasena, ingresarUsuario, obtenerTareasPorRol} from '../metodos/navegacion/metodosLogin.mjs'
import { obtenerEspecialidad } from '../metodos/listasDesplegables/metodosEspecialidad.mjs'
import { obtenerUsuario, restablecerContrasena, obtenerUsuarioAlumno } from '../metodos/navegacion/metodosPerfil.mjs'
import { obtenerAvisosGenerales, obtenerAvisosCurso, actualizarUltimaVisitaAvisos, obtenerUltimaVisitaAvisos } from '../metodos/alumno/metodosAvisos.mjs'
import { obtenerMateriaPorProfesor, obtenerCaracteristicasUnidad, obtenerCursoPorMateria, registrarLibroAula, obtenerLibroAula, obtenerMateriaPorCursoYProfesor,obtenerNumeroDeClase } from '../metodos/profesores/metodosLibroAula.mjs'
import { obtenerTipoDeEvaluacion, registrarEvaluacion } from '../metodos/profesores/metodosAsignarEvaluacion.mjs'
import { obtenerCursosPorProfesor, obtenerMateriasPorProfesor, registrarNotaFinal, actualizarEstadoEvaluativo, obtenerAlumnosNoRegulares} from '../metodos/profesores/metodosCargarNotasFinal.mjs'
import { asignacionDeHoras, obtenerProfesores, obtenerCursoPorProfesor, obtenerMateriaPorCurso, deshabilitarHorario,obtenerHorasProfesor, obtenerHorarioCurso, obtenerHorarioProfesional } from '../metodos/secretaria/metodosAsignarHoras.mjs'
import { marcarAusentes, obtenerProfesionalesAsistencia, registrarEntradaProfesional, registrarSalidaProfesional } from '../metodos/secretaria/metodosAsistenciaProfesores.mjs'
import { registrarProfesional, deshabilitarProfesional, consultarProfesional, modificarProfesional } from '../metodos/secretaria/metodosGestionProfesionales.mjs'
import { obtenerEstadosFaltaProfesionales, obtenerProfesionalesAusentes, registrarJustificacionProfesionales} from '../metodos/secretaria/metodosJustificarFaltaProfesionales.mjs'
import { obtenerEvaluacionesProfesor, obtenerEvaluacionesAlumno } from '../metodos/navegacion/metodosCalendario.mjs'


const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Creación del router
export const ruta = Router()



// Listas Desplegables
ruta.get('/listaDesplegable/sexo', obtenerSexo) // 🟢 
ruta.get('/listaDesplegable/motivos', obtenerMotivos)
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
ruta.get('/listaDesplegable/roles', obtenerRoles) // 🟢
ruta.get('/listaDesplegable/roles/deshabilitados', obtenerRolesDeshabilitados) // 🟢
ruta.get('/listaDesplegable/rol/tarea/:id_rol', obtenerTareasDeRoles) // 🟢
ruta.get('/listaDesplegable/tareas', obtenerTareas) // 🟢
ruta.get('/listaDesplegable/tareas/deshabilitadas', obtenerTareasDeshabilitadas) // 🟢
ruta.get('/listaDesplegable/tarea/rol/:id_tarea', obtenerRolesDeTarea) // 🟢
ruta.get('/listaDesplegable/rol/tarea/:id_rol', obtenerTareasDeRoles) // 🟢
ruta.get('/listaDesplegable/especialidad', obtenerEspecialidad) // 🟢
ruta.get('/listaDesplegable/materia/profesor/:dni_profesional', obtenerMateriaPorProfesor) // 🟢
ruta.get('/listaDesplegable/caracteristicas', obtenerCaracteristicasUnidad) // 🟢
ruta.get('/listaDesplegable/curso/materia/:id_materia', obtenerCursoPorMateria) // 🟢
ruta.get('/listaDesplegable/tipo_de_evaluacion', obtenerTipoDeEvaluacion) // 🟢
ruta.get('/listaDesplegable/profesor/curso/:dni_profesional', obtenerCursosPorProfesor) // 🟢
ruta.get('/listaDesplegable/profesor/curso/materia/:dni_profesional', obtenerMateriasPorProfesor) // 🔵
ruta.get('/listaDesplegable/profesor/curso/alumnos/:dni_profesional', obtenerAlumnosNoRegulares) // 🟢
ruta.get('/listaDesplegable/profesores', obtenerProfesores) // 🟢
ruta.get('/listaDesplegable/curso/profesor/:dni_profesional', obtenerCursoPorProfesor) // 🟢
ruta.get('/listaDesplegable/materia/curso/:id_curso', obtenerMateriaPorCurso) // 🟢
ruta.get('/listaDesplegable/alumnos/curso/:id_curso', obtenerAlumnoCurso) // 🟢
ruta.get('/listaDesplegable/profesionales', obtenerProfesionales) // 🟢 
ruta.get('/listaDesplegable/profesionales/asistencia', obtenerProfesionalesAsistencia) // 🟢
ruta.get('/listaDesplegable/justificar/profesional/estadoFalta', obtenerEstadosFaltaProfesionales) // 🟢 
ruta.get('/listaDesplegable/materia/curso/profesor/:id_curso/:dni_profesional', obtenerMateriaPorCursoYProfesor)// 🟢 
ruta.get('/listaDesplegable/cursos/cantidad', obtenerCursoConAlumnos)



// == GESTION ALUMNO

ruta.get('/alumno/:dni_alumno', obtenerAlumno) // 🟢
//SACAR
ruta.get('/alumnos/:dni_alumno', obtenerAlumnoFiltrado)
ruta.get('/alumnos', obtenerAlumnoNombreApellido) // 🟢
ruta.get('/alumno/legajo/:dni_alumno', obtenerLegajoAlumno) // 🟢
//SACAR
ruta.get('/alumno/legajo/:dni_alumno/:imagen_Tipo', obtenerLegajoAlumnoFiltrado)  // 🔵
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
    { name: 'dni_foto', maxCount: 1 },
    { name: 'ficha_medica', maxCount: 1 },
    { name: 'partida_nacimiento', maxCount: 1 }
]), modificarAdjuntoLegajo)

ruta.put('/alumnos/actualizarEstadoAlumno', actualizarEstadoAlumno)

// == Materias del Alumno
ruta.get('/alumno/materia/:dni_alumno', obtenerMateriaPorDni) // 🔵

// == OBSERVACION 
ruta.post('/alumno/observacion/alta', registrarObservacion)// 🟢

// == AMONESTACION
ruta.post('/alumno/amonestacion/alta', registrarAmonestacion) // 🟢
ruta.get('/alumno/amonestacion/cantidad/:dni_alumno', obtenerCantidadAmonestaciones) // 🟢

// == ASISTENCIA 
ruta.post('/alumno/asistencia/alta', registrarAsistenciaAlumnos)  // 🟢
ruta.put('/alumno/asistencia/modificar/:id_asistencia', modificarAsistenciaAlumnos) // 🟢
ruta.get('/alumno/asistencia/curso/:id_curso/fecha/:fecha', validarFechaAsistencia) // 🟢 
ruta.get('/alumno/asistencia/curso/:id_curso/fecha/:fecha/ausentes', obtenerModificacionAlumnosAusentes) // 🟢
ruta.get('/alumno/asistencia/ausenciaSuperadas', obtenerFaltasSuperadas) // 🟢

// == NOTAS
ruta.get('/alumno/notas/:id_curso/:id_materia', obtenerNotas) // 🟢
ruta.post('/alumno/notas/alta', registrarNota) // 🟢

// == MATERIA
ruta.put('/materia/deshabilitar/:id_materia', deshabilitarMateria) // 🟢
ruta.put('/materia/habilitar/:id_materia', habilitarMateria) // 🟢
ruta.post('/materia/alta', registrarMateria) // 🟢
ruta.get('/materia/consultar/:detalle', consultarMateria) // 🟢
ruta.put('/materia/modificar/:detalle', modificarMateria) // 🟢

// == PASAR AÑO
ruta.get('/alumno/pasarAno/:id_curso', obtenerAlumnoFinal)  // 🟢
ruta.post('/alumno/pasarAno/alta', registrarCursoNuevo) // 🟢

// == JUSTIFICAR FALTA
ruta.get('/alumno/justificarFalta/:fechadesde/:fechahasta', obtenerAlumnosAusentes) // 🟢
ruta.get('/alumno/justificarFalta/estado_alumnos/:fechadesde/:fechahasta', obtenerJustificarFalta) // 🟢
ruta.get('/alumno/justificarFalta/estado_falta', obtenerEstadosFalta) // 🟢
ruta.post('/alumno/justificarFalta', registrarJustificacion) // 🟢

// == LIBRO MATRIZ
ruta.get('/alumno/libroMatriz/:dni_alumno', obtenerLibroMatriz) // 🟢

// == Gestionar Materias
ruta.post('/profesor/materia/alta', registrarMateriaProfesor) // 🟢
ruta.put('/profesor/materia/deshabilitar/:id_materia', deshabilitarMateriaProfesor) // 🟢

// == USUARIOS PERFIL
ruta.get('/usuario/perfil/:dni_usuario', obtenerUsuario) // 🟢
ruta.post('/usuario/perfil/restablecerContrasena/:dni_usuario', restablecerContrasena) // 🟢
ruta.get('/usuario/perfil/alumno/:dni_usuario', obtenerUsuarioAlumno) // 🟢


// == REGISTRAR USUARIO 
ruta.get('/usuario/registrar/consultar/:dni_usuario',  consultarUsuario)
ruta.post('/usuario/registrar',  registrarUsuario)
ruta.put('/usuario/deshabilitar/:dni_usuario',  deshabilitarUsuario)
ruta.put('/usuario/modificar/:dni_usuario',  modificarUsuario)
ruta.get('/usuario/tareas/:id_rol', obtenerTareasPorRol)
ruta.get('/usuario/perfil/:dni_usuario',  obtenerUsuario)
ruta.post('/usuario/perfil/restablecerContrasena/:dni_usuario',  restablecerContrasena)

// == ROLES 
ruta.post('/rol/alta',  registrarRol)
ruta.put('/rol/deshabilitar/:id_rol',  deshabilitarRol)
ruta.put('/rol/habilitar/:id_rol',  habilitarRol)
ruta.post('/rol/tarea/deshabilitar',  deshabilitarRolTarea)
ruta.post('/rol/tarea/alta',  registrarRolTarea)
ruta.get('/rol/tarea/:detalle',  consultarTarea)
ruta.get('/rol/consultar/:detalle',  consultarRol)
ruta.put('/rol/modificar/:detalle',  modificarRol)

// == TAREAS
ruta.post('/tarea/rol/alta', registrarTareaRol)
ruta.post('/tarea/rol/deshabilitar', deshabilitarTareaRol)
ruta.post('/tarea/alta', agregarTarea)
ruta.put('/tarea/deshabilitar/:id_tarea' , deshabilitarTarea)
ruta.put('/tarea/habilitar/:id_tarea',  habilitarTarea)
ruta.get('/tarea/consultar/:detalle',  consultarTarea)
ruta.put('/tarea/modificar/:detalle',  modificarTarea)

// == AVISOS
ruta.post('/secretaria/aviso/alta',  registrarAviso)
ruta.get('/alumno/avisos/general', obtenerAvisosGenerales) // 🟢
ruta.get('/alumno/avisos/curso/:dni_alumno', obtenerAvisosCurso) // 🟢
ruta.post('/alumno/avisos/ultima_visita/actualizar', actualizarUltimaVisitaAvisos) 
ruta.get('/alumno/avisos/ultima_visita/:dni_usuario', obtenerUltimaVisitaAvisos)

// == LIBRO AULA
ruta.post('/profesor/libroAula/alta', registrarLibroAula) // 🟢 
ruta.get('/profesor/libroAula/numero_clase/:dni_profesional/:id_curso/:id_materia',obtenerNumeroDeClase)
ruta.get('/profesor/libroAula/:dni_profesional/:id_curso/:id_materia', obtenerLibroAula)

// == ASIGNAR EVALUACION 
ruta.post('/profesor/asignar_evaluacion/alta', registrarEvaluacion) // 🟢 

// == NOTA FINAL
ruta.post('/profesor/nota_final/alta', registrarNotaFinal); // 🟢 
ruta.put('/profesor/nota_final/estado_evaluativo', actualizarEstadoEvaluativo); // 🟢 

// == ASIGNAR HORAS
ruta.post('/secretaria/profesional/horas/alta', asignacionDeHoras) // 🟢
ruta.get('/secretaria/profesional/horario/:dni_profesional/:id_curso/:id_materia', obtenerHorasProfesor) // 🟢
ruta.get('/secretaria/profesional/horario/:dni_profesional', obtenerHorarioProfesional) // 🟢
ruta.get('/secretaria/curso/horario/:id_curso', obtenerHorarioCurso) // 🟢
ruta.put('/secretaria/profesional/horario/ausente', marcarAusentes) // 🟢

// == ASISTENCIA PROFESIONAL
ruta.post('/secretaria/profesional/asistencia/entrada', registrarEntradaProfesional) // 🟢
ruta.put('/secretaria/profesional/asistencia/salida', registrarSalidaProfesional) // 🟢

// == PROFESIONALES
ruta.get('/profesional/:dni_profesional', consultarProfesional) // 🟢
ruta.post('/profesional/alta', registrarProfesional) // 🟢
ruta.put('/profesional/modificar/:dni_profesional', modificarProfesional) // 🟢 
ruta.put('/profesional/deshabilitar/:dni_profesional', deshabilitarProfesional) // 🟢 

// == JUSTIFICAR FALTA PROFESIONALES
ruta.get('/justificar/profesional/faltas/:fecha_desde/:fecha_hasta', obtenerProfesionalesAusentes); // 🟢 
ruta.post('/justificar/profesional/alta', registrarJustificacionProfesionales);  // 🟢 


// == CURSO
ruta.post('/curso/materia/alta', registrarCursoPorMateria)  // 🟢 
ruta.post('/curso/alta', registrarCurso) // 🟢
ruta.get('/curso/:detalle', consultarCurso) // 🟢
ruta.put('/curso/deshabilitar/:detalle', deshabilitarCurso) // 🟢
ruta.put('/curso/modificar/:id_curso', modificarCurso) // 🟢


// == CALENDARIO
ruta.get('/alumno/evaluaciones/:dni_alumno', obtenerEvaluacionesAlumno)
ruta.get('/profesional/evaluaciones/registradas/:dni_profesional', obtenerEvaluacionesProfesor)


// == LOGIN 
ruta.post('/usuario/ingresar', ingresarUsuario)
ruta.post('/usuario/recuperarContrasena', enviarNuevaContrasena)