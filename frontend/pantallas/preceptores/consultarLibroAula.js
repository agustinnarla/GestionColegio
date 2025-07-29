import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList, ScrollView, Platform, Alert } from 'react-native';

import ListasDesplegables from '../../componente/ListasDesplegables.jsx';

import bg from '../../assets/bg1.jpg';
import CustomAlert from '../../componente/CustomAlerts.js';
import useConsultarLibroAula from '../../hooks/useConsultarLibroAula.js';

export default function ConsultarLibro() {
    
    const {
       
        handleChange,
        handleConsultar,
        mostrarMensaje,
        reiniciarFiltro,
        validarCampo,
        setAlertVisible,
        setFormData,
        formData,
        alertVisible,
        alertTitle,
        alertMessage,
        curso,
        profesores,
        materia,
        datos
        } = useConsultarLibroAula();

    const cargarGrilla = ({ item }) => (
        <View style={styles.fila}>
            <Text style={styles.celda}>{item.fecha}</Text>
            <Text style={styles.celda}>{item.numero_clase}</Text>
            <Text style={styles.celda}>{item.unidad}</Text>
            <Text style={styles.celda}>{item.caracteristica_unidad}</Text>
            <Text style={styles.celda}>{item.tema_abarcado}</Text>
        </View>
    );
    
    const Content = (
        <View style={styles.contenido}>
            <ListasDesplegables
                formData={formData}
                handleChange={handleChange}
                profesores={profesores}
                showLabel={true}
                styles={styles}
            />
            <ListasDesplegables
                formData={formData}
                handleChange={handleChange}
                curso={curso}
                styles={styles}
            />
            <ListasDesplegables
                formData={formData}
                handleChange={handleChange}
                materias={materia}
                showLabel={true}
                styles={styles}
            />
            

            <View style={styles.botonesContainer}>
                <TouchableOpacity style={[styles.botonConsultar, !validarCampo() && styles.botonDeshabilitado]} onPress={handleConsultar} disabled={!validarCampo()}>
                    <Text style={styles.textoBoton}>Consultar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.botonReiniciar, !validarCampo() && styles.botonDeshabilitado]} onPress={reiniciarFiltro} disabled={!validarCampo()}>
                    <Text style={styles.textoBoton}>Reiniciar Filtro</Text>
                </TouchableOpacity>
            </View>
            <CustomAlert
                            isVisible={alertVisible}
                            onClose={() => setAlertVisible(false)}
                            title={alertTitle}
                            message={alertMessage}
            />
            {datos.length > 0 && (
                <View style={styles.grilla}>
                    <View style={styles.encabezado}>
                        <Text style={styles.celdaEncabezado}>Fecha</Text>
                        <Text style={styles.celdaEncabezado}>Clase N°</Text>
                        <Text style={styles.celdaEncabezado}>Unidad</Text>
                        <Text style={styles.celdaEncabezado}>Característica</Text>
                        <Text style={styles.celdaEncabezado}>Tema abarcado</Text>
                    </View>
                    <FlatList
                        data={datos}
                        renderItem={cargarGrilla}
                        keyExtractor={(_, idx) => idx.toString()}
                    />
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.padre}>
            <Image source={bg} style={styles.bg} />
            {Platform.OS === 'web' ? Content : <ScrollView contentContainerStyle={styles.scroll}>{Content}</ScrollView>}
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
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        zIndex: -1,
    },
    botonDeshabilitado: {
        opacity: 0.5,
        backgroundColor: '#cccccc',
        borderColor: '#999999',
    },
    scroll: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    contenido: {
        width: '100%',
        maxWidth: 700,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: '#fafafa',
        fontSize: 16,
        color: '#2a3d6c',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2a3d6c',
    },
    botonesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 10,
    },
    botonConsultar: {
        backgroundColor: '#CED9EF',
        borderColor: '#0500FF',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    botonReiniciar: {
        backgroundColor: '#DADADA',
        borderColor: '#000000',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
    },
    textoBoton: {
        color: '#2a3d6c',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    grilla: {
        marginTop: 20,
        width: '100%',
    },
    encabezado: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#ccc',
    },
    fila: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    celdaEncabezado: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    celda: {
        flex: 1,
        textAlign: 'center',
    }
});