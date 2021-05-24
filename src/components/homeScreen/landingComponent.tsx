import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import CircleCard from '../../components/homeScreen/circleCard'
import { useDispatch, useSelector } from 'react-redux';
import { getAllCircles } from '../../redux/actions/homeScreenActions';

const LandingComponent = (props: any) => {

    const dispatch = useDispatch();
    const circles: Array<any> = useSelector((state: any) => state.app.allCircles)
    const userData: any = useSelector((state: any) => state.app.userData)

    const [circlesList, setCirclesList] = useState<Array<any>>([])

    useEffect(() => {
        (async () => {
            await dispatch(getAllCircles())
        })()
    }, [])

    useEffect(() => {
        if (circles.length) {
            if (userData && userData.circles && userData.circles.length) {
                const _circlesToShow = circles.filter((circle: any) => {
                    const index = userData.circles.findIndex((rs: any) => rs.id === circle.id)
                    if (index === -1) {
                        return circle;
                    }
                })
                setCirclesList(_circlesToShow)
            } else {
                setCirclesList(circles)
            }
        }
    }, [userData, circles])


    return (
        <View style={styles.cardContainer}>
            {circlesList.map((circle: any) => (
                <CircleCard key={circle.id} circle={circle} navigation={props.navigation} />
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

export default LandingComponent
