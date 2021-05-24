import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { Snackbar } from 'react-native-paper'
import colors from '../../constants/colors'
import { updateSnackMessage } from '../../redux/actions/homeScreenActions'

const CustomSnackBar = () => {
    const { isCircleView, snackMessage, selectedCircle } = useSelector((state: any) => state.app)
    const color = selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor;

    const [visible, setVisible] = React.useState(false);
    const dispatch = useDispatch()
    useEffect(() => {
        if (snackMessage && snackMessage.length) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [snackMessage])

    const onDismissSnackBar = () => {
        setVisible(false)
        dispatch(updateSnackMessage(''))
    };

    return (
        <Snackbar
            accessibilityStates
            visible={visible}
            style={{ ...styles.snackStyle, backgroundColor: isCircleView ? color : colors.primary, borderColor: isCircleView ? color : colors.primary }}
            onDismiss={onDismissSnackBar}
            action={{
                label: 'Okay',
                onPress: () => {
                    onDismissSnackBar()
                },
            }}>
            {snackMessage}
        </Snackbar>
    )
}

const styles = StyleSheet.create({
    snackStyle: {
        zIndex: 11,
        borderRadius: 10,
        borderWidth: 1,
        opacity: .94,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 10,
        overflow: 'hidden',
    }
})

export default CustomSnackBar
