const api_urlJustificarFalta = 'http://localhost:5000/justificar/profesional/faltas'
const api_urlJustificarFaltaAlta = 'http://localhost:5000/justificar/profesional/alta'


  // 🟢
  export const obtenerFaltasPP = async (fechaInicio, fechaFin) => {
    try {
      const respuesta = await fetch(`${api_urlJustificarFalta}/${fechaInicio}/${fechaFin}`);
      const data = await respuesta.json();
  
      if (respuesta.ok) {
        return data; // ← Devuelve el array de asistencias con id_estadoasistencia = 2
      } else {
        throw new Error(data.error || 'Error desconocido al obtener faltas');
      }
    } catch (error) {
      console.error('Error al obtener faltas entre fechas:', error);
      throw new Error('No se pudieron obtener las faltas PP');
    }
  };

  // 🟢
  export const registrarJustificacionPP = async (formData) => {
    try {
        const { id_estado_falta_profesional, dni_profesional, id_certificado, fecha } = formData;

        const respuesta = await fetch(`${api_urlJustificarFaltaAlta}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_estado_falta_profesional,
                dni_profesional,
                id_certificado,
                fecha
            }),
        });

        const result = await respuesta.json();

        if (respuesta.ok) {
            console.log('Justificación PP registrada:', result);
            return result;
        } else {
            throw new Error(result.error || 'Error al registrar justificación PP');
        }
    } catch (error) {
        console.error('Error al registrar justificación PP:', error);
        throw new Error('Error al registrar la justificación PP');
    }
};