import React, { useState,useEffect } from 'react';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Picker, CheckBox,Alert,Linking, } from 'react-native';
import bg from '../../assets/bg1.jpg';
import { agregarAlumno, obtenerLocalidad,obtenerCurso,obtenerSexo,obtenerEstadoAlumno,obtenerAlumnoFiltrado,deshabilitarAlumno,modificarAlumno,agregarLegajo, modificarLegajo, obtenerDniPdf, obtenerFichaMedicaPdf, obtenerPartidaNacimientoPdf } from '../../scripts/secretaria/scriptGestionAlumno';
import { mostrarMensaje } from '../../scripts/preceptor/scriptGestionarObservacion';
import * as DocumentPicker from 'expo-document-picker';


export default function GestionarAlumno() {
    const [formData, setFormData] = useState({
        dnialumno: '',
        nombre: '',
        apellido: '',
        cuil: '',
        idsexo: '',
        emailpersonal: '',
        emailfamiliar: '',
        idcurso: '',
        fechaNacimiento: '',
        telefonomadre: '',
        telefonopadre: '',
        telefonopersonal:'',
        idestadoalumno: '',
        idlocalidad: '',
        domicilio: '',
        edificio: false,
        piso: '',
        departamento: ''
    });

    //Listas desplegables
    const[cursos,setCursos] = useState([])
    const[localidad,setLocalidad] = useState([])
    const[sexo,setSexos] = useState([])
    const[estadoalumno,setEstadoAlumno] = useState([])

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const cursosData = await obtenerCurso();
                const localidadData = await obtenerLocalidad();
                const sexosData = await obtenerSexo();
                const estadoData = await obtenerEstadoAlumno();

                setSexos(sexosData);
                setCursos(cursosData); 
                setLocalidad(localidadData);
                setEstadoAlumno(estadoData);
            } catch (error) {
                Alert.alert('Error', error.message);
            }
        };

    cargarDatos();
    }, []);
    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleConsultar = async () => {
        try {
            const alumno = await obtenerAlumnoFiltrado(formData.dnialumno); 
            const legajoDNI = await obtenerDniPdf(formData.dnialumno) || null
            const legajoFichaMedica = await obtenerFichaMedicaPdf(formData.dnialumno) || null
            const legajoPartidaNacimiento = await obtenerPartidaNacimientoPdf(formData.dnialumno) || null
            console.log('Alumno consultado:', alumno);
            
            if (alumno) {
                setFormData({
                    ...formData,
                    nombre: alumno.nombre,
                    apellido: alumno.apellido,
                    domicilio: alumno.domicilio,
                    idsexo: alumno.idsexo,
                    cuil: alumno.cuil,
                    fechaNacimiento: new Date(alumno.fechanacimiento).toISOString().split('T')[0].replace(/-/g, '/'),
                    idlocalidad: alumno.idlocalidad,
                    idestadoalumno: alumno.idestadoalumno,
                    telefonopersonal: alumno.telefonopersonal,
                    telefonomadre: alumno.telefonomadre,
                    telefonopadre: alumno.telefonopadre,
                    emailpersonal: alumno.emailpersonal,
                    emailfamiliar: alumno.emailfamiliar,
                    idcurso: alumno.idcurso,
                    departamento: alumno.departamento,
                    piso: alumno.piso,
                    edificio: alumno.edificio,
                });
                setDocumentos({
                    dni: legajoDNI,
                    fichaMedica: legajoFichaMedica,
                    partidaNacimiento: legajoPartidaNacimiento,
                  });
            } else {
                Alert.alert('Error', 'Alumno no encontrado');
            }
        } catch (error) {
            console.error('Error al consultar alumno:', error.message);
            Alert.alert('Error', error.message);
        }
    }

    //Modificar
    const handleAgregar = async () => {

        const dni = parseInt(formData.dnialumno, 10);
        if (isNaN(dni)) {
            Alert.alert('Error', 'El DNI debe ser un número válido.');
            console.log('DNI no válido:', formData.dnialumno);
            return;
        }

        const cuil = formData.cuil;  // CUIL ingresado por el usuario como string
        if (validarCUIL(cuil, dni)) {
            console.log('CUIL y DNI válidos');
            formData.cuil = cuil; 
        } else {
            Alert.alert('Error', 'CUIL NO VALIDO.');
            console.log('El CUIL o DNI no es válido.');
            return;
        }


        const telefonoPadre = parseInt(formData.telefonopadre, 10);
        const telefonoMadre = parseInt(formData.telefonomadre, 10);
        // Validar los teléfonos
        if (isNaN(telefonoMadre)) {
            Alert.alert('Error', 'El teléfono de la madre debe ser un número válido.');
            console.log('Teléfono madre no válido:', formData.telefonomadre);
            return;
        }

        if (isNaN(telefonoPadre)) {
            Alert.alert('Error', 'El teléfono del padre debe ser un número válido.');
            console.log('Teléfono padre no válido:', formData.telefonopadre);
            return;
        }

        const telefonoPersonal = parseInt(formData.telefonopersonal, 10);
        if (isNaN(telefonoPersonal)) {
            Alert.alert('Error', 'El teléfono personal debe ser un número válido.');
            console.log('Teléfono personal no válido:', formData.telefonopersonal);
            return;
        }

        const idsexo = parseInt(formData.idsexo, 10);
        const idlocalidad = parseInt(formData.idlocalidad, 10);
        const idestadoalumno = parseInt(formData.idestadoalumno, 10);
        const idcurso = parseInt(formData.idcurso, 10);

        if (isNaN(idsexo) || isNaN(idlocalidad) || isNaN(idestadoalumno) || isNaN(idcurso)) {
            Alert.alert('Error', 'Los IDs deben ser números válidos.');
            console.log('IDs no válidos:', { idsexo, idlocalidad, idestadoalumno, idcurso });
            return;
        }

        const fechanacimiento = new Date(formData.fechaNacimiento);
        if (!validarFechaNacimiento(fechanacimiento)) {
            return; // Detener el flujo si la fecha no es válida
        }
        
        
        // Crear el objeto alumnoData, omitiendo campos no obligatorios
        const alumnoData = {
            dnialumno: dni, 
            nombre: formData.nombre,
            apellido: formData.apellido,
            domicilio: formData.domicilio,
            idsexo: idsexo, 
            cuil: formData.cuil,
            fechanacimiento: fechanacimiento.toISOString().split('T')[0], 
            idlocalidad: idlocalidad, 
            idestadoalumno: idestadoalumno,
            telefonopersonal: telefonoPersonal,
            telefonomadre: telefonoMadre,
            telefonopadre: telefonoPadre,
            emailpersonal: formData.emailpersonal,
            emailfamiliar: formData.emailfamiliar,
            idcurso: idcurso, // Usar el ID de curso validado
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
        formDataLegajo.append('dnialumno', dni);
        formDataLegajo.append('fecha_subida', new Date().toISOString());

        if (documentos.dni) {
            const response = await fetch(documentos.dni);
            const blob = await response.blob();
            formDataLegajo.append('dnifoto', blob, 'dni.jpg');
        }

        if (documentos.fichaMedica) {
            const response = await fetch(documentos.fichaMedica);
            const blob = await response.blob();
            formDataLegajo.append('fichamedica', blob, 'ficha_medica.jpg');
        }

        if (documentos.partidaNacimiento) {
            const response = await fetch(documentos.partidaNacimiento);
            const blob = await response.blob();
            formDataLegajo.append('partidanacimiento', blob, 'partida_nacimiento.jpg');
        }

        try {
            const response = await agregarAlumno(alumnoData);
            const responseLegajo = await agregarLegajo(formDataLegajo);
            await mostrarMensaje('El alumno se registro correctamente')
            console.log('Alumno agregado:', response);

            setFormData({
                dnialumno: '',
                nombre: '',
                apellido: '',
                cuil: '',
                idsexo: '',
                emailpersonal: '',
                emailfamiliar: '',
                idcurso: '',
                fechaNacimiento: '',
                telefonomadre: '',
                telefonopadre: '',
                telefonopersonal:'',
                idestadoalumno: '',
                idlocalidad: '',
                domicilio: '',
                edificio: false,
                piso: '',
                departamento: ''
            });
        } catch (error) {
            console.error('Error al agregar alumno:', error.message);
        }
    };

    const handleModificar = async () => {
        try {
            const dni = formData.dnialumno; 
            console.log('DNI a modificar:', dni); 
    
            if (!dni) {
                Alert.alert('Error', 'Por favor, consulta primero al alumno.');
                return;
            }
            
            const cuil = formData.cuil;  // CUIL ingresado por el usuario como string
            if (validarCUIL(cuil, dni)) {
                console.log('CUIL y DNI válidos');
                formData.cuil = cuil;  // Asigna el CUIL al formData
            } else {
                Alert.alert('Error', 'CUIL NO VALIDO.');
                console.log('El CUIL o DNI no es válido.');
                return;
            }
            
            // Validar la fecha de nacimiento directamente desde formData
            const fechaNacimiento = formData.fechaNacimiento;
            if (!validarFechaNacimiento(new Date(fechaNacimiento))) {
                // Si la fecha no es válida, detener el flujo y mostrar un mensaje de error
                Alert.alert('Error', 'La fecha de nacimiento no es válida.');
                return;
            }

            // Formatear la fecha de nacimiento correctamente (YYYY-MM-DD)
            const fechaNacimientoFormateada = new Date(fechaNacimiento).toISOString().split('T')[0];
            console.log('Fecha de Nacimiento a modificar:', fechaNacimientoFormateada);

            // Asignar la fecha formateada directamente a formData
            formData.fechanacimiento = fechaNacimientoFormateada;

            //agrego roma
            const formDataLegajo = new FormData();
            formDataLegajo.append('dnialumno', dni);
            formDataLegajo.append('fecha_subida', new Date().toISOString());



                // Verificar si el DNI es nuevo o tiene un valor tipo "data:"
                if (documentos.dni && typeof documentos.dni === 'string' && documentos.dni.startsWith("data:")) {
                    const response = await fetch(documentos.dni);
                    const blob = await response.blob();
                    formDataLegajo.append('dnifoto', blob, 'dni.jpg');
                    console.log('Nuevo DNI cargado:', documentos.dni);
                }
                else {
                    formDataLegajo.append('dnifoto', documentos.dni, 'dni.jpg')
                }
    
                // Verificar si la Ficha Médica es nueva o tiene un valor tipo "data:"
                if (documentos.fichaMedica && typeof documentos.fichaMedica === 'string' && documentos.fichaMedica.startsWith("data:")) {
                    const response = await fetch(documentos.fichaMedica);
                    const blob = await response.blob();
                    formDataLegajo.append('fichamedica', blob, 'ficha_medica.jpg');
                    console.log('Nueva Ficha Médica cargada:', documentos.fichaMedica);
                }
                else {
                    formDataLegajo.append('fichamedica', documentos.fichaMedica, 'ficha_medica.jpg')
                }
    
                // Verificar si la Partida de Nacimiento es nueva o tiene un valor tipo "data:"
                if (documentos.partidaNacimiento && typeof documentos.partidaNacimiento === 'string' && documentos.partidaNacimiento.startsWith("data:")) {
                    const response = await fetch(documentos.partidaNacimiento);
                    const blob = await response.blob();
                    formDataLegajo.append('partidanacimiento', blob, 'partida_nacimiento.jpg');
                }
                else {
                    formDataLegajo.append('partidanacimiento', documentos.partidaNacimiento, 'partidanacimiento.jpg')
                }
                
            const respuesta = await modificarAlumno(dni, formData);
            const respuesta2 = await modificarLegajo(dni, formDataLegajo);
            console.log('Alumno modificado:', respuesta);
            await mostrarMensaje('El alumno modificado correctamente')
            setFormData({
                dnialumno: '',
                nombre: '',
                apellido: '',
                cuil: '',
                idsexo: '',
                emailpersonal: '',
                emailfamiliar: '',
                idcurso: '',
                fechanacimiento: '',
                fechaNacimiento: '',
                telefonomadre: '',
                telefonopadre: '',
                telefonopersonal:'',
                idestadoalumno: '',
                idlocalidad: '',
                domicilio: '',
                edificio: false,
                piso: '',
                departamento: ''
            });
            console.log(formData)
        } catch (error) {
            console.log('Error al modificar un alumno:', error.message);
            Alert.alert('Error', error.message);
        }
    }

    const handleDeshabilitar = async () => {
        try {
            
            const dni = formData.dnialumno; 
            console.log('DNI a deshabilitar:', dni); 
            
            if (!dni) {
                Alert.alert('Error', 'Por favor, consulta primero al alumno.');
                return;
            }
    
            const response = await deshabilitarAlumno(dni); 
            console.log('Alumno deshabilitado:', response);
            await mostrarMensaje('El alumno se deshabilito correctamente')
            setFormData({
                dnialumno: '',
                nombre: '',
                apellido: '',
                cuil: '',
                idsexo: '',
                emailpersonal: '',
                emailfamiliar: '',
                idcurso: '',
                fechaNacimiento: '',
                telefonomadre: '',
                telefonopadre: '',
                telefonopersonal:'',
                idestadoalumno: '',
                idlocalidad: '',
                domicilio: '',
                edificio: false,
                piso: '',
                departamento: ''
            });
        } catch (error) {
            console.log('Error al deshabilitar un alumno:', error.message);
            Alert.alert('Error', error.message);
        }
    }
    
    const handleLimpiar = async() => {
        
        setFormData({
            dnialumno: '',
            nombre: '',
            apellido: '',
            domicilio: '',
            departamento: '',
            piso: '',
            idsexo: '',
            cuil: '',
            fechaNacimiento: '',
            idlocalidad: '',
            idestadoalumno: '',
            telefonopersonal: '',
            telefonomadre: '',
            telefonopadre: '',
            emailpersonal: '',
            emailfamiliar: '',
            edificio: false,
            idcurso: '',
        });
        setDocumentos({
            dni: null,
            fichaMedica: null,
            partidaNacimiento: null
        });
    }
    
    const PickerField = React.memo(({ label, selectedValue, onValueChange, items }) => {
        useEffect(() => {
            console.log("Items en PickerField: ", items);
        }, [items]);

        return (
            <>
                <Text style={styles.label}>{label}</Text>
                <Picker
                    style={styles.input}
                    selectedValue={selectedValue}
                    onValueChange={onValueChange}
                >
                    {items.length > 0 ? (
                        items.map((item) => (
                            <Picker.Item key={item.key || item.value} label={item.label} value={item.value} />
                        ))
                    ) : (
                        <Picker.Item label="Cargando..." value="" />
                    )}
                </Picker>
            </>
        );
    });

    const [documentos, setDocumentos] = useState({
        dni: null,
        fichaMedica: null,
        partidaNacimiento: null,
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

    const abrirPDF = async (dni) => {
        try {
            let blob;
            // Si el argumento es un Blob directamente
            if (dni instanceof Blob) {
                console.log("hola dni instanceof blob")
                blob = dni;
            } 
            // Si el argumento es una URI, se realiza un fetch para convertirlo en un Blob
            else if (typeof dni === 'string' && dni.length > 0) {
                const response = await fetch(dni);  
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

    const validarFechaNacimiento = (fecha) =>{
        const fechaIngresada = new Date(fecha);
        const fechaActual = new Date(); // Obtiene la fecha actual

        if (isNaN(fechaIngresada.getTime())) {
            Alert.alert('Error', 'La fecha de nacimiento no es válida.');
            console.log('Fecha de nacimiento no válida:', fecha);
            return false;
        }

        if (fechaIngresada > fechaActual) {
            Alert.alert('Error', 'La fecha de nacimiento no puede ser mayor a la fecha actual.');
            console.log('Fecha de nacimiento no válida, es mayor que la fecha actual:', fecha);
            return false;
        }

        // La fecha es válida
        return true;
    }

    function validarCUIL(cuil, dni) {
        // Asegurarse de que dni es una cadena
        const dniFormateado = String(dni).trim(); // Convertir el DNI a cadena y eliminar espacios extra
    
        // Expresión regular para verificar el formato del CUIL: XX-XXXXXXXX-X
        const regex = /^(\d{2})-(\d{8})-(\d{1})$/;
    
        if (regex.test(cuil)) {
            // Extraer el bloque del medio (DNI) del CUIL
            const dniDelCuil = cuil.split('-')[1].trim(); // Remover posibles espacios extra
            
            // Asegurarse de que el DNI tenga exactamente 8 dígitos
            if (dniFormateado.length !== 8 || isNaN(dniFormateado)) {
                Alert.alert('Error', 'El DNI debe tener 8 dígitos válidos.');
                console.log('El DNI ingresado no tiene el formato correcto.');
                return false;
            }
    
            // Verificar que el DNI del CUIL coincida con el DNI ingresado
            if (dniFormateado === dniDelCuil) {
                // Si coincide, devolver true
                console.log('CUIL válido y DNI coincidente.');
                return true;
            } else {
                // Si no coincide, mostrar mensaje de error
                Alert.alert('Error', 'El número del CUIL debe coincidir con el DNI.');
                console.log('El DNI del CUIL no coincide con el DNI ingresado.');
                return false;
            }
        } else {
            // Si el CUIL no tiene el formato correcto
            Alert.alert('Error', 'El CUIL no tiene el formato correcto. Debe ser XX-XXXXXXXX-X.');
            console.log('El CUIL no tiene el formato correcto.');
            return false;
        }
    }
    
    
    
    

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg}></Image>
            <View style={styles.formulario}>
                <View style={styles.dniContainer}>
                    <Text style={styles.label}>DNI:</Text>
                    <TextInput style={styles.inputDni} placeholder='DNI' onChangeText={(value) => handleChange('dnialumno', value)}/>
                    <TouchableOpacity style={styles.consultarButton} onPress={handleConsultar}>
                        <Text style={styles.consultarText}>Consultar</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.fila}>
                    {/* Primera columna */}
                    <View style={styles.columna}>
                        <Text style={styles.label}>Nombre:</Text>
                        <TextInput style={styles.input} placeholder='Nombre' value={formData.nombre} onChangeText={(value) => handleChange('nombre', value)} />
                        
                        <Text style={styles.label}>Apellido:</Text>
                        <TextInput style={styles.input} placeholder='Apellido' value={formData.apellido} onChangeText={(value) => handleChange('apellido', value)} />
                        
                        <Text style={styles.label}>CUIL:</Text>
                        <TextInput style={styles.input} placeholder='CUIL' value={formData.cuil} onChangeText={(value) => handleChange('cuil', value)} />
                        
                        <PickerField 
                            label="Sexo" 
                            selectedValue={formData.idsexo} 
                            onValueChange={(value) => handleChange('idsexo', value)} 
                            items={[
                                { label: 'Seleccione el sexo', value: '' },
                                ...sexo.map(sexo => ({ label: sexo.detalle, value: sexo.idsexo, key: sexo.idsexo })) 
                            ]} 
                        />
                        
                        <Text style={styles.label}>Email:</Text>
                        <TextInput style={styles.input} placeholder='Email Personal' value={formData.emailpersonal} onChangeText={(value) => handleChange('emailpersonal', value)} />
                        
                        <Text style={styles.label}>Email Familiar:</Text>
                        <TextInput style={styles.input} placeholder='Email Familiar' value={formData.emailfamiliar} onChangeText={(value) => handleChange('emailfamiliar', value)} />
                        
                        
                        
                        <PickerField  
                            label="Curso" 
                            selectedValue={formData.idcurso} 
                            onValueChange={(value) => handleChange('idcurso', value)} 
                            items={[
                                { label: 'Seleccione el curso', value: '' },
                                ...cursos.map(curso => ({ label: curso.detalle, value: curso.idcurso, key: curso.idcurso })) 
                            ]} 
                        />
                    </View>

                    {/* Segunda columna */}
                    <View style={styles.columna}>
                        
                        <Text style={styles.label}>Fecha de Nacimiento:</Text>
                        <TextInput style={styles.input} placeholder='AAAA/MM/DD' value={formData.fechaNacimiento} onChangeText={(value) => handleChange('fechaNacimiento', value)} />
                        
                        <Text style={styles.label}>Teléfono Madre/Tutor:</Text>
                        <TextInput style={styles.input} placeholder='Teléfono Madre/Tutor' value={formData.telefonomadre} onChangeText={(value) => handleChange('telefonomadre', value)} />

                        <Text style={styles.label}>Teléfono Padre/Tutor:</Text>
                        <TextInput style={styles.input} placeholder='Teléfono Padre/Tutor' value={formData.telefonopadre} onChangeText={(value) => handleChange('telefonopadre', value)} />
                        
                        <Text style={styles.label}>Teléfono Personal:</Text>
                        <TextInput style={styles.input} placeholder='Teléfono Personal' value={formData.telefonopersonal} onChangeText={(value) => handleChange('telefonopersonal', value)} />

                        <PickerField 
                            label="Estado Alumno" 
                            selectedValue={formData.idestadoalumno} 
                            onValueChange={(value) => handleChange('idestadoalumno', value)} 
                            items={[
                                { label: 'Selecciona el estado', value: '' },
                                ...estadoalumno.map(estado => ({ label: estado.detalle, value: estado.idestadoalumno, key: estado.idestadoalumno })) 
                            ]} 
                        />
                        
                        
                        
                        
                    </View>

                    
                    {/* Tercera columna */}
                    <View style={styles.columna}>
                        <PickerField 
                            label="Localidad" 
                            selectedValue={formData.idlocalidad} 
                            onValueChange={(value) => handleChange('idlocalidad', value)} 
                            items={[
                                { label: 'Seleccione la localidad', value: '' },
                                ...localidad.map(localidad => ({ label: localidad.detalle, value: localidad.idlocalidad, key: localidad.idlocalidad })) 
                            ]} 
                        />     
                        <Text style={styles.label}>Domicilio:</Text>
                        <TextInput style={styles.input} placeholder='Domicilio' value={formData.domicilio} onChangeText={(value) => handleChange('domicilio', value)} />
                        
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
                                    placeholder='Piso'
                                    value={formData.piso}
                                    onChangeText={(value) => handleChange('piso', value)}
                                />
                                <Text style={styles.label}>Departamento:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder='Departamento'
                                    value={formData.departamento}
                                    onChangeText={(value) => handleChange('departamento', value)}
                                />
                            </>
                            
                        )}
                        <Text style={styles.label}>Legajo:</Text>
                            <View>
                                    <TouchableOpacity style={styles.boton} onPress={() => seleccionarArchivo('dni')}>
                                        <Text style={styles.textoBoton}>Ingrese Foto DNI</Text>
                                    </TouchableOpacity>
                                    {/* Verifica si documentos.dni está presente y tiene un Blob con tamaño mayor a 0 */}
                                    {documentos.dni && 
                                        (documentos.dni instanceof Blob && documentos.dni.size > 0 || 
                                        (typeof documentos.dni === 'string' && documentos.dni.length > 0)) && (
                                            <TouchableOpacity
                                                style={styles.botonVer}
                                                onPress={async () => {
                                                    try {
                                                        console.log('documentos.dni:', documentos.dni);  // Verifica lo que contiene documentos.dni
                                                        
                                                        if (documentos.dni instanceof Blob && documentos.dni.size > 0) {
                                                            abrirPDF(documentos.dni);  // Si es un Blob válido con contenido
                                                        } else if (typeof documentos.dni === 'string' && documentos.dni.length > 0) {
                                                            abrirPDF(documentos.dni);  // Si es una URI válida, la pasamos a abrirPDF
                                                        } else {
                                                            console.log('El archivo no tiene un formato válido');
                                                        }
                                                    } catch (error) {
                                                        console.log('Error al abrir el PDF:', error);
                                                    }
                                                }}
                                            >
                                                <Text style={styles.textoBoton}>Ver DNI</Text>
                                            </TouchableOpacity>
                                    )}
                            </View>
                                <View>
                                    <TouchableOpacity style={styles.boton} onPress={() => seleccionarArchivo('fichaMedica')}>
                                        <Text style={styles.textoBoton}>Ingrese Ficha Medica</Text>
                                    </TouchableOpacity>
                                    {documentos.fichaMedica && 
                                        ((documentos.fichaMedica instanceof Blob && documentos.fichaMedica.size > 0) || 
                                        (typeof documentos.fichaMedica === 'string' && documentos.fichaMedica.length > 0)) && (
                                            <TouchableOpacity
                                                style={styles.botonVer}
                                                onPress={async () => {
                                                    try {
                                                        console.log('documentos.fichaMedica:', documentos.fichaMedica);  // Verifica lo que contiene documentos.fichaMedica
                                                        
                                                        if (documentos.fichaMedica instanceof Blob && documentos.fichaMedica.size > 0) {
                                                            abrirPDF(documentos.fichaMedica);  // Si es un Blob válido con contenido
                                                        } else if (typeof documentos.fichaMedica === 'string' && documentos.fichaMedica.length > 0) {
                                                            abrirPDF(documentos.fichaMedica);  // Si es una URI válida, la pasamos a abrirPDF
                                                        } else {
                                                            console.log('El archivo no tiene un formato válido');
                                                        }
                                                    } catch (error) {
                                                        console.log('Error al abrir el PDF:', error);
                                                    }
                                                }}
                                            >
                                                <Text style={styles.textoBoton}>Ver Ficha Medica</Text>
                                            </TouchableOpacity>
                                    )}
                                </View>
                                <View>
                                    <TouchableOpacity style={styles.boton} onPress={() => seleccionarArchivo('partidaNacimiento')}>
                                        <Text style={styles.textoBoton}>Ingrese Partida de Nacimiento</Text>
                                    </TouchableOpacity>
                                    {documentos.partidaNacimiento && 
                                        ((documentos.partidaNacimiento instanceof Blob && documentos.partidaNacimiento.size > 0) || 
                                        (typeof documentos.partidaNacimiento === 'string' && documentos.partidaNacimiento.length > 0)) && (
                                            <TouchableOpacity
                                                style={styles.botonVer}
                                                onPress={async () => {
                                                    try {
                                                        console.log('documentos.partidaNacimiento:', documentos.partidaNacimiento);  // Verifica lo que contiene documentos.fichaMedica
                                                        
                                                        if (documentos.partidaNacimiento instanceof Blob && documentos.partidaNacimiento.size > 0) {
                                                            abrirPDF(documentos.partidaNacimiento);  // Si es un Blob válido con contenido
                                                        } else if (typeof documentos.partidaNacimiento === 'string' && documentos.partidaNacimiento.length > 0) {
                                                            abrirPDF(documentos.partidaNacimiento);  // Si es una URI válida, la pasamos a abrirPDF
                                                        } else {
                                                            console.log('El archivo no tiene un formato válido');
                                                        }
                                                    } catch (error) {
                                                        console.log('Error al abrir el PDF:', error);
                                                    }
                                                }}
                                            >
                                                <Text style={styles.textoBoton}>Ver Partida Nacimiento</Text>
                                            </TouchableOpacity>
                                    )}
                            </View>
                        
                    </View>
                    
                    
                </View>
            </View>

            <View style={styles.contenidoBotones}>
                <TouchableOpacity style={styles.botonAlta} onPress={handleAgregar}><Text style={styles.textoBoton}>Alta</Text></TouchableOpacity>
                <TouchableOpacity style={styles.botonBaja} onPress={handleDeshabilitar}><Text style={styles.textoBoton}>Baja</Text></TouchableOpacity>
                <TouchableOpacity style={styles.botonModificar} onPress={handleModificar}><Text style={styles.textoBoton}>Modificar</Text></TouchableOpacity>
                <TouchableOpacity style={styles.botonLimpiar} onPress={handleLimpiar}><Text style={styles.textoBoton}>Limpiar</Text></TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
    },
    formulario: {
        width: '90%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    dniContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10, 
    },
    consultarButton: {
        backgroundColor: '#CED9EF',
        borderColor: '#746BC8',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginLeft:10
    },
    consultarText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
    fila: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    columna: {
        flex: 1,
        marginRight: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    inputLegajo:{
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
        borderColor:'#FF0000',
        borderWidth:1,
    },
    inputDni: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
        width: 200,
        marginLeft:10
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    check:{
        marginLeft:10
    },
    contenidoBotones: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '50%',
    },
    botonAlta:{
        backgroundColor: '#CFEFCE',
        borderColor: '#33FF00',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
    },
    botonBaja:{
        backgroundColor: '#F3B9B9',
        borderColor: '#FF0000',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        flex: 1,
        marginLeft: 10,
        marginRight:10
    },
    botonModificar:{
        backgroundColor: '#CED9EF',
        borderColor: '#746BC8',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
    },
    botonLimpiar:{
        backgroundColor: '#DADADA',
        borderColor: '#000000',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        flex: 1,
    },
    textoBoton:{
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    boton: {
        backgroundColor: '#788CC8', // Color azul
        padding: 15, // Espaciado interno
        borderRadius: 8, // Bordes redondeados
        alignItems: 'center', // Centrar el texto
        marginVertical: 10, // Separación entre botones
    },
    webview: {
        height: 300, // Altura del visor
        marginVertical: 10,
    },
    botonVer: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#28a745', // Color de fondo para el botón "Ver"
        borderRadius: 5,
    },
    row: {
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 10, 
    },
    
});

