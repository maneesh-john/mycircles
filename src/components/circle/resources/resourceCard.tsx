import React, { useState } from 'react'
import { View, StyleSheet, Image, Text, TouchableOpacity, Linking } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'
import colors from '../../../constants/colors'
import fonts from '../../../constants/fonts'
import ShareModal from '../common/shareModal'
import { REDIRECT_URL } from '../../../constants/config'
import { addReaction } from '../../../redux/actions/profileActions'
import { reactionOnType, reactionTypes } from '../../../constants/const_values'

const IMAGE_URL = require('../../../assets/images/logo.png')

const ResourceCard = ({ data, type, color, selectedCircle, userData, title, otherScreen }: any) => {
    const navigation = useNavigation()
    const [showModal, setShowModal] = useState<boolean>(false)

    const getImageUrl = () => {
        switch (type) {
            case 'articles':
                return data?.article_attach?.file
            case 'poll':
                return data?.poll_attach?.file
            case 'trivia':
                return data?.poll_attach?.file
            case 'videos':
                return data?.article_attach?.file
            case 'slideshows':
                return data?.article_attach[0]?.main_image
            default:
                return ''
        }
    }

    const getDescription = () => {
        switch (type) {
            case 'articles': {
                let str = data?.article_description.replace(/<p>/g, '')
                str = str.replace(/<\/p>/g, '')
                return str
            }
            case 'poll':
                return data?.poll_question
            case 'trivia':
                return data?.poll_question
            case 'videos':
                return ''
            case 'slideshows': {
                let str = data?.article_description.replace(/<p>/g, '')
                str = str.replace(/<\/p>/g, '')
                return str
            }
            default:
                return ''
        }
    }

    const getCountText = () => {
        switch (type) {
            case 'articles':
                return `This article has been read ${data.read} times.`
            case 'poll':
                return `This poll has been taken ${data.no_of_attempts} times.`
            case 'trivia':
                return `This trivia has been taken ${data.no_of_attempts} times.`
            case 'videos':
                return `This video has been watched ${data.read} times.`
            case 'slideshows':
                return `This video has been viewed ${data.read} times.`
            default:
                return ''
        }
    }

    const navigateToDetails = () => {
        if (otherScreen) {
            navigation.navigate(
                'Home',
                {
                    screen: 'ResourcesScreen',
                    initial: false,
                    params: {
                        screen: 'ResourceDetails',
                        initial: false,
                        params: {
                            title,
                            type,
                            id: data.id
                        }
                    }
                })
        } else {
            navigation.navigate('ResourceDetails', {
                title,
                type,
                id: data.id
            })
        }
    }

    const reactAndOpen = () => {
        const body = {
            "reacted_on_type": reactionOnType[type],
            "reacted_on_id": data.id,
            "reaction_type": reactionTypes['read'],
            "user": userData.id
        }
        addReaction(selectedCircle.id, body)
        Linking.openURL(`${REDIRECT_URL}${data.article_share}`)
    }

    const getActionButtons = () => {
        switch (type) {
            case 'articles':
                return (<Text onPress={reactAndOpen} style={{ ...styles.action, color }}>Learn more</Text>)
            case 'poll':
                return (
                    <View style={styles.actionContainer}>
                        <TouchableOpacity onPress={() => setShowModal(true)} activeOpacity={.7} style={styles.share}>
                            <MaterialCommunityIcons name="share-variant" size={20} color={color} />
                            <Text style={styles.shareText}>Share</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={.7} onPress={navigateToDetails} style={{ ...styles.btn, backgroundColor: color }}>
                            <Text style={styles.actionText}>Take Poll</Text>
                        </TouchableOpacity>
                    </View>
                )
            case 'trivia':
                return (
                    <View style={styles.actionContainer}>
                        <TouchableOpacity onPress={() => setShowModal(true)} activeOpacity={.7} style={styles.share}>
                            <MaterialCommunityIcons name="share-variant" size={20} color={color} />
                            <Text style={styles.shareText}>Share</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={navigateToDetails} activeOpacity={.7} style={{ ...styles.btn, backgroundColor: color }}>
                            <Text style={styles.actionText}>Take Trivia</Text>
                        </TouchableOpacity>
                    </View>
                )
            case 'videos':
                return (<Text onPress={navigateToDetails} style={{ ...styles.action, color }}>Watch</Text>)
            case 'slideshows':
                return (<Text onPress={navigateToDetails} style={{ ...styles.action, color }}>Show</Text>)
            default:
                return <View></View>
        }
    }

    return (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <Image source={getImageUrl() ? { uri: getImageUrl() } : IMAGE_URL} style={{ ...styles.image, resizeMode: getImageUrl() ? 'cover' : "contain" }} />
            </View>
            {data.article_title ? <Text style={styles.title}>{data.article_title}</Text> : null}
            <Text style={styles.description}>{getDescription()}</Text>
            <Text style={styles.count}>{getCountText()}</Text>
            {getActionButtons()}
            {showModal && <ShareModal type={type} color={color} showModal={showModal} item={{ ...data, content_type: type }} selectedCircle={selectedCircle} userData={userData} setShowModal={setShowModal} />}
        </View>
    )
}
const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.secondary,
        borderRadius: 15,
        shadowColor: '#ccc',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
        overflow: 'hidden',
        padding: 15,
        marginVertical: 5,
    },
    imageContainer: {
        height: 150,
        width: '100%',
        marginBottom: 10,
    },
    image: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover'
    },
    title: {
        fontFamily: fonts.LATO_BOLD,
        fontSize: 16,
        marginBottom: 5
    },
    description: {
        marginVertical: 5,
        fontFamily: fonts.LATO_REGULAR,
        color: '#444'
    },
    count: {
        fontFamily: fonts.LATO_REGULAR,
        color: '#333'
    },
    action: {
        fontFamily: fonts.LATO_BOLD,
        fontSize: 15,
        width: '100%',
        marginTop: 10,
        textAlign: 'right'
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 15
    },
    share: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 15,
    },
    shareText: {
        marginLeft: 5,
        fontFamily: fonts.LATO_BOLD,
        textTransform: 'uppercase',
        color: '#444',
    },
    btn: {
        borderRadius: 15,
        paddingVertical: 8,
        paddingHorizontal: 15
    },
    actionText: {
        fontFamily: fonts.LATO_BOLD,
        textTransform: 'uppercase',
        color: colors.secondary,
        width: '100%',
        textAlign: 'center'
    },
})
export default ResourceCard