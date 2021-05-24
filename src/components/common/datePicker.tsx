import React from 'react'
import { Platform, View, Button, Modal, SafeAreaView } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dialog, Portal } from 'react-native-paper';
import { useSelector } from 'react-redux';
import colors from '../../constants/colors';

interface DatePickerInterface {
    value: any
    onChange: any
    visible: boolean
    onClose: any
    mode?: any
    key?: string,
    maximumDate?: any,
    minimumDate?: any,
    display?: any
    testID?: string,
    modal?: boolean
}

const Picker = (props: DatePickerInterface) => {
    return (
        <DateTimePicker
            key={props.key}
            testID={props.testID}
            value={props.value ? props.value : new Date()}
            mode={props.mode ? props.mode : 'date'}
            display={props.display ? props.display : "calendar"}
            onChange={props.onChange}
            minimumDate={props.minimumDate ? props.minimumDate : undefined}
            maximumDate={props.maximumDate ? props.maximumDate : undefined}
        />
    )
}

const DatePicker = (props: DatePickerInterface) => {
    const { selectedCircle } = useSelector((state: any) => state.app)
    const color: string = selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor
    return (
        <View>
            {Platform.OS === 'ios' ?
                props.modal ?
                    <Modal transparent={true} visible={props.visible} onRequestClose={() => props.onClose(false)}>
                        <SafeAreaView style={{ flex: 1 }}>
                            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.5)', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                                <View style={{ backgroundColor: colors.secondary, width: '100%', borderRadius: 15 }}>
                                    <Picker {...props} />
                                    <Button color={color} onPress={() => props.onClose(false)} title="Done"></Button>
                                </View>
                            </View>
                        </SafeAreaView>
                    </Modal>
                    :
                    <Portal>
                        <Dialog visible={props.visible} onDismiss={() => props.onClose(false)}>
                            <Picker {...props} />
                            <Button color={color} onPress={() => props.onClose(false)} title="Done"></Button>
                        </Dialog>
                    </Portal>
                :
                <Picker {...props} />
            }
        </View>
    )
}

export default DatePicker
