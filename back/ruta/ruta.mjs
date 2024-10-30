import {Router} from 'express'
import multer from 'multer'
import { agregarAlumno, deshabilitarAlumno, modificarAlumno, obtenerAlumno, obtenerAlumnoFiltrado } from '../metodos/metodosGestionAlumno.mjs'
import { obtenerSexo } from '../metodos/metodosSexo.mjs'
import { obtenerCurso } from '../metodos/metodosCurso.mjs'
import { obtenerEstadoAlumno } from '../metodos/metodosEstadoAlumno.mjs'
import { obtenerLocalidad } from '../metodos/metodosLocalidad.mjs'

// Configuración de multer con validación de tipos
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos PDF'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    }
});

export const ruta = Router()

// Gestion alumno
ruta.get('/alumnos', obtenerAlumno)
ruta.get('/alumnos/:dnialumno', obtenerAlumnoFiltrado)
ruta.post('/alumnos', 
    upload.fields([
        { name: 'dniFoto', maxCount: 1 }, 
        { name: 'fichaMedica', maxCount: 1 }, 
        { name: 'partidaNacimiento', maxCount: 1 }
    ]), 
    agregarAlumno
)
ruta.put('/alumnos/deshabilitar/:dnialumno', deshabilitarAlumno)
ruta.put('/alumnos/modificar/:dnialumno', modificarAlumno)

//Sexo
ruta.get('/sexo',obtenerSexo)
//Curso
ruta.get('/curso',obtenerCurso)
//EstadoAlumno
ruta.get('/estadoAlumno',obtenerEstadoAlumno)
//Localidad
ruta.get('/localidad',obtenerLocalidad)