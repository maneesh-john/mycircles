import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import colors from './src/constants/colors';
import Loader from './src/components/common/loader';
import CustomSnackBar from './src/components/common/snackbar';
import AppNavigations from './src/navigations/appNavigations';

const theme = {
  ...DefaultTheme,
  roundness: 15,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.secondary,
  }
};

const App = () => {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <SafeAreaView>
          <View style={styles.screen}>
            <Loader />
            <AppNavigations />
            <CustomSnackBar />
          </View>
        </SafeAreaView>
      </PaperProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  screen: {
    height: '100%',
    width: "100%",
    backgroundColor: colors.secondary
  }
});

export default App;
