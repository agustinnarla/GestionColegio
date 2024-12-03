import React, { useState,useEffect } from 'react';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Picker, CheckBox,Alert } from 'react-native';
import bg from '../../assets/bg1.jpg';
import { agregarAlumno, obtenerLocalidad,obtenerCurso,obtenerSexo,obtenerEstadoAlumno,obtenerAlumnoFiltrado,deshabilitarAlumno,modificarAlumno } from '../../scripts/secretaria/scriptGestionAlumno';
import { mostrarMensaje } from '../../scripts/preceptor/scriptGestionarObservacion';



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
            console.log('Alumno consultado:', alumno);
            
            if (alumno) {
                setFormData({
                    ...formData,
                    nombre: alumno.nombre,
                    apellido: alumno.apellido,
                    domicilio: alumno.domicilio,
                    idsexo: alumno.idsexo,
                    cuil: alumno.cuil,
                    fechaNacimiento: alumno.fechanacimiento,
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
            } else {
                Alert.alert('Error', 'Alumno no encontrado');
            }
        } catch (error) {
            console.error('Error al consultar alumno:', error.message);
            Alert.alert('Error', error.message);
        }
    }
    const handleAgregar = async () => {

        const dni = parseInt(formData.dnialumno, 10);
        if (isNaN(dni)) {
            Alert.alert('Error', 'El DNI debe ser un número válido.');
            console.log('DNI no válido:', formData.dnialumno);
            return;
        }

        const cuil = parseInt(formData.cuil, 10);
        if (isNaN(cuil)) {
            Alert.alert('Error', 'El cuil debe ser un número válido.');
            console.log('cuil no válido:', formData.cuil);
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
        if (isNaN(fechanacimiento.getTime())) {
            Alert.alert('Error', 'La fecha de nacimiento no es válida.');
            console.log('Fecha de nacimiento no válida:', formData.fechaNacimiento);
            return;
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

        // Agregar el departamento y el piso solo si tienen un valor
        if (formData.departamento) {
            alumnoData.departamento = formData.departamento;
        }
        if (formData.piso) {
            alumnoData.piso = formData.piso;
        }
        console.log('Datos del alumno a agregar:', alumnoData); // Verifica el contenido

        try {
            const response = await agregarAlumno(alumnoData);
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
    
            const respuesta = await modificarAlumno(dni, formData); 
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
    }
    
});

