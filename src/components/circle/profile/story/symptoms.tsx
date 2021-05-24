import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import colors from '../../../../constants/colors'
import EditSymptomsModal from './editSymptomsModal'
import fonts from '../../../../constants/fonts'

const TypeOfSymptoms = (props: any) => {
    const info = Array.isArray(props.userAbout)
    ? props.userAbout[0]
    : props.userAbout?.user_info;
    const [modalVisible, setmodalVisible] = useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>TYPES OF SYMPTOMS ({info?.symptoms?.length})</Text>
                {props.isOtherProfile ? null : <AntDesign name="edit" onPress={() => setmodalVisible(true)} size={18} color={colors.secondary} style={{ ...styles.edit, backgroundColor: props.color }} />}
            </View>
            {info?.symptoms?.length ? <View style={styles.contentHolder}>
                {info?.symptoms?.map((symptom: any) => (
                    <View key={symptom.id} style={styles.content}>
                        <Entypo name="dot-single" size={20} color={props.color} />
                        <Text style={styles.value}>{symptom.display_name}</Text>
                    </View>
                ))}
            </View> : null}
            {info?.other_symptoms?.length ? <View style={styles.contentHolder}>
                {info?.other_symptoms?.map((symptom: any) => (
                    <View key={symptom.id} style={styles.content}>
                        <Entypo name="dot-single" size={20} color={props.color} />
                        <Text style={styles.value}>{symptom.display_name}</Text>
                    </View>
                ))}
            </View> : null}
            <EditSymptomsModal setmodalVisible={setmodalVisible} modalVisible={modalVisible} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    headerText: {
        fontSize: 17,
        fontFamily: fonts.LATO_BOLD,
        flex: 1,
        color: '#333'

    },
    edit: {
        height: 30,
        width: 30,
        backgroundColor: 'pink',
        padding: 5,
        overflow: 'hidden',
        textAlign: 'center',
        borderRadius: 15,
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
        textTransform: 'capitalize',
        fontFamily: fonts.LATO_REGULAR
    }
})

export default TypeOfSymptoms
