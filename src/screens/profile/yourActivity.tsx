import React, { useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import colors from '../../constants/colors'
import Links from '../../components/homeScreen/links'
import { useSelector, useDispatch } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Octicons from 'react-native-vector-icons/Octicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { getActivityInfo } from '../../redux/actions/profileActions'
import PeopleCard from '../../components/circle/common/peopleCard'
import ResourceItem from '../../components/circle/resources/resourceItem'

const YourActivity = (props: any) => {
    const { selectedCircle, userData } = useSelector((state: any) => state.app);
    const { activityInfo } = useSelector((state: any) => state.profile);

    const color: string = selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor

    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            dispatch(getActivityInfo(selectedCircle.id))
        });
        return unsubscribe;
    }, [dispatch])

    return (
        <ScrollView style={styles.screen}>
            <View style={styles.container}>
                <View style={styles.section}>
                    <Text style={styles.header}>ACCOUNT STATISTICS FOR {selectedCircle.condition_type} CIRCLE</Text>
                    <View style={styles.row}>
                        <View style={styles.item}>
                            <Octicons name="book" size={23} color='#C66F6B' style={styles.icon} />
                            <Text style={{ ...styles.value, color: color }}>{activityInfo?.articles_count}</Text>
                            <Text style={styles.title}>Articles</Text>
                        </View>
                        <View style={styles.item}>
                            <AntDesign name="question" size={23} color='#C3C66B' style={styles.icon} />
                            <Text style={{ ...styles.value, color: color }}>{activityInfo?.quiz_taken_count}</Text>
                            <Text style={styles.title}>Quiz Taken</Text>
                        </View>
                        <View style={styles.item}>
                            <Octicons name="graph" size={23} color='#C66BC3' style={styles.icon} />
                            <Text style={{ ...styles.value, color: color }}>{activityInfo?.poll_taken_count}</Text>
                            <Text style={styles.title}>Poll Taken</Text>
                        </View>
                        <View style={styles.item}>
                            <MaterialCommunityIcons name="emoticon-happy-outline" size={23} style={styles.icon} color='#FFAF61' />
                            <Text style={{ ...styles.value, color: color }}>{activityInfo?.hugs_given_count}</Text>
                            <Text style={styles.title}>Hugs Given</Text>
                        </View>
                        <View style={styles.item}>
                            <MaterialCommunityIcons name="comment-text-outline" size={23} style={styles.icon} color='#82E884' />
                            <Text style={{ ...styles.value, color: color }}>{activityInfo?.comments_count}</Text>
                            <Text style={styles.title}>Comments</Text>
                        </View>
                    </View>
                </View>
                {activityInfo?.hugs_given?.length ? <View style={styles.section}>
                    <Text style={styles.header}>HUGS GIVEN</Text>
                    {activityInfo.hugs_given.map((rs: any) => (
                        <View key={rs.id}>
                            <PeopleCard type={"otheruser"} isOtherProfile={true} navigator={props.navigation} showButtons={rs.id !== userData.id} item={rs} selectedCircle={selectedCircle} userData={userData} />
                        </View>
                    ))}
                </View> : null}
                {activityInfo?.polls_taken?.length ? <View style={styles.section}>
                    <Text style={styles.header}>POLLS TAKEN</Text>
                    <ResourceItem otherScreen={true} viewMore={() => { }} selectedCircle={selectedCircle} userData={userData} color={color} type='poll' taken={true} showMore={false} title='Polls' data={activityInfo?.polls_taken} />
                </View> : null}
                {activityInfo?.quiz_taken?.length ? <View style={styles.section}>
                    <Text style={styles.header}>QUIZ TAKEN</Text>
                    <ResourceItem otherScreen={true} viewMore={() => { }} selectedCircle={selectedCircle} userData={userData} color={color} type='quiz' taken={true} showMore={false} title='Quiz' data={activityInfo?.quiz_taken} />
                </View> : null}
                {activityInfo?.read_articles?.length ? <View style={styles.section}>
                    <Text style={styles.header}>READ ARTICLES</Text>
                    <ResourceItem otherScreen={true} viewMore={() => { }} selectedCircle={selectedCircle} userData={userData} color={color} type='articles' taken={true} showMore={false} title='Articles' data={activityInfo?.read_articles} />
                </View> : null}
                {activityInfo?.removed_users?.length ? <View style={styles.section}>
                    <Text style={styles.header}>REMOVED USERS</Text>
                    {activityInfo.removed_users.map((rs: any) => (
                        <View key={rs.id}>
                            <PeopleCard type="otheruser" isOtherProfile={true} navigator={props.navigation} showButtons={rs.id !== userData.id} item={rs} selectedCircle={selectedCircle} userData={userData} />
                        </View>
                    ))}
                </View> : null}
            </View>
            <View style={styles.footer}>
                <Links color={color} />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        minHeight: '100%',
        backgroundColor: '#f6f6f6',
    },
    container: {
        margin: 20
    },
    footer: {
        backgroundColor: '#e4e4e4'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: -5,
        flexWrap: 'wrap'
    },
    section: {
        marginVertical: 10
    },
    header: {
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
        width: '100%'
    },
    item: {
        borderRadius: 10,
        borderWidth: .5,
        padding: 10,
        minWidth: '30%',
        marginHorizontal: 5,
        marginVertical: 10,
        backgroundColor: colors.secondary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
    },
    value: {
        fontSize: 20,
        width: '100%',
        textAlign: 'center',
        fontWeight: 'bold',
        padding: 5
    },
    title: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
        textAlign: 'center',
        width: '100%',
        paddingHorizontal: 5
    },
})

export default YourActivity
