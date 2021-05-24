import React, { useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, Switch } from 'react-native'
import colors from '../../constants/colors'
import Links from '../../components/homeScreen/links'
import { useSelector, useDispatch } from 'react-redux'
import { getNotificationSettings, updateNotificationSettings } from '../../redux/actions/profileActions'
import { Divider } from 'react-native-paper'

const NotificationSettings = () => {
    const { selectedCircle } = useSelector((state: any) => state.app);
    const { notificationSettings } = useSelector((state: any) => state.profile);

    const color: string = selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getNotificationSettings(selectedCircle.id))
    }, [dispatch])

    const toggleSwitch = (type: any) => {
        const body: any = {}
        body[type] = !notificationSettings[type]
        dispatch(updateNotificationSettings(selectedCircle.id, body))
    }

    return (
        <ScrollView style={styles.screen}>
            <View style={styles.container}>
                <View style={[styles.box, styles.row]}>
                    <View style={{ flex: 1, paddingHorizontal: 5 }}>
                        <Text style={{ fontWeight: 'bold', width: '100%', fontSize: 16, marginBottom: 5 }}>ALLOW NOTIFICATIONS</Text>
                        <Text style={{ width: '100%', }}>Stay up to date with notifications on activity that involves you, including mentions, messages, replies to your post, and invitations.</Text>
                    </View>
                    <Switch
                        trackColor={{ false: "#767577", true: color }}
                        thumbColor={notificationSettings?.allow_notifications ? colors.secondary : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => { toggleSwitch('allow_notifications') }}
                        value={notificationSettings?.allow_notifications}
                    />
                </View>
                <View style={styles.box}>
                    <View style={{ ...styles.row, paddingVertical: 10 }}>
                        <Text>{`Likes & Hugs`}</Text>
                        <Switch
                            disabled={notificationSettings?.allow_notifications ? false : true}
                            trackColor={{ false: notificationSettings?.allow_notifications ? "#767577" : '#d6d6d6', true: color }}
                            thumbColor={notificationSettings?.reactions ? colors.secondary : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => { toggleSwitch('reactions') }}
                            value={notificationSettings?.reactions}
                        />
                    </View>
                    <Divider style={{ height: .5 }} accessibilityStates />
                    <View style={{ ...styles.row, paddingVertical: 10 }}>
                        <Text>{`Post & comment Replies`}</Text>
                        <Switch
                            disabled={notificationSettings?.allow_notifications ? false : true}
                            trackColor={{ false: notificationSettings?.allow_notifications ? "#767577" : '#d6d6d6', true: color }}
                            thumbColor={notificationSettings?.posts ? colors.secondary : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => { toggleSwitch('posts') }}
                            value={notificationSettings?.posts}
                        />
                    </View>
                    <Divider style={{ height: .5 }} accessibilityStates />
                    <View style={{ ...styles.row, paddingVertical: 10 }}>
                        <Text>{`New messages, mentions, and invitations`}</Text>
                        <Switch
                            disabled={notificationSettings?.allow_notifications ? false : true}
                            trackColor={{ false: notificationSettings?.allow_notifications ? "#767577" : '#d6d6d6', true: color }}
                            thumbColor={notificationSettings?.invitations ? colors.secondary : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => { toggleSwitch('invitations') }}
                            value={notificationSettings?.invitations}
                        />
                    </View>
                </View>
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
        justifyContent: 'space-between'
    },
    box: {
        paddingHorizontal: 15,
        paddingVertical: 20,
        backgroundColor: colors.secondary,
        borderRadius: 10,
        overflow: 'hidden',
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 10
    }
})

export default NotificationSettings
