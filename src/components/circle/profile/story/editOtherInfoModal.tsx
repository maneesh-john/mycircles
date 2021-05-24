import React, { useState, useEffect } from 'react'
import { Modal, View, StyleSheet, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator, SafeAreaView } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import colors from '../../../../constants/colors';
import { updateCircleUserData } from '../../../../redux/actions/profileActions';
import { useDispatch, useSelector } from 'react-redux';

const EditOtherInfoModal = (props: any) => {

    const { selectedCircle, userData, role } = useSelector((state: any) => state.app)

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [value, setvalue] = useState<string>('');
    const [header, setheader] = useState<string>('');

    const dispatch = useDispatch()

    useEffect(() => {
        if (props.modalVisible && props.selectedItem) {
            setvalue(props.info[props.selectedItem] ? props.info[props.selectedItem] : '')
            const _header = props.selectedItem.replace(/\_/g, ' ')
            setheader(_header)
        }
        return () => {
            setvalue('')
        }
    }, [props.modalVisible, props.selectedItem])

    const closeModal = () => {
        props.setmodalVisible(false)
    }

    const onsave = async () => {
        setIsLoading(true)
        try {
            if (!value.length) { throw new Error("Please enter value") }
            else {
                const body: any = {}
                body[props.selectedItem] = value
                await dispatch(updateCircleUserData(userData.id, selectedCircle.id, body, true, role))
                closeModal()
            }
        } catch (error) {
            Alert.alert('Oops', error.message)
        }
        setIsLoading(false)
    }


    return (
        <Modal transparent={true} onRequestClose={() => closeModal()} animationType="slide" visible={props.modalVisible}>
            <SafeAreaView style={{ flex: 1 }}>
                {isLoading ? <View style={styles.activityIndication}>
                    <ActivityIndicator size={40} color={props.color} />
                </View> : null}
                <View style={styles.modal}>
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <Text style={styles.modalHeaderText}>{header}</Text>
                            <MaterialIcons name="close" onPress={closeModal} size={26} />
                        </View>
                        <View style={styles.iputHolder}>
                            <TextInput
                                style={styles.inputField}
                                placeholder=""
                                keyboardType='default'
                                maxLength={500}
                                multiline={true}
                                numberOfLines={8}
                                value={value}
                                onChangeText={(value: any) => setvalue(value)}
                                returnKeyType="done"
                            />
                            <Text style={{ alignSelf: 'flex-end', color: '#6d6d6d', marginTop: 2 }}>{500 - value?.length} Characters remaining.</Text>
                        </View>
                        <View style={styles.modalFooter}>
                            <TouchableOpacity activeOpacity={.7} style={{ ...styles.btn, borderColor: props.color }} onPress={closeModal}>
                                <Text style={{ ...styles.btnText, color: props.color }}>Close</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={.7} onPress={onsave} style={{ ...styles.btn, borderColor: props.color, backgroundColor: props.color }}>
                                <Text style={{ ...styles.btnText }}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,.8)',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        width: '100%',
        backgroundColor: colors.secondary
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f6f6f6',
    },
    iputHolder: {
        padding: 15
    },
    modalHeaderText: {
        fontWeight: '500',
        fontSize: 16,
        color: '#333',
        flex: 1,
        textTransform: 'uppercase'
    },
    modalFooter: {
        borderTopColor: '#ccc',
        borderTopWidth: .5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    inputField: {
        backgroundColor: colors.secondary,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        width: "100%",
        fontSize: 16,
        marginBottom: 5,
        shadowColor: '#ccc',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 1,
        overflow: 'hidden',
        minHeight: 160,
        textAlignVertical: 'top'
    },
    btn: {
        minWidth: 120,
        paddingVertical: 10,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        borderWidth: 1
    },
    btnText: {
        fontSize: 16,
        textTransform: 'uppercase',
        color: colors.secondary
    },
    activityIndication: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,.8)'
    },
})

export default EditOtherInfoModal
