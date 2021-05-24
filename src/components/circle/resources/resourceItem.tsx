import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import fonts from '../../../constants/fonts';
import ResourceCard from './resourceCard';

const ResourceItem = ({ showMore, title, data, type, color, selectedCircle, userData, viewMore, taken, otherScreen }: any) => {
    return (
        <View style={styles.container}>
            {taken ? null : <Text style={styles.title}>{type === 'poll' ? 'Take a poll' : title}</Text>}
            {data.map((rs: any) => {
                return (<ResourceCard key={rs.id} otherScreen={otherScreen} title={title} data={rs} type={type} color={color} selectedCircle={selectedCircle} userData={userData} />)
            })}
            {showMore ? <Text onPress={() => viewMore(title)} style={{ ...styles.loadMore, color }}>view more {title}</Text> : null}
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 5
    },
    title: {
        fontSize: 16,
        paddingBottom: 8,
        fontFamily: fonts.LATO_BOLD,
        textTransform: 'uppercase'
    },
    loadMore: {
        width: '100%',
        textAlign: 'right',
        fontFamily: fonts.LATO_BOLD,
        marginVertical: 3,
        textTransform: 'lowercase'
    }
});

export default ResourceItem
