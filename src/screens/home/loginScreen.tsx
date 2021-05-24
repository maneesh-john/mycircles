import React from 'react'
import { ScrollView, StyleSheet, View, Text, Image } from 'react-native'
import colors from '../../constants/colors'
import Links from '../../components/homeScreen/links';
import CircleLoginComponent from '../../components/homeScreen/circleLoginComponent';

const CircleLoginScreen = (props:any) => {
    return (
        <ScrollView contentContainerStyle={styles.screen}>
            <CircleLoginComponent {...props} />
            <Links />
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    screen: {
        minHeight: "100%"
    }
})

export default CircleLoginScreen
