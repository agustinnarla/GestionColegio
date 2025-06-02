import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function PickerField({ label, selectedValue, onValueChange, items, style }) {
    return (
        <View style={style?.pickerContainer}>
            <Text style={style?.pickerLabel}>{label}</Text>
            <Picker
                selectedValue={selectedValue}
                onValueChange={onValueChange}
                style={style?.picker}
            >
                {items.map(item => (
                    <Picker.Item key={item.key} label={item.label} value={item.value} />
                ))}
            </Picker>
        </View>
    );
}
