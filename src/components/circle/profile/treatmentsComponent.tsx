import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import colors from '../../../constants/colors'
import { useSelector, useDispatch } from 'react-redux';
import AddNewTreatmentModal from '../../homeScreen/signUpForms/addNewTreatmentModal'
import Entypo from 'react-native-vector-icons/Entypo'
import { getAbout } from '../../../redux/actions/profileActions';
import fonts from '../../../constants/fonts';

const TreatmentsComponent = (props: any) => {
    const { selectedCircle, userData, userProfileInfo, isOtherProfile } = props;
    const { userAbout } = useSelector((state: any) => state.profile);
    const info = userAbout[0];
    const color = selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor;

    const [modalVisible, setModalVisible] = useState(false);

    const dispatch = useDispatch()

    useEffect(() => {
        if (userProfileInfo?.user_info?.id && selectedCircle.id) {
            dispatch(getAbout(userProfileInfo?.user_info.id, selectedCircle.id, props.role, isOtherProfile))
        }
    }, [selectedCircle, userProfileInfo])

    React.useEffect(() => {
        const unsubscribe = props.navigator.addListener('focus', () => {
            if (userProfileInfo?.user_info?.id && selectedCircle.id) {
                dispatch(getAbout(userProfileInfo?.user_info.id, selectedCircle.id, props.role, isOtherProfile))
            }
        });
        return unsubscribe;
      }, [props.navigator]);
    

    const getColor = (id: number | string): string => {
        switch (id) {
            case '0': return 'red';
            case '50': return 'orange';
            case '100': return 'green';
            default: return 'red'
        }
    }
    return (
        <View style={styles.container}>
            {isOtherProfile ? null : <Text onPress={() => { setModalVisible(true) }} style={{ ...styles.button, backgroundColor: color }}>Add Treatment</Text>}

            {isOtherProfile ?
                <View style={styles.timeline}>
                    <Text style={styles.timelineHeader}>timeline</Text>
                    {info?.treatment?.map((_item: any) => (
                        <View style={{ ...styles.timelineItem, borderColor: getColor(_item.effectiveness) }} key={_item.id}>
                            <Text style={styles.timelineText}>{_item.treatment[0].display_name}</Text>
                        </View>
                    ))}
                </View> :
                <>
                    {info?.treatment?.length ? <View style={styles.box}>
                        {/* <View style={styles.graphContainer}></View> NOT IMPLEMENTED */} 
                        <View style={styles.subContainer}>
                            <Text style={styles.subheader}>Effectiveness:</Text>
                            {info?.treatment.map((treatment: any) => (
                                <Text key={treatment.id} style={{ ...styles.itemHolder, backgroundColor: getColor(treatment.effectiveness) }}>{treatment.effectiveness}</Text>
                            ))}
                        </View>
                        <View style={styles.subContainer}>
                            <Text style={styles.subheader}>Side Effects:</Text>
                            {info?.treatment.map((treatment: any) => (
                                treatment.side_effects.map((item: any) => (
                                    <Text key={treatment.id} style={{ ...styles.itemHolder, backgroundColor: getColor(treatment.effectiveness) }}>{item}</Text>
                                ))
                            ))}
                        </View>
                    </View> : null}

                    {info?.symptoms?.length || info?.other_symptoms?.length ? <View style={styles.box}>
                        <Text style={styles.header}>symptoms</Text>
                        {info?.symptoms?.length ? <View style={styles.contentHolder}>
                            {info?.symptoms?.map((symptom: any) => (
                                <View key={symptom.id} style={styles.content}>
                                    <Entypo name="dot-single" size={20} color={color} />
                                    <Text style={styles.value}>{symptom.display_name}</Text>
                                </View>
                            ))}
                        </View> : null}
                        {info?.other_symptoms?.length ? <View style={styles.contentHolder}>
                            {info?.other_symptoms?.map((symptom: any) => (
                                <View key={symptom.id} style={styles.content}>
                                    <Entypo name="dot-single" size={20} color={color} />
                                    <Text style={styles.value}>{symptom.display_name}</Text>
                                </View>
                            ))}
                        </View> : null}
                    </View> : null}
                </>}

            <AddNewTreatmentModal modalVisible={modalVisible} setModalVisible={setModalVisible} edit={true} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    button: {
        alignSelf: 'flex-end',
        marginVertical: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        textTransform: 'uppercase',
        borderRadius: 20,
        color: colors.secondary,
        overflow: 'hidden',
        fontFamily: fonts.LATO_REGULAR,
    },
    header: {
        textTransform: 'uppercase',
        fontSize: 18,
        fontFamily: fonts.LATO_BOLD,
        marginHorizontal: 10,
        marginBottom: 10
    },
    graphContainer: {
        minHeight: 200
    },
    subContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        paddingVertical: 10
    },
    subheader: {
        fontSize: 16,
        fontFamily: fonts.LATO_BOLD,
        marginRight: 10,
        letterSpacing: .3,
        width: '100%'
    },
    itemHolder: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        textAlign: 'center',
        borderRadius: 10,
        color: colors.secondary,
        margin: 3,
        overflow: 'hidden',
        fontFamily: fonts.LATO_REGULAR,
    },
    box: {
        borderRadius: 10,
        padding: 15,
        backgroundColor: colors.secondary,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
        overflow: 'hidden',
        marginBottom: 20
    },
    contentHolder: {

    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },
    value: {
        color: '#333',
        fontFamily: fonts.LATO_REGULAR,
        textTransform: 'capitalize'
    },
    timeline: {
        borderRadius: 10,
        padding: 15,
        backgroundColor: colors.secondary,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
        overflow: 'hidden',
    },
    timelineHeader: {
        textTransform: 'uppercase',
        fontFamily: fonts.LATO_BOLD,
        fontSize: 18,
        marginBottom: 10
    },
    timelineItem: {
        padding: 15,
        borderRadius: 15,
        borderWidth: 1,
        marginVertical: 5
    },
    timelineText: {
        textTransform: 'uppercase',
        fontSize: 15,
        fontFamily: fonts.LATO_REGULAR,
    },
})

export default TreatmentsComponent
