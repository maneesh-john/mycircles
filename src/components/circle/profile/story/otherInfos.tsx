import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import colors from '../../../../constants/colors'
import EditOtherInfoModal from './editOtherInfoModal'
import fonts from '../../../../constants/fonts'

const OtherInformations = (props: any) => {
    const info = Array.isArray(props.userAbout)
    ? props.userAbout[0]
    : props.userAbout?.user_info;

    const [selectedItem, setselectedItem] = useState('');
    const [modalVisible, setmodalVisible] = useState(false);

    const editItem = (item: string) => {
        setselectedItem(item)
        setmodalVisible(true)
    }

    return (
        <View>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>MOST DAYS I FIND MYSELF</Text>
                    {props.isOtherProfile ? null : <AntDesign name="edit" onPress={() => { editItem('most_days_i_find_myself') }} size={18} color={colors.secondary} style={{ ...styles.edit, backgroundColor: props.color }} />}
                </View>
                <Text style={styles.value}>{info?.most_days_i_find_myself}</Text>
            </View>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>GIVEN WHAT I KNOW NOW</Text>
                    {props.isOtherProfile ? null : <AntDesign name="edit" onPress={() => { editItem('given_what_i_know_now') }} size={18} color={colors.secondary} style={{ ...styles.edit, backgroundColor: props.color }} />}
                </View>
                <Text style={styles.value}>{info?.given_what_i_know_now}</Text>
            </View>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>MY LIFE HAS CHANGED IN THIS WAY</Text>
                    {props.isOtherProfile ? null : <AntDesign name="edit" onPress={() => { editItem('my_life_has_changed_in_this_way') }} size={18} color={colors.secondary} style={{ ...styles.edit, backgroundColor: props.color }} />}
                </View>
                <Text style={styles.value}>{info?.my_life_has_changed_in_this_way}</Text>
            </View>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>WHEN I AM HAVING A BAD DAY</Text>
                    {props.isOtherProfile ? null : <AntDesign name="edit" onPress={() => { editItem('when_im_having_a_bad_day') }} size={18} color={colors.secondary} style={{ ...styles.edit, backgroundColor: props.color }} />}
                </View>
                <Text style={styles.value}>{info?.when_im_having_a_bad_day}</Text>
            </View>
            <EditOtherInfoModal info={info} setmodalVisible={setmodalVisible} selectedItem={selectedItem} modalVisible={modalVisible} color={props.color} />
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
        fontFamily: fonts.LATO_REGULAR,

    }
})

export default OtherInformations
