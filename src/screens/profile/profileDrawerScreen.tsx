import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import colors from '../../constants/colors'
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/homeScreenActions';
import fonts from '../../constants/fonts';

const PofileDrawerScreen = (props: any) => {
    const dispatch = useDispatch()
    const { selectedCircle, myProfileInfo } = useSelector((state: any) => state.app);
    const color: string = selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor

    const logOutAction = () => {
        dispatch(logout())
    }

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <View style={styles.imgContainer}>
                    <Image source={{ uri: myProfileInfo?.user_info?.url }} style={styles.img}></Image>
                </View>
                <Text style={styles.name}>{myProfileInfo?.user_info?.role === 'doctor' ? `${myProfileInfo?.user_info?.first_name} ${myProfileInfo?.user_info?.last_name}` : myProfileInfo?.user_info?.display_name}</Text>
            </View>
            <View style={styles.navContainer}>
                <Text onPress={() => { props.navigation.navigate('MyProfile') }} style={styles.navItem}>My profile</Text>
                <Text onPress={() => { props.navigation.navigate('YourActivity') }} style={styles.navItem}>Your Activity</Text>
                <Text onPress={() => { props.navigation.navigate('AccountSettings') }} style={styles.navItem}>Account settings</Text>
                <Text onPress={() => { props.navigation.navigate('NotificationSettings') }} style={styles.navItem}>notification settings</Text>
            </View>
            <View style={styles.btnContainer}>
                <TouchableOpacity activeOpacity={.7} onPress={logOutAction} style={{ ...styles.btn, backgroundColor: color }} >
                    <Text style={styles.btnText}>Log out</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.secondary
    },
    header: {
        paddingVertical: 10,
        borderBottomColor: '#333',
        borderBottomWidth: .5,
        flexDirection: "row",
        alignItems: 'center'
    },
    imgContainer: {
        height: 80,
        width: 80,
        borderRadius: 40,
        overflow: "hidden",
        marginRight: 10
    },
    img: {
        height: "100%",
        width: "100%",
        resizeMode: "cover",
        backgroundColor: '#f6f6f6'
    },
    name: {
        fontSize: 18,
        textTransform: 'uppercase',
        fontFamily: fonts.LATO_REGULAR,
        fontWeight: '500',
        flex: 1
    },
    navContainer: {
        paddingVertical: 20,
        borderBottomColor: '#333',
        borderBottomWidth: .5,
        paddingHorizontal: 15
    },
    navItem: {
        fontSize: 15,
        paddingVertical: 15,
        textTransform: 'uppercase',
        fontFamily: fonts.LATO_REGULAR,
        letterSpacing: .5,
    },
    btnContainer: {
        paddingVertical: 60,
        alignItems: 'center'
    },
    btn: {
        width: 180,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 20,
        overflow: 'hidden'
    },
    btnText: {
        color: colors.secondary,
        textTransform: 'uppercase',
        fontSize: 16,
        width: '100%',
        textAlign: 'center',
        fontFamily: fonts.LATO_REGULAR,
    },
})

export default PofileDrawerScreen
