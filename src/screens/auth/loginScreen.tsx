import React, { useState, useRef } from 'react'
import { View, StyleSheet, Image, Text, ScrollView, TouchableOpacity, Keyboard } from 'react-native'
import colors from '../../constants/colors'
import { Button, RadioButton } from 'react-native-paper'
import { TextInput } from 'react-native-gesture-handler'
import AntDesign from 'react-native-vector-icons/AntDesign';
// import {
//     GoogleSignin,
//     statusCodes,
// } from '@react-native-community/google-signin';
//import { LoginManager, GraphRequestManager, GraphRequest, AccessToken } from "react-native-fbsdk";
import { LOGO } from '../../constants/config'

// GoogleSignin.configure({
//     webClientId: '550967689592-24vahn0vn6nh3q20m1q0aocnueqm48c4.apps.googleusercontent.com',
//     offlineAccess: true,
//     hostedDomain: '',
//     loginHint: '',
//     forceCodeForRefreshToken: true,
//     accountName: '',
//     // iosClientId: '<FROM DEVELOPER CONSOLE>', 
// });

export const LoginScreen = () => {
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const firstTextInputRef = useRef<any>(null);

    const refCallback = (textInputRef: any) => (node: any) => {
        textInputRef.current = node;
    };

    const loginHandler = () => {
        Keyboard.dismiss()
    }

    // Create a graph request asking for user information with a callback to handle the response.
    const fbLogin = () => {
        let token;
        const responseCallback = ((error: any, result: any) => {
            if (error) {
                console.log(error)
            } else {
                console.log(result)
            }
        })
        const profileRequestParams = {
            fields: {
                string: 'id, name, email, first_name, last_name, gender'
            }
        }

        const profileRequestConfig = {
            httpMethod: 'GET',
            version: 'v2.5',
            parameters: profileRequestParams,
            accessToken: token
        }

        // const profileRequest = new GraphRequest(
        //     '/me',
        //     profileRequestConfig,
        //     responseCallback,
        // )

        // LoginManager.logInWithPermissions(["public_profile"]).then(
        //     function (result: any) {
        //         if (result.isCancelled) {
        //             console.log("Login cancelled");
        //         } else {
        //             AccessToken.getCurrentAccessToken().then(
        //                 (data: any) => {
        //                     token = data.accessToken.toString();
        //                     new GraphRequestManager().addRequest(profileRequest).start();
        //                 }
        //             )
        //         }
        //     },
        //     function (error:any) {
        //         console.log("Login fail with error: " + error);
        //     }
        // );
    }

    const googleSignIn = async () => {
        // try {
        //     await GoogleSignin.hasPlayServices();
        //     const userInfo = await GoogleSignin.signIn();
        //     console.log(userInfo);
        // } catch (error) {
        //     console.log(error)
        //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        //         // user cancelled the login flow
        //     } else if (error.code === statusCodes.IN_PROGRESS) {
        //         // operation (e.g. sign in) is in progress already
        //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        //         // play services not available or outdated
        //     } else {
        //         // some other error happened
        //     }
        // }
    };

    return (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.screen}>
            <View style={styles.logoContainer}>
                <Image source={{ uri: LOGO }} style={styles.logo} />
            </View>
            <View style={styles.socialLogins}>
                <Text style={styles.socialLoginText}>connect with</Text>
                <View style={styles.socialLoginContainer}>
                    <TouchableOpacity activeOpacity={.7} style={styles.socialLoginOption} onPress={fbLogin}>
                        <Text>fb</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.7} style={styles.socialLoginOption} onPress={googleSignIn}>
                        <Text>gPlus</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.7} style={styles.socialLoginOption}>
                        <Text>linkdIn</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.loginContainer}>
                <Text style={styles.loginHeader}>Or sign in using email</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>email</Text>
                    <View style={styles.inputHolder}>
                        <AntDesign style={{ left: 10, alignSelf: 'center' }} name="user" color={colors.secondary} size={14} />
                        <TextInput
                            style={styles.inputBox}
                            keyboardType='email-address'
                            maxLength={50}
                            value={email}
                            returnKeyType="next"
                            onSubmitEditing={() => { firstTextInputRef.current.focus(); }}
                            onChangeText={(value) => setEmail(value)}
                        />
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>password</Text>
                    <View style={styles.inputHolder}>
                        <AntDesign style={{ left: 10, alignSelf: 'center', transform: [{ rotate: '125deg' }] }} name="key" color={colors.secondary} size={14} />
                        <TextInput
                            style={styles.inputBox}
                            keyboardType='default'
                            value={password}
                            secureTextEntry
                            returnKeyType="done"
                            ref={refCallback(firstTextInputRef)}
                            onChangeText={(value) => setPassword(value)}
                        />
                    </View>
                </View>
                <View style={styles.actions}>
                    <View style={styles.rememberMe}>
                        <RadioButton
                            value="first"
                            status={rememberMe ? 'checked' : 'unchecked'}
                            onPress={() => setRememberMe(!rememberMe)}
                        />
                        <Text style={styles.actionsText}>Remember me</Text>
                    </View>
                    <TouchableOpacity activeOpacity={.7} style={styles.forgotPwd}>
                        <Text style={styles.actionsText}>Forgot your password?</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.btnContainer}>
                <Button accessibilityStates mode="contained" labelStyle={{ color: colors.primary, fontSize: 16 }} style={{ justifyContent: 'center', height: 40, backgroundColor: colors.secondary }} onPress={loginHandler}>LOGIN</Button>
            </View>
            <View style={styles.signUp}>
                <Text style={styles.memberText}>Not a member yet? </Text>
                <TouchableOpacity activeOpacity={.7}>
                    <Text style={styles.signUpText}>Sign up</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        minHeight: "100%",
        backgroundColor: colors.primary,
    },
    logoContainer: {
        paddingHorizontal: 40,
        marginTop: 60,
        marginBottom: 50,
    },
    logo: {
        height: 40,
        resizeMode: "contain",
    },
    btnContainer: {
        marginVertical: 50,
        paddingHorizontal: 40,
    },
    socialLogins: {},
    socialLoginText: {
        fontSize: 14,
        color: colors.secondary,
        textTransform: 'uppercase',
        textAlign: 'center'
    },
    socialLoginContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 70,
        justifyContent: 'space-between',
        marginVertical: 20
    },
    socialLoginOption: {},
    loginContainer: {

    },
    loginHeader: {
        fontSize: 14,
        color: colors.secondary,
        textTransform: 'uppercase',
        textAlign: 'center'
    },
    inputContainer: {
        paddingHorizontal: 40,
        marginTop: 30
    },
    inputLabel: {
        fontSize: 12,
        color: colors.secondary,
        textTransform: 'uppercase',
    },
    inputHolder: {
        flexDirection: 'row'
    },
    inputBox: {
        flex: 1,
        borderBottomColor: colors.secondary,
        borderBottomWidth: 1,
        margin: 0,
        paddingVertical: 3,
        color: colors.secondary,
        paddingLeft: 40,
        marginLeft: -10
    },
    actions: {
        flexDirection: 'row',
        paddingHorizontal: 40,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 15
    },
    forgotPwd: {},
    rememberMe: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    actionsText: {
        color: colors.secondary
    },
    signUp: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center'
    },
    memberText: {
        color: colors.secondary,
    },
    signUpText: {
        color: colors.secondary,
        borderColor: colors.secondary,
        borderBottomWidth: 0.8,
        paddingBottom: 1
    },
})