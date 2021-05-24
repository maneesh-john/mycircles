import React from 'react'
import { View, StyleSheet, Image, Text } from 'react-native'
import colors from '../../constants/colors'
import { Button } from 'react-native-paper'
import { LOGO } from '../../constants/config'

export const OnboardScreen = (props: any) => {
    return (
        <View style={styles.screen}>
            <View style={styles.logoContainer}>
                <Image source={{ uri: LOGO }} style={styles.logo} />
                <Text style={styles.tagline}>The social network for those living with IBS</Text>
            </View>
            <View style={styles.btnContainer}>
                <Button accessibilityStates mode="outlined" labelStyle={{ color: colors.secondary, fontSize: 16 }} style={{ marginVertical: 15, justifyContent: 'center', height: 40, borderColor: colors.secondary, borderWidth: 1 }} onPress={() => { }}>SIGN UP</Button>
                <Button accessibilityStates mode="contained" labelStyle={{ color: colors.primary, fontSize: 16 }} style={{ marginVertical: 15, justifyContent: 'center', height: 40, backgroundColor: colors.secondary }} onPress={() => { props.navigation.navigate('Login') }}>LOGIN</Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'space-between',
        overflow: "hidden",
        backgroundColor: colors.primary,
    },
    logoContainer: {
        paddingHorizontal: 40,
        marginTop: "30%"
    },
    logo: {
        height: 70,
        resizeMode: "contain",
        marginBottom: 40
    },
    tagline: {
        color: colors.secondary,
        fontSize: 24,
        textAlign: "center",
    },
    btnContainer: {
        paddingHorizontal: 40,
        marginBottom: "15%",
    },
})