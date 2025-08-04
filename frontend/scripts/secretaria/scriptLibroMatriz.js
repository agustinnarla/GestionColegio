const api_urlAlumno = 'http://192.168.0.23:5000/libroMatriz'
const api_urlLibroMatriz = 'http://localhost:5000/alumno/libroMatriz'
import {Platform} from 'react-native';

/*
    CONSULTA A LA API PARA LA OBTENCIÓN DEL LIBRO MATRIZ DEL ALUMNO 
*/

// 🟢
export const obtenerLibroMatriz = async (dni_alumno) => {
 
    try {
        const respuesta = await fetch(`${api_urlLibroMatriz}/${dni_alumno}`);
        const data = await respuesta.json();
        return data
         
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
    // Si el promedio es null, undefined o no es un número válido
    if (promedio === null || promedio === undefined || isNaN(promedio)) {
        return 'no hay notas registradas';
    }
    
    // Convertir a número y redondear para manejar decimales
    const promedioNum = Math.round(parseFloat(promedio));
    
    switch (promedioNum) {
        case 10:
            return 'diez';
        case 9:
            return 'nueve';
        case 8:
            return 'ocho';
        case 7:
            return 'siete';
        case 6:
            return 'seis';
        case 5:
            return 'cinco';
        case 4:
            return 'cuatro';
        case 3:
            return 'tres';
        case 2:
            return 'dos';
        case 1:
            return 'uno';
        case 0:
            return 'cero';
        default:
            return 'no hay notas registradas';
    }
}