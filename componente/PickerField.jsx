import React from 'react';
import { View, Text, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function PickerField({ label, selectedValue, onValueChange, items, style }) {
    return (
        <View>
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
                    }}
                >
                    {items.map(item => (
                        <option key={item.key ?? item.value} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
            ) : (
                <View style={style.input}>
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