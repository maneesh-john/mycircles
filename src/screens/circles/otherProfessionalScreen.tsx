import React from 'react'
import { Text, View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import { useSelector } from 'react-redux';

const OPTIONS: Array<{ key: string, value: string }> = [
    { key: "", value: "Anesthesiology Assistant" },
    { key: "", value: "Certified Clinical Nurse Specialist (Cns)" },
    { key: "", value: "Certified Nurse Midwife (Cnm)" },
    { key: "", value: "Certified Registered Nurse Anesthetist (Crna)" },
    { key: "", value: "Chiropractic" },
    { key: "", value: "Clinical Social Worker" },
    { key: "", value: "Nurse Practitioner" },
    { key: "", value: "Occupational Therapy" },
    { key: "", value: "Optometry" },
    { key: "", value: "Physical Therapy" },
    { key: "", value: "Physician Assistant" },
    { key: "", value: "Clinical Psychologist" },
    { key: "", value: "Qualified Audiologist" },
    { key: "", value: "Qualified Speech Language Pathologist" },
    { key: "", value: "Registered Dietitian Or Nutrition Professional" },
];

const OtherProfessionalScreen = (props: any) => {
    const { selectedCircle } = useSelector((state: any) => state.app);
    const color = selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor;

    return (
        <ScrollView contentContainerStyle={styles.screen}>
            <View style={styles.card}>
                <Text style={styles.title}>Other Health Professionals</Text>
                <Text style={styles.description}>You can search for other healthcare professionals (non-physicians) from over hundred thousand profiles on DoveMed database and add or recommend them to your circles, based on your location.</Text>
                <View style={styles.grid}>
                    {OPTIONS.map(rs => (
                        <TouchableOpacity onPress={() => { props.navigation.navigate("OtherDirectoryDetails", { type: rs.value }) }} activeOpacity={0.8} style={[styles.item, { borderColor: color }]} key={rs.value}>
                            <Text style={styles.label}>{rs.value}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        paddingHorizontal: 10,
        paddingVertical: 20
    },
    card: {
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
        fontFamily: fonts.LATO_BOLD,
        textTransform: "uppercase",
        color: '#333333',
        fontSize: 18,
        marginBottom: 20,
        width: '100%',
        textAlign: 'center'
    },
    description: {
        fontFamily: fonts.LATO_REGULAR,
        color: '#333333',
        fontSize: 15,
        marginBottom: 20,
        width: '100%',
        textAlign: 'center'
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    item: {
        width: '45%',
        marginHorizontal: '2.5%',
        marginVertical: 10,
        borderWidth: 1,
        borderRadius: 22,
        minHeight: 80,
        alignItems: 'center',
        padding: 10,
        justifyContent: 'center'
    },
    label: {
        fontFamily: fonts.LATO_BOLD,
        textTransform: "uppercase",
        color: '#333333',
        textAlign: 'center'
    }
})

export default OtherProfessionalScreen;