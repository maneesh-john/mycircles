import React, { useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import CoverImagePicker from '../profile/coverImagePicker';

const CoverPictureComponent = ({ uri, color, isOtherProfile }: any) => {
    const [selectedImage, setSelectedImage] = useState<any>()
    const [showModal, setShowModal] = useState<boolean>(false)
    const chooseImage = () => {
        setShowModal(true)
    }

    return (
        <View style={styles.imageHolder}>
            {isOtherProfile ? null : <MaterialIcons onPress={chooseImage} name="photo-camera" color={'#fff'} style={{ ...styles.cameraIcon, backgroundColor: color }} size={18} />}
            <Image source={{ uri: selectedImage?.uri ? selectedImage.uri : uri }} style={styles.image} />
            <CoverImagePicker showModal={showModal} setShowModal={setShowModal} setSelectedImage={setSelectedImage} />
        </View>
    )
}

const styles = StyleSheet.create({
    imageHolder: {
        height: 240
    },
    image: {
        height: '100%',
        width: '100%',
        resizeMode: "cover"
    },
    cameraIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
        textAlign: 'center',
        padding: 5,
        borderRadius: 15,
        overflow: 'hidden'
    }
})

export default CoverPictureComponent
