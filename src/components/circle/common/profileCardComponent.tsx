import React, { useState } from 'react'
import { View, StyleSheet, Image, Platform, Alert } from 'react-native'
import colors from '../../../constants/colors'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import ImagePicker from 'react-native-image-picker';
import { useSelector, useDispatch } from 'react-redux';
import { uploadProfileImage } from '../../../redux/actions/homeScreenActions';
import { TouchableOpacity } from 'react-native-gesture-handler';

const ProfileCardComponent = (props: any) => {

    const [selectedImage, setSelectedImage] = useState<any>()
    const { selectedCircle, userData } = useSelector((state: any) => state.app)

    const dispatch = useDispatch()

    const chooseImage = async () => {
        try {
            const options = {
                title: 'Select Image',
                storageOptions: {
                    skipBackup: true,
                    path: 'images',
                    cameraRoll: true,
                    waitUntilSaved: true,
                },
            };
            ImagePicker.showImagePicker(options, response => {
                if (response.didCancel) {
                } else if (response.error) {
                } else if (response.customButton) {
                } else {
                    const file: any = {
                        uri: (Platform.OS === 'android') ? response.uri : response.uri.replace('file://', ''),
                        name: response.fileName ? response.fileName : `random_image.${response.type?.split('/')[1]}`,
                        type: response.type,
                    };
                    setSelectedImage(response)
                    dispatch(uploadProfileImage(file, userData.id, selectedCircle.id))
                }
            });
        } catch (error) {
            Alert.alert('Oops', error?.message)
        }
    }

    return (
        <View style={styles.card}>
            <View style={styles.circle}>
                {props.isOtherProfile ? null : <TouchableOpacity activeOpacity={.7} containerStyle={styles.iconCntainer} onPress={chooseImage}>
                    <MaterialIcons name="photo-camera" color={'#fff'} style={{ ...styles.cameraIcon, backgroundColor: props.color }} size={18} />
                </TouchableOpacity>}
                <View style={styles.imageHodlder}>
                    <Image source={{ uri: selectedImage?.uri ? selectedImage.uri : props.uri }} style={styles.image} />
                </View>
            </View>
            <View style={[styles.cardBody, props.profileCard]}>
                {props.children}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        marginTop: -110,
        marginHorizontal: 25
    },
    circle: {
        zIndex: 1,
        height: 80,
        width: 80,
        alignSelf: 'center',
        borderRadius: 40,
        shadowColor: 'black',
        elevation: 3,

    },
    cardBody: {
        marginTop: -40,
        backgroundColor: colors.secondary,
        padding: 15,
        minHeight: 120,
        borderRadius: 15,
        zIndex: -1,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
        overflow: 'hidden'
    },
    imageHodlder: {
        borderRadius: 40,
        overflow: 'hidden'
    },
    image: {
        height: '100%',
        width: '100%',
        resizeMode: "cover",
        backgroundColor: '#f6f6f6'
    },
    iconCntainer: {
        position: 'absolute',
        left: 55,
        top: -5,
        zIndex: 20,
        elevation: 4,
        height: 30,
        width: 30,
        borderRadius: 15,
        overflow: 'hidden'
    },
    cameraIcon: {
        height: 30,
        width: 30,
        borderRadius: 15,
        textAlign: 'center',
        padding: 5,
        overflow: 'hidden'

    }
})
export default ProfileCardComponent
