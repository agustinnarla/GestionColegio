import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const CustomHeader = ({ title }) => {
    return (
        <LinearGradient
            colors={['#0A1231', 'rgba(45, 85, 228, 0.8)']}
            style={styles.header}
        >
            <Text style={styles.headerTitle}>{title}</Text>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 60, // Altura del encabezado
        paddingTop: 20, // Espacio superior para alinear el texto
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CustomHeader;
