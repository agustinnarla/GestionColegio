const api_urlAlumno = 'http://192.168.0.23:5000/libroMatriz'

export const obtenerLibroMatriz = async (dnialumno) => {
    if (!dnialumno) {
        throw new Error("dnialumno es requerido");
    }

    try {
        const respuesta = await fetch(`${api_urlAlumno}/${dnialumno}`);
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