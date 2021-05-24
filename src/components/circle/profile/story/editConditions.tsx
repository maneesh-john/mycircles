import React, { useState, useEffect } from 'react'
import { Modal, View, StyleSheet, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator, ScrollView, SafeAreaView } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import colors from '../../../../constants/colors';
import { updateCircleUserData } from '../../../../redux/actions/profileActions';
import { useDispatch, useSelector } from 'react-redux';
import { Chip } from 'react-native-paper';
import fonts from '../../../../constants/fonts';

const EditConditionsModal = (props: any) => {

    const dispatch = useDispatch()

    const { selectedCircle, userData, role } = useSelector((state: any) => state.app)

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [conditions, setconditions] = useState<Array<any>>([]);
    const [additionalConditions, setadditionalConditions] = useState('');

    useEffect(() => {
        if (props.modalVisible && props.info) {
            setconditions(props.info.add_conditions)
        }
        return () => {

        }
    }, [props.modalVisible, props.info])

    const closeModal = () => {
        props.setmodalVisible(false)
    }

    const onsave = async () => {
        setIsLoading(true)
        try {
            const body = {
                add_conditions: conditions
            }
            await dispatch(updateCircleUserData(userData.id, selectedCircle.id, body, true, role))
            closeModal()
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
                            <Text style={styles.modalHeaderText}>Additional symptoms</Text>
                            <MaterialIcons name="close" onPress={closeModal} size={26} />
                        </View>
                        <ScrollView style={styles.inputHolder}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
                                {conditions.map((condition: string) => (
                                    <Chip icon="close"
                                        style={{ margin: 3, flexShrink: 1, borderColor: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor, borderWidth: 1, backgroundColor: colors.secondary }} accessibilityStates key={condition}
                                        textStyle={{ padding: 2 }}
                                        onPress={() => {
                                            setconditions((prev: any) => {
                                                const state = [...prev];
                                                const index = state.indexOf(condition);
                                                state.splice(index, 1)
                                                return state;
                                            })
                                        }}>
                                        {condition}
                                    </Chip>
                                ))}
                            </View>

                            <TextInput style={styles.inputField}
                                placeholder="ex. depression, anxiety etc.."
                                keyboardType='default'
                                value={additionalConditions}
                                maxLength={50}
                                onChangeText={(value: any) => setadditionalConditions(value)}
                                enablesReturnKeyAutomatically={true}
                                onSubmitEditing={() => {
                                    if (additionalConditions) {
                                        setconditions((prev: any) => {
                                            const state = [...prev];
                                            state.push(additionalConditions)
                                            return state;
                                        })
                                        setadditionalConditions('');
                                    }
                                }}
                                returnKeyType="done"
                            />
                        </ScrollView>
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
        paddingHorizontal: 10,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        minWidth: '100%',
        backgroundColor: colors.secondary
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f6f6f6',
    },
    inputHolder: {
        padding: 15
    },
    modalHeaderText: {
        fontFamily: fonts.LATO_REGULAR,
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
        fontSize: 14,
        fontFamily: fonts.LATO_REGULAR,
        marginBottom: 5,
        // shadowColor: '#ccc',
        // shadowOpacity: 0.26,
        // shadowOffset: { width: 0, height: 2 },
        // shadowRadius: 5,
        // elevation: 1,
        overflow: 'hidden',
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
        fontSize: 14,
        textTransform: 'uppercase',
        color: colors.secondary,
        fontFamily: fonts.LATO_REGULAR
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

export default EditConditionsModal
