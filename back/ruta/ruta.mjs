import {Router} from 'express'
//import multer from 'multer'
import { agregarAlumno, deshabilitarAlumno, modificarAlumno, obtenerAlumno, obtenerAlumnoCurso, obtenerAlumnoFiltrado, obtenerAlumnoNombreApellido } from '../metodos/metodosGestionAlumno.mjs'
import { obtenerSexo } from '../metodos/metodosSexo.mjs'
import { obtenerCurso } from '../metodos/metodosCurso.mjs'
import { obtenerEstadoAlumno } from '../metodos/metodosEstadoAlumno.mjs'
import { obtenerLocalidad } from '../metodos/metodosLocalidad.mjs'
import { obtenerSolicitante } from '../metodos/metodosSolicitante.mjs'
import { registrarObservacion } from '../metodos/metodosObservacion.mjs'
import { registrarAmonestacion, obtenerCantidadAmonestaciones} from '../metodos/metodosAmonestacion.mjs'
import { modificarAsistencia, registrarAsistencia } from '../metodos/metodosAsistencia.mjs'
import { obtenerNotas, registrarNota } from '../metodos/metodosCargarNotas.mjs'
import { obtenerMateria } from '../metodos/metodosMateria.mjs'
import { obtenerEtapaEvaluativa } from '../metodos/metodosEtapaEvaluativa.mjs'
import { obtenerAlumnoFinal, registrarCursoNuevo } from '../metodos/metodosPasarCurso.mjs'
import {  obtenerAlumnosAusentes, registrarJustificacion } from '../metodos/metodosJustificarFalta.mjs'
import { obtenerEstadoCertificado } from '../metodos/metodosCertificados.mjs'
import { obtenerEstadoInasistencia } from '../metodos/metodosEstado.mjs'

// Configuración de multer
//const storage = multer.memoryStorage()
//const upload = multer({ storage: storage })

export const ruta = Router()

//Gestion alumno
ruta.get('/alumnos', obtenerAlumno)
ruta.get('/alumnos/:dnialumno', obtenerAlumnoFiltrado)
ruta.get('/alumnosNombreApellido',obtenerAlumnoNombreApellido)
ruta.get('/alumnosPorCurso/:idcurso',obtenerAlumnoCurso)
ruta.post('/alumnos', agregarAlumno)
ruta.put('/alumnos/deshabilitar/:dnialumno',deshabilitarAlumno)
ruta.put('/alumnos/modificar/:dnialumno',modificarAlumno);
//Sexo
ruta.get('/sexo',obtenerSexo)
//Curso
ruta.get('/curso',obtenerCurso)
//EstadoAlumno
ruta.get('/estadoAlumno',obtenerEstadoAlumno)
//Localidad
ruta.get('/localidad',obtenerLocalidad)
//Solicitante
ruta.get('/solicitante',obtenerSolicitante)
//Observación
ruta.post('/observacion',registrarObservacion)
//Amonestación
ruta.post('/amonestacion',registrarAmonestacion)
ruta.get('/amonestacion/:dnialumno',obtenerCantidadAmonestaciones)
//Asistencia 
ruta.post('/asistencia',registrarAsistencia)
ruta.put('/asistencia', modificarAsistencia)
//Notas
ruta.get('/notas/:idcurso', obtenerNotas)
ruta.post('/notas',registrarNota)
//Materia
ruta.get('/materia',obtenerMateria)
//Etapas
ruta.get('/etapas',obtenerEtapaEvaluativa)
//Pasaje de curso
ruta.get('/pasajeCurso/:idcurso',obtenerAlumnoFinal)
ruta.post('/pasajeCurso',registrarCursoNuevo)
//Justificar Falta
ruta.get('/justificarFalta/:idcurso', obtenerAlumnosAusentes)
ruta.post('/justificarFalta',registrarJustificacion)
//Certificado
ruta.get('/certificado',obtenerEstadoCertificado)
//Estado Inasistencia
ruta.get('/estado',obtenerEstadoInasistencia)