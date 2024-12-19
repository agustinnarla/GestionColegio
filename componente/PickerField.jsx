import { Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function PickerField({ label, selectedValue, onValueChange, items, style }) {
    return (
        <>
            <Text style={style?.label}>{label}</Text>
            <Picker
                style={style?.input}
                selectedValue={selectedValue}
                onValueChange={onValueChange}
            >
                {items.length > 0 ? (
                    items.map((item) => (
                        <Picker.Item 
                            key={item.key || item.value} 
                            label={item.label} 
                            value={item.value} 
                        />
                    ))
                ) : (
                    <Picker.Item label="Cargando..." value="" />
                )}
            </Picker>
        </>
    );
} 