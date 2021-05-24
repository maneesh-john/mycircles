import React, { useRef, useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import colors from "../../constants/colors";
import { connect, useDispatch, useSelector } from "react-redux";
import fonts from "../../constants/fonts";
import { FlatList } from "react-native-gesture-handler";
import Octicons from "react-native-vector-icons/Octicons";
import {
  socialLoginAction,
  updateSnackMessage,
} from "../../redux/actions/homeScreenActions";
// import {
//   LoginManager,
//   AccessToken,
//   GraphRequest,
//   GraphRequestManager,
// } from "react-native-fbsdk-next";
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from "@react-native-google-signin/google-signin";

const width = Dimensions.get("screen").width;

const SignUpModeSelectionScreen = (props: any) => {
  const { selectedCircle } = useSelector((state: any) => state.app);
  const [userInfo, setUserInfo] = useState({});
  const dispatch = useDispatch();
  const color = selectedCircle.color_code
    ? selectedCircle.color_code
    : colors.mainColor;

  useEffect(() => {
    // GoogleSignin.configure({
    //   //scopes: ["profile"], // what API you want to access on behalf of the user, default is email and profile

    //   webClientId:
    //     "252386673833-2hcac5ivea84nr4c3pftehf3608gku3q.apps.googleusercontent.com", // client ID of type WEB for your server (needed to verify user ID and offline access)
    //   offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    //   hostedDomain: "", // specifies a hosted domain restriction
    //   loginHint: "", // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
    //   forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
    //   accountName: "", // [Android] specifies an account name on the device that should be used
    //   //iosClientId: "<FROM DEVELOPER CONSOLE>", // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    //   //androidClientId:"",
    // });
  }, []);

  // const loginWithGoogle = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     props.socialLoginAction(userInfo, "google").then((res: boolean) => {
  //       if (res) {
  //         dispatch(updateSnackMessage("Signed in successfully"));
  //         setTimeout(() => {
  //           props.navigation.replace("SignupSelectionScreen", {
  //             type: "social",
  //             userData: userInfo,
  //           });
  //         }, 1000);
  //       }
  //     });
  //     console.log(userInfo);
  //     setUserInfo(userInfo);
  //   } catch (error) {
  //     console.log("Message", error.message);
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       dispatch(updateSnackMessage("Google sign in cancelled"));
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       console.log("Signing In");
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       dispatch(updateSnackMessage("Play Services Not Available or Outdated"));
  //       console.log("Play Services Not Available or Outdated");
  //     } else {
  //       dispatch(updateSnackMessage("Google sign in failed"));
  //       console.log("Some Other Error Happened");
  //     }
  //   }
  // };
  // const isSignedIn = async () => {
  //   const isSignedIn = await GoogleSignin.isSignedIn();
  //   if (!!isSignedIn) {
  //     getCurrentUserInfo();
  //   } else {
  //     console.log("Please Login");
  //   }
  // };
  // const getCurrentUserInfo = async () => {
  //   try {
  //     const userInfo = await GoogleSignin.signInSilently();
  //     setUserInfo(userInfo);
  //   } catch (error) {
  //     if (error.code === statusCodes.SIGN_IN_REQUIRED) {
  //       Alert.alert("User has not signed in yet");
  //       console.log("User has not signed in yet");
  //     } else {
  //       Alert.alert("Something went wrong. Unable to get user's info");
  //       console.log("Something went wrong. Unable to get user's info");
  //     }
  //   }
  // };

  // const getInfoFromToken = (token: any) => {
  //   const PROFILE_REQUEST_PARAMS = {
  //     fields: {
  //       string: "id, name,  first_name, last_name",
  //     },
  //   };

  //   const profileRequest = new GraphRequest(
  //     "/me",
  //     { token, parameters: PROFILE_REQUEST_PARAMS },
  //     (error, result) => {
  //       if (error) {
  //         console.log("login info has error: " + error);
  //       } else {
  //         props.socialLoginAction(userInfo, "facebook").then((res: boolean) => {
  //           if (res) {
  //             dispatch(updateSnackMessage("Signed in successfully"));
  //             setTimeout(() => {
  //               props.navigation.replace("SignupSelectionScreen", {
  //                 type: "social",
  //                 userData: userInfo,
  //               });
  //             }, 1000);
  //           }
  //         });
  //         setUserInfo(result);
  //         console.log("result:", result);
  //       }
  //     }
  //   );
  //   new GraphRequestManager().addRequest(profileRequest).start();
  // };

  const loginWithFacebook = () => {
    // Attempt a login using the Facebook login dialog asking for default permissions.
    // LoginManager.logInWithPermissions(["public_profile"]).then(
    //   (login) => {
    //     if (login.isCancelled) {
    //       dispatch(updateSnackMessage("Facebook sign in cancelled"));
    //     } else {
    //       AccessToken.getCurrentAccessToken().then((data: any) => {
    //         const accessToken = data.accessToken.toString();
    //         getInfoFromToken(accessToken);
    //       });
    //     }
    //   },
    //   (error) => {
    //     dispatch(updateSnackMessage("Facebook sign in failed"));
    //     console.log("Login fail with error: " + error);
    //   }
    // );
  };

  const onSignInClick = (type: string) => {
    if (type === "google") {
      //loginWithGoogle();
    } else if (type === "facebook") {
      loginWithFacebook();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.body}>
        <Text style={styles.pageHeader}>{"Sign up using"}</Text>
        <View
          style={{
            alignSelf: "center",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              ...styles.row,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.social_icons_btn}
              onPress={() => {
                onSignInClick("google");
              }}
            >
              <Image
                style={styles.social_icons}
                source={require("../../assets/icons/google_icon.png")}
              ></Image>
            </TouchableOpacity>
            {/* <TouchableOpacity
              activeOpacity={0.9}
              style={styles.social_icons_btn}
              onPress={() => {
                onSignInClick("facebook");
              }}
            >
              <Image
                style={styles.social_icons}
                source={require("../../assets/icons/fb_icon.png")}
              ></Image>
            </TouchableOpacity> */}
            {/* <TouchableOpacity
              activeOpacity={0.9}
              style={styles.social_icons_btn}
            >
              <Image
                style={styles.social_icons}
                source={require("../../assets/icons/linkedin_icon.png")}
              ></Image>
            </TouchableOpacity> */}
          </View>
          <Text
            style={{
              ...styles.buttonText,
              color: "black",
              textAlign: "center",
            }}
          >
            or
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              ...styles.buttonContainer,
              backgroundColor: color,
            }}
            onPress={async () => {
              props.navigation.replace("SignupSelectionScreen", {
                type: "email",
                userData: null,
              });
            }}
          >
            <Text
              style={{
                ...styles.buttonText,
                color: "white",
              }}
            >
              Using Email address
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  screen: {
    minHeight: "100%",
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 24,
    textAlign: "left",
    color: colors.secondary,
    //textTransform: "uppercase",
    letterSpacing: 1,
  },
  rowContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 16,
    backgroundColor: "#fff",
    marginBottom: 14,
    borderRadius: 10,
    alignSelf: "stretch",
    minHeight: 80,
  },
  row: {
    flexDirection: "row",
    //alignItems: "center",
    marginBottom: 10,
  },
  social_icons: {
    resizeMode: "center",
    height: 30,
    width: 30,
  },
  social_icons_btn: {
    padding: 5,
    marginHorizontal: 5,
  },
  address: {
    //flex: 1,
    color: "rgba(51,51,51,0.54)",
    fontSize: 12,
    marginLeft: 6,
    fontFamily: fonts.LATO_BOLD,
  },
  body: {
    paddingBottom: 30,
    paddingTop: 0,
    paddingHorizontal: 14,
    justifyContent: "flex-start",
    alignItems: "center",
    minWidth: width,
  },
  pageHeader: {
    fontSize: 22,
    color: "#000",
    fontWeight: "600",
    marginTop: "20%",
    marginBottom: "10%",
  },
  title: {
    color: "#000",
    fontSize: 18,
    maxWidth: (width - 28) * 0.65,
  },
  name: {
    //marginTop: 23,
    //textAlign: "center",
    color: "#333",
    fontSize: 13,
    fontWeight: "100",
    fontFamily: fonts.LATO_BOLD,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    //textTransform: "uppercase",
  },
});

export default connect(null, {
  updateSnackMessage,
  socialLoginAction,
})(SignUpModeSelectionScreen);
