import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import CircleCard from '../../components/homeScreen/circleCard'
import { useSelector } from 'react-redux';

const MyCirclesComponent = (props: any) => {

    const userData: any = useSelector((state: any) => state.app.userData)
    console.log(JSON.stringify(userData))
    useEffect(() => {
        //if (!(userData && userData.token)) {
        //    props.navigation.push("CircleLogin")
        //}
    }, [userData])


    return (
        <View style={styles.cardContainer}>
            {userData?.circles?.map((circle: any) => (
                <CircleCard email={userData?.email} userId={userData?.id} showResources isLogin key={circle.id} circle={circle} navigation={props.navigation} />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        paddingVertical: 15,
        marginTop: 15
    }
})

export default MyCirclesComponent
