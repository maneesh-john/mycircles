import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert, ActivityIndicator, SafeAreaView, Dimensions } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import colors from '../../../constants/colors'
import { Chip, Checkbox } from 'react-native-paper'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { getSymptomsList, addSymptom, getAddedSymptomsList } from '../../../redux/actions/homeScreenActions'
import CONSTS from '../../../constants/consts'
import { getAbout } from '../../../redux/actions/profileActions'


const MySymptoms = (props: any) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { selectedCircle, userData } = useSelector((state: any) => state.app)
    const [selectedSpecificSymptom, setSelectedSpecificSymptom] = useState<Array<any>>([]);
    const [specificSymptomList, setSpecificSymptomList] = useState<Array<any>>([]);
    const [specificSymptomListVisible, setSpecificSymptomListVisible] = useState<boolean>(false);

    const [selectedOtherSymptom, setSelectedOtherSymptom] = useState<Array<any>>([]);
    const [otherSymptomList, setOtherSymptomList] = useState<Array<any>>([]);
    const [otherSymptomListVisible, setOtherSymptomListVisible] = useState<boolean>(false);

    const dispatch = useDispatch();

    const updateCheckedField = (items: Array<any>, selected: Array<any>) => {
        if (items) {
            return items.map((item: any) => {
                const selectIndex = selected.findIndex(val => val.id === item.id)
                item.isChecked = selectIndex < 0 ? false : true;
                return item;
            })
        } else {
            return []
        }
    }

    const updateSelectedSpecificSyptom = (item: any) => {
        setSpecificSymptomList((prev: any) => {
            const _state = [...prev];
            const index = _state.findIndex(i => i.id === item.id)
            _state[index].isChecked = !item.isChecked
            return _state;
        })
        setSelectedSpecificSymptom((prev: any) => {
            const _state = [...prev];
            const index = _state.findIndex(i => i.id === item.id)
            if (index < 0) {
                _state.push(item)
            } else {
                _state.splice(index, 1)
            }
            return _state;
        })
    }

    const updateSelectedOtherSyptom = (item: any) => {
        setOtherSymptomList((prev: any) => {
            const _state = [...prev];
            const index = _state.findIndex(i => i.id === item.id)
            _state[index].isChecked = !item.isChecked
            return _state;
        })
        setSelectedOtherSymptom((prev: any) => {
            const _state = [...prev];
            const index = _state.findIndex(i => i.id === item.id)
            if (index < 0) {
                _state.push(item)
            } else {
                _state.splice(index, 1)
            }
            return _state;
        })
    }

    const initialiseSelectedChips = (circle_symptoms: Array<any>, other_symptoms: Array<any>) => {
        const selected_circle_symptoms = circle_symptoms.filter(rs => rs.isChecked);
        const selected_other_symptoms = other_symptoms.filter(rs => rs.isChecked);
        setSelectedSpecificSymptom(selected_circle_symptoms)
        setSelectedOtherSymptom(selected_other_symptoms)
    }

    useEffect(() => {
        if (selectedCircle.id && userData.id) {
            (async () => {
                setIsLoading(true)
                dispatch({ type: CONSTS.SHOW_LOADER })
                const res = await getSymptomsList(selectedCircle.id);
                const added = await getAddedSymptomsList(selectedCircle.id, userData.id)
                const circle_symptoms = updateCheckedField(res.circle_symptoms, added.circle_symptoms ? added.circle_symptoms : []);
                const other_symptoms = updateCheckedField(res.other_symptoms, added.other_symptoms ? added.other_symptoms : []);
                initialiseSelectedChips(circle_symptoms, other_symptoms)
                setSpecificSymptomList(circle_symptoms)
                setOtherSymptomList(other_symptoms)
                dispatch({ type: CONSTS.HIDE_LOADER })
                setIsLoading(false)
            })()
        }
    }, [dispatch, selectedCircle, userData])

    const getIds = (array: Array<any>): Array<number> => {
        const ids: Array<number> = array.map(item => Number(item.id))
        return ids;
    }

    const onSave = async () => {
        setIsLoading(true)
        try {
            const userType = props.selectedRole == 1 ? 'symptoms' : 'caregiversymptoms';
            const body = { symptoms: [...getIds(selectedSpecificSymptom), ...getIds(selectedOtherSymptom)] }
            await dispatch(addSymptom(body, userData.id, selectedCircle.id, userType))
            if (props.edit) {
                await dispatch(getAbout(userData.id, selectedCircle.id, props.role))
            }
            setIsLoading(false)
            props.handleNext();
        } catch (error) {
            setIsLoading(false)
            Alert.alert('Oops', error.message)
        }
    }

    return (
        <>
            {props.edit && isLoading ? <View style={styles.activityIndication}>
                <ActivityIndicator size={40} color={props.color} />
            </View> : null}
            <View style={styles.headerContent}>
                <Text style={styles.mainHeader}>
                    Symptoms
                </Text>
            </View>
            <View style={styles.container}>
                <View style={styles.inputHolder}>
                    <Text style={styles.label}>What symptoms specfic to {selectedCircle?.condition_type} do you experience?</Text>
                    <Text style={styles.subLabel}>(For example: abdominal pain etc..)</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
                        {selectedSpecificSymptom.map((condition: any) => (
                            <Chip icon="close"
                                style={{ margin: 3, borderColor: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor, borderWidth: 1, backgroundColor: colors.secondary }} accessibilityStates
                                key={condition.id}
                                textStyle={{ padding: 2 }}
                                onPress={() => {
                                    updateSelectedSpecificSyptom(condition)
                                }}>
                                {condition.display_name}
                            </Chip>
                        ))}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity activeOpacity={.7} style={{ ...styles.inputField, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                            onPress={() => { setSpecificSymptomListVisible(true) }}>
                            <Text>Select symptoms...</Text>
                            <MaterialIcons name="add" size={25} style={{ marginLeft: -35, elevation: 3, }} color={selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor} />
                        </TouchableOpacity>
                    </View>
                    <Modal key={'m1'} onRequestClose={() => setSpecificSymptomListVisible(false)} animationType="slide" visible={specificSymptomListVisible}>
                        <SafeAreaView style={{ flex: 1 }}>
                            <Text style={{ ...styles.modalHeader, backgroundColor: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor }}>Select your symptoms</Text>
                            <ScrollView >
                                {specificSymptomList.map((item: any) => (
                                    <View key={item.id} style={{ width: "100%", zIndex: 12, paddingVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
                                        <Checkbox.Android accessibilityStates key={item.id} status={item.isChecked ? 'checked' : 'unchecked'} onPress={() => { updateSelectedSpecificSyptom(item) }} color={selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor} />
                                        <Text onPress={() => { updateSelectedSpecificSyptom(item) }}>{item.display_name}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                            <TouchableOpacity activeOpacity={.5} onPress={() => { setSpecificSymptomListVisible(false) }} style={{ ...styles.modalBtn, borderColor: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor, backgroundColor: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor }}>
                                <Text style={{ ...styles.btnText }}>Done</Text>
                            </TouchableOpacity>
                        </SafeAreaView>
                    </Modal>
                </View>

                <View style={styles.inputHolder}>
                    <Text style={styles.label}>Please add any other symptoms that you experience?</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
                        {selectedOtherSymptom.map((condition: any) => (
                            <Chip icon="close"
                                style={{ margin: 3, borderColor: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor, borderWidth: 1, backgroundColor: colors.secondary }} accessibilityStates
                                key={condition.id}
                                textStyle={{ padding: 2 }}
                                onPress={() => {
                                    updateSelectedOtherSyptom(condition)
                                }}>
                                {condition.display_name}
                            </Chip>
                        ))}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity activeOpacity={.7} style={{ ...styles.inputField, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                            onPress={() => { setOtherSymptomListVisible(true) }}>
                            <Text>Select symptoms...</Text>
                            <MaterialIcons name="add" size={25} style={{ marginLeft: -35, elevation: 3, }} color={selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor} />
                        </TouchableOpacity>
                    </View>
                    <Modal key={'m2'} onRequestClose={() => setOtherSymptomListVisible(false)} animationType="slide" visible={otherSymptomListVisible} onDismiss={() => { setOtherSymptomListVisible(false) }}>
                        <SafeAreaView style={{ flex: 1 }}>
                            <Text style={{ ...styles.modalHeader, backgroundColor: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor }}>Select your symptoms</Text>
                            <ScrollView >
                                {otherSymptomList.map((item: any) => (
                                    <View key={item.id} style={{ width: "100%", zIndex: 12, paddingVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
                                        <Checkbox.Android accessibilityStates key={item.id} status={item.isChecked ? 'checked' : 'unchecked'} onPress={() => { updateSelectedOtherSyptom(item) }} color={selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor} />
                                        <Text onPress={() => { updateSelectedOtherSyptom(item) }}>{item.display_name}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                            <TouchableOpacity activeOpacity={.5} onPress={() => { setOtherSymptomListVisible(false) }} style={{ ...styles.modalBtn, borderColor: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor, backgroundColor: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor }}>
                                <Text style={{ ...styles.btnText }}>Done</Text>
                            </TouchableOpacity>
                        </SafeAreaView>
                    </Modal>
                </View>
            </View>
            <View style={{
                backgroundColor: colors.secondary,
                flexDirection: 'row', justifyContent: props.edit ? 'flex-end' : 'space-between', paddingHorizontal: 20,
                paddingBottom: 30, alignItems: 'center', marginTop: props.edit ? 20 : 0
            }} >
                {props.edit ? null : <TouchableOpacity activeOpacity={.5} onPress={() => { props.handleNext() }}>
                    <Text style={{ ...styles.btnText, color: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor }}>SKIP STEP</Text>
                </TouchableOpacity>}
                <View style={styles.btnContainer}>
                    {props.edit ? <TouchableOpacity activeOpacity={.5} onPress={() => { props.handleNext() }} style={{ ...styles.btnStyle, borderColor: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor, marginRight: 5 }}>
                        <Text style={{ ...styles.btnText, color: '#333' }}>BACK</Text>
                    </TouchableOpacity> : null}
                    <TouchableOpacity activeOpacity={.5} onPress={() => { onSave() }} style={{ ...styles.btnStyle, borderColor: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor, backgroundColor: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor }}>
                        <Text style={{ ...styles.btnText }}>{props.edit ? 'DONE' : 'NEXT'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    activityIndication: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        height: Dimensions.get('screen').height,
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,.8)'
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    btnStyle: {
        paddingVertical: 8,
        paddingHorizontal: 25,
        borderRadius: 15,
        borderWidth: 1,
        width: 120,
        backgroundColor: colors.secondary
    },
    btnText: {
        textAlign: "center",
        textAlignVertical: 'center',
        color: colors.secondary,
        fontWeight: '600'
    },
    headerContent: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: colors.secondary
    },
    mainHeader: {
        textAlign: 'center',
        fontSize: 24,
        marginBottom: 10,
        letterSpacing: .5,
        fontWeight: '600'
    },
    container: {
        backgroundColor: colors.secondary,
        padding: 20
    },
    inputHolder: {
        marginVertical: 5,
    },
    label: {
        marginBottom: 5,
        fontWeight: "500"
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
        shadowRadius: 8,
        elevation: 2,
        overflow: 'hidden'
    },
    error: {
        marginLeft: 5,
        fontSize: 13,
        fontWeight: '600',
        color: 'red'
    },
    placeholder: {
        color: '#ccc',
        fontSize: 16,
        paddingVertical: 4
    },
    subLabel: {
        fontSize: 12,
        color: '#6d6d6d',
        marginBottom: 7
    },
    optional: {
        fontStyle: 'italic',
        color: '#6d6d6d'
    },
    responseHolder: {
        borderRadius: 10,
        borderColor: "#ccc",
        borderWidth: .5,
        position: "absolute",
        bottom: -180,
        width: "100%",
        backgroundColor: colors.secondary,
        zIndex: 10,
        maxHeight: 180,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden'
    },
    modalBtn: {
        paddingVertical: 8,
        paddingHorizontal: 25,
        borderRadius: 15,
        borderWidth: 1,
        marginVertical: 10,
        marginHorizontal: "25%",
        backgroundColor: colors.secondary
    },
    modalHeader: {
        color: colors.secondary,
        fontSize: 20,
        textAlignVertical: 'center',
        textAlign: 'center',
        paddingVertical: 15
    }
})
export default MySymptoms
