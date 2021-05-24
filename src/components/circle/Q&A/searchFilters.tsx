import React, { useState } from 'react'
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../../../constants/colors';
import SelectCategory from './selectCategory';
import fonts from '../../../constants/fonts';

const SearchFilters = (props: any) => {
    const { color, questionCategories, search }: any = props;
    const [input, setinput] = useState<string>('');
    const [selectedCategory, setselectedCategory] = useState<any>();
    const [openCategoryModal, setopenCategoryModal] = useState<boolean>(false);

    const onSelect = (type?: any) => {
        setopenCategoryModal(false)
        setselectedCategory(type)
    }

    return (
        <View style={{ ...styles.section, borderColor: color }}>
            <TouchableOpacity activeOpacity={.7} onPress={() => { setopenCategoryModal(true) }} style={styles.category}>
                <Text style={styles.categoryText} >
                    {selectedCategory ? selectedCategory.display_name : `Select category`}
                </Text>
                <AntDesign name="down" size={18} color={'#333'} style={{ paddingRight: 5 }} />
            </TouchableOpacity>
            <View style={{ width: 1, height: 50, backgroundColor: color }}></View>
            <TextInput
                style={styles.input}
                placeholder={'Search Question'}
                placeholderTextColor='#888'
                value={input}
                onChangeText={(value: any) => setinput(value)}
            />
            <TouchableOpacity activeOpacity={.7} onPress={() => search(input, selectedCategory)} style={{ ...styles.btn, backgroundColor: color }}>
                <AntDesign name="search1" size={20} color={colors.secondary} />
            </TouchableOpacity>
            {openCategoryModal && <SelectCategory color={color} selectedCategory={selectedCategory} onSelect={onSelect} openCategoryModal={openCategoryModal} setopenCategoryModal={setopenCategoryModal} questionCategories={questionCategories} />}
        </View>
    )
}
const styles = StyleSheet.create({
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        borderWidth: 1,
        borderRadius: 15,
        height: 50,
        overflow: 'hidden',
    },
    input: {
        flex: 1,
        paddingHorizontal: 5,
        color: '#333',
        fontFamily: fonts.LATO_REGULAR
    },
    category: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        paddingHorizontal: 3,
    },
    categoryText: {
        fontSize: 14,
        textAlign: 'center',
        color: '#333',
        flex: 1,
        fontFamily: fonts.LATO_REGULAR

    },
    btn: {
        height: 50,
        width: 35,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default SearchFilters
