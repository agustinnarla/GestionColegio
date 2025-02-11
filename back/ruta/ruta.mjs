import {Router} from 'express'
import multer from 'multer'
import { agregarAlumno,agregarLegajo, deshabilitarAlumno, modificarAlumno, obtenerAlumno, obtenerAlumnoCurso, obtenerAlumnoFiltrado,obtenerLegajoAlumnoFiltrado, obtenerAlumnoNombreApellido, obtenerLegajoAlumno, modificarAdjuntoLegajo } from '../metodos/metodosGestionAlumno.mjs'
import { obtenerSexo } from '../metodos/metodosSexo.mjs'
import { obtenerCurso, obtenerCursoFiltrado } from '../metodos/metodosCurso.mjs'
import { obtenerEstadoAlumno } from '../metodos/metodosEstadoAlumno.mjs'
import { obtenerLocalidad } from '../metodos/metodosLocalidad.mjs'
import { obtenerSolicitante } from '../metodos/metodosSolicitante.mjs'
import { registrarObservacion } from '../metodos/metodosObservacion.mjs'
import { registrarAmonestacion, obtenerCantidadAmonestaciones} from '../metodos/metodosAmonestacion.mjs'
import { modificarAsistencia, registrarAsistenciaBackend, validarFechaAsistencia, obtenerModificacionAlumnosAusentes, obtenerFaltasSuperadas } from '../metodos/metodosAsistencia.mjs'
import { obtenerNotas, registrarNota } from '../metodos/metodosCargarNotas.mjs'
import { obtenerMateria } from '../metodos/metodosMateria.mjs'
import { obtenerEtapaEvaluativa } from '../metodos/metodosEtapaEvaluativa.mjs'
import { obtenerAlumnoFinal, registrarCursoNuevo } from '../metodos/metodosPasarCurso.mjs'
import {  obtenerAlumnosAusentes, obtenerEstadosFalta, obtenerJustificarFalta, registrarJustificacion, ActualizarEstadoLibreAlumno} from '../metodos/metodosJustificarFalta.mjs'
import { obtenerEstadoCertificado } from '../metodos/metodosCertificados.mjs'
import { obtenerEstadoInasistencia } from '../metodos/metodosEstado.mjs'

// Configuración de multer
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

export const ruta = Router()

//Gestion alumno
ruta.get('/alumnos', obtenerAlumno)
ruta.get('/alumnos/:dnialumno', obtenerAlumnoFiltrado)
ruta.get('/alumnosNombreApellido',obtenerAlumnoNombreApellido)
ruta.get('/alumnosPorCurso/:idcurso',obtenerAlumnoCurso)
ruta.get('/alumnosLegajo', obtenerLegajoAlumno)
ruta.get('/alumnosLegajo/:dnialumno/:imagenTipo', obtenerLegajoAlumnoFiltrado);
ruta.post('/alumnos', agregarAlumno)
ruta.post('/alumnosLegajo', upload.fields([
    { name: 'dnifoto', maxCount: 1 },
    { name: 'fichamedica', maxCount: 1 },
    { name: 'partidanacimiento', maxCount: 1 }
]), agregarLegajo);
ruta.put('/alumnos/deshabilitar/:dnialumno',deshabilitarAlumno)
ruta.put('/alumnos/modificar/:dnialumno',modificarAlumno);
ruta.put('/alumnosLegajo/modificar/:dnialumno',  upload.fields([
    { name: 'dnifoto', maxCount: 1 },
    { name: 'fichamedica', maxCount: 1 },
    { name: 'partidanacimiento', maxCount: 1 }
]), modificarAdjuntoLegajo);
ruta.put('/alumnos/actualizarEstadoAlumno', ActualizarEstadoLibreAlumno) //cambiar a metodosAlumno
//Sexo
ruta.get('/sexo',obtenerSexo)
//Curso
ruta.get('/curso',obtenerCurso)
ruta.get('/curso/:idcurso', obtenerCursoFiltrado)
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
// Asegúrate de que esta línea esté definida correctamente en el backend
ruta.post('/asistencia', registrarAsistenciaBackend);
ruta.put('/asistencia', modificarAsistencia)
ruta.get('/asistencia/curso/:idcurso/fecha/:fecha', validarFechaAsistencia)
ruta.get('/asistencia/curso/:idcurso/fecha/:fecha/ausentes', obtenerModificacionAlumnosAusentes)
ruta.get('/asistencia/ausenciaSuperadas', obtenerFaltasSuperadas) 
//Notas
ruta.get('/notas/:idcurso/:idmateria', obtenerNotas)
ruta.post('/notas',registrarNota)
//Materia
ruta.get('/materia',obtenerMateria)
//Etapas
ruta.get('/etapas',obtenerEtapaEvaluativa)
//Pasaje de curso
ruta.get('/pasajeCurso/:idcurso',obtenerAlumnoFinal)
ruta.post('/pasajeCurso',registrarCursoNuevo)
//Justificar Falta
ruta.get('/justificarFalta/:fechadesde/:fechahasta', obtenerAlumnosAusentes) 
ruta.get('/justificarFalta/estadoalumnos/:fechadesde/:fechahasta', obtenerJustificarFalta);
ruta.get('/justificarFalta/estadofalta', obtenerEstadosFalta)
ruta.get('/justificarFalta', obtenerJustificarFalta)
ruta.post('/justificarFalta',registrarJustificacion)
//Certificado
ruta.get('/certificado',obtenerEstadoCertificado)
//Estado Inasistencia
ruta.get('/estado',obtenerEstadoInasistencia)