import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, StyleSheet, Platform, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native'
import colors from '../../../constants/colors'
import RNPickerSelect from 'react-native-picker-select';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useSelector, useDispatch } from 'react-redux';
import { getCityData, checkUserNameAvailability, addNewUser } from '../../../redux/actions/homeScreenActions';
import { validate } from '../../../utils/validations';
import SucessScreen from './sucessScreen';
import DatePicker from '../../../components/common/datePicker';
import { Checkbox } from 'react-native-paper';
import Drawer from '../../../components/common/drawer';
import fonts from '../../../constants/fonts';

const SignupForm2 = (props: any) => {

    const { selectedCircle, userData, loginType } = useSelector((state: any) => state.app)
    const color = selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor;
    const dispatch = useDispatch();
    const [citySearchData, setCitySearchData] = useState<Array<any>>([])
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [organization, setOrganization] = useState('');
    const [designation, setDesignation] = useState('');
    const [password, setPassword] = useState('');
    const [birthday, setbirthday] = useState<any>();
    const [gender, setgender] = useState('');
    const [zipcode, setzipcode] = useState('');
    const [selectedCity, setselectedCity] = useState<any>();

    const [show1, setShow1] = useState(false);

    const [city, setcity] = useState('');
    const [isNameAvailable, setisNameAvailable] = useState(true);

    const [errors, setErrors] = useState<any>({});
    const [visible, setVisible] = useState(false);
    const [isEditable, setIsEditable] = useState(true)
    const [myself, setMyself] = useState(false)

    const showDialog = () => setVisible(true);

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
        debugger;
        if(loginType && loginType !== "email"){
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
        setbirthday(currentDate);
    };

    const updateSelectedCity = (cityData: any) => {
        setselectedCity(cityData);
        setcity(cityData.city);
        setCitySearchData([])
    }

    const validateRequest = (): boolean => {
        let errs: any = {}
        //display name
        if (displayName.length < 6) {
            errs.displayName = 'Display name must be minimum 6 characters';
        } else if (!isNameAvailable) {
            errs.displayName = 'Display name already taken';
        }
        //email
        if (!validate(email, 'email')) {
            errs.email = 'Email is invalid';
        }
        //organization
        if (!organization && !myself) {
            errs.organization = 'Please enter organization name'
        }
        // designation
        if (!designation && !myself) {
            errs.designation = 'Please enter designation name'
        }
        //password
        if (isEditable && !validate(password, 'password')) {
            errs.password = 'Password must be minimum 8 characters';
        }
        //birthday
        if (!(birthday && birthday instanceof Date)) {
            errs.birthday = 'Please select a valid date';
        }
        //gender 
        if (!gender) {
            errs.gender = 'Please select a gender';
        }
        //city
        if (!(selectedCity && selectedCity.city)) {
            errs.city = 'Please select a valid city';
        }
        //zipcode
        if (zipcode.length !== 6) {
            errs.zipcode = 'Please enter a valid zipcode';
        }
        setErrors(errs)
        return Object.keys(errs).length ? false : true
    }

    const createRequestBody = () => {
        const dob = (birthday.toISOString()).split('T')[0];
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
            "advocate": {
                "organization": organization,
                "designation": designation
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
        body.role = props.selectedRole === 3 ? 'advocate' : 'hcp'
        return body;
    }

    const onSave = async () => {
        const isValid = validateRequest();
        if (isValid) {
            const body = createRequestBody();
            const uri = props.selectedRole === 3 ? 'advocatecreate/' : 'hcpcreate/'
            try {
                await dispatch(addNewUser(body, uri));
                showDialog()
            } catch (error) {
                Alert.alert('Oops!', error.message)
            }
        }
    }

    return (
        <>
            {props.selectedRole === 3 ? <>
                <Drawer
                    header="What is an Advocate?"
                    body="Lorem ipsum dolor sit amet, ea nam prompta concludaturque, ne mea decore tritani oblique, iudicabit intellegat ex mel. Mei officiis efficiendi no, primis malorum nec ex. Fabulas civibus an vix, no exerci deleniti pro. Sea numquam appareat te, ponderum electram eum an, an mollis eirmod vocent eam. Nobis mandamus eam ut. Graeco epicuri cu ius."
                />
                <View style={styles.headerContent}>
                    <Text style={styles.mainHeader}>
                        Welcome
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
                            keyboardType='default'
                            maxLength={50}
                            value={displayName}
                            onChangeText={(value: any) => setDisplayName(value)}
                            returnKeyType="next"
                        />
                        {errors.displayName ? <Text style={styles.error}>{errors.displayName}</Text> : null}
                    </View>
                    {/*  */}
                    <View style={styles.inputHolder}>
                        <Text style={styles.label}>Organization You Support {!myself && <Text style={styles.star}> *</Text>}</Text>
                        <TextInput style={styles.inputField}
                            placeholder="Provide organization"
                            keyboardType='default'
                            maxLength={50}
                            value={organization}
                            onChangeText={(value: any) => setOrganization(value)}
                            returnKeyType="next"
                        />
                        {errors.organization ? <Text style={styles.error}>{errors.organization}</Text> : null}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: -5 }}>
                        <Checkbox.Android
                            accessibilityStates
                            status={myself ? 'checked' : 'unchecked'}
                            onPress={() => { setMyself(!myself) }}
                            color={color}
                        />
                        <Text style={{ textTransform: 'capitalize' }}>I represent myself</Text>
                    </View>
                    <View style={styles.inputHolder}>
                        <Text style={styles.label}>Designation{!myself && <Text style={styles.star}> *</Text>}</Text>
                        <TextInput style={styles.inputField}
                            placeholder="Provide designation"
                            keyboardType='default'
                            maxLength={50}
                            value={designation}
                            onChangeText={(value: any) => setDesignation(value)}
                            returnKeyType="next"
                        />
                        {errors.designation ? <Text style={styles.error}>{errors.designation}</Text> : null}
                    </View>
                    {/*  */}
                    <View style={styles.inputHolder}>
                        <Text style={styles.label}>Email<Text style={styles.star}> *</Text></Text>
                        <TextInput style={[styles.inputField, !isEditable ? styles.disabled : null]}
                            placeholder="Provide email address"
                            keyboardType='email-address'
                            maxLength={50}
                            editable={isEditable}
                            value={email}
                            autoCapitalize="none"
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
                            value={isEditable ? password : 'password'}
                            editable={isEditable}
                            onChangeText={(value: any) => setPassword(value)}
                            secureTextEntry={true}
                            returnKeyType="next"
                        />
                        {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}
                    </View>
                    <View style={{ ...styles.inputHolder, position: 'relative' }}>
                        <Text style={styles.label}>City<Text style={styles.star}> *</Text></Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput style={styles.inputField}
                                placeholder="Search city"
                                keyboardType='default'
                                maxLength={50}
                                autoCapitalize="none"
                                onChangeText={(value: any) => {
                                    setselectedCity({})
                                    setcity(value)
                                }}
                                value={city}
                                returnKeyType="next"
                            />
                            <MaterialIcons name="search" size={25} style={{ marginLeft: -35, elevation: 3 }} color={color} />
                        </View>
                        {citySearchData && citySearchData.length && city ? <View style={styles.cityResponseHolder}>
                            <ScrollView nestedScrollEnabled={true} >
                                {citySearchData.map(city => (
                                    <TouchableOpacity activeOpacity={.7} onPress={() => { updateSelectedCity(city) }} key={city.id} style={{ width: "100%", paddingHorizontal: 10, paddingVertical: 15 }}>
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
                            editable={false}
                            value={selectedCity?.state ? selectedCity.state : ''}
                        />
                    </View>
                    <View style={styles.inputHolder}>
                        <Text style={styles.label}>Country<Text style={styles.star}> *</Text></Text>
                        <TextInput style={[styles.inputField, styles.disabled]}
                            placeholder="Country"
                            editable={false}
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
                            onChangeText={(value: any) => setzipcode(value)}
                            returnKeyType="next"
                        />
                        {errors.zipcode ? <Text style={styles.error}>{errors.zipcode}</Text> : null}
                    </View>
                    <View style={styles.inputHolder}>
                        <Text style={styles.label}>My Birthday<Text style={styles.star}> *</Text></Text>
                        <TouchableOpacity activeOpacity={.8} style={{ ...styles.inputField, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} onPress={() => setShow1(true)}>
                            {birthday ? <Text style={styles.value}>{new Date(birthday).toDateString()}</Text> : <Text style={styles.placeholder}>Select date</Text>}
                            <AntDesign name="calendar" size={20} color={color} />
                        </TouchableOpacity>
                        {show1 && <DatePicker
                            key="bday"
                            testID="dateTimePicker"
                            value={birthday ? birthday : new Date()}
                            mode="date"
                            display="calendar"
                            onChange={onSelectBirthday}
                            maximumDate={new Date()}
                            visible={show1}
                            onClose={setShow1}
                        />}
                        {errors.birthday ? <Text style={styles.error}>{errors.birthday}</Text> : null}
                    </View>
                    <View style={styles.inputHolder}>
                        <Text style={styles.label}>Gender<Text style={styles.star}> *</Text></Text>
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
                                return <MaterialIcons size={30} name="keyboard-arrow-down" color={color} />;
                            }}
                        />
                        {errors.gender ? <Text style={styles.error}>{errors.gender}</Text> : null}
                    </View>
                </View>
                <View style={styles.btnContainer}>
                    <TouchableOpacity activeOpacity={.5} onPress={() => { props.handlePrevious() }} style={{ ...styles.btnStyle, borderColor: color }}>
                        <Text style={{ ...styles.btnText, color: color }}>BACK</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.5} onPress={() => { onSave() }} style={{ ...styles.btnStyle, borderColor: color, backgroundColor: color }}>
                        <Text style={{ ...styles.btnText }}>SAVE</Text>
                    </TouchableOpacity>
                </View>
                <SucessScreen {...props} visible={visible} setVisible={setVisible} />
            </> :
                <View style={{ marginVertical: 30, flex: 1, padding: 10, alignItems: 'center' }}>
                    <Text style={{ textAlign: 'center', fontFamily: fonts.LATO_BOLD, fontSize: 20, color: '#333', marginBottom: 10 }}>We dont support Healthcare Professional Registration.</Text>
                    <Text style={{ textAlign: 'center', fontFamily: fonts.LATO_REGULAR, fontSize: 16, color: '#333', marginBottom: 20 }}>To register as a healtcare professional</Text>
                    <Text onPress={() => { Linking.openURL(`https://www.dovemed.com/ratings/physicians/`) }} style={{ fontFamily: fonts.LATO_REGULAR, color: '#fff', paddingHorizontal: 15, paddingVertical: 10, marginBottom: 120, borderRadius: 15, overflow: "hidden", backgroundColor: color }}>CLICK HERE</Text>
                </View>
            }
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
        fontWeight: '600'
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
        fontWeight: '600'
    },
    subHeader: {
        textAlign: 'center',
        fontSize: 14,
        letterSpacing: .3,
    },
    container: {
        padding: 20
    },
    inputHolder: {
        marginVertical: 5,
    },
    label: {
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
        shadowColor: '#ccc',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
        overflow: 'hidden'
    },
    star: {
        color: 'red',

    },
    error: {
        marginLeft: 5,
        fontSize: 13,
        fontWeight: '600',
        color: 'red'
    },
    placeholder: {
        color: '#ccc',
        fontSize: 16,
        paddingVertical: 4
    },
    value: {
        fontSize: 16,
        paddingVertical: 4
    },
    disabled: {
        backgroundColor: '#f2f2f2',
        color: '#333'
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
        marginBottom: 7
    },
    optional: {
        fontStyle: 'italic',
        color: '#6d6d6d'
    }
})

export default SignupForm2
