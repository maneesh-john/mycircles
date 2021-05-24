import React, { useState } from 'react'
import { View, StyleSheet, Text, TextInput, Alert } from 'react-native'
import { useDispatch } from 'react-redux'
import fonts from '../../../constants/fonts'
import colors from '../../../constants/colors'
import { validate } from '../../../utils/validations'
import { createProvider } from '../../../redux/actions/meetOthersAction'

const AddProvider = ({ color, type }: any) => {

    const dispatch = useDispatch()

    const [providerName, setproviderName] = useState<string>('')
    const [email, setemail] = useState<string>('')
    const [phone, setphone] = useState<string>('')
    const [address, setaddress] = useState<string>('')
    const [city, setcity] = useState<string>('')
    const [zipcode, setzipcode] = useState<string>('')
    const [npiNumber, setnpiNumber] = useState<string>('')
    const [errors, setErrors] = useState<any>({});

    const validateRequest = (): boolean => {
        let valid: boolean = true;
        let err: any = {}
        if (!validate(email, 'email')) {
            valid = false;
            err.email = true;
        }
        if (!providerName) {
            valid = false;
            err.providerName = true;
        }
        if (!(phone.length === 10)) {
            valid = false;
            err.phone = true;
        }
        if (!address) {
            valid = false;
            err.address = true;
        }
        if (!city) {
            valid = false;
            err.city = true;
        }
        if (type === 'provider' && !npiNumber) {
            valid = false;
            err.npiNumber = true;
        }
        if (!zipcode) {
            valid = false;
            err.zipcode = true;
        }
        setErrors(err)
        return valid;
    }

    const submit = async () => {
        const isValid: boolean = validateRequest();
        if (isValid) {
            const body = {
                name: providerName,
                email,
                phone,
                npi_number: npiNumber,
                type,
                location: {
                    address_line1: address,
                    address_line2: "",
                    city,
                    state: "",
                    country: "",
                    zip_code: zipcode
                }
            }
            try {
                await dispatch(createProvider(body))
                setproviderName('')
                setemail('')
                setphone('')
                setaddress('')
                setcity('')
                setzipcode('')
                setnpiNumber('')
                setErrors({})
            } catch (error) {
                Alert.alert('Oops!', error.message)
            }
        }
    }

    return (
        <View style={styles.section}>
            <View style={styles.inputContainer}>
                <Text style={[styles.label, { textTransform: 'capitalize' }]}>Business/{type} Name <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    value={providerName}
                    onChangeText={(value: any) => setproviderName(value)}
                />
                {errors.providerName ? <Text style={styles.error}>Name is required</Text> : null}
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address <Text style={styles.required}>*</Text></Text>
                <TextInput
                    keyboardType='email-address'
                    placeholder='Enter Email'
                    placeholderTextColor='#888'
                    style={styles.input}
                    value={email}
                    onChangeText={(value: any) => setemail(value)}
                />
                {errors.email ? <Text style={styles.error}>Email is required</Text> : null}
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number <Text style={styles.required}>*</Text></Text>
                <TextInput
                    placeholder='Enter Phone Number'
                    keyboardType='numeric'
                    placeholderTextColor='#888'
                    style={styles.input}
                    value={phone}
                    maxLength={10}
                    onChangeText={(value: any) => setphone(value)}
                />
                {errors.phone ? <Text style={styles.error}>Phone Number is required</Text> : null}
            </View>
            {type === 'provider' ? <View style={styles.inputContainer}>
                <Text style={styles.label}>NPI Number <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    value={npiNumber}
                    maxLength={10}
                    onChangeText={(value: any) => setnpiNumber(value)}
                />
                {errors.npiNumber ? <Text style={styles.error}>NPI Number is required</Text> : null}
            </View> : null}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Street Address <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    value={address}
                    onChangeText={(value: any) => setaddress(value)}
                />
                {errors.address ? <Text style={styles.error}>Address is required</Text> : null}

            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>City <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    value={city}
                    onChangeText={(value: any) => setcity(value)}
                />
                {errors.city ? <Text style={styles.error}>City is required</Text> : null}
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Zip/Postal Code <Text style={styles.required}>*</Text></Text>
                <TextInput
                    maxLength={6}
                    style={styles.input}
                    value={zipcode}
                    keyboardType="numeric"
                    onChangeText={(value: any) => setzipcode(value)}
                />
                {errors.zipcode ? <Text style={styles.error}>Zip/Postal code is required</Text> : null}
            </View>

            <Text style={{ ...styles.submitBtn, backgroundColor: color }} onPress={submit}>Add Business</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    section: {
        marginVertical: 20,
    },
    inputContainer: {
        marginBottom: 10
    },
    label: {
        fontFamily: fonts.LATO_BOLD,
        marginBottom: 5
    },
    error: {
        fontFamily: fonts.LATO_REGULAR,
        fontSize: 12,
        color: 'red'
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 5,
        fontFamily: fonts.LATO_REGULAR,
    },
    required: {
        color: 'red'
    },
    submitBtn: {
        alignSelf: 'center',
        width: 140,
        textAlign: 'center',
        marginTop: 10,
        paddingVertical: 10,
        fontFamily: fonts.LATO_REGULAR,
        borderRadius: 15,
        color: colors.secondary,
        overflow: 'hidden'
    }
})
export default AddProvider
