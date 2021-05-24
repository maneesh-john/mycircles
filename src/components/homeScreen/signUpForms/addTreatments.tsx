import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import colors from '../../../constants/colors'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AddNewTreatmentModal from './addNewTreatmentModal'
import { getTreatmentList, deleteTreatement } from '../../../redux/actions/homeScreenActions'
import CONSTS from '../../../constants/consts'

const AddTreatments = (props: any) => {
    const { selectedCircle, userData, userSelectedRole } = useSelector((state: any) => state.app)
    const [modalVisible, setModalVisible] = useState(false);

    const [treatments, setTreatments] = useState<Array<any>>([])

    const dispatch = useDispatch()

    const getInitialData = async () => {
        dispatch({ type: CONSTS.SHOW_LOADER })
        const _treatments = await getTreatmentList(userSelectedRole.role, userData.id, selectedCircle.id);
        setTreatments(_treatments)
        dispatch({ type: CONSTS.HIDE_LOADER })
    }

    useEffect(() => {
        if ((userData.id && selectedCircle.id && !modalVisible)) {
            getInitialData()
        }
    }, [dispatch, selectedCircle, userData, modalVisible])

    const deleteATreatement = async (id: string) => {
        dispatch({ type: CONSTS.SHOW_LOADER })
        try {
            await deleteTreatement(id);
            getInitialData()
        } catch (error) {
            Alert.alert('Oops!', error.message)
        }
        dispatch({ type: CONSTS.HIDE_LOADER })
    }

    return (
        <View>
            <View style={styles.headerContent}>
                <Text style={styles.mainHeader}>
                    Treatments
                </Text>
            </View>
            <View style={styles.container}>
                <Text style={styles.label}>What treatments or therapies have you used or are using?</Text>
                <Text style={styles.subLabel}>(For example: Jogging, Surgery, etc..)</Text>
                {treatments && treatments.length ? <View style={{ paddingVertical: 10 }}>
                    {treatments.map((treatment: any) => (
                        <View key={treatment.id} style={{ padding: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 20, borderWidth: 2, borderColor: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor }}>
                            <View style={{ width: "89%" }}>
                                <Text style={{ fontWeight: "bold", fontSize: 18, textTransform: 'uppercase', marginBottom: 5 }}>{treatment.treatment[0].display_name}</Text>
                                <Text style={{ fontSize: 12, textTransform: 'uppercase' }}>{treatment.treatment[0].treatment_type}</Text>
                            </View>
                            <View style={{ width: "10%" }}>
                                <MaterialIcons name="delete" onPress={() => { deleteATreatement(treatment.id) }} size={30} color={selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor} />
                            </View>
                        </View>
                    ))}
                </View> : null}

                <TouchableOpacity activeOpacity={.5} onPress={() => { setModalVisible(true) }} style={{ ...styles.btnStyle, width: "100%", marginVertical: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderColor: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor }}>
                    <MaterialIcons name="add" size={22} style={{ marginRight: 3 }} color={selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor} />
                    <Text style={{ ...styles.btnText, color: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor }}>ADD TREATMENT</Text>
                </TouchableOpacity>
            </View>
            <View style={{
                flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20,
                paddingBottom: 30, alignItems: 'center'
            }} >
                <TouchableOpacity activeOpacity={.5} onPress={() => { props.handleNext() }}>
                    <Text style={{ ...styles.btnText, color: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor }}>SKIP STEP</Text>
                </TouchableOpacity>
                <View style={styles.btnContainer}>
                    <TouchableOpacity activeOpacity={.5} onPress={() => { props.handlePrevious() }} style={{ ...styles.btnStyle, borderColor: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor }}>
                        <Text style={{ ...styles.btnText, color: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor }}>BACK</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.5} onPress={() => { props.handleNext() }} style={{ ...styles.btnStyle, marginLeft: 15, borderColor: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor, backgroundColor: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor }}>
                        <Text style={{ ...styles.btnText }}>NEXT</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <AddNewTreatmentModal selectedCircle={selectedCircle} modalVisible={modalVisible} setModalVisible={setModalVisible} />
        </View>
    )
}
const styles = StyleSheet.create({
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    btnStyle: {
        paddingVertical: 8,
        // paddingHorizontal: 25,
        borderRadius: 15,
        borderWidth: 1,
        width: Dimensions.get('screen').width < 370 ? 70 : 120,
        backgroundColor: colors.secondary
    },
    btnText: {
        textAlign: "center",
        fontSize: 14,
        textAlignVertical: 'center',
        color: colors.secondary,
        fontWeight: '600'
    },
    headerContent: {
        padding: 20
    },
    mainHeader: {
        textAlign: 'center',
        fontSize: 24,
        marginBottom: 10,
        letterSpacing: .5,
        fontWeight: '600'
    },
    container: {
        padding: 20
    },
    inputHolder: {
        marginVertical: 5,
    },
    label: {
        marginBottom: 5,
        fontWeight: "500",
        textAlign: 'center'
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
        marginBottom: 7,
        textAlign: 'center'
    },
    optional: {
        fontStyle: 'italic',
        color: '#6d6d6d'
    }
})

export default AddTreatments
