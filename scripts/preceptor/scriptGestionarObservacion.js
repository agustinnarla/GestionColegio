import { Alert, Platform } from 'react-native';
//Rutas que utilizamos
const api_url = 'http://localhost:5000'
const api_urlAlumnoCurso = 'http://localhost:5000/alumnosPorCurso'

//Obtenemos los solicitantes para registrar quien manda la observación
export const obtenerSolicitante = async () => {
    try{
        //Consultamos a la api
        const respuesta = await fetch(`${api_url}/solicitante`)
        const data = await respuesta.json()
        if(respuesta.ok){
            return data.solicitante
        }else{
            //console.log('error')
            throw new Error(data.error)

        }
    }catch(error){
        //console.log(error)
        throw new Error("Error al obtener los solicitantes")
    }
}

//Obtenemos alumno por curso para la carga de la lista desplegable
export const obtenerAlumnoCurso = async (id_curso) =>{
    try{
        //Consultamos la api
        const respuesta = await fetch(`${api_urlAlumnoCurso}/${id_curso}`)
        const data = await respuesta.json()
        if(respuesta.ok){
            return data.alumnos
        }else{
            //console.log('error')
            throw new Error(data.error)

        }
    }catch(error){
        //console.log(error)
        throw new Error("Error al obtener los alumnos")
    }
}

//Registramos la observación
export const registrarObservacion = async (formData) => {
    try{
        //Consultamos la api 
        const respuesta = await fetch(`${api_url}/observacion`, {
            method: 'POST',
            headers: {'Content-Type' : 
            'application/json'},
            body: JSON.stringify(formData)
        })
        const data =  await respuesta.json()

        if(respuesta.ok){
            //console.log("Se agrego la observación")
            return data;  
        } else {
            throw new Error(data.error || 'Error desconocido al registrar la observación');
        }
    }catch(error){
        //console.log(error)
        throw new Error("Error al cargar la observación")
    }
}


//Mostramos un mensaje en pantalla, pero lo configuramos para web y para celular ya que si no tenemos error 
export const mostrarMensaje = (titulo, texto) => {
    if (Platform.OS === 'web') {
        // Para web
        return new Promise((resolve) => {
            alert(`${titulo}\n${texto}`);
            resolve();
        });
    } else {
        // Para celular
        return new Promise((resolve) => {
            Alert.alert(
                titulo,
                texto,
                [
                    {
                        text: "Observación registrada correctamente",
                        onPress: () => resolve()
                    }
                ],
                { cancelable: false }
            );
        });
    }
}


//Funcion para imprimir el archivo 
export const imprimirArchivo = async (formData, alumno, solicitante) => {
    try {
        //Obtenemos la fecha del equipo local
        const fecha = new Date().toLocaleDateString();
        //Generamos nuestro contenido en html para luego ser mostrado 
        const htmlContent = `
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif, text-align: center; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .content { margin: 20px, text-align: center; }
                        .footer { text-align: center; margin-top: 50px; }
                        .firma-line { border-top: 1px solid black; width: 200px; margin: 10px auto; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Observación Escolar</h1>
                        <p>Fecha de emisión: ${fecha}</p>
                    </div>
                    <div class="content">
                        <p><strong>Alumno:</strong> ${alumno.nombrecompleto}</p>
                        <p><strong>DNI:</strong> ${formData.dni_alumno}</p>
                        <p><strong>Fecha de la observación:</strong> ${formData.fecha}</p>
                        <p><strong>Solicitado por:</strong> ${solicitante.nombre_apellido}</p>
                        <p><strong>Motivo:</strong>${formData.motivo}</p>
                    </div>
                    <div class="footer">
                        <div class="firma-line"></div>
                        <p>Firma del Preceptor</p>
                    </div>
                </body>
            </html>
        `;

        if (Platform.OS === 'web') {
            //Para web -> abrimos en una nueva ventana e imprimir
            const printWindow = window.open('', '_blank');
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            printWindow.print();
            return 'Documento listo para imprimir';
        } 
    } catch (error) {
        console.error('Error al generar PDF:', error);
        throw new Error('No se pudo generar el documento');
    }
};