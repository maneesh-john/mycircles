import React, { useState } from 'react'
import { Modal, View, ActivityIndicator, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import colors from '../../../constants/colors'
import { ScrollView } from 'react-native-gesture-handler'
import { RadioButton } from 'react-native-paper'
import { reactionTypes, reactionOnType } from '../../../constants/const_values'
import { addReaction, reportSpam } from '../../../redux/actions/profileActions'
import { useDispatch } from 'react-redux'
import { updateSnackMessage } from '../../../redux/actions/homeScreenActions'
import fonts from '../../../constants/fonts'

const ReportModal = (props: any) => {

    const dispatch = useDispatch()

    const [reportOptions, setReportOptions] = useState<Array<any>>(
        [
            {
                title: 'I would like my circle admin to review',
                value: 2,
                selected: false
            },
            {
                title: 'I am concerned about a community member',
                value: 3,
                selected: false
            },
            {
                title: 'It’s SPAM',
                value: 1,
                selected: false
            },
            {
                title: 'Inappropriate picture',
                value: 4,
                selected: false
            },
            {
                title: 'Inappropriate display name',
                value: 5,
                selected: false
            },
            {
                title: 'Others',
                value: 6,
                selected: false
            },
        ]
    )

    const [description, setDescription] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const closeModal = () => {
        props.setShowModal(false)
    }

    const setChecked = (selectedVal: any) => {
        setError('')
        const _val = reportOptions.map((item) => {
            if (item.value === selectedVal.value) {
                item.selected = true
            } else {
                item.selected = false
            }
            return item;
        });
        setReportOptions(_val)
    }

    const send = async () => {
        setError('')
        const selected = reportOptions.find(option => option.selected);
        if (selected) {
            setIsLoading(true)
            try {
                const body1: any = {
                    spam: selected.value,
                    spam_description: description
                }
                const body2 = {
                    "reacted_on_type": reactionOnType[props.item.content_type],
                    "reacted_on_id": props.item.id,
                    "user": props.userData.id,
                    "reaction_type": reactionTypes.flaged
                }
                await reportSpam(props.item.id, body1)
                await addReaction(props.selectedCircle.id, body2)
                setIsLoading(false)
                dispatch(updateSnackMessage('Reported successfully'))
                closeModal()
            } catch (error) {
                setIsLoading(false)
                Alert.alert('Oops!', error)
            }
        } else {
            setError('Please select a type')
        }
    }

    return (
        <Modal transparent={false} onRequestClose={closeModal} animationType="slide" visible={props.showModal}>
            <SafeAreaView style={{ flex: 1 }}>
                {isLoading ? <View style={styles.activityIndication}>
                    <ActivityIndicator size={40} color={props.color} />
                </View> : null}
                <View style={styles.modal}>
                    <View style={styles.container}>
                        <View style={{ ...styles.header, backgroundColor: props.color }}>
                            <Text style={styles.modalHeaderText}>Report Content</Text>
                            <MaterialIcons name="close" onPress={closeModal} size={26} color={colors.secondary} />
                        </View>
                        <View style={styles.body}>
                            <ScrollView contentContainerStyle={{ padding: 20 }}>
                                <Text style={styles.subheader}>Please select a reason below as to why you feel this content has treaded on our community guidelines: (Reporting content is completely anonymous)</Text>
                                <View style={styles.options}>
                                    {reportOptions.map((rs, index) => (
                                        <View key={index} style={styles.row}>
                                            <RadioButton.Android
                                                accessibilityStates
                                                value={rs.value}
                                                color={props.color}
                                                status={rs.selected ? 'checked' : 'unchecked'}
                                                onPress={() => setChecked(rs)}
                                            />
                                            <Text style={styles.title}>{rs.title}</Text>
                                        </View>
                                    ))}
                                    {error ? <Text style={styles.error}>* {error}</Text> : null}
                                </View>
                                <View>
                                    <Text style={styles.label}>Description <Text style={styles.optional}>- Optional</Text>.</Text>
                                    <TextInput style={styles.inputField}
                                        placeholder="Tell us about the content"
                                        keyboardType='default'
                                        maxLength={2000}
                                        multiline={true}
                                        numberOfLines={8}
                                        value={description}
                                        onChangeText={(value: any) => setDescription(value)}
                                        returnKeyType="done"
                                    />
                                </View>
                            </ScrollView>
                        </View>
                        <View style={[styles.row, styles.footer]}>
                            <TouchableOpacity activeOpacity={.5} onPress={closeModal} style={styles.btnStyle}>
                                <Text style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={.5} onPress={send} style={{ ...styles.btnStyle, borderColor: props.color, backgroundColor: props.color }}>
                                <Text style={{ ...styles.btnText, color: colors.secondary }}>Submit</Text>
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
        paddingVertical: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        minWidth: '100%',
        backgroundColor: colors.secondary
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f6f6f6',
    },
    modalHeaderText: {
        fontFamily: fonts.LATO_REGULAR,
        fontSize: 16,
        color: colors.secondary,
        flex: 1,
    },
    body: {
        flex: 1
    },
    textInput: {
        borderRadius: 10,
        borderWidth: .5,
        marginVertical: 15,
        padding: 10,
        color: '#333'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        flex: 1,
        fontFamily: fonts.LATO_REGULAR,
        color: '#333'
    },
    options: {
        paddingVertical: 10,
        marginHorizontal: -5
    },
    subheader: {
        color: '#333',
        fontFamily: fonts.LATO_BOLD,
    },
    label: {
        marginBottom: 5,
        fontFamily: fonts.LATO_REGULAR,
    },
    optional: {
        fontStyle: 'italic',
        color: '#6d6d6d'
    },
    inputField: {
        backgroundColor: colors.secondary,
        borderColor: '#ccc',
        borderWidth: .5,
        borderRadius: 10,
        padding: 10,
        width: "100%",
        marginBottom: 5,
        minHeight: 150,
        textAlignVertical: 'top'
    },
    footer: {
        justifyContent: 'flex-end',
        paddingVertical: 20,
        paddingHorizontal: 10,
        backgroundColor: '#f8f8f8'
    },
    btnStyle: {
        width: 100,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        marginHorizontal: 10,
        borderColor: '#888'
    },
    btnText: {
        fontFamily: fonts.LATO_REGULAR,
        color: '#333'
    },
    error: {
        color: 'red',
        fontSize: 12,
        fontFamily: fonts.LATO_BOLD,
        paddingHorizontal: 10,
    }
})

export default ReportModal
