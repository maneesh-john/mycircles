import React from 'react'
import { WebView } from 'react-native-webview';
import { View, Platform } from 'react-native';

const Video = ({ uri }: any) => {
    return (
        <View>
            {uri ? <WebView originWhitelist={['*']}
                style={{
                    flex: 0,
                    height: 300,
                    backgroundColor: '#f8f8f8',
                    marginTop: (Platform.OS == 'ios') ? 20 : 0
                }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowsFullscreenVideo={true}
                source={{ uri: 'https://www.youtube.com/embed/' + uri }} /> : null}
        </View>
    )
}

export default Video
