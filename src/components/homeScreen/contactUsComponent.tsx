import React, { useState, useRef, useEffect } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Keyboard, ScrollView, Alert } from 'react-native'
import colors from '../../constants/colors';
import Links from './links';
import { useDispatch } from 'react-redux';
import { contactUs } from '../../redux/actions/homeScreenActions';
import { validate } from '../../utils/validations';

const ContactUsComponent = () => {
    const [email, setEmail] = useState<string>('');
    const [fname, setFname] = useState<string>('');
    const [lname, setLName] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<any>({
        email: '',
        message: '',
        fname: '',
        lname: ''
    })

    const secondTextInputRef = useRef<any>(null);
    const thirdTextInputRef = useRef<any>(null);
    const fourthTextInputRef = useRef<any>(null);


    const dispatch = useDispatch()

    useEffect(() => {
        if (error.email || error.fname || error.lname || error.message) {
            if (email && email.length) {
                setError((prevState: any) => {
                    const state = { ...prevState }
                    state.email = "";
                    return state
                })
            }
            if (fname && fname.length) {
                setError((prevState: any) => {
                    const state = { ...prevState }
                    state.fname = "";
                    return state;
                })
            }
            if (lname && lname.length) {
                setError((prevState: any) => {
                    const state = { ...prevState }
                    state.lname = "";
                    return state;
                })
            }
            if (message && message.length) {
                setError((prevState: any) => {
                    const state = { ...prevState }
                    state.message = "";
                    return state;
                })
            }
        }
    }, [email, fname, lname, message])

    const refCallback = (textInputRef: any) => (node: any) => {
        textInputRef.current = node;
    };

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

        if (!(fname && fname.length)) {
            setError((prevState: any) => {
                const state = { ...prevState }
                state.fname = "First name is required";
                return state;
            })
            valid = false;
        }
        if (!(lname && lname.length)) {
            setError((prevState: any) => {
                const state = { ...prevState }
                state.lname = "Last name is required";
                return state;
            })
            valid = false;
        }
        if (!(message && message.length)) {
            setError((prevState: any) => {
                const state = { ...prevState }
                state.message = "Message is required";
                return state;
            })
            valid = false;
        }
        return valid;
    }

    const send = async () => {
        Keyboard.dismiss();
        const isvalid = validateRequest()
        if (isvalid) {
            const body = {
                email,
                first_name: fname,
                last_name: lname,
                message
            }
            try {
                await dispatch(contactUs(body))
                setEmail('')
                setFname('')
                setLName('')
                setMessage('')
            } catch (error) {
                Alert.alert(error.message)
            }
        }
    }

    return (
        <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>contact us</Text>
                </View>
                <View style={styles.formContainer}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                        style={styles.inputField}
                        placeholder="Provide first name"
                        keyboardType='default'
                        maxLength={50}
                        value={fname}
                        returnKeyType="next"
                        onSubmitEditing={() => { fname && fname.length ? secondTextInputRef.current.focus() : null }}
                        onChangeText={(value: any) => setFname(value)}
                    />
                    {error.fname ? <Text style={styles.error}>{error.fname}</Text> : null}
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                        style={styles.inputField}
                        placeholder="Provide last name"
                        keyboardType='default'
                        maxLength={50}
                        value={lname}
                        returnKeyType="next"
                        onSubmitEditing={() => { lname && lname.length ? thirdTextInputRef.current.focus() : null }}
                        ref={refCallback(secondTextInputRef)}
                        onChangeText={(value: any) => setLName(value)}
                    />
                    {error.lname ? <Text style={styles.error}>{error.lname}</Text> : null}
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={styles.inputField}
                        placeholder="Provide email"
                        keyboardType='email-address'
                        maxLength={50}
                        value={email}
                        autoCapitalize="none"
                        returnKeyType="next"
                        onSubmitEditing={() => { email && email.length ? fourthTextInputRef.current.focus() : null }}
                        ref={refCallback(thirdTextInputRef)}
                        onChangeText={(value: any) => setEmail(value)}
                    />
                    {error.email ? <Text style={styles.error}>{error.email}</Text> : null}
                    <Text style={styles.label}>Message</Text>
                    <TextInput
                        style={[styles.inputField, styles.textarea]}
                        placeholder="Provide message"
                        keyboardType='default'
                        multiline={true}
                        numberOfLines={5}
                        value={message}
                        returnKeyType="done"
                        ref={refCallback(fourthTextInputRef)}
                        onChangeText={(value: any) => setMessage(value)}
                    />
                    {error.message ? <Text style={styles.error}>{error.message}</Text> : null}

                </View>
                <TouchableOpacity activeOpacity={.5} style={styles.btn} onPress={send}>
                    <Text style={styles.btnText}>Send</Text>
                </TouchableOpacity>
            </View>
            <Links />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.secondary
    },
    header: {
        backgroundColor: colors.mainColor,
        paddingHorizontal: 40
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
        paddingVertical: 40,
        color: colors.secondary
    },
    formContainer: {
        marginTop: 30,
        paddingHorizontal: 20
    },
    label: {
        marginTop: 10,
        marginBottom: 5,
        fontWeight: "500"
    },
    inputField: {
        backgroundColor: colors.secondary,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        width: "100%",
        fontSize: 16,
        marginBottom: 5,
    },
    textarea: {
        minHeight: 150,
        textAlignVertical: 'top'
    },
    btn: {
        marginHorizontal: "15%",
        backgroundColor: colors.mainColor,
        marginVertical: 20,
        borderRadius: 30,
        paddingHorizontal: 24,
        paddingVertical: 11
    },
    btnText: {
        color: colors.secondary,
        fontSize: 16,
        textAlign: 'center',
        textTransform: 'uppercase'
    },
    error: {
        marginLeft: 5,
        fontSize: 13,
        fontWeight: '600',
        color: 'red'
    }
})

export default ContactUsComponent
