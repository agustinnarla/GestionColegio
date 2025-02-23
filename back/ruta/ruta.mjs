import { Router } from 'express'
import multer from 'multer'
import { 
    agregarAlumno, agregarLegajo, deshabilitarAlumno, modificarAlumno, obtenerAlumno, 
    obtenerAlumnoCurso, obtenerAlumnoFiltrado, obtenerLegajoAlumnoFiltrado, 
    obtenerAlumnoNombreApellido, obtenerLegajoAlumno, modificarAdjuntoLegajo 
} from '../metodos/metodosGestionAlumno.mjs'

import { obtenerSexo } from '../metodos/metodosSexo.mjs'
import { obtenerCurso, obtenerCursoFiltrado } from '../metodos/metodosCurso.mjs'
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
import { obtenerMateria } from '../metodos/metodosMateria.mjs'
import { obtenerEtapaEvaluativa } from '../metodos/metodosEtapaEvaluativa.mjs'
import { obtenerAlumnoFinal, registrarCursoNuevo } from '../metodos/metodosPasarCurso.mjs'
import {  
    obtenerAlumnosAusentes, obtenerEstadosFalta, obtenerJustificarFalta, 
    registrarJustificacion, ActualizarEstadoLibreAlumno 
} from '../metodos/metodosJustificarFalta.mjs'
import { obtenerEstadoCertificado } from '../metodos/metodosCertificados.mjs'
import { obtenerEstadoInasistencia } from '../metodos/metodosEstado.mjs'
import { cargarGrilla } from '../metodos/metodosLibroMatriz.mjs'
import { obtenerMaterias, obtenerProfesor, registrarMateriaProfesor, obtenerProfesorXMateria, eliminarMateriaProfesor, deshabilitarMateria} from '../metodos/metodosGestionMateria.mjs'
import { registrarUsuario} from '../metodos/metodosRegistrarUsuario.mjs'
import { obtenerRoles, registrarRol } from '../metodos/metodosRoles.mjs'  
import { ingresarUsuario } from '../metodos/metodosLogin.mjs'
// Configuración de almacenamiento para subida de archivos con multer
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
ruta.put('/materia/:id_materia', deshabilitarMateria)
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
//       REGISTRAR USUARIO
// =====================================
ruta.post('/registrarUsuario', registrarUsuario)

// =====================================
//       INGRESAR USUARIO
// =====================================
ruta.post('/ingresarUsuario', ingresarUsuario)
// =====================================
//       OBTENER ROLES 
// =====================================
ruta.get('/roles', obtenerRoles)
ruta.post('/roles', registrarRol)
