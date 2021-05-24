import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Image, Text, TouchableOpacity, Alert } from 'react-native'
import { useDispatch } from 'react-redux'
import fonts from '../../../constants/fonts'
import { submitPollAnswer } from '../../../redux/actions/resourcesAction'

const Poll = ({ data, color, circleId, userId, title }: any) => {

    const dispatch = useDispatch()

    const [selecteOption, setselecteOption] = useState<any>({})
    const [disable, setDisable] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    useEffect(() => {
        if (Object.keys(selecteOption).length) {
            if (error) {
                setError('')
            }
        }

    }, [selecteOption])

    const onSubmit = async () => {
        setError('')
        if (Object.keys(selecteOption).length) {
            const body = { "user_circle": circleId, "user": userId, "poll": selecteOption.poll, "choice": selecteOption.id }
            try {
                await dispatch(submitPollAnswer(body, title));
                setselecteOption({})
                setDisable(true)
            } catch (error) {
                setDisable(false)
                Alert.alert('Oops', error.message)
            }
        } else {
            setDisable(false)
            setError('Please select an option')
        }
    }

    return (
        <View>
            <View style={styles.imageContainer}>
                <Image source={{ uri: data?.poll_attach?.file }} style={styles.image} />
            </View>
            <Text style={styles.title}>{data?.poll_question}</Text>
            <View style={styles.optionContainer}>
                {data?.choices?.map((rs: any) => (
                    <TouchableOpacity disabled={disable} key={rs.id} onPress={() => { setselecteOption(rs) }} activeOpacity={.7} style={{ ...styles.option, backgroundColor: (selecteOption.id === rs.id) ? color : '#f1f1f1' }}>
                        {disable && <View style={{ position: 'absolute', height: 40, width: `${rs.choice_vote}%`, backgroundColor: color, opacity: .7, borderRadius: 10, overflow: 'hidden' }}></View>}
                        <Text style={{ ...styles.btnText, color: (selecteOption.id === rs.id) ? '#fff' : '#444' }}>{rs.poll_option}</Text>
                        {disable && <Text style={{ ...styles.btnText, color: '#444' }}>{parseFloat(rs.choice_vote).toFixed(1)}%</Text>}
                    </TouchableOpacity>
                ))}
                {error ? <Text style={styles.error}>*{error}</Text> : null}
            </View>
            {!disable && <TouchableOpacity onPress={onSubmit} activeOpacity={.7} style={{ ...styles.btn, backgroundColor: color }}>
                <Text style={styles.btnText}>Submit</Text>
            </TouchableOpacity>}
            {disable &&
                <View style={styles.thankyouView}>
                    <Text style={{ ...styles.thanks, color }}>Thank you for your Answer</Text>
                    <Text style={styles.total}>Total Votes : {data?.total_vote}</Text>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    imageContainer: {
        height: 200,
        width: '100%',
        marginBottom: 10,
    },
    image: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover'
    },
    title: {
        fontFamily: fonts.LATO_BOLD,
        width: '100%',
        fontSize: 15,
        marginVertical: 5
    },
    optionContainer: {
        paddingVertical: 10
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginVertical: 5,
        borderRadius: 10,
    },
    btn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 15,
        alignSelf: 'center',
        borderRadius: 10,
    },
    btnText: {
        color: '#fff',
        fontFamily: fonts.LATO_BOLD
    },
    thankyouView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    thanks: {
        fontFamily: fonts.LATO_REGULAR
    },
    total: {
        fontFamily: fonts.LATO_REGULAR,
        color: '#333'
    },
    error: {
        fontFamily: fonts.LATO_REGULAR,
        color: 'red',
        marginVertical: 5
    }
})
export default Poll
