import React, { useState, useRef, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import colors from '../../constants/colors'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { validate } from '../../utils/validations';
import { useDispatch, useSelector } from 'react-redux';
import { loginCheck } from '../../redux/actions/homeScreenActions'
import fonts from '../../constants/fonts';

const AdminLogin = (props: any) => {
    const dispatch = useDispatch()
    const selectedCircle: any = useSelector((state: any) => state.app.selectedCircle)
    const color = selectedCircle?.color_code ? selectedCircle?.color_code : colors.mainColor;

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [pwdVisible, setpwdVisible] = useState(false)
    const [error, setError] = useState<any>({
        email: '',
        password: ''
    })
    const firstTextInputRef = useRef<any>(null);
    const refCallback = (textInputRef: any) => (node: any) => {
        textInputRef.current = node;
    };

    useEffect(() => {
        if (error.email || error.password) {
            if (email && email.length) {
                setError((prevState: any) => {
                    const state = { ...prevState }
                    state.email = "";
                    return state
                })
            }
            if (password && password.length) {
                setError((prevState: any) => {
                    const state = { ...prevState }
                    state.password = "";
                    return state;
                })
            }
        }
    }, [email, password])

    const validateRequest = (): boolean => {
        let valid: boolean = true;
        if (!(email && email.length)) {
            setError((prevState: any) => {
                const state = { ...prevState }
                state.email = "Email is required";
                return state
            })
            valid = false;
        } else if (!validate(email, 'email')) {
            setError((prevState: any) => {
                const state = { ...prevState }
                state.email = "Invalid email";
                return state
            })
            valid = false;
        }

        if (!(password && password.length)) {
            setError((prevState: any) => {
                const state = { ...prevState }
                state.password = "Password is required";
                return state;
            })
            valid = false;
        }
        //  else if (!validate(password, 'password')) {
        //     setError((prevState: any) => {
        //         const state = { ...prevState }
        //         state.password = "Password must be minimum of 8 character";
        //         return state;
        //     })
        //     valid = false;
        // }
        return valid;
    }

    const login = async () => {
        const isValid: boolean = validateRequest();
        if (isValid) {
            try {
                let url = "checkhospital";
                if (props.route.params?.selectedCategory.id === 'hospital') {
                    url = 'checkhospital'
                } else if (props.route.params?.selectedCategory.id === 'clinic') {
                    url = 'checkclinic'
                }
                const res: any = await loginCheck(url, { email, password })
                if (res && Object.keys(res).length) {
                    props.navigation.navigate("AdminSelection", {
                        selectedCategory: props.route.params?.selectedCategory,
                        info: res,
                        userinfo: { email, password }
                    })
                }
            } catch (error) {
                Alert.alert('Oops', error.message)
            }
        }
    }

    return (
        <View style={styles.screen}>
            <Text style={styles.loginText}>Log In</Text>
            <Text style={styles.loginSubText}>Log in with your administrator credentials.</Text>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.inputField}
                    placeholder="Provide Email Address"
                    placeholderTextColor="#ABABAB"
                    keyboardType='email-address'
                    maxLength={50}
                    autoCapitalize="none"
                    value={email}
                    returnKeyType={"next"}
                    onSubmitEditing={() => { (email && email.length) ? firstTextInputRef.current.focus() : null }}
                    onChangeText={(value) => setEmail(value)}
                />
                <Text style={styles.error}>{error.email}</Text>
                <View style={{ flexDirection: "row", alignItems: 'center' }}>
                    <TextInput
                        style={styles.inputField}
                        placeholder="Provide Password"
                        placeholderTextColor="#ABABAB"
                        secureTextEntry={!pwdVisible}
                        keyboardType='default'
                        value={password}
                        returnKeyType="done"
                        autoCapitalize="none"
                        ref={refCallback(firstTextInputRef)}
                        onChangeText={(value) => setPassword(value)}
                    />
                    <Icon onPress={() => setpwdVisible(!pwdVisible)} style={{ marginLeft: "-10%", marginTop: 5 }} name={pwdVisible ? "eye" : "eye-slash"} size={16} />
                </View>
                <Text style={styles.error}>{error.password}</Text>
            </View>
            <TouchableOpacity activeOpacity={.5} style={[styles.loginBtn, { backgroundColor: color }]} onPress={login}>
                <Text style={styles.btnText}>Login</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    screen: {
        backgroundColor: colors.secondary,
        paddingHorizontal: 40,
        minHeight: '100%'
    },
    loginText: {
        fontSize: 24,
        fontFamily: fonts.LATO_BOLD,
        textAlign: 'center',
        paddingTop: 40,
        paddingBottom: 10,
        color: '#333'
    },
    loginSubText: {
        fontSize: 16,
        fontFamily: fonts.LATO_REGULAR,
        textAlign: 'center',
        color: '#333'
    },
    formContainer: {
        marginTop: 45,
        marginBottom: 5
    },
    inputField: {
        marginTop: 10,
        marginBottom: 5,
        backgroundColor: colors.secondary,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 10,
        fontFamily: fonts.LATO_REGULAR,
        width: "100%",
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#dddddd'
    },
    loginBtn: {
        marginHorizontal: "15%",
        marginVertical: 20,
        borderRadius: 30,
        paddingHorizontal: 24,
        paddingVertical: 11
    },
    btnText: {
        color: colors.secondary,
        fontSize: 16,
        textAlign: 'center',
        fontFamily: fonts.LATO_REGULAR,
        textTransform: 'uppercase'
    },
    error: {
        marginBottom: 5,
        fontSize: 13,
        fontWeight: '600',
        color: 'red'
    }
})
export default AdminLogin
