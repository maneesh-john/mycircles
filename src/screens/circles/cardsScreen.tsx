import React from 'react'
import { View, StyleSheet, Image, Text } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import fonts from '../../constants/fonts'

const CardsScreen = (props: any) => {
    return (
        <View style={{ padding: 15 }}>
            <View style={styles.card}>
                <View style={styles.firstContainer}>
                    <View style={styles.badge}>
                        <MaterialIcons name="done" size={16} color={'#fff'} style={{ marginTop: -2, marginLeft: -1 }} />
                    </View>
                    <View style={styles.imageConatiner}>
                        <Image source={{ uri: 'https://dev.mycircles.dovemed.com/static/img/dovemed-logo.f227732.png' }} />
                    </View>
                    <View style={styles.rating}>
                        <MaterialIcons name="star" size={14} color={'#fff'} />
                        <Text style={styles.rate}>4.6</Text>
                    </View>
                    <Text style={styles.reviews}>25 Reviews</Text>
                </View>
                <View style={styles.devider}></View>
                <View style={styles.secondContainer}>
                    <Text style={styles.promoted}>Promoted</Text>
                    <Text style={styles.name}>Matthew Young,MD</Text>
                    <Text style={styles.title}>Family Medicine</Text>
                    <Text style={styles.subLocation}>Part of Christie Clinic LLC</Text>
                    <View style={styles.tags}>
                        <View style={styles.tagParts}>
                            <FontAwesome5 name={'crown'} size={16} color="#F98E46" />
                        </View>
                        <Text style={styles.tag}>Christie Clinic Provider</Text>
                        <Text style={styles.tagParts}>+2</Text>
                    </View>
                    <View style={styles.row}>
                        <MaterialCommunityIcons name="phone-outline" size={24} color="#A0AEBE" />
                        <Text style={styles.phoneNo}>(718) 389-8585</Text>
                    </View>
                    <View style={styles.row}>
                        <Octicons name="location" size={22} color="#A0AEBE" style={{ marginLeft: 5 }} />
                        <Text style={styles.address}>
                            <Text>Brooklyn, NY</Text>{'\n'}
                            <Text>934 Manhattan Ave</Text>
                        </Text>
                    </View>
                    <Text style={styles.distance}>1.24 miles away</Text>
                    <View style={styles.btnContainer}>
                        <Text onPress={() => { }} style={styles.btnPrimary}>Add to circle</Text>
                        <Text onPress={() => { }} style={styles.btnSecondary}>Review</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    card: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(6, 43, 84, 0.1)',
        backgroundColor: '#fff',
        flexDirection: 'row',
    },
    firstContainer: {
        padding: 16,
        alignItems: 'center'
    },
    secondContainer: {
        padding: 16,
        // flex: 1,
    },
    devider: {
        borderWidth: .5,
        borderColor: 'rgba(6, 43, 84, 0.1)'
    },
    imageConatiner: {
        height: 55,
        width: 55,
        overflow: 'hidden',
        borderRadius: 28,
        backgroundColor: '#f6f6f6'
    },
    image: {
        height: '100%',
        width: '100%',
        resizeMode: "cover",
        backgroundColor: '#f6f6f6'
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
        backgroundColor: '#F5B255',
        paddingVertical: 3,
        paddingHorizontal: 7,
        marginTop: 5,
        borderRadius: 10
    },
    rate: {
        color: '#fff',
        fontSize: 12,
        paddingLeft: 5,
        fontFamily: fonts.LATO_BOLD
    },
    reviews: {
        fontSize: 8,
        color: '#333',
        marginTop: 3,
        fontFamily: fonts.LATO_BOLD
    },
    badge: {
        textAlign: 'center',
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: '#6DD400',
        position: 'absolute',
        zIndex: 1,
        left: 13,
        top: 13,
        borderWidth: 2,
        borderColor: '#fff',
        height: 23,
        width: 23,
        alignItems: 'center',
        justifyContent: 'center'
    },
    promoted: {
        fontFamily: fonts.LATO_BOLD,
        fontSize: 12,
        color: '#F98E46',
        textAlign: 'center',
        paddingVertical: 6,
        paddingHorizontal: 10,
        textTransform: 'uppercase',
        backgroundColor: 'rgba(247,181,0,0.25)',
        borderRadius: 7,
        alignSelf: 'flex-start',
        marginBottom: 15
    },
    name: {
        fontFamily: fonts.LATO_BOLD,
        color: '#333',
        fontSize: 20,
        marginBottom: 7
    },
    title: {
        fontFamily: fonts.LATO_BOLD,
        fontSize: 12,
        color: 'rgba(51,51,51,0.87)',
        marginBottom: 5,
    },
    tags: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: -5,
        marginBottom: 20,
        flexWrap: 'wrap',
        marginTop: 6
    },
    tag: {
        fontFamily: fonts.LATO_BOLD,
        color: '#F68A56',
        fontSize: 12,
        backgroundColor: 'rgba(245,178,85,0.25)',
        borderRadius: 7,
        paddingVertical: 5,
        flex: 1,
        paddingHorizontal: 12,
        marginHorizontal: 5,
    },
    tagParts: {
        fontFamily: fonts.LATO_BOLD,
        color: '#F68A56',
        fontSize: 12,
        backgroundColor: 'rgba(245,178,85,0.25)',
        borderRadius: 7,
        paddingVertical: 5,
        paddingHorizontal: 12,
        marginHorizontal: 5,
    },
    phoneNo: {
        fontSize: 16,
        fontFamily: fonts.LATO_BOLD,
        color: '#333',
        marginLeft: 6,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    address: {
        color: 'rgba(51,51,51,0.54)',
        fontSize: 12,
        marginLeft: 6,
        fontFamily: fonts.LATO_BOLD
    },
    distance: {
        color: '#333',
        fontSize: 12,
        fontFamily: fonts.LATO_BOLD,
        marginLeft: 30,
    },
    btnContainer: {
        marginTop: 25,
        flexDirection: 'row',
        alignItems: 'center',
    },
    btnPrimary: {
        paddingVertical: 8,
        paddingHorizontal: 13,
        color: '#fff',
        fontSize: 12,
        fontFamily: fonts.LATO_BOLD,
        backgroundColor: '#F5B255',
        borderRadius: 18,
        textTransform: 'uppercase',
        borderWidth: 1,
        borderColor: '#F5B255',
        marginRight: 5,
    },
    btnSecondary: {
        paddingVertical: 8,
        marginLeft: 5,
        paddingHorizontal: 26,
        color: '#F5B255',
        fontSize: 12,
        fontFamily: fonts.LATO_BOLD,
        backgroundColor: '#fff',
        borderRadius: 18,
        textTransform: 'uppercase',
        borderWidth: 1,
        borderColor: '#F5B255',
    },
    subLocation: {
        color: '#0F74BD',
        fontSize: 12,
        fontFamily: fonts.LATO_BOLD,
        marginBottom: 5,
    }
})
export default CardsScreen
