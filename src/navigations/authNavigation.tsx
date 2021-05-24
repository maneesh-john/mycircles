import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
// import { OnboardScreen } from '../screens/auth/onboardScreen';
import { StatusBar, View, Image, Text, Platform } from "react-native";
import colors from "../constants/colors";
// import { LoginScreen } from '../screens/auth/loginScreen';
import LandingScreen from "../screens/home/landingScreen";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import CircleLoginScreen from "../screens/home/loginScreen";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import ContactUsComponent from "../components/homeScreen/contactUsComponent";
import SignupSelectionScreen from "../screens/home/signupSelectionScreen";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/actions/homeScreenActions";
import SignupFormsScreen from "../screens/home/signupFormsScreen";
import { LOGO } from "../constants/config";
import fonts from "../constants/fonts";
import ClaimProfileScreen from "../screens/home/claimProfileScreen";
import AdminLogin from "../screens/home/adminLogin";
import AdminSelection from "../screens/home/adminSelection";
import SignupModeSelectionScreen from "../screens/home/signupModeSelectionScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const MyHeader = (props: any) => {
  const selectedCircle: any = useSelector(
    (state: any) => state.app.selectedCircle
  );
  const url =
    selectedCircle.condition_type === "Multiple Sclerosis"
      ? require("../assets/images/MyMSCircle_Logo.png")
      : require("../assets/images/MyPsoriasisCircle_Logo.png");
  return (
    <View
      style={{
        height: 60,
        paddingHorizontal: 10,
        overflow: "hidden",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: props.circle
          ? selectedCircle?.color_code
          : colors.secondary,
      }}
    >
      <MaterialIcons
        color={props.circle ? colors.secondary : "#333"}
        name={props.leftButton ? "arrow-back" : "menu"}
        size={30}
        style={{ position: "absolute", left: 10, zIndex: 1 }}
        onPress={() =>
          props.leftButton
            ? props.navigation.goBack()
            : props.navigation.toggleDrawer()
        }
      />
      {props.circle ? (
        <Image
          source={url}
          style={{
            height: 35,
            width: 140,
            resizeMode: "contain",
          }}
        />
      ) : (
        <Image
          source={{ uri: LOGO }}
          style={{
            height: 40,
            width: 140,
            resizeMode: "contain",
          }}
        />
      )}
      <View style={{ padding: 8, width: "10%" }}></View>
    </View>
  );
};

const getOptions = (circle: boolean = false) => {
  return {
    header: ({ scene, previous, navigation }: any) => {
      const { options } = scene.descriptor;
      const title =
        options.headerTitle !== undefined
          ? options.headerTitle
          : options.title !== undefined
          ? options.title
          : scene.route.name;

      return (
        <MyHeader
          circle={circle}
          title={title}
          navigation={navigation}
          leftButton={previous}
          showTitle={false}
          style={options.headerStyle}
          showLeftIcon={true}
        />
      );
    },
  };
};

const stackNavigator = (props: any) => {
  return (
    <Stack.Navigator initialRouteName={"LandingScreen"}>
      <Stack.Screen
        key="SignUpModeSelectionKey"
        name="SignUpModeSelectionScreen"
        component={SignupModeSelectionScreen}
        options={getOptions(true)}
      />
      <Stack.Screen
        key="LandingKey"
        name="LandingScreen"
        component={LandingScreen}
        options={getOptions()}
      />
      <Stack.Screen
        key="CircleLoginKey"
        name="CircleLogin"
        component={CircleLoginScreen}
        options={getOptions()}
      />
      <Stack.Screen
        name="SignupSelectionScreen"
        component={SignupSelectionScreen}
        options={getOptions(true)}
      />
      <Stack.Screen
        name="SignupFormsScreen"
        component={SignupFormsScreen}
        options={getOptions(true)}
      />
      <Stack.Screen
        name="ClaimProfileScreen"
        component={ClaimProfileScreen}
        options={getOptions(true)}
      />
      <Stack.Screen
        name="AdminLogin"
        component={AdminLogin}
        options={getOptions(true)}
      />
      <Stack.Screen
        name="AdminSelection"
        component={AdminSelection}
        options={getOptions(true)}
      />
    </Stack.Navigator>
  );
};

const ContactUsStack = (props: any) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ContactUs"
        component={ContactUsComponent}
        options={{
          header: ({ scene, previous, navigation }) => {
            const { options } = scene.descriptor;
            const title =
              options.headerTitle !== undefined
                ? options.headerTitle
                : options.title !== undefined
                ? options.title
                : scene.route.name;

            return (
              <MyHeader
                title={title}
                navigation={navigation}
                leftButton={previous}
                style={options.headerStyle}
                showLeftIcon={true}
              />
            );
          },
        }}
      />
    </Stack.Navigator>
  );
};

const CustomDrawerContent = (props: any, token: string, dispatch: any) => {
  return (
    <DrawerContentScrollView {...props}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ color: colors.mainColor }}>v. 0.9.0</Text>
        <MaterialIcons
          name="close"
          size={30}
          onPress={() => props.navigation.closeDrawer()}
        />
      </View>
      <DrawerItemList {...props} />
      {token ? (
        <DrawerItem
          label="Logout"
          labelStyle={{
            fontSize: 16,
            width: 200,
            padding: 0,
            textTransform: "uppercase",
            fontFamily: fonts.LATO_BOLD,
            paddingLeft: 20,
          }}
          onPress={() => {
            dispatch(logout());

            //props.navigation.navigate("Home");
            props.navigation.closeDrawer();
          }}
        />
      ) : null}
    </DrawerContentScrollView>
  );
};

const AuthNavigation = (props: any) => {
  const token = useSelector((state: any) => state.app.token);
  const dispatch = useDispatch();
  if (Platform.OS === "android") {
    StatusBar.setBackgroundColor("black");
  }
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerStyle={{
        backgroundColor: "#e6f7ff",
        padding: 10,
      }}
      drawerType="back"
      drawerContentOptions={{
        activeTintColor: colors.mainColor,
        activeBackgroundColor: "#e6f7ff",
        labelStyle: {
          fontSize: 16,
          padding: 0,
          width: 200,
          textTransform: "uppercase",
          fontFamily: fonts.LATO_BOLD,
          paddingLeft: 20,
        },
      }}
      drawerContent={(props) => CustomDrawerContent(props, token, dispatch)}
    >
      <Drawer.Screen name="Home" component={stackNavigator} />
      <Drawer.Screen name="Partnerships" component={stackNavigator} />
      <Drawer.Screen name="Contact" component={ContactUsStack} />
    </Drawer.Navigator>
  );
};

export default AuthNavigation;
