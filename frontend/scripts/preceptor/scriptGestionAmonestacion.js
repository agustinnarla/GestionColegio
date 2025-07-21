import { Alert, Platform } from 'react-native';
const api_url = 'http://localhost:5000'
const api_urlAmonestacion = 'http://localhost:5000/alumno/amonestacion/alta'
const api_urlCantidad = 'http://localhost:5000/alumno/amonestacion/cantidad'


// 🟢
export const registrarAmonestacion = async (formData) => {
    try{
        const respuesta = await fetch(`${api_urlAmonestacion}`, {
            method: 'POST',
            headers: {'Content-Type' : 
            'application/json'},
            body: JSON.stringify(formData)
        })
        const data =  await respuesta.json()

        if(respuesta.ok){
            console.log("Se registro la amonestación")
            return data;  
        } else {
            throw new Error(data.error || 'Error desconocido al registrar la amonestación');
        }
    }catch(error){
        console.log(error)
        throw new Error("Error al cargar la amonestación")
    }
}

// 🟢
export const imprimirArchivo = async (formData, alumno, profesional) => {
    try {
        const fecha = new Date().toLocaleDateString();
        
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
                        <h1>Amonestación Escolar</h1>
                        <p>Fecha de emisión: ${fecha}</p>
                    </div>
                    <div class="content">
                        <p><strong>Alumno:</strong> ${alumno.nombrecompleto}</p>
                        <p><strong>DNI:</strong> ${formData.dni_alumno}</p>
                        <p><strong>Amonestaciones:</strong> ${formData.cantidad}</p>
                        <p><strong>Fecha de la amonestación:</strong> ${formData.fecha}</p>
                        <p><strong>Solicitado por:</strong> ${profesional.nombre_apellido}</p>
                        <p><strong>Motivo:</strong>${formData.motivo}</p>
                       
                    </div>
                    <div class="footer">
                        <div class="firma-line"></div>
                        <p>Firma del Preceptor</p>
                         <br>
                        <p><strong>Colegio Nuestra Señora del Huerto</strong></p>
                        <p><strong>Telefono:</strong> 1234-5678</p>
                    </div>
                </body>
            </html>
        `;

        if (Platform.OS === 'web') {
            // Para web: abrir en una nueva ventana e imprimir
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

export const obtenerCantidadAmonestaciones = async(dni_alumno) => {
    try{
        const respuesta = await fetch(`${api_urlCantidad}/${dni_alumno}`)

        if (!respuesta.ok) {
            throw new Error('Error al obtener las amonestaciones');
        }
        
        const data = await respuesta.json();

        return data.total 
        
    } catch (error) {
        console.error('Error en obtenerCantidadAmonestaciones:', error);
    }
}