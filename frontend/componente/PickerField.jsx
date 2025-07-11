import React from 'react';
import { View, Text, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function PickerField({ label, selectedValue, onValueChange, items, style }) {
    return (
        <View style={{ marginBottom: 12 }}>
            <Text style={style?.label}>{label}</Text>
            {Platform.OS === 'web' ? (
                <select
                    value={selectedValue}
                    onChange={e => onValueChange(e.target.value)}
                    style={{
                        ...style.input,
                        outline: 'none',
                        width: '100%',
                        fontSize: 16,
                        backgroundColor: '#fafafa',
                        border: '1px solid #bbb',
                        borderRadius: 5,
                        padding: '8px 12px',
                        marginTop: 4,
                    }}
                >
                    {items.map(item => (
                        <option key={item.key ?? item.value} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
            ) : (
                <View style={[
                    style.input,
                    {
                        backgroundColor: '#fafafa',
                        borderWidth: 1,
                        borderColor: '#bbb',
                        borderRadius: 5,
                        paddingHorizontal: 8,
                        marginTop: 4,
                        justifyContent: 'center',
                    }
                ]}>
                    <Picker
                        selectedValue={selectedValue}
                        onValueChange={onValueChange}
                        style={{ width: '100%', backgroundColor: 'transparent', fontSize: 16 }}
                        dropdownIconColor="#333"
                    >
                        {items.map(item => (
                            <Picker.Item key={item.key ?? item.value} label={item.label} value={item.value} />
                        ))}
                    </Picker>
                </View>
            )}
        </View>
    );
}