import React, { useState, useEffect } from 'react'
import { Modal, View, StyleSheet, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator, Platform, ScrollView, SafeAreaView } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import RNPickerSelect from 'react-native-picker-select';
import colors from '../../../../constants/colors';
import { useDispatch, useSelector } from 'react-redux';
import { geBaseDataForProfileEdit, editAbout } from '../../../../redux/actions/profileActions';
import { getSymptoms } from '../../../../redux/actions/homeScreenActions';
import DatePicker from '../../../../components/common/datePicker';
import fonts from '../../../../constants/fonts';

const EditPatientAbout = (props: any) => {
    const dispatch = useDispatch();

    const { relationships, situations } = useSelector((state: any) => state.profile)
    const { selectedCircle, userData, symptoms } = useSelector((state: any) => state.app)

    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [birthday, setbirthday] = useState<any>();
    const [gender, setgender] = useState('');
    const [typeOfCircle, settypeOfCircle] = useState('');
    const [situation, setSitualtion] = useState('');
    const [relationship, setRelationship] = useState('');
    const [miniBio, setMiniBio] = useState('');
    const [dateOfDiagnosis, setdateOfDiagnosis] = useState<any>();

    const [symptomsList, setSymptomsList] = useState<Array<any>>([])
    const [relationshipList, setRelationshipList] = useState<Array<any>>([])
    const [situationList, setSituationList] = useState<Array<any>>([])

    useEffect(() => {
        if (props.modalVisible && selectedCircle.id) {
            dispatch(getSymptoms(selectedCircle.id))
        }
    }, [dispatch, props.modalVisible, selectedCircle])

    useEffect(() => {
        const _symptoms = symptoms.map((symptom: any) => {
            return {
                label: symptom.display_name,
                value: symptom.display_name
            }
        })
        setSymptomsList(_symptoms)
    }, [symptoms])

    useEffect(() => {
        const _relationships = relationships.map((relationship: any) => {
            return {
                label: (relationship.display_name).toLowerCase(),
                value: (relationship.display_name).toLowerCase()
            }
        })
        setRelationshipList(_relationships)
    }, [relationships])

    useEffect(() => {
        const _situations = situations.map((situation: any) => {
            return {
                label: situation.display_name,
                value: situation.display_name
            }
        })
        setSituationList(_situations)
    }, [situations])

    useEffect(() => {
        if (props.modalVisible) {
            setbirthday(new Date(props.info?.dob));
            setdateOfDiagnosis(new Date(props.info?.diagnosis_date));
            setgender(props.info?.gender);
            settypeOfCircle(props.info?.disease_type);
            setSitualtion(props.info?.current_situation);
            setRelationship(props.info?.relationship_status);
            setMiniBio(props.info?.mini_bio ? props.info?.mini_bio : '');
            (async () => {
                setIsLoading(true);
                await dispatch(geBaseDataForProfileEdit())
                setIsLoading(false);
            })()
        }
    }, [props.modalVisible, props.info])

    const closeModal = () => {
        props.setmodalVisible(false)
    }

    const onsave = async () => {
        try {
            const dob = (birthday.toISOString()).split('T')[0];
            let diagnosis_date;
            try {
                diagnosis_date = (dateOfDiagnosis.toISOString()).split('T')[0];
            } catch (error) {
                throw new Error("Please select a valid date of diagnosis");
            }
            const role = props.info?.user[0].role;
            const body: any = {
                dob,
                "gender": gender,
                "relationship_status": relationship,
                "current_situation": situation,
            }
            if (role === 'patient') {
                body["normal_user"] = {
                    "mini_bio": miniBio,
                    diagnosis_date,
                    "disease_type": typeOfCircle
                }
            } else if (props.info?.user[0].role === 'caregiver') {
                body["caregiver"] = {
                    "mini_bio": miniBio,
                    diagnosis_date,
                    "disease_type": typeOfCircle
                }
            }
            setIsLoading(true);
            await dispatch(editAbout(userData.id, selectedCircle.id, body, role))
            closeModal()
        } catch (error) {
            Alert.alert('Oops', error.message)
        }
        setIsLoading(false);
    }

    const onSelectBirthday = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || birthday;
        setShow1(Platform.OS === 'ios');
        if (currentDate > dateOfDiagnosis) {
            setdateOfDiagnosis(undefined)
        }
        setbirthday(currentDate);
    };

    const onSelectDoD = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || dateOfDiagnosis;
        setShow2(Platform.OS === 'ios');
        setdateOfDiagnosis(currentDate);
    };

    return (
        <Modal transparent={true} onRequestClose={() => closeModal()} animationType="slide" visible={props.modalVisible}>
            <SafeAreaView style={{ flex: 1 }}>
                {isLoading ? <View style={styles.activityIndication}>
                    <ActivityIndicator size={40} color={props.color} />
                </View> : null}
                <View style={styles.modal}>
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <Text style={styles.modalHeaderText}>About</Text>
                            <MaterialIcons name="close" onPress={closeModal} size={26} />
                        </View>
                        <ScrollView contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 15 }}>
                            <View style={styles.inputHolder}>
                                <Text style={styles.label}>I'm a</Text>
                                <RNPickerSelect
                                    onValueChange={(value) => setgender(value)}
                                    placeholder={{ label: 'Select gender', value: '', color: '#ccc' }}
                                    style={{
                                        inputAndroid: {
                                            ...styles.inputField
                                        },
                                        inputIOS: {
                                            ...styles.inputField
                                        },
                                        iconContainer: {
                                            top: 9,
                                            right: 5,
                                            elevation: 3
                                        },
                                    }}
                                    useNativeAndroidPickerStyle={false}
                                    value={gender}
                                    items={[
                                        { label: 'Male', value: 'male' },
                                        { label: 'Female', value: 'female' }
                                    ]}
                                    Icon={() => {
                                        return <MaterialIcons size={30} name="keyboard-arrow-down" color={selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor} />;
                                    }}
                                />
                            </View>

                            <View style={styles.inputHolder}>
                                <Text style={styles.label}>Birthday Date</Text>
                                <TouchableOpacity activeOpacity={.8} style={{ ...styles.inputField, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} onPress={() => setShow1(true)}>
                                    {birthday ? <Text style={styles.value}>{new Date(birthday).toDateString()}</Text> : <Text style={styles.placeholder}>Select date</Text>}
                                    <AntDesign name="calendar" size={20} color={selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor} />
                                </TouchableOpacity>
                                {show1 && <DatePicker
                                    key="bday"
                                    testID="dateTimePicker"
                                    value={birthday ? birthday : new Date()}
                                    mode="date"
                                    display="calendar"
                                    onChange={onSelectBirthday}
                                    maximumDate={new Date()}
                                    visible={show1}
                                    modal
                                    onClose={setShow1}
                                />}
                            </View>

                            <View style={styles.inputHolder}>
                                <Text style={styles.label}>My Type of {selectedCircle?.condition_type}</Text>
                                <RNPickerSelect
                                    onValueChange={(value) => settypeOfCircle(value)}
                                    placeholder={{ label: 'Select type', value: '', color: '#ccc' }}
                                    style={{
                                        inputAndroid: {
                                            ...styles.inputField,
                                            paddingRight: 30
                                        },
                                        inputIOS: {
                                            ...styles.inputField
                                        },
                                        iconContainer: {
                                            top: 9,
                                            right: 5,
                                            elevation: 3
                                        },
                                    }}
                                    useNativeAndroidPickerStyle={false}
                                    value={typeOfCircle}
                                    items={symptomsList}
                                    Icon={() => {
                                        return <MaterialIcons size={30} name="keyboard-arrow-down" color={selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor} />;
                                    }}
                                />
                            </View>
                            <View style={styles.inputHolder}>
                                <Text style={styles.label}>My Date of Diagnosis</Text>
                                <TouchableOpacity activeOpacity={.8} style={{ ...styles.inputField, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} onPress={() => setShow2(true)}>
                                    {dateOfDiagnosis ? <Text style={styles.value}>{new Date(dateOfDiagnosis).toDateString()}</Text> : <Text style={styles.placeholder}>Select date</Text>}
                                    <AntDesign name="calendar" size={20} color={selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor} />
                                </TouchableOpacity>
                                {show2 && <DatePicker
                                    key="dod"
                                    testID="dateTimePicker"
                                    value={dateOfDiagnosis ? dateOfDiagnosis : new Date()}
                                    mode="date"
                                    display="calendar"
                                    minimumDate={birthday}
                                    maximumDate={new Date()}
                                    onChange={onSelectDoD}
                                    visible={show2}
                                    onClose={setShow2}
                                    modal
                                />}
                            </View>

                            <View style={styles.inputHolder}>
                                <Text style={styles.label}>Relationship Status</Text>
                                <RNPickerSelect
                                    onValueChange={(value) => setRelationship(value)}
                                    placeholder={{ label: 'Select type', value: '', color: '#ccc' }}
                                    style={{
                                        inputAndroid: {
                                            ...styles.inputField,
                                            paddingRight: 30
                                        },
                                        inputIOS: {
                                            ...styles.inputField
                                        },
                                        iconContainer: {
                                            top: 9,
                                            right: 5,
                                            elevation: 3
                                        },
                                    }}
                                    useNativeAndroidPickerStyle={false}
                                    value={relationship}
                                    items={relationshipList}
                                    Icon={() => {
                                        return <MaterialIcons size={30} name="keyboard-arrow-down" color={selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor} />;
                                    }}
                                />
                            </View>

                            <View style={styles.inputHolder}>
                                <Text style={styles.label}>Current Situation</Text>
                                <RNPickerSelect
                                    onValueChange={(value) => setSitualtion(value)}
                                    placeholder={{ label: 'Select type', value: '', color: '#ccc' }}
                                    style={{
                                        inputAndroid: {
                                            ...styles.inputField,
                                            paddingRight: 30
                                        },
                                        inputIOS: {
                                            ...styles.inputField
                                        },
                                        iconContainer: {
                                            top: 9,
                                            right: 5,
                                            elevation: 3
                                        },
                                    }}
                                    useNativeAndroidPickerStyle={false}
                                    value={situation}
                                    items={situationList}
                                    Icon={() => {
                                        return <MaterialIcons size={30} name="keyboard-arrow-down" color={selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor} />;
                                    }}
                                />
                            </View>

                            <View style={styles.inputHolder}>
                                <Text style={styles.label}>Mini Bio</Text>
                                <TextInput
                                    style={{ ...styles.inputField, minHeight: 150, textAlignVertical: 'top' }}
                                    placeholder="Tell us about yourself"
                                    keyboardType='default'
                                    maxLength={500}
                                    multiline={true}
                                    numberOfLines={8}
                                    value={miniBio}
                                    onChangeText={(value: any) => setMiniBio(value)}
                                    returnKeyType="done"
                                />
                                <Text style={{ alignSelf: 'flex-end', color: '#6d6d6d', marginTop: 2, fontFamily: fonts.LATO_REGULAR, fontSize: 13 }}>{500 - miniBio?.length} Characters remaining.</Text>
                            </View>

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
    iputHolder: {
        padding: 15
    },
    modalHeaderText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
        fontFamily: fonts.LATO_REGULAR,
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
    value: {
        fontSize: 14,
        paddingVertical: 4,
        fontFamily: fonts.LATO_REGULAR
    },
    inputField: {
        backgroundColor: colors.secondary,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        paddingVertical: 8,
        fontSize: 14,
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
    inputHolder: {
        marginVertical: 5,
    },
    label: {
        marginBottom: 5,
        fontFamily: fonts.LATO_BOLD
    },
    placeholder: {
        color: '#ccc',
        fontSize: 14,
        paddingVertical: 4,
        fontFamily: fonts.LATO_REGULAR
    },
})
export default EditPatientAbout
