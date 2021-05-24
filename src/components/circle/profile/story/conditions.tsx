import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import colors from '../../../../constants/colors'
import EditConditionsModal from './editConditions'
import fonts from '../../../../constants/fonts'

const AdditionalConditions = (props: any) => {
    const info = Array.isArray(props.userAbout)
    ? props.userAbout[0]
    : props.userAbout?.user_info;
    const [modalVisible, setmodalVisible] = useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>ADDITIONAL CONDITIONS ({info?.add_conditions?.length})</Text>
                {props.isOtherProfile ? null : <AntDesign name="edit" onPress={() => setmodalVisible(true)} size={18} color={colors.secondary} style={{ ...styles.edit, backgroundColor: props.color }} />}
            </View>
            {info?.add_conditions?.length ? <View style={styles.contentHolder}>
                {info?.add_conditions?.map((condition: any) => (
                    <View key={condition} style={styles.content}>
                        <Entypo name="dot-single" size={20} color={props.color} />
                        <Text style={styles.value}>{condition}</Text>
                    </View>
                ))}
            </View> : null}
            <EditConditionsModal info={info} setmodalVisible={setmodalVisible} modalVisible={modalVisible} color={props.color} />
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
        fontFamily: fonts.LATO_REGULAR,
        textTransform: 'capitalize',
        flex: 1,
    }
})

export default AdditionalConditions
