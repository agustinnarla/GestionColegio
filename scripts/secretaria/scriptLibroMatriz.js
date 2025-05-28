const api_urlAlumno = 'http://192.168.0.23:5000/libroMatriz'
const api_urlLibroMatriz = 'http://localhost:5000/alumno/libroMatriz'
import {Platform} from 'react-native';

/*
    CONSULTA A LA API PARA LA OBTENCIÓN DEL LIBRO MATRIZ DEL ALUMNO 
*/

// 🟢
export const obtenerLibroMatriz = async (dni_alumno) => {
    if (!dni_alumno) {
        throw new Error("dnialumno es requerido");
    }

    try {
        const respuesta = await fetch(`${api_urlLibroMatriz}/${dni_alumno}`);
        const data = await respuesta.json();
        
        if (respuesta.ok) {
            if (data.grilla && Array.isArray(data.grilla) && data.grilla.length > 0) {
                return data.grilla;
            } else {
                throw new Error("No se encontraron datos del alumno");
            }
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.log("Error en obtenerLibroMatriz:", error);
        throw new Error("Error al traer el alumno y sus datos: " + error.message);
    }
}

/*
    FUNCIÓN PARA IMPRIMIR EL LIBRO MATRIZ
*/
// 🟢
export const imprimirLibroMatriz = async (alumno, cursos) => {
    try {
        const fecha = new Date().toLocaleDateString();
        
        const htmlContent = `
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .content { margin: 20px; }
                        .footer { text-align: center; margin-top: 50px; }
                        .firma-line { border-top: 1px solid black; width: 200px; margin: 10px auto; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid black; padding: 8px; text-align: center; }
                        th { background-color: #f2f2f2; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Libro Matriz</h1>
                        <p>Fecha de emisión: ${fecha}</p>
                    </div>
                    ${cursos.map(curso => `
                        <div class="content">
                            <p><strong>DNI:</strong> ${alumno.dni_alumno}</p>
                            <p><strong>Curso:</strong> ${curso.curso_detalle}</p>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Espacio Curricular</th>
                                        <th>Condición</th>
                                        <th>N°</th>
                                        <th>Letra</th>
                                        <th>D</th>
                                        <th>M</th>
                                        <th>A</th>
                                        <th>Establecimiento</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${curso.datos.map(item => `
                                        <tr>
                                            <td>${item.materia_detalle}</td>
                                            <td>${item.estado_detalle}</td>
                                            <td>${item.promedio}</td>
                                            <td>${obtenerLetra(item.promedio)}</td>
                                            <td>${new Date().getDate()}</td>
                                            <td>${new Date().getMonth() + 1}</td>
                                            <td>${new Date().getFullYear()}</td>
                                            <td>Este establecimiento</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `).join('')}
                    <div class="footer">
                        <div class="firma-line"></div>
                        <p>Firma del Preceptor</p>
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


/*
    OBTENEMOS LETRA DE ACUERDO AL PROMEDIO 
*/
// 🟢
export const obtenerLetra = (promedio) => {
    switch (true) {
        case promedio == 10:
            return 'diez';
        case promedio == 9:
            return 'nueve';
        case promedio == 8:
            return 'ocho';
        case promedio == 7:
            return 'siete';
        case promedio == 6:
            return 'seis';
        case promedio == 5:
            return 'cinco';
        case promedio == 4:
            return 'cuatro';
        case promedio == 3:
            return 'tres';
        case promedio == 2:
            return 'dos';
        case promedio == 1:
            return 'uno';
        case promedio == 0:
            return 'cero';
        default:
            return 'no hay notas registradas';
    }
}