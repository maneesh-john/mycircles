import React, { useState, useEffect } from 'react'
import { View, Image, TextInput, StyleSheet, Dimensions, Text, Alert, Platform, PermissionsAndroid } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import ImagePicker from 'react-native-image-picker';
import colors from '../../../constants/colors';
import { getPostComments, processAndUploadImage, postCommentsOnQuestion, addReaction, removeReaction, getPostSubComments } from '../../../redux/actions/profileActions';
import { reactionTypes, reactionOnType } from '../../../constants/const_values'
import Comments from './comments';
import Geolocation from 'react-native-geolocation-service';
import fonts from '../../../constants/fonts';

const PAGE_ITEM: number = 1;

const PostComments = ({ userProfileInfo, item, selectedCircle, userData, color, showComments, setCounts, settoggleComment }: any) => {
    const [comment, setComment] = useState('');
    const [page, setPage] = useState(1);
    const [total, settotal] = useState(0);
    const [selectedImages, setSelectedImages] = useState<Array<any>>([])
    const [selectedImageNames, setSelectedImageNames] = useState<Array<string>>([])
    const [comments, setComments] = useState<any>({
        data: [],
        paginator: {}
    })
    const [showReplyIndex, setShowReplyIndex] = useState<number>(-1);
    const [replyTo, setReplyTo] = useState<any>({});
    const [reply, setReply] = useState<string>('')
    const [replies, setReplies] = useState<Array<any>>([])
    const [updating, setupdating] = useState<boolean>(false)

    const updateCommentsInfo = async (_comments: Array<any>): Promise<Array<any>> => {
        return _comments.map((res: any) => {
            res['_myreactions'] = {
                'hugs': { value: false },
                'flaged': { value: false },
                'likes': { value: false }
            }
            const hugs = res.my_reaction.find((i: any) => i.reaction_type === reactionTypes['hugs'])
            const likes = res.my_reaction.find((i: any) => i.reaction_type === reactionTypes['likes'])
            const flaged = res.my_reaction.find((i: any) => i.reaction_type === reactionTypes['flaged'])
            if (hugs) {
                res['_myreactions']['hugs'] = {
                    value: true,
                    id: hugs.id
                }
            }
            if (likes) {
                res['_myreactions']['likes'] = {
                    value: true,
                    id: likes.id
                }
            }
            if (flaged) {
                res['_myreactions']['flaged'] = {
                    value: true,
                    id: flaged.id
                }
            }
            return res;
        })
    }

    const getData = async () => {
        const res = await getPostComments(1, page * PAGE_ITEM, item.id);
        res.data = await updateCommentsInfo(res.data)
        setComments(res)
        settotal(res.paginator.total_count)
    }

    const getReplies = async (id: number) => {
        setReplies([])
        const res = await getPostSubComments(id);
        if (res && res.data) {
            const data = await updateCommentsInfo(res.data)
            setReplies(data)
        }
    }

    useEffect(() => {
        if (showComments) {
            getData()
        }
    }, [showComments, page])

    useEffect(() => {
        return () => {
            setPage(1);
            settotal(0);
            setComments({
                data: [],
                paginator: {}
            })
        }
    }, [])
    useEffect(() => {
        if (!showComments) {
            setPage(1);
            settotal(0);
            setComments({
                data: [],
                paginator: {}
            })
        }
    }, [showComments])

    const chooseImage = async () => {
        const options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
                cameraRoll: true,
                waitUntilSaved: true,
            },
        };
        ImagePicker.showImagePicker(options, async response => {
            if (response.didCancel) {
            } else if (response.error) {
            } else if (response.customButton) {
            } else {
                const file: any = {
                    uri: (Platform.OS === 'android') ? response.uri : response.uri.replace('file://', ''),
                    name: response.fileName ? response.fileName : `random_image.${response.type?.split('/')[1]}`,
                    type: response.type,
                };
                const filename: string = await processAndUploadImage(file)
                file.id = selectedImages.length + 1;
                setSelectedImageNames(prev => [...prev, filename])
                setSelectedImages(prev => [...prev, file])
            }
        });
    }


    const updateMyReaction = async (_comment: any, type: string, isReply: boolean = false) => {
        if (updating) return;
        setupdating(true)
        try {
            if (_comment?._myreactions[type]?.value) {
                await removeReaction(_comment._myreactions[type].id)
                if (isReply) {
                    setReplies((prev: any) => {
                        const _state = prev.map((rs: any) => {
                            if (rs.id === _comment.id) {
                                rs['_myreactions'][type] = { value: false };
                                rs['reaction'][type] -= 1
                                return rs;
                            } else {
                                return rs;
                            }
                        });
                        return _state;
                    })
                } else {
                    setComments((prev: any) => {
                        const _state = { ...prev };
                        _state.data = _state?.data?.map((rs: any) => {
                            if (rs.id === _comment.id) {
                                rs['_myreactions'][type] = { value: false };
                                rs['reaction'][type] -= 1
                                return rs;
                            } else {
                                return rs;
                            }
                        });
                        return _state;
                    })
                }
            } else {
                const body = {
                    "reacted_on_type": reactionOnType['comment'],
                    "reacted_on_id": _comment.id,
                    "user": userData.id,
                    "reaction_type": reactionTypes[type]
                }
                const res: any = await addReaction(selectedCircle.id, body)
                if (isReply) {
                    setReplies((prev: any) => {
                        const _state = prev.map((rs: any) => {
                            if (rs.id === _comment.id) {
                                rs['_myreactions'][type] = { value: true, id: res.data.id };
                                rs['reaction'][type] += 1
                                return rs;
                            } else {
                                return rs;
                            }
                        });
                        return _state;
                    })
                } else {
                    setComments((prev: any) => {
                        const _state = { ...prev };
                        _state.data = _state?.data?.map((rs: any) => {
                            if (rs.id === _comment.id) {
                                rs['_myreactions'][type] = { value: true, id: res.data.id };
                                rs['reaction'][type] += 1
                                return rs;
                            } else {
                                return rs;
                            }
                        });
                        return _state;
                    })
                }

            }
        } catch (error) {
            Alert.alert('Oops', error.message)
        }
        setupdating(false)
    }

    const getColor = (comment: any) => {
        switch (comment.user[0].role) {
            case 'patient':
                return colors.secondary;
            case 'caregiver':
                return colors.secondary;
            case 'advocate':
                return colors.secondary;
            case 'hcp':
                return colors.secondary;
            case 'doctor':
                return 'rgb(214, 246, 251)';
            case 'admin':
                return 'rgb(235, 252, 245)';
            default:
                return colors.secondary;
        }
    }

    const commentSave = async (location: any, coment: any, index: number) => {
        try {
            const body = {
                "post_parent_id": item.id,
                "comment_text": comment,
                "user": userData.id,
                "comment_attach": selectedImageNames,
                "commented_on_type": reactionOnType[item.content_type],
                "commented_on_id": item.id,
                "latlong": { "lat": location.coords.latitude, "lon": location.coords.longitude },
            }
            await postCommentsOnQuestion(selectedCircle.id, body)
            setComment('');
            setSelectedImageNames([]);
            setSelectedImages([]);
            if (showComments) {
                await getData()

            } else {
                settoggleComment(true)
            }
            setCounts((prev: any) => {
                return { ...prev, comment: prev.comment ? prev.comment + 1 : 1 }
            })
        } catch (error) {
            Alert.alert('Oops', error.message)
        }
    }

    const getLocations = async (cb: any, comment?: any, index?: number) => {
        try {
            let permisson;
            if (Platform.OS === 'android') {
                permisson = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            } else if (Platform.OS === 'ios') {
                permisson = await Geolocation.requestAuthorization('whenInUse')
            }
            if (permisson === 'granted') {
                Geolocation.getCurrentPosition(
                    (position) => {
                        cb(position, comment, index)
                    },
                    (error) => {
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );
            }
        } catch (error) {
            console.log(error)
        }
    }

    const postComment = async () => {
        if (comment) {
            getLocations(commentSave)
        }
    }

    const replySave = async (location: any, comment: any, index: number) => {
        try {
            const body = {
                "post_parent_id": item.id,
                "comment_text": reply,
                "user": userData.id,
                "commented_on_type": reactionOnType.comment,
                "commented_on_id": comment.id,
                "latlong": { "lat": location.coords.latitude, "lon": location.coords.longitude },
            }
            await postCommentsOnQuestion(selectedCircle.id, body)
            setReply('');
            setComments((prev: any) => {
                const _state = { ...prev }
                _state.data[index].comments_count += 1;
                return _state;
            })
            setCounts((prev: any) => {
                return { ...prev, comment: prev.comment + 1 }
            })
            await getReplies(comment.id)
        } catch (error) {
            Alert.alert('Oops', error.message)
        }
    }

    const postReply = async (comment: any, index: number) => {
        if (reply) {
            getLocations(replySave, comment, index)
        }
    }

    useEffect(() => {
        setReplyTo({})
        setReply('')
        if (showReplyIndex >= 0) {
            const _replyto = comments.data[showReplyIndex]
            setReplyTo(_replyto)
            getReplies(_replyto.id)
        }
    }, [showReplyIndex])

    const removeImage = (index: number) => {
        setSelectedImageNames(prev => {
            const _state = [...prev]
            _state.splice(index, 1)
            return _state
        })
        setSelectedImages(prev => {
            const _state = [...prev]
            _state.splice(index, 1)
            return _state
        })
    }

    return (
        <View>
            <View style={styles.commentContainer}>
                <View style={styles.commentSection}>
                    <View style={styles.imageHolder1}>
                        <Image source={{ uri: userProfileInfo?.user_info?.url }} style={styles.image} />
                    </View>
                    <TextInput
                        style={styles.commentInput}
                        maxLength={2000}
                        value={comment}
                        onChangeText={(value: any) => setComment(value)}
                        returnKeyType="done"
                        onSubmitEditing={postComment}
                    />
                    <MaterialCommunityIcons onPress={chooseImage} name="camera" size={24} color={color} style={{ marginLeft: "-10%", marginTop: -2 }} />
                </View>
                {selectedImages.length ?
                    <View style={styles.commentImagesContainer}>
                        {selectedImages.map((img: any, ind: number) => (
                            <View key={img.id} style={styles.commentImages}>
                                <MaterialCommunityIcons onPress={() => { removeImage(ind) }} name="close-circle-outline" size={20} color={'red'} style={{ position: 'absolute', zIndex: 10, right: -8, top: -8 }} />
                                <Image source={{ uri: img.uri }} style={{ ...styles.image, borderRadius: 5 }} />
                            </View>
                        ))}
                    </View>
                    : null}
            </View>

            {showComments ? <View style={styles.commentsList}>
                {comments.data.map((comment: any, index: number) => (
                    <View key={comment.id} style={{ ...styles.commentView, backgroundColor: getColor(comment) }} >
                        <Comments color={color} data={comment} item={item} updateMyReaction={updateMyReaction} index={index} setShowReplyIndex={setShowReplyIndex} reply={false} />
                        {showReplyIndex === index ?
                            <View>
                                {replies.map((_reply: any, ind: number) => (
                                    <View key={ind} style={{ paddingLeft: 20, borderTopWidth: .5, borderTopColor: '#ccc', paddingTop: 10 }}>
                                        <Comments parentUser={comment.user[0]} color={color} reply={true} data={_reply} item={item} updateMyReaction={updateMyReaction} />
                                    </View>
                                ))}
                                <View style={styles.commentSection}>
                                    <View style={styles.imageHolder1}>
                                        <Image source={{ uri: userProfileInfo?.user_info?.url }} style={styles.image} />
                                    </View>
                                    <TextInput
                                        style={[styles.commentInput, styles.replyInput]}
                                        maxLength={2000}
                                        value={reply}
                                        onChangeText={(value: any) => setReply(value)}
                                        returnKeyType="done"
                                        onSubmitEditing={() => { postReply(comment, index) }}
                                    />
                                </View>
                            </View>
                            : null}
                    </View>
                ))}
                {(Math.ceil(total / PAGE_ITEM) > page) ? <Text style={styles.showmore} onPress={() => { setPage(page + 1) }}>View more comments ...</Text> : null}
            </View> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    commentContainer: {
        borderBottomWidth: .5,
        borderBottomColor: '#ccc'
    },
    commentSection: {
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageHolder1: {
        borderRadius: 20,
        height: 40,
        width: 40,
        overflow: 'hidden'
    },
    image: {
        height: '100%',
        width: '100%',
        resizeMode: "cover",
        backgroundColor: '#f6f6f6'
    },
    commentInput: {
        backgroundColor: colors.secondary,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        paddingRight: 35,
        marginLeft: 10,
        width: Dimensions.get('screen').width - 120,
        overflow: 'hidden'
    },
    replyInput: {
        width: Dimensions.get('screen').width - 130,
    },
    commentsList: {
    },
    commentView: {
        paddingTop: 15,
        borderBottomWidth: .5,
        borderBottomColor: '#ccc',
        padding: 5,
        borderRadius: 5
    },
    showmore: {
        paddingVertical: 10,
        marginLeft: 4,
        fontFamily: fonts.LATO_REGULAR
    },
    commentImagesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginHorizontal: -5
    },
    commentImages: {
        height: 100,
        width: 100,
        padding: 5,
        borderRadius: 5,
        margin: 5,
        borderWidth: .5,
        borderColor: '#ccc'
    },
})

export default PostComments
