import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import colors from '../../constants/colors'
import { LOGO } from '../../constants/config'
import fonts from '../../constants/fonts'

const Links = (props: any) => {
    return (
        <>
            {/* <View style={styles.links}>
                <View style={styles.link}>
                    <Text style={styles.linkHeader}>Quick Links</Text>
                    <TouchableOpacity activeOpacity={.5}><Text style={{ ...styles.linkTitle, color: props.color ? props.color : colors.mainColor }}>About</Text></TouchableOpacity>
                    <TouchableOpacity activeOpacity={.5}><Text style={{ ...styles.linkTitle, color: props.color ? props.color : colors.mainColor }}>Partnerships</Text></TouchableOpacity>
                    <TouchableOpacity activeOpacity={.5}><Text style={{ ...styles.linkTitle, color: props.color ? props.color : colors.mainColor }}>FAQ</Text></TouchableOpacity>
                    <TouchableOpacity activeOpacity={.5}><Text style={{ ...styles.linkTitle, color: props.color ? props.color : colors.mainColor }}>Contact Us</Text></TouchableOpacity>
                </View>
                <View style={styles.link}>
                    <Text style={styles.linkHeader}>Our networks</Text>
                    <TouchableOpacity activeOpacity={.5}><Text style={{ ...styles.linkTitle, color: props.color ? props.color : colors.mainColor }}>MyIBSCircle</Text></TouchableOpacity>
                    <TouchableOpacity activeOpacity={.5}><Text style={{ ...styles.linkTitle, color: props.color ? props.color : colors.mainColor }}>MyAutismCircle</Text></TouchableOpacity>
                    <TouchableOpacity activeOpacity={.5}><Text style={{ ...styles.linkTitle, color: props.color ? props.color : colors.mainColor }}>MyDiabetesCircle</Text></TouchableOpacity>
                    <TouchableOpacity activeOpacity={.5}><Text style={{ ...styles.linkTitle, color: props.color ? props.color : colors.mainColor }}>MyMSCircle</Text></TouchableOpacity>
                    <TouchableOpacity activeOpacity={.5}><Text style={{ ...styles.linkTitle, color: props.color ? props.color : colors.mainColor }}>MyObesityCircle</Text></TouchableOpacity>
                    <TouchableOpacity activeOpacity={.5}><Text style={{ ...styles.linkTitle, color: props.color ? props.color : colors.mainColor }}>MyDepressionCircle</Text></TouchableOpacity>
                    <TouchableOpacity activeOpacity={.5}><Text style={{ ...styles.linkTitle, color: props.color ? props.color : colors.mainColor }}>MyFibroCircle</Text></TouchableOpacity>
                    <TouchableOpacity activeOpacity={.5}><Text style={{ ...styles.linkTitle, color: props.color ? props.color : colors.mainColor }}>MyLupusCircle</Text></TouchableOpacity>
                    <TouchableOpacity activeOpacity={.5}><Text style={{ ...styles.linkTitle, color: props.color ? props.color : colors.mainColor }}>MyFoodAlergyCircle</Text></TouchableOpacity>
                    <TouchableOpacity activeOpacity={.5}><Text style={{ ...styles.linkTitle, color: props.color ? props.color : colors.mainColor }}>MyEpilepsyCircl</Text></TouchableOpacity>
                </View>
            </View> */}
            <View style={{ ...styles.footer, backgroundColor: props.color ? props.color : colors.mainColor }}>
                <Image source={{ uri: LOGO }} style={styles.logo} />
                <Text style={styles.footerText}>© 2018 MyHealthCircles. All rights reserved.</Text>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    links: {
        flexDirection: 'row',
        paddingTop: 60,
        paddingBottom: 30,
        paddingHorizontal: 17
    },
    link: {
        flex: 1
    },
    linkHeader: {
        color: '#000000',
        fontSize: 16,
        fontFamily:fonts.LATO_BOLD,
        marginBottom: 15,
        letterSpacing: .3
    },
    linkTitle: {
        color: colors.mainColor,
        fontSize: 14,
        fontFamily:fonts.LATO_REGULAR,
        marginBottom: 5,
        letterSpacing: .3
    },footer: {
        backgroundColor: colors.mainColor,
        paddingVertical: 25,
        paddingHorizontal: 17,
    },
    logo: {
        height: 40,
        resizeMode: "contain",
        width: 130,
    },
    footerText: {
        marginTop: 20,
        letterSpacing: .5,
        fontFamily:fonts.LATO_REGULAR,
        color: colors.secondary
    }
})

export default Links
