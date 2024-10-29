import {Router} from 'express'
//import multer from 'multer'
import { agregarAlumno, deshabilitarAlumno, modificarAlumno, obtenerAlumno, obtenerAlumnoFiltrado } from '../metodos/metodosGestionAlumno.mjs'
import { obtenerSexo } from '../metodos/metodosSexo.mjs'
import { obtenerCurso } from '../metodos/metodosCurso.mjs'
import { obtenerEstadoAlumno } from '../metodos/metodosEstadoAlumno.mjs'
import { obtenerLocalidad } from '../metodos/metodosLocalidad.mjs'

// Configuración de multer
//const storage = multer.memoryStorage()
//const upload = multer({ storage: storage })

export const ruta = Router()

//Gestion alumno
ruta.get('/alumnos', obtenerAlumno)
ruta.get('/alumnos/:dnialumno', obtenerAlumnoFiltrado)
ruta.post('/alumnos', agregarAlumno)
ruta.put('/alumnos/deshabilitar/:dnialumno',deshabilitarAlumno)
ruta.put('/alumnos/:dnialumno',modificarAlumno);
//Sexo
ruta.get('/sexo',obtenerSexo)
//Curso
ruta.get('/curso',obtenerCurso)
//EstadoAlumno
ruta.get('/estadoAlumno',obtenerEstadoAlumno)
//Localidad
ruta.get('/localidad',obtenerLocalidad)