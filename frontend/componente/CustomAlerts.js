import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import Modal from 'react-native-modal';

const CustomAlert = ({
    isVisible,
    onClose,
    title,
    message,
    buttonText = 'OK',
    showConfirm = false,
    onConfirm,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    showSpinner = false
}) => {
    const [fadeAnim] = useState(new Animated.Value(0));
    const [scaleAnim] = useState(new Animated.Value(0.8));

    useEffect(() => {
        if (isVisible) {
            // Animación de entrada
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            // Animación de salida
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.8,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [isVisible]);

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={showSpinner ? undefined : onClose}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            backdropTransitionInTiming={600}
            backdropTransitionOutTiming={600}
        >
            <Animated.View 
                style={[
                    styles.modalContent,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>
                
                {showSpinner && (
                    <View style={styles.spinnerContainer}>
                        <ActivityIndicator size="large" color="#007BFF" />
                    </View>
                )}
                
                {!showSpinner && (
                    showConfirm ? (
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity style={[styles.button, { backgroundColor: '#6c757d' }]} onPress={onClose}>
                                <Text style={styles.buttonText}>{cancelText}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => { onConfirm(); onClose(); }}>
                                <Text style={styles.buttonText}>{confirmText}</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.button} onPress={onClose}>
                            <Text style={styles.buttonText}>{buttonText}</Text>
                        </TouchableOpacity>
                    )
                )}
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    spinnerContainer: {
        marginVertical: 15,
    },
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default CustomAlert;