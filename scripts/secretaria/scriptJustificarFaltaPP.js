const api_urlJustificarFaltaPP = 'http://localhost:5000/justificarFaltaPP'

export const obtenerEstadosFaltaPP = async () => {
    try {
      const respuesta = await fetch(`${api_urlJustificarFaltaPP}/estadoFalta`);
      const data = await respuesta.json();
  
      if (respuesta.ok) {
        return data; // ← Devuelve el array de estados
      } else {
        throw new Error(data.error || 'Error desconocido');
      }
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener los estados de falta PP');
    }
  };
  
  export const obtenerFaltasPP = async (fechaInicio, fechaFin) => {
    try {
      const respuesta = await fetch(`${api_urlJustificarFaltaPP}/faltas/${fechaInicio}/${fechaFin}`);
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

  export const registrarJustificacionPP = async (formData) => {
    try {
        const { id_estadofalta, dni_profesor, id_certificado, fecha } = formData;

        const respuesta = await fetch(`${api_urlJustificarFaltaPP}/registrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_estadofalta,
                dni_profesor,
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