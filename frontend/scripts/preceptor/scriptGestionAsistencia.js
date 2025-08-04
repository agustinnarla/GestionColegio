import { API_BASE_URL } from "../config";
import * as XLSX from 'xlsx';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
//Rutas que utilizamos
const api_url = 'http://localhost:5000'
const api_urlAsistencia = `${ API_BASE_URL }/alumno/asistencia`
const api_urlCurso = `${ API_BASE_URL }/listaDesplegable/curso`

// Esta es la función del frontend que hace la solicitud HTTP al backend.
export const registrarAsistenciaFrontend = async (formData) => {
    try {
        console.log("Datos que se van a enviar al backend:", formData); // Verifica los datos antes de enviarlos

        const respuesta = await fetch(`${api_urlAsistencia}/alta`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // Enviamos solo un objeto
        });
        

        const data = await respuesta.json();
        console.log('Respuesta del servidor:', data); // Verifica la respuesta del backend

        if (respuesta.ok) {
            console.log("Se agregó la asistencia");
            return data;
        } else {
            throw new Error(data.error || 'Error desconocido al registrar la asistencia');
        }
    } catch (error) {
        console.log(error);
        throw new Error("Error al cargar la asistencia");
    }
};

export const obtenerCursoFrontend = async (idcurso) => {
    try {
        const url = `${api_urlCurso}/${idcurso}`; // Construye la URL con el idcurso
        console.log("URL que se va a consumir:", url); // Verifica la URL antes de consumirla

        const respuesta = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await respuesta.json();
        console.log('Respuesta del servidor:', data); // Verifica la respuesta del backend

        if (respuesta.ok) {
            console.log("Curso obtenido correctamente");
            return data;
        } else {
            throw new Error(data.error || 'Error desconocido al obtener el curso');
        }
    } catch (error) {
        console.log("Error al obtener el curso:", error.message);
        throw new Error("Error al obtener el curso");
    }
};

export const validarFechaAsistencia = async (idcurso, fecha) => {
    try {
        const url = `${api_urlAsistencia}/curso/${idcurso}/fecha/${fecha}`; // Construye la URL con el idcurso
        console.log("URL que se va a consumir:", url); // Verifica la URL antes de consumirla
        const respuesta = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await respuesta.json();
        console.log('Respuesta del servidor:', data); // Verifica la respuesta del backend
        return data.tieneAsistencia;
    } catch (error) {
        console.log("Error al validar", error.message);
        throw new Error("Error al validar");
    }
}

export const obtenerAlumnosAusentes = async (idcurso, fecha) => {
    try {
        const url = `${api_urlAsistencia}/curso/${idcurso}/fecha/${fecha}/ausentes`;  // Asegúrate de que esta URL sea correcta
        console.log("URL que se va a consumir:", url); // Verifica que la URL esté correcta
        const respuesta = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await respuesta.json();
        console.log('Respuesta de la API:', data); // Verifica la respuesta de la API
        return data;  // Aquí aseguramos que se devuelve la respuesta completa
    } catch (error) {
        console.log("Error al obtener los alumnos ausentes", error.message);
        throw new Error("Error al obtener los alumnos ausentes");
    }
};


export const exportarExcelConDatos = async (nuevosDatos, nombreArchivo = 'asistencia.xlsx') => {
  try {
    const fileName = nombreArchivo;

    if (Platform.OS === 'web') {
      // 👉 Exportación para web
      const worksheet = XLSX.utils.json_to_sheet(nuevosDatos);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Asistencia');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      // 👉 Exportación para Android/iOS
      const pathArchivo = FileSystem.documentDirectory + fileName;
      let workbook;
      let worksheet;

      const fileInfo = await FileSystem.getInfoAsync(pathArchivo);
      if (fileInfo.exists) {
        const contenidoBase64 = await FileSystem.readAsStringAsync(pathArchivo, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const buffer = Buffer.from(contenidoBase64, 'base64');
        workbook = XLSX.read(buffer, { type: 'buffer' });

        worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const datosExistentes = XLSX.utils.sheet_to_json(worksheet);
        const nuevosCombinados = [...datosExistentes, ...nuevosDatos];
        const nuevoSheet = XLSX.utils.json_to_sheet(nuevosCombinados);
        workbook.Sheets[workbook.SheetNames[0]] = nuevoSheet;
      } else {
        worksheet = XLSX.utils.json_to_sheet(nuevosDatos);
        workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Asistencia');
      }

      const excelBase64 = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
      await FileSystem.writeAsStringAsync(pathArchivo, excelBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (!(await Sharing.isAvailableAsync())) {
        alert("Compartir no está disponible en este dispositivo");
        return;
      }

      await Sharing.shareAsync(pathArchivo);
    }
  } catch (error) {
    console.error("Error al exportar Excel:", error);
    alert("Error al exportar la asistencia.");
  }
};
