import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { getPostsList } from '../../../redux/actions/profileActions';
import { ScrollView } from 'react-native-gesture-handler';
import Links from '../../../components/homeScreen/links';
import QuestionCard from '../common/questionCard';
import colors from '../../../constants/colors';

const NotificationDetails = (props: any) => {
    const post_id = props.route.params?.id;
    const dispatch = useDispatch()
    const { notificationDetails } = useSelector((state: any) => state.profile);
    const { selectedCircle, userData, myProfileInfo, userSelectedRole } = useSelector((state: any) => state.app);
    const color = selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor;
    const [loading, setloading] = useState(true)
    useEffect(() => {
        if (post_id) {
            (async () => {
                setloading(true)
                await dispatch(getPostsList(userSelectedRole.role, 1, 1, '', '', '', '-created_at', '', false, true, post_id))
                setloading(false)
            })()
        }
    }, [post_id])
    return (
        <ScrollView>
            <View style={styles.conainer}>
                {!loading && notificationDetails?.data?.length ? <QuestionCard navigator={props.navigation} otherScreen={true} item={notificationDetails.data[0]} selectedCircle={selectedCircle} userProfileInfo={myProfileInfo} userData={userData} /> : null}
            </View>
            <Links color={color} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {

    },
    conainer: {
        padding: 15,
        backgroundColor: '#f6f6f6'
    }
})

export default NotificationDetails
