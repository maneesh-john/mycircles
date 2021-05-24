import * as React from "react";
import PofileDrawerScreen from "../../screens/profile/profileDrawerScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, Image } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import colors from "../../constants/colors";
import MyProfileScreen from "../../screens/profile/myProfileScreen";
import AccountSettingsScreen from "../../screens/profile/accountSettingsScreen";
import OtherProfileScreen from "../../screens/profile/otherProfileScreen";
import AllOtherProfileScreen from "../../screens/profile/allOtherProfileScreen";
import NotificationSettings from "../../screens/profile/notificationSettings";
import YourActivity from "../../screens/profile/yourActivity";
import { LOGO } from "../../constants/config";

const Stack = createStackNavigator();

const MyHeader = (props: any) => {
  const { selectedCircle } = useSelector((state: any) => state.app);
  const url =
    selectedCircle.condition_type === "Multiple Sclerosis"
      ? require("../../assets/images/MyMSCircle_Logo.png")
      : require("../../assets/images/MyPsoriasisCircle_Logo.png");
  return (
    <View
      style={{
        height: 60,
        paddingHorizontal: 10,
        overflow: "hidden",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: selectedCircle.color_code
          ? selectedCircle.color_code
          : colors.mainColor,
      }}
    >
      <MaterialIcons
        style={{ position: "absolute", left: 10, zIndex: 1 }}
        name={"arrow-back"}
        color={colors.secondary}
        size={30}
        onPress={() => props.navigation.goBack()}
      />
      {props.logo ? (
        <Image
          source={url}
          style={{
            height: 40,
            width: 140,
            resizeMode: "contain",
          }}
        />
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text
            style={{
              color: colors.secondary,
              fontWeight: "500",
              fontSize: 20,
              width: "100%",
              textAlign: "center",
            }}
          >
            {props.title}
          </Text>
        </View>
      )}
    </View>
  );
};

const getOptions = (title: string, logo: boolean = false) => {
  return {
    header: ({ scene, previous, navigation }: any) => {
      const { options } = scene.descriptor;
      return (
        <MyHeader
          title={title}
          navigation={navigation}
          leftButton={previous}
          logo={logo}
          style={options.headerStyle}
          showLeftIcon={true}
        />
      );
    },
  };
};

const ProfileStack = (props: any) => {
  return (
    <Stack.Navigator initialRouteName="ProfileDrawer">
      <Stack.Screen
        name="ProfileDrawer"
        component={PofileDrawerScreen}
        options={getOptions("Account")}
      />
      <Stack.Screen
        name="MyProfile"
        component={MyProfileScreen}
        options={getOptions("My Profile")}
      />
      <Stack.Screen
        name="AccountSettings"
        component={AccountSettingsScreen}
        options={getOptions("Account Settings")}
      />
      <Stack.Screen
        name="OtherProfile"
        component={OtherProfileScreen}
        options={({ route }: any) => getOptions(route.params.userInfo.name)}
      />
      <Stack.Screen
        name="AllOtherProfile"
        component={AllOtherProfileScreen}
        options={({ route }: any) => getOptions(route.params.userInfo.name)}
      />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettings}
        options={getOptions("Notification Settings")}
      />
      <Stack.Screen
        name="YourActivity"
        component={YourActivity}
        options={getOptions("Your Activity")}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
