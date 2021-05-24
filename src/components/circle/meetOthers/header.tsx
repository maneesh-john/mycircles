import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import colors from '../../../constants/colors'
import fonts from '../../../constants/fonts'

const HeaderComponent = (props: any) => {

    const { color, selectedTab, setselectedTab }: any = props;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{`MEET OTHERS`}</Text>
            <Text style={styles.description}>You can use this section to add people or physician providers to your circle by searching for them using various parameters such as location, gender, or specialty (for adding a physician).</Text>
            <View style={{ ...styles.tabs, borderColor: color }}>
                <Text onPress={() => setselectedTab(0)} style={{ ...styles.tab, backgroundColor: selectedTab === 0 ? color : colors.secondary, color: selectedTab === 0 ? colors.secondary : '#333' }}>People</Text>
                <Text onPress={() => setselectedTab(1)} style={{ ...styles.tab, backgroundColor: selectedTab === 1 ? color : colors.secondary, color: selectedTab === 1 ? colors.secondary : '#333' }}>Invite Others</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: colors.secondary,
        borderRadius: 15,
        shadowColor: '#ccc',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
        overflow: 'hidden',
    },
    title: {
        fontSize: 18,
        paddingBottom: 8,
        fontFamily: fonts.LATO_BOLD
    },
    description: {
        paddingBottom: 15,
        fontFamily: fonts.LATO_REGULAR
    },
    tabs: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        borderWidth: 1,
        borderRadius: 30,
        overflow: 'hidden'
    },
    tab: {
        paddingVertical: 12,
        paddingHorizontal: 5,
        flex: 1,
        textAlign: 'center',
        fontFamily: fonts.LATO_BOLD,
        textTransform: 'uppercase'
    }
})

export default HeaderComponent
