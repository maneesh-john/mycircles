import React from 'react'
import { View, ScrollView, Text, StyleSheet, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import ProviderCard from '../../components/circle/providers/providerCard';
import { loginAction } from '../../redux/actions/homeScreenActions';
import { CommonActions } from '@react-navigation/native';

const AdminSelection = (props: any) => {
    const selectedCircle: any = useSelector((state: any) => state.app.selectedCircle)
    const color = selectedCircle?.color_code ? selectedCircle?.color_code : colors.mainColor;
    const type = props.route.params?.selectedCategory?.id;
    const info = props.route.params?.info;
    const userinfo = props.route.params?.userinfo;
    const dispatch = useDispatch()

    const login = async () => {
        try {
            await dispatch(loginAction(userinfo))
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                        {
                            name: 'LandingScreen',
                        }
                    ],
                })
            );
        } catch (error) {
            Alert.alert('Oops', error.message)
        }
    }

    return (
        <ScrollView style={styles.screen}>
            <View style={styles.container}>
                <Text style={styles.header} >You are logged in as an administrator for</Text>
                <View style={styles.cardHolder}>
                    <ProviderCard type={type} hide={true} info={info} color={color} selectedCircle={selectedCircle} />

                </View>
                <Text style={[styles.link, { color }]}>This is not my {type == 'nfc' ? 'Non For Profit' : type}.</Text>
                <View style={styles.btnContainer}>
                    <Text onPress={() => { props.navigation.goBack() }} style={[styles.btn, { borderColor: color, color }]}>back</Text>
                    <Text onPress={login} style={[styles.btn, { borderColor: color, backgroundColor: color, color: colors.secondary }]}>next</Text>
                </View>
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
    },
    cardHolder: {
        marginHorizontal: -15
    },
    header: {
        fontFamily: fonts.LATO_BOLD,
        color: '#333',
        textAlign: 'center',
        paddingBottom: 10,
        fontSize: 24
    },
    link: {
        fontFamily: fonts.LATO_REGULAR,
        fontSize: 14,
        textDecorationLine: 'underline'
    },
    btnContainer: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "flex-end"
    },
    btn: {
        marginLeft: 15,
        marginTop: 70,
        paddingVertical: 10,
        borderWidth: 1,
        minWidth: 120,
        paddingHorizontal: 10,
        borderRadius: 22,
        fontFamily: fonts.LATO_BOLD,
        fontSize: 15,
        textAlign: 'center',
        overflow: 'hidden',
        textTransform: 'uppercase'
    }
})
export default AdminSelection
