import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { getSlideshowTemplate } from '../../../helpers/slideshow';
const {height} = Dimensions.get('screen')


const Slides = ({ data }: any) => {
    const [template, setTempplate] = useState<string>('')

    useEffect(() => {
        if (data) {
            const _template = getSlideshowTemplate(data)
            setTempplate(_template)
        }
    }, [data])
    return (
        <View style={styles.slide}>
            {template ? <WebView originWhitelist={['*']}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                style={{
                    flex: 0,
                    minHeight: height*0.6,
                    backgroundColor: '#f8f8f8',
                    marginTop: (Platform.OS == 'ios') ? 20 : 0
                }}
                source={{
                    html: template
                }} /> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    slide: {
        backgroundColor: '#f8f8f8'
    }
})

export default Slides
