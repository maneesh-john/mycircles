import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign';
import fonts from '../../constants/fonts';

const Drawer = ({ header, body }: any) => {
    const [show, setshow] = useState<boolean>(false)
    return (
        <View style={styles.drawer}>
            <TouchableOpacity activeOpacity={.8} onPress={() => { setshow(!show) }} style={styles.drawerHeader}>
                <Text style={styles.drawerTitle}>{header}</Text>
                <AntDesign name={show ? "up" : "down"} size={20} color={'#333'} />
            </TouchableOpacity>
            {show && <Text style={styles.drawerBody}>{body}</Text>}
        </View>
    )
}
const styles = StyleSheet.create({
    drawer: {
        backgroundColor: '#F3F7FD'
    },
    drawerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 22,
        paddingHorizontal: 30
    },
    drawerTitle: {
        fontSize: 20,
        fontFamily: fonts.LATO_BOLD,
        color: '#333'
    },
    drawerBody: {
        paddingHorizontal: 30,
        fontSize: 16,
        fontFamily: fonts.LATO_REGULAR,
        color: '#333',
        paddingBottom: 22
    },
})
export default Drawer
