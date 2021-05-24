import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, ScrollView } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import colors from '../../../constants/colors'
import Links from '../../../components/homeScreen/links'
import ShareModal from '../common/shareModal'
import fonts from '../../../constants/fonts'
import { getResourcesList, getPollsData } from '../../../redux/actions/resourcesAction'
import { addReaction } from '../../../redux/actions/profileActions'
import { reactionTypes, reactionOnType } from '../../../constants/const_values'
import Video from './video'
import Slides from './slides'
import Poll from './poll'

const ResourceDetails = (props: any) => {

    const dispatch = useDispatch()

    const { id, title, type } = props.route.params

    const { resourcesData } = useSelector((state: any) => state.profile);
    const { selectedCircle, userData } = useSelector((state: any) => state.app);

    const color = selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor;

    const [showModal, setShowModal] = useState<boolean>(false)
    const [detailInfo, setDetailInfo] = useState<any>({})

    const navigate = () => {
        props.navigation.navigate("Resources");
    }

    useEffect(() => {
        if (resourcesData && resourcesData[title]) {
            setDetailInfo(resourcesData[title][0])
        }
    }, [resourcesData])

    useEffect(() => {
        switch (type) {
            case 'poll':
            case 'trivia': {
                dispatch(getPollsData(1, 1, id, title))
                break;
            }
            case 'videos':
            case 'slideshows': {
                const body = {
                    "reacted_on_type": reactionOnType[type],
                    "reacted_on_id": id,
                    "reaction_type": reactionTypes['read'],
                    "user": userData.id
                }
                addReaction(selectedCircle.id, body)
                dispatch(getResourcesList(1, 1, title, selectedCircle.id, id))
                break;
            }
            default:
                break;
        }
    }, [props.route.params])

    const getBtnText = () => {
        switch (type) {
            case 'poll':
                return 'VIEW MORE RESOURCES'
            case 'trivia':
                return 'VIEW MORE RESOURCES'
            case 'videos':
                return 'WATCH ANOTHER VIDEO'
            case 'slideshows':
                return 'SHOW ANOTHER SLIDESHOW'
            default:
                return ''
        }
    }
    const getDescription = (string: string) => {
        let str = string.replace(/<p>/g, '')
        str = str?.replace(/<\/p>/g, '')
        return str
    }

    const getContent = () => {
        switch (type) {
            case 'poll':
                return (
                    <View>
                        <Poll data={detailInfo} title={title} color={color} userId={userData.id} circleId={selectedCircle.id} />
                    </View>
                )
            case 'trivia':
                return (
                    <View>
                        <Poll data={detailInfo} title={title} color={color} userId={userData.id} circleId={selectedCircle.id} />
                    </View>
                )
            case 'videos':
                return (
                    <View>
                        <Video uri={detailInfo?.ext_ref_id} />
                    </View>
                )
            case 'slideshows':
                return (
                    <View>
                        <Slides data={detailInfo?.article_attach} />
                    </View>
                )
            default:
                return <View></View>

        }
    }

    return (
        <ScrollView contentContainerStyle={styles.screen} nestedScrollEnabled={true}>
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.header}>Last Updated: {moment((type === 'poll' || type === 'trivia') ? detailInfo.updated_at : detailInfo.last_updated).format('DD/MM/YYYY')}</Text>
                    <View style={styles.body}>
                        {detailInfo?.article_title ? <Text style={styles.title}>{detailInfo.article_title}</Text> : null}
                        {getContent()}
                        {detailInfo?.article_description ? <Text style={styles.description}>{getDescription(detailInfo.article_description)}</Text> : null}
                    </View>
                    <View style={styles.footer}>
                        <TouchableOpacity onPress={() => setShowModal(true)} activeOpacity={.7} style={styles.share}>
                            <MaterialCommunityIcons name="share-variant" size={20} color={color} />
                            <Text style={styles.shareText}>Share</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={navigate} activeOpacity={.7} style={styles.next}>
                            <Text style={styles.actionText}>{getBtnText()}</Text>
                            <MaterialCommunityIcons name="arrow-right-circle" size={20} color={color} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Links color={color} />
            <ShareModal type={type} color={color} showModal={showModal} item={{ ...detailInfo, content_type: type }} selectedCircle={selectedCircle} userData={userData} setShowModal={setShowModal} />
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    screen: {
    },
    container: {
        backgroundColor: '#f6f6f6'
    },
    card: {
        margin: 20,
        padding: 10,
        backgroundColor: colors.secondary,
        borderRadius: 15,
        shadowColor: '#ccc',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
        overflow: 'hidden',
    },
    header: {
        width: '100%',
        textAlign: 'right',
        fontFamily: fonts.LATO_REGULAR,
        color: '#333',
        fontSize: 12,
        marginBottom: 10
    },
    body: {},
    title: {
        fontFamily: fonts.LATO_BOLD,
        width: '100%',
        fontSize: 18,
        marginVertical: 5
    },
    description: {
        fontFamily: fonts.LATO_REGULAR,
        color: '#444',
        width: '100%',
        fontSize: 15,
        marginVertical: 10
    },
    footer: {
        borderTopWidth: .5,
        paddingTop: 10,
        borderTopColor: '#888',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    share: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    shareText: {
        marginLeft: 5,
        fontFamily: fonts.LATO_BOLD,
        textTransform: 'uppercase',
        color: '#444',
    },
    next: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        fontFamily: fonts.LATO_BOLD,
        textTransform: 'uppercase',
        color: '#333',
        textAlign: 'center',
        marginRight: 5
    },
})

export default ResourceDetails
