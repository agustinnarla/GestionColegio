import {Router} from 'express'
//import multer from 'multer'
import { agregarAlumno, deshabilitarAlumno, modificarAlumno, obtenerAlumno, obtenerAlumnoCurso, obtenerAlumnoFiltrado, obtenerAlumnoNombreApellido } from '../metodos/metodosGestionAlumno.mjs'
import { obtenerSexo } from '../metodos/metodosSexo.mjs'
import { obtenerCurso } from '../metodos/metodosCurso.mjs'
import { obtenerEstadoAlumno } from '../metodos/metodosEstadoAlumno.mjs'
import { obtenerLocalidad } from '../metodos/metodosLocalidad.mjs'
import { obtenerSolicitante } from '../metodos/metodosSolicitante.mjs'
import { registrarObservacion } from '../metodos/metodosObservación.mjs'

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