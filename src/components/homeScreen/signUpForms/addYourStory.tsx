import React, { useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native'
import colors from '../../../constants/colors'
import { useSelector, useDispatch } from 'react-redux'
import { addUserStory } from '../../../redux/actions/homeScreenActions'
import CONSTS from '../../../constants/consts'
import SucessScreen from './sucessScreen'

const AddYourStory = (props: any) => {
    const { selectedCircle, userData } = useSelector((state: any) => state.app)
    const [story, setstory] = useState('')

    const dispatch = useDispatch()

    const [visible, setVisible] = useState(false);

    const showDialog = () => setVisible(true);

    const onSubmit = async () => {
        if (story) {
            try {
                dispatch({ type: CONSTS.SHOW_LOADER })
                const userType = props.selectedRole == 1 ? 'normaluser' : 'caregiver';
                await addUserStory(userData.id, userType, { story })
                dispatch({ type: CONSTS.HIDE_LOADER })
                showDialog()
            } catch (error) {
                dispatch({ type: CONSTS.HIDE_LOADER })
                Alert.alert('Oops', error.message)
            }
        } else {
            showDialog()
        }
    }

    return (
        <View>
            <View style={styles.headerContent}>
                <Text style={styles.mainHeader}>
                    Your Story
                </Text>
            </View>
            <View style={styles.container}>
                <View style={styles.inputHolder}>
                    <Text style={styles.label}>Tell us about yourself.</Text>
                    <TextInput style={{...styles.inputField, minHeight:150}}
                        placeholder="Tell us about yourself"
                        keyboardType='default'
                        maxLength={2000}
                        multiline={true}
                        numberOfLines={8}
                        value={story}
                        onChangeText={(value: any) => setstory(value)}
                        returnKeyType="done"
                    />
                    <Text style={{ alignSelf: 'flex-end', color: '#6d6d6d', marginTop: 2 }}>{2000 - story.length} Characters remaining.</Text>
                </View>
            </View>

            <View style={styles.btnContainer}>
                <TouchableOpacity activeOpacity={.5} onPress={() => { props.handlePrevious() }} style={{ ...styles.btnStyle, borderColor: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor }}>
                    <Text style={{ ...styles.btnText, color: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor }}>BACK</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={.5} onPress={() => { onSubmit() }} style={{ ...styles.btnStyle, borderColor: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor, backgroundColor: selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor }}>
                    <Text style={{ ...styles.btnText }}>DONE</Text>
                </TouchableOpacity>
            </View>
            <SucessScreen {...props} visible={visible} setVisible={setVisible} />
        </View>
    )
}

const styles = StyleSheet.create({
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: "100%",
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
        // fontSize: 16,
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
    container: {
        paddingHorizontal: 20,
        paddingBottom: 20
    },
    inputHolder: {
        marginVertical: 5,
    },
    label: {
        marginBottom: 5,
        fontWeight: "500",
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
        overflow: 'hidden',
        textAlignVertical: 'top'
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
    subLabel: {
        fontSize: 12,
        color: '#6d6d6d',
        marginBottom: 7,
        textAlign: 'center'
    },
    optional: {
        fontStyle: 'italic',
        color: '#6d6d6d'
    }
})

export default AddYourStory
