import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import colors from '../../constants/colors'
import { useSelector } from 'react-redux'

const Loader = () => {
    const showLoader: boolean = useSelector((state: any) => state.app.loader)
    if (showLoader) {
        return (
            <View style={styles.screen}>
                <ActivityIndicator size={50} color={colors.mainColor} />
            </View>
        )
    } else {
        return(
           null
        )
    }
}

const styles = StyleSheet.create({
    screen: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,.75)',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default Loader
