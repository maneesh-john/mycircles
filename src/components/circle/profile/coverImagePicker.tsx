import React, { useEffect, useState } from 'react'
import { StyleSheet, Modal, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, FlatList, Alert, Image, SafeAreaView } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useSelector, useDispatch } from 'react-redux'
import colors from '../../../constants/colors'
import { getMainCoverCategories, getSubCoverCategories, getCoverImages } from '../../../redux/actions/profileActions'
import { updateUserData } from '../../../redux/actions/homeScreenActions'
import fonts from '../../../constants/fonts'

const CoverImagePicker = (props: any) => {

    const dispatch = useDispatch()

    const { selectedCircle, userData } = useSelector((state: any) => state.app)
    const { mainCoverCategories, subCoverCategories, coverImages } = useSelector((state: any) => state.profile)

    const color = selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor;

    const [selectedMainCategory, setSelectedMainCategory] = useState<any>({})
    const [selectedSubCategory, setSelectedSubCategory] = useState<any>({})
    const [selectedImage, setSelectedImage] = useState<any>({})


    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        if (props.showModal) {
            (async () => {
                setIsLoading(true)
                await dispatch(getMainCoverCategories())
                setIsLoading(false)
            })()
        }
    }, [props.showModal])

    useEffect(() => {
        if (selectedMainCategory && Object.keys(selectedMainCategory).length) {
            (async () => {
                setIsLoading(true)
                await dispatch(getSubCoverCategories(selectedMainCategory.id))
                setIsLoading(false)
            })()
        }
    }, [selectedMainCategory])


    useEffect(() => {
        if (selectedSubCategory && Object.keys(selectedSubCategory).length) {
            (async () => {
                setIsLoading(true)
                try {
                    await dispatch(getCoverImages(selectedSubCategory.id))
                } catch (error) {
                    Alert.alert('Oops', error.message)
                }
                setIsLoading(false)
            })()
        }
    }, [selectedSubCategory])

    const closeModal = () => {
        setSelectedMainCategory([])
        setSelectedSubCategory([])
        setSelectedImage([])
        props.setShowModal(false)
    }

    const selectImage = (item: any) => {
        setSelectedImage((prev: any) => {
            if (item.id === prev.id) {
                return {}
            } else {
                return item
            }
        })
    }

    const onsave = async () => {
        setIsLoading(true)
        try {
            const body = {
                bg_img: selectedImage.id
            }
            await dispatch(updateUserData(userData.id, selectedCircle.id, body))
            closeModal()
        } catch (error) {
            Alert.alert('Oops', error.message)
        }
        setIsLoading(false)
    }

    return (
        <Modal transparent={false} onRequestClose={closeModal} animationType="slide" visible={props.showModal}>
            <SafeAreaView style={{ flex: 1 }}>
                {isLoading ? <View style={styles.activityIndication}>
                    <ActivityIndicator size={40} color={color} />
                </View> : null}
                <View style={styles.modalContainer}>
                    <View style={styles.container}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.headerText}>Choose Image</Text>
                            <MaterialIcons name="close" size={25} color={'#333'} onPress={closeModal} />
                        </View>
                        <View style={{ padding: 10 }}>
                            {mainCoverCategories.length ?
                                <ScrollView horizontal={true}>
                                    {
                                        mainCoverCategories.map((category: any) => (
                                            <TouchableOpacity style={{ ...styles.mainCategory, borderColor: color, backgroundColor: (category.id === selectedMainCategory.id) ? color : colors.secondary }} onPress={() => setSelectedMainCategory(category)} key={category.id} activeOpacity={.7}>
                                                <Text style={{ fontFamily: fonts.LATO_BOLD, color: (category.id === selectedMainCategory.id) ? colors.secondary : '#333' }}>{category.display_name}</Text>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </ScrollView> : null}
                            {subCoverCategories.length ?
                                <ScrollView horizontal={true}>
                                    {
                                        subCoverCategories.map((category: any) => (
                                            <TouchableOpacity style={{ ...styles.subCategory, borderColor: color, backgroundColor: (category.id === selectedSubCategory.id) ? color : colors.secondary }} onPress={() => setSelectedSubCategory(category)} key={category.id} activeOpacity={.7}>
                                                <Text style={{ fontFamily: fonts.LATO_REGULAR, color: (category.id === selectedSubCategory.id) ? colors.secondary : '#333' }}>{category.display_name}</Text>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </ScrollView> : null}
                        </View>
                        <FlatList
                            data={coverImages}
                            keyExtractor={(item) => `${item.id}`}
                            numColumns={2}
                            renderItem={(itemData) => (<View style={styles.imgList}>
                                <TouchableOpacity activeOpacity={.7} onPress={() => selectImage(itemData.item)} style={{ ...styles.imgContainer, borderColor: (selectedImage.id === itemData.item.id) ? color : colors.secondary }}>
                                    {selectedImage.id === itemData.item.id ? <MaterialIcons size={16} color={colors.secondary} name="done" style={{ ...styles.tick, backgroundColor: color }} /> : null}
                                    <Image source={{ uri: itemData.item.url }} style={styles.img}></Image>
                                </TouchableOpacity>
                            </View>)}
                        />
                        <View style={styles.modalFooter}>
                            <TouchableOpacity activeOpacity={.7} style={{ ...styles.btn, borderColor: color }} onPress={closeModal}>
                                <Text style={{ ...styles.btnText, color: color }}>Close</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={.7} onPress={onsave} style={{ ...styles.btn, borderColor: color, backgroundColor: color }}>
                                <Text style={{ ...styles.btnText }}>Select</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </Modal >
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'rgba(0,0,0,.8)',
        paddingVertical: 20,
        paddingHorizontal: 10,
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.secondary
    },
    activityIndication: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,.8)'
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 15,
        backgroundColor: '#f6f6f6',
    },
    headerText: {
        color: '#333',
        fontSize: 16,
        fontFamily: fonts.LATO_REGULAR,
        letterSpacing: .2,
        textTransform: 'uppercase'
    },
    modalBody: {
        flex: 1,
        paddingHorizontal: 5,
        paddingVertical: 15,
    },
    modalFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    btn: {
        minWidth: 120,
        paddingVertical: 10,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        borderWidth: 1
    },
    btnText: {
        fontSize: 16,
        textTransform: 'uppercase',
        color: colors.secondary,
        fontFamily: fonts.LATO_BOLD
    },
    mainCategory: {
        marginVertical: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        minWidth: 120,
        borderRadius: 10,
        borderWidth: 1,
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    subCategory: {
        marginVertical: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        minWidth: 100,
        borderRadius: 10,
        borderWidth: 1,
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imgContainer: { borderRadius: 3, borderWidth: .8, padding: 5 },
    imgList: {
        height: 110,
        width: '50%',
        paddingHorizontal: 10
    },
    img: {
        height: '100%',
        width: '100%',
        resizeMode: "cover",
        borderRadius: 3,
        backgroundColor: '#f4f4f4'
    },
    tick: {
        position: 'absolute',
        right: 6,
        top: 6,
        zIndex: 1,
        textAlignVertical: 'center',
        textAlign: 'center',
        height: 20,
        width: 20,
        borderRadius: 15
    }
})

export default CoverImagePicker
