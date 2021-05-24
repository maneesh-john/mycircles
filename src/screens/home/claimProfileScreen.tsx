import React from 'react'
import { View, Text, ScrollView, StyleSheet, Linking } from 'react-native'
import { useSelector } from 'react-redux'
import colors from '../../constants/colors'
import fonts from '../../constants/fonts'
import Drawer from '../../components/common/drawer';

const ClaimProfileScreen = (props: any) => {
    const selectedCircle: any = useSelector((state: any) => state.app.selectedCircle)
    const color = selectedCircle?.color_code ? selectedCircle?.color_code : colors.mainColor;
    const type = props.route.params?.selectedCategory?.id;
    return (
        <ScrollView contentContainerStyle={styles.screen}>
            <Drawer
                header="Not sure if i claimed the profile"
                body="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam earum iste ea reiciendis numquam ratione laboriosam eius officiis modi vel sunt debitis magni, amet nobis velit consequuntur minus error accusantium?"
            />
            <View style={styles.container}>
                <Text style={styles.header}>Welcome to {selectedCircle.condition_type} Circle</Text>
                <Text style={styles.subheader}>To access MyCircles as an Administrator, you need to have a claimed {type == 'nfc' ? 'Non For Profit' : type} profile on DoveMed. </Text>
                <Text onPress={() => {
                    props.navigation.navigate("AdminLogin", {
                        selectedCategory: props.route.params?.selectedCategory
                    })
                }} style={[styles.btn, { borderColor: color }]}>I have a claimed profile</Text>
                <Text onPress={() => { Linking.openURL(`https://dovemed.com`) }} style={[styles.btn, { borderColor: color }]}>I want to claim my profile</Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: colors.secondary,
        minHeight: '100%'
    },
    container: {
        padding: 15,
        alignItems: 'center'
    },
    header: {
        fontFamily: fonts.LATO_BOLD,
        color: '#333',
        paddingBottom: 10,
        fontSize: 24,
        textAlign: 'center'
    },
    subheader: {
        fontFamily: fonts.LATO_REGULAR,
        color: '#333',
        paddingBottom: 15,
        fontSize: 16,
        textAlign: 'center'
    },
    btn: {
        marginTop: 15,
        width: '100%',
        paddingVertical: 13,
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 22,
        fontFamily: fonts.LATO_BOLD,
        fontSize: 15,
        color: '#333',
        textAlign: 'center',
        overflow: 'hidden'
    }
})

export default ClaimProfileScreen
