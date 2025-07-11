import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
    cancelText = 'Cancelar'
}) => {
    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            backdropTransitionInTiming={600}
            backdropTransitionOutTiming={600}
        >
            <View style={styles.modalContent}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>
                {showConfirm ? (
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
                )}
            </View>
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