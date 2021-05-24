import React from 'react'
import { StyleSheet, View, ScrollView, Text, Image, Alert } from 'react-native'
import Links from '../../components/homeScreen/links'
import { useDispatch, useSelector } from 'react-redux'
import colors from '../../constants/colors'
import { closeAccount, toggleToCircleView } from '../../redux/actions/homeScreenActions'
import fonts from '../../constants/fonts'

const AccountSettingsScreen = (props: any) => {
    const dispatch = useDispatch()

    const { selectedCircle, myProfileInfo } = useSelector((state: any) => state.app);

    const color: string = selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor
    const userInfo: any = myProfileInfo?.user_info;

    const closeAccountAction = async () => {
        try {
            await dispatch(closeAccount(selectedCircle.id))
            dispatch(toggleToCircleView())
        } catch (error) {
            Alert.alert(error.message)
        }
    }

    return (
        <ScrollView style={styles.screen}>
            <View style={styles.container}>
                <View style={styles.box1}>
                    <View style={styles.imageHolder}>
                        <Image source={{ uri: userInfo.url }} style={styles.image} />
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.infoHeader}>{userInfo.first_name} {userInfo.last_name}</Text>
                        <Text style={styles.infoContent}>{userInfo.display_name}</Text>
                        <Text style={styles.infoContent}>{userInfo.gender}</Text>
                        <Text style={styles.infoContent}>{userInfo.email}</Text>
                    </View>
                </View>
                <View style={styles.box2}>
                    <Text style={{
                        fontSize: 16,
                        marginBottom: 10,
                        fontFamily: fonts.LATO_BOLD
                    }} >CLOSE YOUR ACCOUNT</Text>
                    <Text
                        style={{
                            marginBottom: 5,
                            lineHeight: 18,
                            letterSpacing: .3,
                            fontFamily: fonts.LATO_REGULAR
                        }}
                    >Closing your account will disable your profile and remove your initials from comments you posted. Some information may still be visible to others, such as reviews you have given.</Text>
                    <Text onPress={closeAccountAction} style={{ ...styles.btn, backgroundColor: color }}>close account</Text>
                </View>
            </View>
            <View style={styles.footer}>
                <Links color={color} />

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        minHeight: '100%',
        backgroundColor: '#f6f6f6',
    },
    footer: {
        backgroundColor: '#e4e4e4'
    },
    container: {
        margin: 20
    },
    box1: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 20,
        backgroundColor: colors.secondary,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 10
    },
    box2: {
        marginTop: 10,
        paddingHorizontal: 15,
        paddingVertical: 20,
        backgroundColor: colors.secondary,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
    },
    image: {
        height: '100%',
        width: '100%',
        resizeMode: "cover",
    },
    imageHolder: {
        borderRadius: 50,
        height: 100,
        width: 100,
        overflow: 'hidden',
        marginRight: 10
    },
    info: {
        flex: 1
    },
    infoHeader: {
        fontSize: 18,
        fontFamily: fonts.LATO_BOLD,
        marginBottom: 5
    },
    infoContent: {
        marginBottom: 3,
        fontSize: 16,
        fontFamily: fonts.LATO_REGULAR
    },
    btn: {
        marginVertical: 20,
        paddingHorizontal: 10,
        paddingVertical: 12,
        textAlign: 'center',
        textAlignVertical: 'center',
        marginHorizontal: 20,
        borderRadius: 20,
        textTransform: 'uppercase',
        color: colors.secondary,
        overflow: 'hidden',
        fontFamily: fonts.LATO_REGULAR
    }
})

export default AccountSettingsScreen
