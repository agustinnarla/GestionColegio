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
import { obtenerCursosPorProfesor, obtenerMateriasPorProfesor, registrarNotaFinal, modificarEstadoEvaluativo, obtenerAlumnosNoRegulares} from '../metodos/metodosCargarNotasFinal.mjs'
import { asignacionDeHoras, obtenerProfesores, obtenerCursoPorProfesor, obtenerMateriaPorCurso, obtenerHorasProfesor } from '../metodos/metodosAsignarHoras.mjs'
import { obtenerProfesionalesAsistencia, registrarEntradaProfesional, registrarSalidaProfesional } from '../metodos/metodosAsistenciaProfesores.mjs'
import { registrarProfesional, deshabilitarProfesional, obtenerProfesional, modificarProfesional } from '../metodos/metodosGestionProfesionales.mjs'
import { obtenerEstadosFaltaProfesionales, obtenerFaltasProfesionales, registrarJustificacionProfesionales} from '../metodos/metodosJustificarFaltaProfesionales.mjs'
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Creación del router
export const ruta = Router()



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
ruta.get('/listaDesplegable/roles', obtenerRoles) // 🟢
ruta.get('/listaDesplegable/roles/deshabilitados', obtenerRolesDeshabilitados) // 🟢
ruta.get('/listaDesplegable/rol/tarea/:id_rol', obtenerTareasDeRoles) // 🟢
ruta.get('/listaDesplegable/tareas', obtenerTareas) // 🟢
ruta.get('/listaDesplegable/tareas/deshabilitadas', obtenerTareasDeshabilitadas) // 🟢
ruta.get('/listaDesplegable/tarea/rol/:id_rol', obtenerTareasDeRoles) // 🟢
ruta.get('/listaDesplegable/rol/tarea/:id_tarea', obtenerRolesDeTarea) // 🟢
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

ruta.get('/listaDesplegable/profesionales/asistencia', obtenerProfesionalesAsistencia) // 🟢
ruta.get('/listaDesplegable/justificar/profesional/estadoFalta', obtenerEstadosFaltaProfesionales) // 🟢 

// == GESTION ALUMNO

ruta.get('/alumno/:dni_alumno', obtenerAlumno) // 🟢
//SACAR
ruta.get('/alumnos/:dni_alumno', obtenerAlumnoFiltrado)
ruta.get('/alumnos', obtenerAlumnoNombreApellido) // 🟢
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

// == Materias del Alumno
ruta.get('/alumno/materia/:dni_alumno', obtenerMateriaPorDni) // 🔵

// == OBSERVACION 
ruta.post('/alumno/observacion/alta', registrarObservacion)// 🟢

// == AMONESTACION
ruta.post('/alumno/amonestacion/alta', registrarAmonestacion) // 🟢
ruta.get('/alumno/amonestacion/cantidad/:dni_alumno', obtenerCantidadAmonestaciones) // 🟢

// == ASISTENCIA 
ruta.post('/alumno/asistencia/alta', registrarAsistencia)  // 🟢
ruta.put('/alumno/asistencia/modificar/:id_asistencia', modificarAsistencia) // 🟢
ruta.get('/alumno/asistencia/curso/:id_curso/fecha/:fecha', validarFechaAsistencia) // 🟢 
ruta.get('/alumno/asistencia/curso/:id_curso/fecha/:fecha/ausentes', obtenerModificacionAlumnosAusentes) // 🟢
ruta.get('/alumno/asistencia/ausenciaSuperadas', obtenerFaltasSuperadas) // 🟢

// == NOTAS
ruta.get('/alumno/notas/:id_curso/:id_materia', obtenerNotas) // 🟢
ruta.post('/alumno/notas/alta', registrarNota) // 🟢

// == MATERIA
ruta.put('/materia/deshabilitar/:id_materia', deshabilitarMateria) // 🟢
ruta.put('/materia/habilitar/:id_materia', habilitarMateria) // 🟢
ruta.post('/materia/alta', agregarMateria) // 🟢

// == PASAR AÑO
ruta.get('/alumno/pasarAno/:id_curso', obtenerAlumnoFinal)  // 🟢
ruta.post('/alumno/pasarAno/alta', registrarCursoNuevo) // 🟢

// == JUSTIFICAR FALTA
ruta.get('/alumno/justificarFalta/:fechadesde/:fechahasta', obtenerAlumnosAusentes) // 🔴
ruta.get('/alumno/justificarFalta/estado_alumnos/:fechadesde/:fechahasta', obtenerJustificarFalta) // 🔴
ruta.get('/alumno/justificarFalta/estado_falta', obtenerEstadosFalta) // 🔴
ruta.get('/alumno/justificarFalta', obtenerJustificarFalta) // 🔴
ruta.post('/alumno/justificarFalta', registrarJustificacion) // 🔴

// == LIBRO MATRIZ
ruta.get('/alumno/libroMatriz/:dni_alumno', obtenerLibroMatriz) // 🟢

// == Gestionar Materias
ruta.post('/profesor/materia/alta', registrarMateriaProfesor) // 🟢
ruta.put('/profesor/materia/deshabilitar/:id_materia', deshabilitarMateriaProfesor) // 🟢

// == USUARIOS PERFIL
ruta.get('/usuario/perfil/:dni_usuario', obtenerUsuario) // 🟢
ruta.post('/usuario/perfil/restablecerContrasena/:dni_usuario', restablecerContrasena) // 🟢

// == REGISTRAR USUARIO 
ruta.get('/usuario/registrar/consultar/:dni_usuario', consultarUsuario) // 🟢
ruta.post('/usuario/registrar', registrarUsuario) // 🟢
ruta.put('/usuario/deshabilitar/:dni_usuario', deshabilitarUsuario) // 🟢
ruta.put('/usuario/modificar/:dni_usuario', modificarUsuario)  // 🟢

// == INGRESAR USUARIO
ruta.post('/usuario/ingresar', ingresarUsuario)  // 🟢
ruta.post('/usuario/recuperarContrasena', enviarNuevaContrasena) // 🟢

// == ROLES 
ruta.post('/rol/alta', registrarRol) // 🟢
ruta.put('/rol/deshabilitar/:id_rol', deshabilitarRol) // 🟢
ruta.put('/rol/habilitar/:id_rol', habilitarRol) // 🟢
ruta.post('/rol/tarea/deshabilitar', deshabilitarRolTarea) // 🟢

// == TAREAS
ruta.post('/tarea/rol/alta', registrarTareaRol) // 🟢
ruta.post('/tarea/rol/deshabilitar', deshabilitarTareaRol) // 🟢 
ruta.post('/tarea/alta', agregarTarea) 
ruta.put('/tarea/deshabilitar/:id_tarea', deshabilitarTarea) // 🟢 
ruta.put('/tarea/habilitar/:id_tarea', habilitarTarea) // 🟢 

// == AVISOS
ruta.post('/secretaria/aviso/alta', crearAviso) // 🟢
ruta.get('/alumno/avisos/general', obtenerAvisosGenerales) // 🟢
ruta.get('/alumno/avisos/curso/:id_curso', obtenerAvisosCurso) // 🟢

// == LIBRO AULA
ruta.post('/profesor/libroAula/alta', registrarLibroAula) // 🟢 

// == ASIGNAR EVALUACION 
ruta.post('/profesor/asignar_evaluacion/alta/:dni_profesional', registrarEvaluacion) // 🟢 

// == NOTA FINAL
ruta.post('/profesor/nota_final/alta', registrarNotaFinal); // 🟢 
ruta.put('/profesor/nota_final/estado_evaluativo', modificarEstadoEvaluativo); // 🟢 

// == ASIGNAR HORAS
ruta.post('/secretaria/profesional/horas/alta', asignacionDeHoras) // 🟢
ruta.get('/secretaria/profesional/horario/:dni_profesional/:id_curso', obtenerHorasProfesor) // 🟢

// == ASISTENCIA PROFESIONAL
ruta.post('/secretaria/profesional/asistencia/entrada', registrarEntradaProfesional) // 🟢
ruta.put('/secretaria/profesional/asistencia/salida', registrarSalidaProfesional) // 🟢

// == PROFESIONALES
ruta.get('/profesional/:dni_profesional', obtenerProfesional) // 🟢
ruta.post('/profesional/alta', registrarProfesional) // 🟢
ruta.put('/profesional/modificar/:dni_profesional', modificarProfesional) // 🟢 
ruta.put('/profesional/deshabilitar/:dni_profesional', deshabilitarProfesional) // 🟢 

// == JUSTIFICAR FALTA PROFESIONALES
ruta.get('/justificar/profesional/faltas/:fecha_desde/:fecha_hasta', obtenerFaltasProfesionales); // 🟢 
ruta.post('/justificar/profesional/alta', registrarJustificacionProfesionales);  // 🟢 


// == CURSO
ruta.post('/curso/materia/alta', registrarCursoPorMateria)  // 🟢 