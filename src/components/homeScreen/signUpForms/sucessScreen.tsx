import React from 'react'
import { Portal, Dialog } from 'react-native-paper'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { View, Text, TouchableOpacity, Alert, Dimensions } from 'react-native'
import colors from '../../../constants/colors'
import { useSelector, useDispatch } from 'react-redux'
import { resendVerificationEmail, isUserActive, updateSnackMessage, logout } from '../../../redux/actions/homeScreenActions'
import { CommonActions } from '@react-navigation/native';

const SucessScreen = (props: any) => {
    const { userData, isLoggedIn } = useSelector((state: any) => state.app)

    const [isVisible, setIsVisible] = React.useState(false);

    const dispatch = useDispatch()

    React.useEffect(() => {
        if (props.visible) {
            (async () => {
                const isactive = await isUserActive({ email: userData.email })
                if (isactive || isLoggedIn) {
                    setIsVisible(false)
                    hideDialog()
                } else {
                    setIsVisible(true)
                }
            })()
        }
    }, [userData, props.visible])

    const resendEmail = async () => {
        try {
            await resendVerificationEmail({ email: userData.email })
            dispatch(updateSnackMessage('Re-sent successfully'));
        } catch (error) {
            Alert.alert('Oops', error.message);
        }
    }

    const hideDialog = () => {
        props.setVisible(false)
        // if (!isLoggedIn) {
        dispatch(logout(false))
        props.navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                    {
                        name: 'LandingScreen',
                    },
                    {
                        name: 'CircleLogin'
                    }
                ],
            })
        );
        // } else {
        //     props.navigation.dispatch(
        //         CommonActions.reset({
        //             index: 0,
        //             routes: [
        //                 {
        //                     name: 'LandingScreen',
        //                 }
        //             ],
        //         })
        //     );
        // }
    }

    return (
        <Portal>
            <Dialog style={{ backgroundColor: colors.mainColor }} visible={isVisible && props.visible} onDismiss={hideDialog}>
                <Dialog.Content style={{ padding: 30 }}>
                    <View style={{ backgroundColor: "#21d35a", width: 50, height: 50, alignSelf: 'center', borderRadius: 40, justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialIcons name="mail" size={35} color={'white'} />
                    </View>
                    <Text style={{ alignSelf: 'center', marginVertical: 20, marginHorizontal: 40, backgroundColor: colors.secondary, borderRadius: 10, padding: 10, minWidth: 200, textAlign: 'center' }}>{userData.email}</Text>
                    <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: 'center', marginVertical: 5, marginHorizontal: 10, color: colors.secondary }}>You are yet to confirm your email address!</Text>
                    <Text style={{ textAlign: 'center', marginVertical: 5, marginHorizontal: 10, color: colors.secondary }}>In order to perform this action, please check your email and click on the link to verify your account.</Text>
                    <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center', marginVertical: 15 }}>
                        <TouchableOpacity activeOpacity={.5} onPress={() => { hideDialog() }} style={{ width: "30%", paddingVertical: 10, paddingHorizontal: Dimensions.get('screen').width < 370 ? 0 : 24, borderRadius: 30, borderWidth: 1, borderColor: colors.secondary }}>
                            <Text style={{ textAlign: 'center', fontWeight: "500", color: colors.secondary }}>Close</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={.5} onPress={() => { resendEmail() }} style={{ width: "68%", paddingVertical: 10, paddingHorizontal: 24, borderRadius: 30, borderWidth: 1, borderColor: colors.secondary }}>
                            <Text style={{ textAlign: 'center', overflow: 'hidden', fontWeight: "500", color: colors.secondary }}>Resend Confirmation Email</Text>
                        </TouchableOpacity>
                    </View>
                </Dialog.Content>
            </Dialog>
        </Portal>
    )
}

export default SucessScreen
