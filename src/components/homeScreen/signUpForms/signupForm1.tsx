import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, StyleSheet, Platform, ScrollView, TouchableOpacity, Alert } from 'react-native'
import colors from '../../../constants/colors'
import RNPickerSelect from 'react-native-picker-select';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useSelector, useDispatch } from 'react-redux';
import { getSymptoms, getCityData, checkUserNameAvailability, addNewUser } from '../../../redux/actions/homeScreenActions';
import { Chip, Checkbox } from 'react-native-paper';
import { validate } from '../../../utils/validations';
import DatePicker from '../../../components/common/datePicker';
import fonts from '../../../constants/fonts';
import Drawer from '../../../components/common/drawer';
import { getAlphaColor } from '../../../utils/getColors';

const SignupForm1 = (props: any) => {

    const { selectedCircle, symptoms, userData, loginType } = useSelector((state: any) => state.app);
    const dispatch = useDispatch();
    const [symptomsList, setSymptomsList] = useState<Array<any>>([])
    const [citySearchData, setCitySearchData] = useState<Array<any>>([])
    const color = selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor;
    const color2 = selectedCircle.color_code ? selectedCircle.color_code2 : colors.mainColor;

    useEffect(() => {
        if (selectedCircle.id) {
            dispatch(getSymptoms(selectedCircle.id))
        }
    }, [dispatch, selectedCircle])

    useEffect(() => {
        const _symptoms = symptoms.map((symptom: any) => {
            return {
                label: symptom.display_name,
                value: symptom.display_name
            }
        })
        setSymptomsList(_symptoms)
    }, [symptoms])

    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [birthday, setbirthday] = useState<any>();
    const [gender, setgender] = useState('');
    const [typeOfCircle, settypeOfCircle] = useState('');
    const [dateOfDiagnosis, setdateOfDiagnosis] = useState<any>();
    const [zipcode, setzipcode] = useState('');
    const [selectedCity, setselectedCity] = useState<any>();

    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);

    const [city, setcity] = useState('');
    const [isNameAvailable, setisNameAvailable] = useState(true);

    const [conditions, setconditions] = useState<Array<any>>([]);
    const [additionalConditions, setadditionalConditions] = useState('');

    const [errors, setErrors] = useState<any>({});

    const [isEditable, setIsEditable] = useState(true)
    const [wontSay, setWontSay] = useState(false);


    useEffect(() => {
        setErrors((err: any) => ({ ...err, displayName: '' }))
        if (displayName.length > 5) {
            (async () => {
                const isAvailable = await checkUserNameAvailability(displayName);
                setisNameAvailable(isAvailable)
                if (!isAvailable) {
                    setErrors((err: any) => ({ ...err, displayName: 'Display name already taken' }))
                }
            })()
        }
    }, [displayName])

    useEffect(() => {
        (async () => {
            if (!(selectedCity && selectedCity.city === city)) {
                if (city && city.trim().length) {
                    const cities = await getCityData(city);
                    if (cities && cities.length) {
                        setCitySearchData(cities);
                    } else {
                        setCitySearchData([])
                    }
                } else {
                    setCitySearchData([])
                }
            }
        })()
    }, [city])

    useEffect(() => {
        if(loginType && loginType !== email){
            if(loginType === "google"){
                setEmail(userData.user.email);
                setPassword(userData.idToken);
            }
            else if(loginType === "facebook"){
                
            }
            setIsEditable(true)
        }
        else if (userData && Object.keys(userData).length) {
            setIsEditable(false);
            setEmail(userData.email)
            setgender(userData.gender)
            setselectedCity(userData.location[0])
            setcity(userData.location[0].city)
            setzipcode(userData.location[0].zip_code)
            setbirthday(new Date(userData.dob))
        } else {
            setIsEditable(true)
        }
    }, [userData])

    const onSelectBirthday = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || birthday;
        setShow1(Platform.OS === 'ios');
        if (currentDate > dateOfDiagnosis) {
            setdateOfDiagnosis(undefined)
        }
        setbirthday(currentDate);
    };

    const onSelectDoD = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || dateOfDiagnosis;
        setShow2(Platform.OS === 'ios');
        setdateOfDiagnosis(currentDate);
    };

    const updateSelectedCity = (cityData: any) => {
        setselectedCity(cityData);
        setcity(cityData.city);
        setCitySearchData([])
    }

    const validateRequest = (): boolean => {
        let isValid = true;
        let errs: any = {}
        //display name
        if (displayName.length < 6) {
            isValid = false;
            errs.displayName = 'Display name must be minimum 6 characters';
        } else if (!isNameAvailable) {
            errs.displayName = 'Display name already taken';
        }
        //email
        if (!validate(email, 'email')) {
            isValid = false;
            errs.email = 'Email is invalid';
        }
        //password
        if (isEditable && !validate(password, 'password')) {
            isValid = false;
            errs.password = 'Password must be minimum 8 characters';
        }
        //birthday
        if (!(birthday && birthday instanceof Date)) {
            isValid = false;
            errs.birthday = 'Please select a valid date';
        }
        //dateOfDiagnosis
        if (!(dateOfDiagnosis && dateOfDiagnosis instanceof Date)) {
            isValid = false;
            errs.dateOfDiagnosis = 'Please select a valid date';
        }
        //gender 
        if (!gender) {
            isValid = false;
            errs.gender = 'Please select a gender';
        }
        //typeOfCircle
        if (!typeOfCircle) {
            isValid = false;
            errs.typeOfCircle = 'Please select a valid type';
        }
        //city
        if (!(selectedCity && selectedCity.city)) {
            isValid = false;
            errs.city = 'Please select a valid city';
        }
        //zipcode
        if (zipcode.length !== 6) {
            isValid = false;
            errs.zipcode = 'Please enter a valid zipcode';
        }
        setErrors(errs)
        return isValid
    }

    const createRequestBody = () => {
        const dob = (birthday.toISOString()).split('T')[0];
        const diagnosis_date = (dateOfDiagnosis.toISOString()).split('T')[0];
        const body: any = {
            email,
            password,
            gender,
            "first_name": displayName,
            "display_name": displayName,
            dob,
            "middle_name": "",
            "last_name": "",
            "phone_number": null,
            "user_circle": {
                "circle": selectedCircle.id
            },
            "location": {
                "address_line1": null,
                "address_line2": null,
                "city": selectedCity.city,
                "state": selectedCity.state,
                "country": selectedCity.country,
                "zip_code": Number(zipcode)
            }
        }
        if (props.selectedRole == 1) {
            body.role = "patient";
            body.normal_user = {
                "add_conditions": conditions,
                diagnosis_date,
                "disease_type": typeOfCircle
            }
        } else if (props.selectedRole == 2) {
            body.role = "caregiver";
            body.caregiver = {
                "add_conditions": conditions,
                diagnosis_date,
                "disease_type": typeOfCircle
            }
        }
        return body;
    }

    const onSave = async () => {
        const isValid = validateRequest();
        if (isValid) {
            const body = createRequestBody();
            try {
                await dispatch(addNewUser(body));
                props.handleNext()
            } catch (error) {
                Alert.alert('Oops!', error.message)
            }
        }
    }

    const changeForm = () => {
        props.setselectedRole(3)
    }

    return (
        <>
            {props.selectedRole === 2 ?
                <Drawer
                    header="What is an Caregiver?"
                    body="Lorem ipsum dolor sit amet, ea nam prompta concludaturque, ne mea decore tritani oblique, iudicabit intellegat ex mel. Mei officiis efficiendi no, primis malorum nec ex. Fabulas civibus an vix, no exerci deleniti pro. Sea numquam appareat te, ponderum electram eum an, an mollis eirmod vocent eam. Nobis mandamus eam ut. Graeco epicuri cu ius."
                /> : null
            }
            <View style={styles.headerContent}>
                <Text style={styles.mainHeader}>
                    Welcome to {selectedCircle?.condition_type} Circle
                </Text>
                <Text style={styles.subHeader}>
                    To get started, tell us a bit more about yourself.
                    </Text>
            </View>
            <View style={styles.container}>
                <View style={styles.inputHolder}>
                    <Text style={styles.label}>Display Name<Text style={styles.star}> *</Text></Text>
                    <TextInput style={styles.inputField}
                        placeholder="Provide display name"
                        placeholderTextColor={'#ccc'}
                        keyboardType='default'
                        maxLength={50}
                        value={displayName}
                        onChangeText={(value: any) => setDisplayName(value)}
                        returnKeyType="next"
                    />
                    {errors.displayName ? <Text style={styles.error}>{errors.displayName}</Text> : null}
                </View>
                <View style={styles.inputHolder}>
                    <Text style={styles.label}>Email<Text style={styles.star}> *</Text></Text>
                    <TextInput style={[styles.inputField, !isEditable ? styles.disabled : null]}
                        placeholder="Provide email address"
                        keyboardType='email-address'
                        maxLength={50}
                        autoCapitalize="none"
                        editable={isEditable}
                        value={email}
                        placeholderTextColor={'#ccc'}
                        onChangeText={(value: any) => setEmail(value)}
                        returnKeyType="next"
                    />
                    {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}
                </View>
                <View style={styles.inputHolder}>
                    <Text style={styles.label}>Password<Text style={styles.star}> *</Text></Text>
                    <TextInput style={[styles.inputField, !isEditable ? styles.disabled : null]}
                        placeholder="Provide password"
                        keyboardType='default'
                        maxLength={50}
                        autoCapitalize="none"
                        placeholderTextColor={'#ccc'}
                        value={isEditable ? password : 'password'}
                        editable={isEditable}
                        onChangeText={(value: any) => setPassword(value)}
                        secureTextEntry={true}
                        returnKeyType="next"
                    />
                    {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}
                </View>
                {props.selectedRole === 2 ? <View>
                    <Text style={{ fontFamily: fonts.LATO_BOLD, marginBottom: 5, fontSize: 16 }}>Patien's Information</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: -5 }}>
                        <Checkbox.Android
                            accessibilityStates
                            status={wontSay ? 'checked' : 'unchecked'}
                            onPress={() => { setWontSay(!wontSay) }}
                            color={selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor}
                        />
                        <Text style={{ fontFamily: fonts.LATO_REGULAR }}>I would rather not say</Text>
                    </View>
                </View> : null}
                {!wontSay ?
                    <>
                        <View style={styles.inputHolder}>
                            <Text style={styles.label}>{props.selectedRole === 2 ? "Patient's" : "My"} Birthday<Text style={styles.star}> *</Text></Text>
                            <TouchableOpacity activeOpacity={.8} style={{ ...styles.inputField, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} onPress={() => setShow1(true)}>
                                {birthday ? <Text style={styles.value}>{new Date(birthday).toDateString()}</Text> : <Text style={styles.placeholder}>Select date</Text>}
                                <AntDesign name="calendar" size={20} color={selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor} />
                            </TouchableOpacity>
                            {show1 && <DatePicker
                                key="bday"
                                testID="dateTimePicker"
                                value={birthday ? birthday : new Date()}
                                mode="date"
                                display="calendar"
                                visible={show1}
                                onClose={setShow1}
                                onChange={onSelectBirthday}
                                maximumDate={new Date()}
                            />}
                            {errors.birthday ? <Text style={styles.error}>{errors.birthday}</Text> : null}
                        </View>
                        <View style={styles.inputHolder}>
                            <Text style={styles.label}>{props.selectedRole === 2 ? "Patient's " : ''}Gender<Text style={styles.star}> *</Text></Text>
                            <RNPickerSelect
                                onValueChange={(value) => setgender(value)}
                                placeholder={{ label: 'Select gender', value: '', color: '#ccc' }}
                                style={{
                                    inputAndroid: {
                                        ...styles.inputField
                                    },
                                    inputIOS: {
                                        ...styles.inputField
                                    },
                                    iconContainer: {
                                        top: 9,
                                        right: 5,
                                        elevation: 3
                                    },
                                }}
                                useNativeAndroidPickerStyle={false}
                                value={gender}
                                items={[
                                    { label: 'Male', value: 'male' },
                                    { label: 'Female', value: 'female' }
                                ]}
                                Icon={() => {
                                    return <MaterialIcons size={30} name="keyboard-arrow-down" color={selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor} />;
                                }}
                            />
                            {errors.gender ? <Text style={styles.error}>{errors.gender}</Text> : null}
                        </View>
                        <View style={styles.inputHolder}>
                            <Text style={styles.label}>{props.selectedRole === 2 ? "" : "My "}Type of {selectedCircle?.condition_type}<Text style={styles.star}> *</Text></Text>
                            <RNPickerSelect
                                onValueChange={(value) => settypeOfCircle(value)}
                                placeholder={{ label: 'Select type', value: '', color: '#ccc' }}
                                style={{
                                    inputAndroid: {
                                        ...styles.inputField,
                                        paddingRight: 30
                                    },
                                    inputIOS: {
                                        ...styles.inputField
                                    },
                                    iconContainer: {
                                        top: 9,
                                        right: 5,
                                        elevation: 3
                                    }
                                }}
                                useNativeAndroidPickerStyle={false}
                                value={typeOfCircle}
                                items={symptomsList}
                                Icon={() => {
                                    return <MaterialIcons size={30} name="keyboard-arrow-down" color={selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor} />;
                                }}
                            />
                            {errors.typeOfCircle ? <Text style={styles.error}>{errors.typeOfCircle}</Text> : null}
                        </View>
                        <View style={styles.inputHolder}>
                            <Text style={styles.label}>{props.selectedRole === 2 ? "" : "My "}Date of Diagnosis<Text style={styles.star}> *</Text></Text>
                            <TouchableOpacity activeOpacity={.8} style={{ ...styles.inputField, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} onPress={() => setShow2(true)}>
                                {dateOfDiagnosis ? <Text style={styles.value}>{new Date(dateOfDiagnosis).toDateString()}</Text> : <Text style={styles.placeholder}>Select date</Text>}
                                <AntDesign name="calendar" size={20} color={selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor} />
                            </TouchableOpacity>
                            {show2 && <DatePicker
                                key="dod"
                                testID="dateTimePicker"
                                value={dateOfDiagnosis ? dateOfDiagnosis : new Date()}
                                mode="date"
                                display="calendar"
                                maximumDate={new Date()}
                                minimumDate={birthday}
                                onChange={onSelectDoD}
                                visible={show2}
                                onClose={setShow2}
                            />}
                            {errors.dateOfDiagnosis ? <Text style={styles.error}>{errors.dateOfDiagnosis}</Text> : null}
                        </View>
                        <View style={{ ...styles.inputHolder, position: 'relative' }}>
                            <Text style={styles.label}>City<Text style={styles.star}> *</Text></Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TextInput style={styles.inputField}
                                    placeholder="Search city"
                                    keyboardType='default'
                                    maxLength={50}
                                    placeholderTextColor={'#ccc'}
                                    autoCapitalize="none"
                                    onChangeText={(value: any) => {
                                        setselectedCity({})
                                        setcity(value)
                                    }}
                                    value={city}
                                    returnKeyType="next"
                                />
                                <MaterialIcons name="search" size={25} style={{ marginLeft: -35, elevation: 3 }} color={selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor} />
                            </View>
                            {citySearchData && citySearchData.length && city ? <View style={styles.cityResponseHolder}>
                                <ScrollView nestedScrollEnabled={true} >
                                    {citySearchData.map(city => (
                                        <TouchableOpacity activeOpacity={.7} onPress={() => { updateSelectedCity(city) }} key={city.id} style={{ width: "100%", backgroundColor: colors.secondary, paddingHorizontal: 10, paddingVertical: 15 }}>
                                            <Text>{city.city}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View> : null}
                            {errors.city ? <Text style={styles.error}>{errors.city}</Text> : null}
                        </View>
                        <View style={styles.inputHolder}>
                            <Text style={styles.label}>State<Text style={styles.star}> *</Text></Text>
                            <TextInput style={[styles.inputField, styles.disabled]}
                                placeholder="State"
                                placeholderTextColor={'#ccc'}
                                editable={false}
                                value={selectedCity?.state ? selectedCity.state : ''}
                            />
                        </View>
                        <View style={styles.inputHolder}>
                            <Text style={styles.label}>Country<Text style={styles.star}> *</Text></Text>
                            <TextInput style={[styles.inputField, styles.disabled]}
                                placeholder="Country"
                                editable={false}
                                placeholderTextColor={'#ccc'}
                                value={selectedCity?.country ? selectedCity.country : ''}
                            />
                        </View>
                        <View style={styles.inputHolder}>
                            <Text style={styles.label}>Zipcode<Text style={styles.star}> *</Text></Text>
                            <TextInput style={styles.inputField}
                                placeholder="Zipcode"
                                keyboardType='numeric'
                                maxLength={6}
                                value={zipcode}
                                placeholderTextColor={'#ccc'}
                                onChangeText={(value: any) => setzipcode(value)}
                                returnKeyType="next"
                            />
                            {errors.zipcode ? <Text style={styles.error}>{errors.zipcode}</Text> : null}
                        </View>

                        <View style={styles.inputHolder}>
                            <Text style={styles.label}>{props.selectedRole === 2 ? "Does the Patient have any additional conditions?" : "Do you have any additional conditions?"} <Text style={styles.optional}>- Optional</Text></Text>
                            <Text style={styles.subLabel}>(For ex. depression, anxiety etc..)</Text>

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
                                {conditions.map((condition: string) => (
                                    <Chip icon="close"
                                        style={{ margin: 3, borderColor: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor, borderWidth: 1, backgroundColor: colors.secondary }} accessibilityStates key={condition}
                                        textStyle={{ padding: 2 }}
                                        onPress={() => {
                                            setconditions((prev: any) => {
                                                const state = [...prev];
                                                const index = state.indexOf(condition);
                                                state.splice(index, 1)
                                                return state;
                                            })
                                        }}>
                                        {condition}
                                    </Chip>
                                ))}
                            </View>

                            <TextInput style={styles.inputField}
                                placeholder="ex. depression, anxiety etc.."
                                keyboardType='default'
                                value={additionalConditions}
                                maxLength={50}
                                placeholderTextColor={'#ccc'}
                                onChangeText={(value: any) => setadditionalConditions(value)}
                                enablesReturnKeyAutomatically={true}
                                onSubmitEditing={() => {
                                    if (additionalConditions) {
                                        setconditions((prev: any) => {
                                            const state = [...prev];
                                            state.push(additionalConditions)
                                            return state;
                                        })
                                        setadditionalConditions('');
                                    }
                                }}
                                returnKeyType="done"
                            />
                        </View>
                    </>
                    : <View style={{ marginVertical: 15, padding: 15, borderRadius: 15, backgroundColor: getAlphaColor(color) }}>
                        <Text style={{ color: '#333', fontFamily: fonts.LATO_REGULAR }}>The patient’s information is mandatory when you register as a caregiver.
                            If you wish not to show this information you can register as an Advocate.</Text>
                        <Text onPress={changeForm} style={{ color: '#fff', backgroundColor: color, borderRadius: 15, marginHorizontal: 20, padding: 10, overflow: 'hidden', textAlign: 'center', textTransform: 'uppercase', marginTop: 20 }}>register as advocate</Text>
                    </View>
                }
            </View>
            {wontSay ? null : <View style={styles.btnContainer}>
                <TouchableOpacity activeOpacity={.5} onPress={() => { props.handlePrevious() }} style={{ ...styles.btnStyle, borderColor: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor }}>
                    <Text style={{ ...styles.btnText, color: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor }}>BACK</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={.5} onPress={() => { onSave() }} style={{ ...styles.btnStyle, borderColor: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor, backgroundColor: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor }}>
                    <Text style={{ ...styles.btnText }}>NEXT</Text>
                </TouchableOpacity>
            </View>}
        </>
    )
}

const styles = StyleSheet.create({
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 30
    },
    btnStyle: {
        marginLeft: 10,
        paddingVertical: 8,
        paddingHorizontal: 25,
        borderRadius: 15,
        borderWidth: 1,
        width: 120,
        backgroundColor: colors.secondary
    },
    btnText: {
        textAlign: "center",
        textAlignVertical: 'center',
        color: colors.secondary,
        fontFamily: fonts.LATO_BOLD,
    },
    headerContent: {
        paddingVertical: 20,
        paddingHorizontal: 20
    },
    mainHeader: {
        textAlign: 'center',
        fontSize: 24,
        marginBottom: 10,
        letterSpacing: .5,
        fontFamily: fonts.LATO_BOLD,
    },
    subHeader: {
        textAlign: 'center',
        fontSize: 14,
        letterSpacing: .3,
        fontFamily: fonts.LATO_REGULAR,
    },
    container: {
        padding: 20
    },
    inputHolder: {
        marginVertical: 5,
    },
    label: {
        marginBottom: 5,
        fontFamily: fonts.LATO_BOLD,
        color: '#333'
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
        shadowColor: '#ccc',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
        fontFamily: fonts.LATO_REGULAR,
        color: '#333',
        overflow: 'hidden'
    },
    star: {
        color: 'red',
        fontFamily: fonts.LATO_REGULAR,
    },
    error: {
        marginLeft: 5,
        fontSize: 13,
        fontFamily: fonts.LATO_BOLD,
        color: 'red'
    },
    placeholder: {
        color: '#ccc',
        fontSize: 16,
        paddingVertical: 4,
        fontFamily: fonts.LATO_REGULAR,
    },
    value: {
        fontSize: 16,
        paddingVertical: 4,
        fontFamily: fonts.LATO_REGULAR,
    },
    disabled: {
        backgroundColor: '#f2f2f2',
        color: '#333',
        fontFamily: fonts.LATO_REGULAR,
    },
    cityResponseHolder: {
        borderRadius: 10,
        borderColor: "#ccc",
        borderWidth: .5,
        position: Platform.OS === 'ios' ? "relative" : "absolute",
        top: Platform.OS === 'ios' ? 0 : 76,
        width: "100%",
        backgroundColor: colors.secondary,
        zIndex: 10,
        maxHeight: 150,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden'
    },
    subLabel: {
        fontSize: 12,
        color: '#6d6d6d',
        fontFamily: fonts.LATO_REGULAR,
        marginBottom: 7
    },
    optional: {
        fontStyle: 'italic',
        color: '#6d6d6d',
        fontFamily: fonts.LATO_REGULAR,
    }
})

export default SignupForm1
