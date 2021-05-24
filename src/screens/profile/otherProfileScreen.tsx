import React, { useEffect, useState } from 'react'
import MyProfileScreen from './myProfileScreen'
import { useDispatch } from 'react-redux'
import { getOtherUserProfile } from '../../redux/actions/homeScreenActions'

const OtherProfileScreen = (props: any) => {
    const { id, role, display_name, circle_id } = props.route.params.userInfo

    const [loading, setloading] = useState(true);

    const dispatch = useDispatch()
    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', async () => {
            setloading(true)
            await dispatch(getOtherUserProfile(id, circle_id, true))
            setloading(false)
        });
        return unsubscribe;
    }, [dispatch])

    return (
        <>
            {!loading && <MyProfileScreen navigation={props.navigation} otherProfle={true} userId={id} role={role} display_name={display_name} />}
        </>
    )
}

export default OtherProfileScreen
