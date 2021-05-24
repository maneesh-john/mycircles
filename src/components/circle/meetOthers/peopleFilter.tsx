import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../../../constants/colors';
import fonts from '../../../constants/fonts';
import SelectCategory from '../Q&A/selectCategory';

const PeopleFilter = (props: any) => {

    const ageList: Array<{ display_name: string, id: number }> = [
        {
            display_name: '0-9',
            id: 10
        },
        {
            display_name: '0-10',
            id: 20
        },
        {
            display_name: '20-30',
            id: 30
        },
        {
            display_name: '30-40',
            id: 40
        },
        {
            display_name: '40-50',
            id: 50
        },
        {
            display_name: '50-60',
            id: 60
        },
        {
            display_name: '60-70',
            id: 70
        },
        {
            display_name: '70-80',
            id: 80
        },
        {
            display_name: '80-90',
            id: 90
        },
        {
            display_name: '90-100',
            id: 100
        },
    ];

    const { color, searchPeopleFilter, location, setLocation, searchLocation } = props;
    const [age, setAge] = useState<{ display_name: string, id: number }>()
    const [gender, setGender] = useState<string>()
    const [username, setUsername] = useState<string>()
    const [showFilters, setshowFilters] = useState<boolean>(false)
    const [openCategoryModal, setopenCategoryModal] = useState<boolean>(false);

    const toggleFiltersVisibility = () => setshowFilters(!showFilters)

    const clearAll = () => {
        setAge(undefined)
        setGender(undefined)
        setUsername(undefined)
        searchPeopleFilter()
    }

    const selectedAge = (age: any) => {
        setAge(age)
        setopenCategoryModal(false)
    }

    const submitFilter = () => {
        searchPeopleFilter({
            age: age?.id ? age.id : undefined,
            username,
            gender
        })
    }

    return (
        <View style={styles.container}>
            <View style={{ ...styles.section, borderColor: color }}>
                <TextInput
                    style={styles.location}
                    placeholder={'Search location'}
                    placeholderTextColor='#888'
                    value={location}
                    onChangeText={(value: any) => setLocation(value)}
                />
                <TouchableOpacity activeOpacity={.7} onPress={searchLocation} style={{ ...styles.btn, backgroundColor: color }}>
                    <AntDesign name="search1" size={20} color={colors.secondary} />
                </TouchableOpacity>
            </View>
            <View style={styles.row}>
                <Text style={styles.filterToggle} onPress={toggleFiltersVisibility}>{showFilters ? 'Hide' : 'Show'} Filters</Text>
                {showFilters ? <Text style={{ ...styles.clearFilter, color }} onPress={clearAll}>Clear Filters</Text> : null}
            </View>
            {showFilters && <View>
                <View>
                    <Text style={styles.label}>Age</Text>
                    <TouchableOpacity activeOpacity={.7} onPress={() => { setopenCategoryModal(true) }} style={{ ...styles.category, borderColor: color }}>
                        <Text style={styles.categoryText} >
                            {age?.display_name ? age.display_name : `Select Age`}
                        </Text>
                        <AntDesign name="down" size={18} color={'#333'} style={{ paddingRight: 5 }} />
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={styles.label}>Gender</Text>
                    <View style={{ ...styles.tabs, borderColor: color }}>
                        <Text onPress={() => setGender('male')} style={{ ...styles.tab, backgroundColor: gender === 'male' ? color : colors.secondary, color: gender === 'male' ? colors.secondary : '#333' }}>Male</Text>
                        <View style={{ width: 1.2, height: 40, backgroundColor: color }}></View>
                        <Text onPress={() => setGender('female')} style={{ ...styles.tab, backgroundColor: gender === 'female' ? color : colors.secondary, color: gender === 'female' ? colors.secondary : '#333' }}>Female</Text>
                    </View>
                </View>
                <View>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={{ ...styles.username, borderColor: color }}
                        placeholder={'Search username'}
                        placeholderTextColor='#888'
                        value={username}
                        onChangeText={(value: any) => setUsername(value)}
                    />
                </View>
                <Text onPress={submitFilter} style={{ ...styles.submit, backgroundColor: color }}>Apply</Text>
            </View>}
            {openCategoryModal && <SelectCategory color={color} selectedCategory={age} onSelect={selectedAge} openCategoryModal={openCategoryModal} setopenCategoryModal={setopenCategoryModal} questionCategories={ageList} />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        borderWidth: 1,
        borderRadius: 15,
        height: 50,
        overflow: 'hidden',
    },
    location: {
        flex: 1,
        paddingHorizontal: 10,
        height: 50,
        color: '#333',
        fontFamily: fonts.LATO_REGULAR,
        backgroundColor: colors.secondary
    },
    btn: {
        height: 50,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    filterToggle: {
        textDecorationLine: 'underline',
        fontFamily: fonts.LATO_BOLD,
        fontSize: 16
    },
    clearFilter: {
        fontFamily: fonts.LATO_REGULAR,
        marginLeft: 15,
        fontSize: 15,
        color: '#444'
    },
    label: {
        fontFamily: fonts.LATO_BOLD,
        fontSize: 15,
        marginVertical: 5,
        width: '100%',
        textAlign: 'center',
        marginTop: 10
    },
    category: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        paddingHorizontal: 3,
        backgroundColor: colors.secondary,
        borderRadius: 5,
        borderWidth: 1,
    },
    categoryText: {
        fontSize: 14,
        textAlign: 'center',
        color: '#333',
        flex: 1,
        fontFamily: fonts.LATO_REGULAR

    },
    tabs: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 15,
        overflow: 'hidden'
    },
    tab: {
        paddingVertical: 12,
        paddingHorizontal: 5,
        flex: 1,
        textAlign: 'center',
        fontFamily: fonts.LATO_REGULAR
    },
    username: {
        paddingHorizontal: 10,
        color: '#333',
        fontFamily: fonts.LATO_REGULAR,
        backgroundColor: colors.secondary,
        borderWidth: 1,
        borderRadius: 5,
        overflow: 'hidden',
        height: 40
    },
    submit: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        color: colors.secondary,
        borderRadius: 15,
        overflow: 'hidden',
        alignSelf: 'center',
        marginVertical: 10,
        fontFamily: fonts.LATO_BOLD
    }
})

export default PeopleFilter
