import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, CheckBox, ImageBackground, Alert, Pressable, Linking } from 'react-native';
import bg from '../../assets/bg1.jpg';
import { obtenerLocalidad, obtenerCursoConAlumnos, obtenerSexo, obtenerEstadoGeneral } from '../../scripts/listasDesplegables/listaDesplegable.js'
import { agregarAlumno ,obtenerAlumnoFiltrado,deshabilitarAlumno,modificarAlumno,agregarLegajo, modificarLegajo, obtenerDniPdf, obtenerFichaMedicaPdf, obtenerPartidaNacimientoPdf } from '../../scripts/secretaria/scriptGestionAlumno.js';
import CustomAlert from '../../componente/CustomAlerts.js';
import * as DocumentPicker from 'expo-document-picker';
import ListasDesplegables from '../../componente/ListasDesplegables.jsx';
import ScrollContainer from '../../componente/ScrollContainer.jsx';


export default function GestionarAlumno() {

    const [formData, setFormData] = useState({
        dni_alumno: '',
        nombre: '',
        apellido: '',
        cuil: '',
        id_sexo: '',
        email_personal: '',
        email_familiar: '',
        id_curso: '',
        fecha_nacimiento: '',
        telefono_madre: '',
        telefono_padre: '',
        telefono_personal: '',
        id_estado_general: '',
        id_localidad: '',
        domicilio: '',
        edificio: false,
        piso: '',
        departamento: ''
    });


       // Mensajes 
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [cuilEditable, setCuilEditable] = useState(false);

    const mostrarMensaje = (titulo, mensaje) => {
        setAlertTitle(titulo);
        setAlertMessage(mensaje);
        setAlertVisible(true);
    };

    const validarCampos = () => {
        return(
            formData.dni_alumno &&
            formData.nombre &&
            formData.apellido &&
            formData.cuil &&
            formData.id_sexo &&
            formData.email_personal &&
            formData.email_familiar &&
            formData.id_curso &&
            formData.fecha_nacimiento &&
            formData.telefono_madre &&
            formData.telefono_padre &&
            formData.telefono_personal &&
            formData.id_estado_general &&
            formData.id_localidad &&
            formData.domicilio &&
            formData.edificio != null &&
            formData.piso != null &&
            formData.departamento != null
        )
    }

    const validarDni = () => {
        return(
            formData.dni_alumno
        )
    }

    //Listas desplegables
    const[curso_cantidad,setCursoCantidad] = useState([])
    const[localidad,setLocalidad] = useState([])
    const[sexo,setSexos] = useState([])
    const[estado_general,setEstadoGeneral] = useState([])

    useEffect(() => {
        const cargarListaDesplegable = async () => {
            try {
                const cursosData = await obtenerCursoConAlumnos();
                const localidadData = await obtenerLocalidad();
                const sexosData = await obtenerSexo();
                const estadoData = await obtenerEstadoGeneral();

                setSexos(sexosData);
                setCursoCantidad(cursosData); 
                setLocalidad(localidadData);
                setEstadoGeneral(estadoData);
            } catch (error) {
                mostrarMensaje('Error','Por favor consulte con el administrador')
            }
        };

    cargarListaDesplegable();
    }, []);


    const handleChange = (name, value) => {
        let updatedForm = { ...formData, [name]: value };
    
        // Solo auto-calcular CUIL si no está en modo edición manual
        if (
            (name === 'dni_alumno' || name === 'id_sexo') &&
            updatedForm.dni_alumno &&
            updatedForm.id_sexo &&
            !cuilEditable
        ) {
            const cuilCalculado = calcularCuil(updatedForm.dni_alumno, updatedForm.id_sexo);
            updatedForm.cuil = cuilCalculado;
        }
    
        setFormData(updatedForm);
    };

    const handleDobleClickCuil = () => {
        setCuilEditable(true);
    };


    const handleConsultar = async () => {
        try {
            const alumno = await obtenerAlumnoFiltrado(formData.dni_alumno); 
            const legajoDNI = await obtenerDniPdf(formData.dni_alumno) || null
            const legajoFichaMedica = await obtenerFichaMedicaPdf(formData.dni_alumno) || null
            const legajoPartidaNacimiento = await obtenerPartidaNacimientoPdf(formData.dni_alumno) || null
            console.log('Alumno consultado:', alumno);
            console.log('Legajos obtenidos:', { legajoDNI, legajoFichaMedica, legajoPartidaNacimiento });
            
            if (alumno) {
                setFormData({
                    dni_alumno: alumno.dni_alumno || '',
                    nombre: alumno.nombre || '',
                    apellido: alumno.apellido || '',
                    domicilio: alumno.domicilio || '',
                    id_sexo: alumno.id_sexo || '',
                    cuil: alumno.cuil || '',
                    fecha_nacimiento: alumno.fecha_nacimiento && !isNaN(new Date(alumno.fecha_nacimiento).getTime())
                    ? new Date(alumno.fecha_nacimiento).toISOString().split('T')[0].replace(/-/g, '/')
                    : '',
                                    id_localidad: alumno.id_localidad || '',
                    id_estado_general: alumno.id_estado_general || '',
                    telefono_personal: alumno.telefono_personal || '',
                    telefono_madre: alumno.telefono_madre || '',
                    telefono_padre: alumno.telefono_padre || '',
                    email_personal: alumno.email_personal || '',
                    email_familiar: alumno.email_familiar || '',
                    id_curso: alumno.id_curso || '',
                    departamento: alumno.departamento || '',
                    piso: alumno.piso || '',
                    edificio: alumno.edificio ?? false,
                });

                // Convertir blobs a URLs para mostrar en la interfaz
                const documentosUrls = {};
                
                if (legajoDNI && legajoDNI instanceof Blob && legajoDNI.size > 0) {
                    documentosUrls.dni_foto = URL.createObjectURL(legajoDNI);
                }
                
                if (legajoFichaMedica && legajoFichaMedica instanceof Blob && legajoFichaMedica.size > 0) {
                    documentosUrls.ficha_medica = URL.createObjectURL(legajoFichaMedica);
                }
                
                if (legajoPartidaNacimiento && legajoPartidaNacimiento instanceof Blob && legajoPartidaNacimiento.size > 0) {
                    documentosUrls.partida_nacimiento = URL.createObjectURL(legajoPartidaNacimiento);
                }

                setDocumentos(documentosUrls);
                console.log('Documentos URLs creadas:', documentosUrls);
            } else {
                mostrarMensaje('Advertencia','Alumno no encontrado o DNI erróneo')
            }
        } catch (error) {
            console.error('Error al consultar alumno:', error.message);
            mostrarMensaje('Error','Error al consultar el alumno')
        }
    }

    
    const handleAgregar = async () => {

    
        const telefonoPadre = parseInt(formData.telefono_padre, 10);
        const telefonoMadre = parseInt(formData.telefono_madre, 10);
        // Validar los teléfonos

        if (isNaN(telefonoMadre)) {
            Alert.alert('Error', 'El teléfono de la madre debe ser un número válido.');
            console.log('Teléfono madre no válido:', formData.telefono_madre);
            return;
        }

        if (isNaN(telefonoPadre)) {
            Alert.alert('Error', 'El teléfono del padre debe ser un número válido.');
            console.log('Teléfono padre no válido:', formData.telefono_padre);
            return;
        }

        const telefonoPersonal = parseInt(formData.telefono_personal, 10);
        if (isNaN(telefonoPersonal)) {
            Alert.alert('Error', 'El teléfono personal debe ser un número válido.');
            console.log('Teléfono personal no válido:', formData.telefono_personal);
            return;
        }

        const id_sexo = parseInt(formData.id_sexo, 10);
        const id_localidad = parseInt(formData.id_localidad, 10);
        const id_estado_general = parseInt(formData.id_estado_general, 10);
        const id_curso = parseInt(formData.id_curso, 10);

        if (isNaN(id_sexo) || isNaN(id_localidad) || isNaN(id_estado_general) || isNaN(id_curso)) {
            Alert.alert('Error', 'Los IDs deben ser números válidos.');
            console.log('Ids no válidos:', { id_sexo, id_localidad, id_estado_general, id_curso });
            return;
        }

        const fechanacimiento = new Date(formData.fecha_nacimiento);
        if (!validarFechaNacimiento(fechanacimiento)) {
            return; // Detener el flujo si la fecha no es válida
        }
        
        
        // Crear el objeto alumnoData, omitiendo campos no obligatorios
        const alumnoData = {
            dni_alumno: formData.dni_alumno, 
            nombre: formData.nombre,
            apellido: formData.apellido,
            domicilio: formData.domicilio,
            id_sexo: id_sexo, 
            cuil: formData.cuil,
            fecha_nacimiento: fechanacimiento.toISOString().split('T')[0], 
            id_localidad: id_localidad, 
            id_estado_general: id_estado_general,
            telefono_personal: telefonoPersonal,
            telefono_madre: telefonoMadre,
            telefono_padre: telefonoPadre,
            email_personal: formData.email_personal,
            email_familiar: formData.email_familiar,
            id_curso: id_curso, // Usar el ID de curso validado
            edificio: formData.edificio
        };

        //agregue yo (roma)
        const obtenerFechaActual = () => {
            const ahora = new Date();
            const fecha = ahora.toISOString().split('T')[0]; // Obtiene la fecha en formato YYYY-MM-DD
            const tiempo = ahora.toISOString().split('T')[1].slice(0, -1); // Obtiene el tiempo en HH:MM:SS.SSS
            return `${fecha} ${tiempo}`; // Combina fecha y hora en el formato deseado
        }

        // Agregar el departamento y el piso solo si tienen un valor
        if (formData.departamento) {
            alumnoData.departamento = formData.departamento;
        }
        if (formData.piso) {
            alumnoData.piso = formData.piso;
        }
        console.log('Datos del alumno a agregar:', alumnoData); // Verifica el contenido
      
        //Agregue yo (roma)
        const formDataLegajo = new FormData();
        formDataLegajo.append('dni_alumno', formData.dni_alumno); // <-- corregido
        formDataLegajo.append('fecha_subida', new Date().toISOString());

        if (documentos.dni_foto) {
            const response = await fetch(documentos.dni_foto);
            const blob = await response.blob();
            formDataLegajo.append('dni_foto', blob, 'dni.jpg');
        }

        if (documentos.ficha_medica) {
            const response = await fetch(documentos.ficha_medica);
            const blob = await response.blob();
            formDataLegajo.append('ficha_medica', blob, 'ficha_medica.jpg');
        }

        if (documentos.partida_nacimiento) {
            const response = await fetch(documentos.partida_nacimiento);
            const blob = await response.blob();
            formDataLegajo.append('partida_nacimiento', blob, 'partida_nacimiento.jpg');
        }

        try {
            const response = await agregarAlumno(alumnoData);
            const responseLegajo = await agregarLegajo(formDataLegajo);
            mostrarMensaje('Exito', 'El alumno registrado correctamente')
            console.log('Alumno agregado:', response);

            limpiarInterfaz()
        } catch (error) {
            console.error('Error al agregar alumno:', error.message);
        }
    };

    const handleModificar = async () => {
      try {
        if (!formData.dni_alumno) {
          mostrarMensaje('Error', 'Por favor, consulta primero al alumno.');
          return;
        }
    
        // Validar fecha de nacimiento
        const fechaNacimiento = new Date(formData.fecha_nacimiento);
        if (!validarFechaNacimiento(fechaNacimiento)) {
          Alert.alert('Error', 'La fecha de nacimiento no es válida.');
          return;
        }
    
        formData.fecha_nacimiento = fechaNacimiento.toISOString().split('T')[0];
    
        // Preparar FormData para legajo
        const formDataLegajo = new FormData();
        formDataLegajo.append('dni_alumno', formData.dni_alumno);
        formDataLegajo.append('fecha_subida', new Date().toISOString());
    
        // Función para agregar archivos de manera genérica
        const agregarArchivo = async (campo, nombreArchivo) => {
          const archivo = documentos[campo];
          if (!archivo) return;
    
          // En web, ya es File
          if (archivo instanceof File) {
            formDataLegajo.append(campo, archivo);
            return;
          }
    
          // Si es URI de React Native (data: o local)
          if (typeof archivo === 'string' && (archivo.startsWith('data:') || archivo.startsWith('file:'))) {
            const response = await fetch(archivo);
            const blob = await response.blob();
            formDataLegajo.append(campo, blob, nombreArchivo);
          }
        };
    
        await agregarArchivo('dni_foto', 'dni.jpg');
        await agregarArchivo('ficha_medica', 'ficha_medica.pdf');
        await agregarArchivo('partida_nacimiento', 'partida_nacimiento.pdf');
    
        // Llamadas a backend
        const respuestaAlumno = await modificarAlumno(formData.dni_alumno, formData);
        const respuestaLegajo = await modificarLegajo(formData.dni_alumno, formDataLegajo);
    
        mostrarMensaje('Exito', 'Alumno modificado correctamente');
        limpiarInterfaz();
        console.log('Alumno modificado:', respuestaAlumno, respuestaLegajo);
    
      } catch (error) {
        console.log('Error al modificar un alumno:', error.message);
        Alert.alert('Error', error.message);
      }
    };

    const handleDeshabilitar = async () => {
        try {
            
            const dni_alumno = formData.dni_alumno; 
            console.log('DNI a deshabilitar:', dni_alumno); 
            
            if (!dni_alumno) {
                mostrarMensaje('Error', 'Por favor, consulta primero al alumno.');
                return;
            }
            
            const response = await deshabilitarAlumno(dni_alumno); 
            console.log('Alumno deshabilitado:', response);
            mostrarMensaje('Exito', 'Alumno deshabilitado correctamente')
            limpiarInterfaz()
        } catch (error) {
            console.log('Error al deshabilitar un alumno:', error.message);
            Alert.alert('Error', error.message);
        }
    }
    
    const limpiarInterfaz = async() => {
        // Limpiar URLs creadas para evitar memory leaks
        Object.values(documentos).forEach(url => {
            if (url && typeof url === 'string' && url.startsWith('blob:')) {
                URL.revokeObjectURL(url);
            }
        });
        
        setFormData({
            dni_alumno: '',
            nombre: '',
            apellido: '',
            domicilio: '',
            departamento: '',
            piso: '',
            id_sexo: '',
            cuil: '',
            fecha_nacimiento: '',
            id_localidad: '',
            id_estado_general: '',
            telefono_personal: '',
            telefono_madre: '',
            telefono_padre: '',
            email_personal: '',
            email_familiar: '',
            edificio: false,
            id_curso: '',
        });
        setDocumentos({
            dni_foto: null,
            ficha_medica: null,
            partida_nacimiento: null
        });
    }
    
    const calcularCuil = (dni, sexoId) => {
    let prefijo = sexoId === '1' || sexoId === 1 ? '20' : '27';
    let dniStr = dni.toString().padStart(8, '0');
    
    // Función auxiliar para calcular con un prefijo específico
    const calcularConPrefijo = (prefijoActual) => {
      let cuilBase = prefijoActual + dniStr;
      const multiplicadores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
      let suma = 0;

      for (let i = 0; i < multiplicadores.length; i++) {
        suma += parseInt(cuilBase[i]) * multiplicadores[i];
      }

      let resto = suma % 11;
      let digitoVerificador = 11 - resto;

      if (digitoVerificador === 11) {
        digitoVerificador = 0;
      } else if (digitoVerificador === 10) {
        // Cambiar prefijo y recalcular
        const nuevoPrefijo = prefijoActual === '20' ? '23' : '24';
        return calcularConPrefijo(nuevoPrefijo);
      }

      return `${prefijoActual}-${dniStr}-${digitoVerificador}`;
    };

    return calcularConPrefijo(prefijo);
  };

    const [documentos, setDocumentos] = useState({
        dni_foto: null,
        ficha_medica: null,
        partida_nacimiento: null,
    });
    const [formDataLegajo, setFormDataLegajo] = useState(new FormData());
    
    const seleccionarArchivo = async (tipoDocumento) => {
        try {
            const doc = await DocumentPicker.getDocumentAsync({
                type: 'image/*',
            });
    
            if (doc.assets && doc.assets[0].uri) {
                
                // Actualiza `documentos` con la URI seleccionada
                setDocumentos((prev) => ({
                    ...prev,
                    [tipoDocumento]: doc.assets[0].uri,
                }));
    
                // Convierte el archivo seleccionado en blob y actualiza `formDataLegajo`
                const response = await fetch(doc.assets[0].uri);
                const blob = await response.blob();
    
                // Crear un nuevo FormData y copiar los datos existentes
                const updatedFormData = new FormData();
                formDataLegajo.forEach((value, key) => {
                    updatedFormData.append(key, value);
                });
                // Agregar el nuevo archivo
                updatedFormData.append(tipoDocumento, blob, `${tipoDocumento}.jpg`);
    
                setFormDataLegajo(updatedFormData);
                console.log(`Archivo ${tipoDocumento} agregado exitosamente`);
            } else {
                console.log('No se seleccionó ningún archivo');
            }
        } catch (error) {
            console.error('Error al seleccionar archivo:', error);
            Alert.alert('Error', 'No se pudo seleccionar el archivo.');
        }
    };

    const abrirPDF = async (dni_alumno) => {
        try {
            let blob;
            // Si el argumento es un Blob directamente
            if (dni_alumno instanceof Blob) {
                
                blob = dni_alumno;
            } 
            // Si el argumento es una URI, se realiza un fetch para convertirlo en un Blob
            else if (typeof dni_alumno === 'string' && dni_alumno.length > 0) {
                const response = await fetch(dni_alumno);  
                blob = await response.blob();  // Convertir la URI en Blob
            } else {
                throw new Error('El archivo no es válido');
            }
    
            // Convertimos el Blob a una URL temporal
            const url = URL.createObjectURL(blob);
    
            // Abrimos el PDF en una nueva pestaña o vista
            Linking.openURL(url).catch((err) => {
                console.log('Error', 'No se pudo abrir el archivo: ' + err.message);
            });
    
            // Liberamos la URL temporal después de su uso
            URL.revokeObjectURL(url);
        } catch (error) {
            console.log('Error al abrir el PDF:', error);
        }
    };

    const validarFechaNacimiento = (fecha) => {
    const fechaIngresada = new Date(fecha);
    const fechaActual = new Date();

    if (isNaN(fechaIngresada.getTime())) {
        mostrarMensaje('Error', 'La fecha de nacimiento no es válida.');
        console.log('Fecha de nacimiento no válida:', fecha);
        return false;
    }

    if (fechaIngresada > fechaActual) {
        mostrarMensaje('Error', 'La fecha de nacimiento no puede ser mayor a la fecha actual.');
        console.log('Fecha futura:', fecha);
        return false;
    }

    // Calcular la edad
    const edad = fechaActual.getFullYear() - fechaIngresada.getFullYear();
    const mesActual = fechaActual.getMonth();
    const mesNacimiento = fechaIngresada.getMonth();

    // Si aún no cumplió años este año, restamos 1
    if (
        mesActual < mesNacimiento ||
        (mesActual === mesNacimiento && fechaActual.getDate() < fechaIngresada.getDate())
    ) {
        edad--;
    }

    if (edad <= 10) {
        mostrarMensaje('Error', 'El alumno debe tener más de 11 años.');
        console.log('Edad menor o igual a 11:', edad);
        return false;
    }

    return true;
};

  
    
    
    

    return (
  <View style={styles.padre}>
    <ScrollContainer />

    <ImageBackground source={bg} style={styles.bg}>
      <View style={styles.formulario}>

        {/* DNI */}
        <View style={styles.dniContainer}>
          <Text style={styles.label}>DNI:</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputDni}
              placeholder="Ingrese DNI (8 dígitos)"
              value={formData.dni_alumno}
              onChangeText={(value) => handleChange('dni_alumno', value)}
              maxLength={8}
              keyboardType="numeric"
            />
            {formData.dni_alumno && formData.dni_alumno.length < 8 && (
              <Text style={styles.errorText}>El DNI debe contener 8 números</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.consultarButton, !validarDni() && styles.botonDeshabilitado]}
            onPress={handleConsultar}
            disabled={!validarDni()}
          >
            <Text style={styles.consultarText}>Consultar</Text>
          </TouchableOpacity>
        </View>
        {/* Contenedor de columnas */}
        <View style={styles.fila}>

          {/* Columna 1 */}
          <View style={styles.columna}>
            <Text style={styles.label}>Nombre:</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={formData.nombre}
              onChangeText={(value) => handleChange('nombre', value)}
            />

            <Text style={styles.label}>Apellido:</Text>
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              value={formData.apellido}
              onChangeText={(value) => handleChange('apellido', value)}
            />

            <Text style={styles.label}>CUIL {cuilEditable ? '(editable)' : '(autogenerado - doble click para editar)'}:</Text>
            {cuilEditable ? (
              <TextInput 
                style={[styles.input]} 
                value={formData.cuil} 
                onChangeText={(v) => handleChange('cuil', v)}
                onBlur={() => setCuilEditable(false)}
                placeholder="XX-XXXXXXXX-X"
                autoFocus
              />
            ) : (
              <Pressable 
                onPress={({ nativeEvent }) => {
                  if (nativeEvent.detail === 2) { // Doble click
                    handleDobleClickCuil();
                  }
                }}
                style={[styles.input, styles.inputDisabled, styles.cuilPressable]}
              >
                <Text style={styles.cuilText}>{formData.cuil || 'XX-XXXXXXXX-X'}</Text>
              </Pressable>
            )}

            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              placeholder="Email Personal"
              value={formData.email_personal}
              onChangeText={(value) => handleChange('email_personal', value)}
            />

            <Text style={styles.label}>Email Familiar:</Text>
            <TextInput
              style={styles.input}
              placeholder="Email Familiar"
              value={formData.email_familiar}
              onChangeText={(value) => handleChange('email_familiar', value)}
            />

            <ListasDesplegables
              formData={formData}
              handleChange={handleChange}
              sexo={sexo}
              showLabel={true}
              curso_cantidad={curso_cantidad}
              styles={styles}
            />
          </View>

          {/* Columna 2 */}
          <View style={styles.columna}>
            <ListasDesplegables
              formData={formData}
              handleChange={handleChange}
              estado_general={estado_general}
              localidad={localidad}
              showLabel={true}
              styles={styles}
            />

            <Text style={styles.label}>Fecha de Nacimiento:</Text>
            <TextInput
              style={styles.input}
              placeholder="AAAA/MM/DD"
              value={formData.fecha_nacimiento}
              onChangeText={(value) => handleChange('fecha_nacimiento', value)}
            />

            <Text style={styles.label}>Teléfono Madre/Tutor:</Text>
            <TextInput
              style={styles.input}
              placeholder="Teléfono Madre/Tutor"
              value={formData.telefono_madre}
              onChangeText={(value) => handleChange('telefono_madre', value)}
            />

            <Text style={styles.label}>Teléfono Padre/Tutor:</Text>
            <TextInput
              style={styles.input}
              placeholder="Teléfono Padre/Tutor"
              value={formData.telefono_padre}
              onChangeText={(value) => handleChange('telefono_padre', value)}
            />

            <Text style={styles.label}>Teléfono Personal:</Text>
            <TextInput
              style={styles.input}
              placeholder="Teléfono Personal"
              value={formData.telefono_personal}
              onChangeText={(value) => handleChange('telefono_personal', value)}
            />
          </View>

          {/* Columna 3 */}
          <View style={styles.columna}>
            <Text style={styles.label}>Domicilio:</Text>
            <TextInput
              style={styles.input}
              placeholder="Domicilio"
              value={formData.domicilio}
              onChangeText={(value) => handleChange('domicilio', value)}
            />

            <View style={styles.checkboxContainer}>
              <Text style={styles.label}>¿Vives en un departamento?</Text>
              <CheckBox
                value={formData.edificio}
                onValueChange={() => handleChange('edificio', !formData.edificio)}
                style={styles.check}
              />
            </View>

            {formData.edificio && (
              <>
                <Text style={styles.label}>Piso:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Piso"
                  value={formData.piso}
                  onChangeText={(value) => handleChange('piso', value)}
                />

                <Text style={styles.label}>Departamento:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Departamento"
                  value={formData.departamento}
                  onChangeText={(value) => handleChange('departamento', value)}
                />
              </>
            )}

            <Text style={styles.label}>Legajo:</Text>

            {/* Botones de carga y ver documentos */}
            <View>
              {['dni_foto', 'ficha_medica', 'partida_nacimiento'].map((tipo) => (
                <View key={tipo}>
                  <TouchableOpacity style={styles.boton} onPress={() => seleccionarArchivo(tipo)}>
                    <Text style={styles.textoBoton}>Ingrese {tipo.replace('_', ' ').toUpperCase()}</Text>
                  </TouchableOpacity>

                  {documentos[tipo] &&
                    ((documentos[tipo] instanceof Blob && documentos[tipo].size > 0) ||
                      (typeof documentos[tipo] === 'string' && documentos[tipo].length > 0)) && (
                      <TouchableOpacity
                        style={styles.botonVer}
                        onPress={() => abrirPDF(documentos[tipo])}
                      >
                        <Text style={styles.textoBoton}>Ver {tipo.replace('_', ' ').toUpperCase()}</Text>
                      </TouchableOpacity>
                    )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Botones inferiores */}
      <View style={styles.contenidoBotones}>
        <TouchableOpacity style={[styles.botonAlta, !validarCampos() && styles.botonDeshabilitado]} onPress={handleAgregar} disabled={!validarCampos()}>
          <Text style={styles.textoBoton}>Alta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.botonBaja, !validarCampos() && styles.botonDeshabilitado]} onPress={handleDeshabilitar} disabled={!validarCampos()}>
          <Text style={styles.textoBoton}>Baja</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.botonModificar, !validarCampos() && styles.botonDeshabilitado]} onPress={handleModificar} disabled={!validarCampos()}>
          <Text style={styles.textoBoton}>Modificar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonLimpiar} onPress={limpiarInterfaz}>
          <Text style={styles.textoBoton}>Limpiar</Text>
        </TouchableOpacity>
      </View>

      <CustomAlert
        isVisible={alertVisible}
        onClose={() => setAlertVisible(false)}
        title={alertTitle}
        message={alertMessage}
      />
    </ImageBackground>
  </View>
);

}

const styles = StyleSheet.create({

  // Contenedores principales
  padre: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  bg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  botonDeshabilitado: {
        opacity: 0.5,
        backgroundColor: '#cccccc',
        borderColor: '#999999',
    },
  formulario: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 10,
    maxWidth: 1200,
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, // Changed from 2 to 1
    shadowOpacity: 0.05, // Changed from 0.1 to 0.05
    shadowRadius: 3, // Changed from 5 to 3
    marginBottom: 15, // Changed from 20 to 15
  },
  errorText: { color: 'red', marginTop: 4, fontSize: 12 },
  // Sección DNI - Ajustada según la imagen
  dniContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    width: '100%',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
    color: '#2c3e50',
  },
  inputDni: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginLeft: 10,
    marginRight: 10,
  },
  consultarButton: {
   backgroundColor: '#f0f7ff',
        borderColor: '#746BC8',
        borderWidth: 1,
        paddingVertical: 0,
        paddingHorizontal: 14,
        borderRadius: 5,
        height: 38,
        justifyContent: 'center',
        marginLeft: 10,
  },
  consultarText: {
    color: '#746BC8',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
  },
  // Layout de columnas - Ajustado a 3 columnas iguales
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  columna: {
    width: '32%', // Ligeramente menos que 33.33% para dejar espacio entre columnas
  },

  // Estilos de campos
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
    height: 40,
  },
  inputDisabled: { backgroundColor: '#e0e0e0' },
  
  // CUIL editable
  cuilPressable: { 
    justifyContent: 'center', 
    marginBottom: 15,
    cursor: 'pointer'
  },
  cuilText: { 
    fontSize: 15, 
    color: '#2c3e50',
    userSelect: 'none'
  },
  
  // Checkbox
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  check: {
    marginLeft: 10,
  },

  // Botones de legajo - Colores ajustados a la imagen
  boton: {
    backgroundColor: '#ffebee',
    borderColor: '#a72828ff',
    borderWidth: 2,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 8,
    height: 45,
  },
  botonVer: {
    backgroundColor: '#e8f5e9',
    borderColor: '#28a745',
    borderWidth: 2,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 5,
    height: 45,
  },
  
  // Botones inferiores - Ajustados al tamaño de la imagen
  contenidoBotones: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 800,
    gap: 10,
    alignSelf: 'center',
  },
  botonAlta: {
        backgroundColor: '#e8f5e9',
        borderColor: '#4caf50',
        borderWidth: 1,
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 5,
        flex: 1,
        maxWidth: 200,
        height: 40,
        justifyContent: 'center',
        marginRight: 6,
  },
  botonBaja: {
    backgroundColor: '#ffebee',
        borderColor: '#f44336',
        borderWidth: 1,
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 5,
        flex: 1,
        maxWidth: 200,
        height: 40,
        justifyContent: 'center',
        marginLeft: 6,
        marginRight: 6,
  },
  botonModificar: {
     backgroundColor: '#e3f2fd',
        borderColor: '#746BC8',
        borderWidth: 1,
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 5,
        flex: 1,
        maxWidth: 200,
        height: 40,
        justifyContent: 'center',
        marginRight: 6,
  },
  botonLimpiar: {
    backgroundColor: '#f5f5f5',
        borderColor: '#9e9e9e',
        borderWidth: 1,
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 5,
        flex: 1,
        maxWidth: 200,
        height: 40,
        justifyContent: 'center',
  },
  
  // Textos
  textoBoton: {
    color: '#2c3e50',
    fontSize: 14, // Texto más pequeño
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Responsive
  '@media (max-width: 768)': {
    fila: {
      flexDirection: 'column',
    },
    columna: {
      maxWidth: '100%',
      marginBottom: 15,
    },
    contenidoBotones: {
      width: '100%',
      flexWrap: 'wrap',
    },
  },
});

// Constantes de colores
export const COLORS = {
  primary: '#3f51b5',
  secondary: '#2196f3',
  success: '#4caf50',
  error: '#f44336',
  warning: '#ff9800',
  light: '#f5f5f5',
  dark: '#2c3e50',
};



export const SPACING = {
  xs: 4,
  sm: 8,
  md: 15,
  lg: 20,
  xl: 30,
};