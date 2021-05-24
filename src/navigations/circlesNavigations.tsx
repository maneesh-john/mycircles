import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import ActivityScreen from "../screens/circles/activityScreen";
import ProviderDirectoryScreen from "../screens/circles/providerDirectoryScreen";
import QandAScreen from "../screens/circles/qAndAScreen";
import ResourcesScreen from "../screens/circles/resourcesScreen";
import TreatmentsScreen from "../screens/circles/treatmentAZScreen";
import colors from "../constants/colors";
import { View, Image, StatusBar, Platform, Text } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { toggleToCircleView } from "../redux/actions/homeScreenActions";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileStack from "./profileNavigations/profileNavigation";
import NotificationStack from "./notificationNavigations/notificationNavigation";
import ResourceDetails from "../components/circle/resources/resourceDetails";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import fonts from "../constants/fonts";
import TreatmentDetails from "../components/circle/treatmentAZ/treatmentDetails";
import MeetOtheersStack from "./meetOthersNavigations.tsx/meetOthersNavigations";
import OtherProfileScreen from "../screens/profile/otherProfileScreen";
import HospitalDirectoryScreen from "../screens/circles/hospitalDirectoryScreen";
import ClinicDirectoryScreen from "../screens/circles/clinicDirectoryScreen";
import NFPDirectoryScreen from "../screens/circles/nfpScreen";
import OtherProfessionalScreen from "../screens/circles/otherProfessionalScreen";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import OtherProfessionalsView from "../screens/circles/otherProfessionalsView";
import RoleSelectionScreen from "../screens/circles/roleSelectionScreen";
import AllOtherProfileScreen from "../screens/profile/allOtherProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const MyHeader = (props: any) => {
  const { selectedCircle } = useSelector((state: any) => state.app);
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
        backgroundColor: selectedCircle.color_code
          ? selectedCircle.color_code
          : colors.mainColor,
      }}
    >
      {props.showLeftIcon && (
        <MaterialIcons
          style={{ position: "absolute", left: 10, zIndex: 1 }}
          name={props.leftButton ? "arrow-back" : "menu"}
          color={colors.secondary}
          size={30}
          onPress={() =>
            props.leftButton
              ? props.navigation.goBack()
              : props.navigation.toggleDrawer()
          }
        />
      )}
      <Image
        source={url}
        style={{
          height: 40,
          width: 140,
          resizeMode: "contain",
        }}
      />
    </View>
  );
};

const getOptions = (
  showTitle: boolean = false,
  showLeftIcon: boolean = true
) => {
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
          title={title}
          navigation={navigation}
          leftButton={previous}
          showTitle={showTitle}
          style={options.headerStyle}
          showLeftIcon={showLeftIcon}
        />
      );
    },
  };
};

const ActivityStack = (props: any) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Activity"
        component={ActivityScreen}
        options={getOptions()}
      />
      <Stack.Screen
        name="AllOtherProfile"
        component={AllOtherProfileScreen}
        options={({ route }: any) => getOptions(route.params.userInfo.name)}
      />
    </Stack.Navigator>
  );
};

const ProviderDirectoryStack = (props: any) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProviderDirectory"
        component={ProviderDirectoryScreen}
        options={getOptions()}
      />
      <Stack.Screen
        name="AllOtherProfile"
        component={AllOtherProfileScreen}
        options={({ route }: any) => getOptions(route.params.userInfo.name)}
      />
    </Stack.Navigator>
  );
};

const HospitalDirectoryStack = (props: any) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HospitalDirectory"
        component={HospitalDirectoryScreen}
        options={getOptions()}
      />
      <Stack.Screen
        name="AllOtherProfile"
        component={AllOtherProfileScreen}
        options={({ route }: any) => getOptions(route.params.userInfo.name)}
      />
    </Stack.Navigator>
  );
};
const ClinicDirectoryStack = (props: any) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ClinicDirectory"
        component={ClinicDirectoryScreen}
        options={getOptions()}
      />
      <Stack.Screen
        name="AllOtherProfile"
        component={AllOtherProfileScreen}
        options={({ route }: any) => getOptions(route.params.userInfo.name)}
      />
    </Stack.Navigator>
  );
};
const NFPDirectoryStack = (props: any) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="NFPDirectory"
        component={NFPDirectoryScreen}
        options={getOptions()}
      />
      <Stack.Screen
        name="AllOtherProfile"
        component={AllOtherProfileScreen}
        options={({ route }: any) => getOptions(route.params.userInfo.name)}
      />
    </Stack.Navigator>
  );
};
const OtherDirectoryStack = (props: any) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OtherDirectory"
        component={OtherProfessionalScreen}
        options={getOptions()}
      />
      <Stack.Screen
        name="OtherDirectoryDetails"
        component={OtherProfessionalsView}
        options={getOptions()}
      />
      <Stack.Screen
        name="AllOtherProfile"
        component={AllOtherProfileScreen}
        options={({ route }: any) => getOptions(route.params.userInfo.name)}
      />
    </Stack.Navigator>
  );
};

const ResourcesStack = (props: any) => {
  return (
    <Stack.Navigator initialRouteName="Resources">
      <Stack.Screen
        name="Resources"
        component={ResourcesScreen}
        options={getOptions()}
      />
      <Stack.Screen
        name="ResourceDetails"
        component={ResourceDetails}
        options={getOptions(true)}
      />
      <Stack.Screen
        name="AllOtherProfile"
        component={AllOtherProfileScreen}
        options={({ route }: any) => getOptions(route.params.userInfo.name)}
      />
    </Stack.Navigator>
  );
};

const QandAStack = (props: any) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="QandA"
        component={QandAScreen}
        options={getOptions()}
      />
      <Stack.Screen
        name="AllOtherProfile"
        component={AllOtherProfileScreen}
        options={({ route }: any) => getOptions(route.params.userInfo.name)}
      />
    </Stack.Navigator>
  );
};

const TreatmentsStack = (props: any) => {
  return (
    <Stack.Navigator initialRouteName="Treatments">
      <Stack.Screen
        name="Treatments"
        component={TreatmentsScreen}
        options={getOptions()}
      />
      <Stack.Screen
        name="TreatmentDetails"
        component={TreatmentDetails}
        options={getOptions()}
      />
      <Stack.Screen
        name="AllOtherProfile"
        component={AllOtherProfileScreen}
        options={({ route }: any) => getOptions(route.params.userInfo.name)}
      />
    </Stack.Navigator>
  );
};

const CustomDrawerContent = (props: any, dispatch: any) => {
  return (
    <DrawerContentScrollView {...props}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <MaterialIcons
          name="close"
          size={30}
          onPress={() => props.navigation.closeDrawer()}
        />
      </View>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Other circles"
        labelStyle={{
          fontSize: 15,
          width: 200,
          padding: 0,
          textTransform: "uppercase",
          fontFamily: fonts.LATO_BOLD,
        }}
        icon={({ focused, color, size }: any) => {
          return (
            <FontAwesome5Icon
              name="exchange-alt"
              size={17}
              style={{ marginRight: -20 }}
              color={color}
            />
          );
        }}
        onPress={() => {
          props.navigation.closeDrawer();
          dispatch(toggleToCircleView());
        }}
      />
    </DrawerContentScrollView>
  );
};

const HomeDrawer = (props: any) => {
  const { selectedCircle, activeRoute } = useSelector(
    (state: any) => state.app
  );
  const dispatch = useDispatch();
  return (
    <Drawer.Navigator
      initialRouteName={activeRoute}
      drawerStyle={{
        backgroundColor: "#e6f7ff",
        padding: 10,
        width: "80%",
      }}
      drawerType="back"
      backBehavior="initialRoute"
      drawerContentOptions={{
        activeTintColor: selectedCircle.color_code
          ? selectedCircle.color_code
          : colors.mainColor,
        activeBackgroundColor: "#e6f7ff",
        labelStyle: {
          fontSize: 15,
          padding: 0,
          width: "100%",
          textTransform: "uppercase",
          fontFamily: fonts.LATO_BOLD,
        },
      }}
      drawerContent={(props) => CustomDrawerContent(props, dispatch)}
    >
      <Drawer.Screen
        name="ActivityScreen"
        component={ActivityStack}
        options={{
          title: "Activity",
          drawerIcon: ({ focused, color, size }: any) => {
            return (
              <MaterialCommunityIcons
                name="window-maximize"
                size={22}
                style={{ marginRight: -20 }}
                color={color}
              />
            );
          },
        }}
      />
      <Drawer.Screen
        name="ProviderDirectoryScreen"
        component={ProviderDirectoryStack}
        options={{
          title: "Physician Directory",
          drawerIcon: ({ focused, color, size }: any) => {
            return (
              <FontAwesome5Icon
                name="user-md"
                size={22}
                style={{ marginRight: -20 }}
                color={color}
              />
            );
          },
        }}
      />
      <Drawer.Screen
        name="HospitalDirectoryScreen"
        component={HospitalDirectoryStack}
        options={{
          title: "Hospital Directory",
          drawerIcon: ({ focused, color, size }: any) => {
            return (
              <FontAwesome5Icon
                name="hospital-alt"
                size={17}
                style={{ marginRight: -20 }}
                color={color}
              />
            );
          },
        }}
      />
      <Drawer.Screen
        name="ClinicDirectoryScreen"
        component={ClinicDirectoryStack}
        options={{
          title: "Clinic Directory",
          drawerIcon: ({ focused, color, size }: any) => {
            return (
              <FontAwesome5Icon
                name="hospital"
                size={21}
                style={{ marginRight: -20 }}
                color={color}
              />
            );
          },
        }}
      />
      <Drawer.Screen
        name="NFPDirectoryScreen"
        component={NFPDirectoryStack}
        options={{
          title: "Non For Profit Directory",
          drawerIcon: ({ focused, color, size }: any) => {
            return (
              <FontAwesome5Icon
                name="hand-holding-heart"
                size={16}
                style={{ marginRight: -20 }}
                color={color}
              />
            );
          },
        }}
      />
      <Drawer.Screen
        name="OtherHealthProfesionalsScreen"
        component={OtherDirectoryStack}
        options={{
          title: "Other Health Profesionals",
          drawerIcon: ({ focused, color, size }: any) => {
            return (
              <FontAwesome5Icon
                name="hospital-symbol"
                size={18}
                style={{ marginRight: -20 }}
                color={color}
              />
            );
          },
        }}
      />
      <Drawer.Screen
        name="QandAScreen"
        component={QandAStack}
        options={{
          title: "Q&A",
          drawerIcon: ({ focused, color, size }: any) => {
            return (
              <FontAwesome5Icon
                name="question-circle"
                size={18}
                style={{ marginRight: -20 }}
                color={color}
              />
            );
          },
        }}
      />
      <Drawer.Screen
        name="ResourcesScreen"
        component={ResourcesStack}
        options={{
          title: "Resources",
          drawerIcon: ({ focused, color, size }: any) => {
            return (
              <FontAwesome5Icon
                name="book-open"
                size={16}
                style={{ marginRight: -20 }}
                color={color}
              />
            );
          },
        }}
      />
      <Drawer.Screen
        name="TreatmentsScreen"
        component={TreatmentsStack}
        options={{
          title: "Treatments A-Z",
          drawerIcon: ({ focused, color, size }: any) => {
            return (
              <FontAwesome5Icon
                name="briefcase-medical"
                size={17}
                style={{ marginRight: -20 }}
                color={color}
              />
            );
          },
        }}
      />
    </Drawer.Navigator>
  );
};

const CirclesNavigation = (props: any) => {
  const { selectedCircle } = useSelector((state: any) => state.app);
  const { notifications } = useSelector((state: any) => state.profile);
  const color = selectedCircle.color_code
    ? selectedCircle.color_code
    : colors.mainColor;
  if (Platform.OS === "android") {
    StatusBar.setBackgroundColor(color);
  }
  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior={"initialRoute"}
      tabBarOptions={{
        showLabel: false,
        style: { height: 60 },
        keyboardHidesTabBar: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeDrawer}
        options={(props: any) => ({
          tabBarIcon: (options: any) => (
            <AntDesign
              name={"home"}
              size={30}
              color={options.focused ? color : options.focused ? color : "#333"}
            ></AntDesign>
          ),
        })}
      />
      <Tab.Screen
        name="MeetOthers"
        component={MeetOtheersStack}
        options={(props: any) => ({
          tabBarIcon: (options: any) => (
            <AntDesign
              name={"addusergroup"}
              size={30}
              color={options.focused ? color : "#333"}
            ></AntDesign>
          ),
        })}
      />
      <Tab.Screen
        name="Addnew"
        component={HomeDrawer}
        options={(props: any) => ({
          tabBarIcon: (options: any) => (
            <View
              style={{
                shadowColor: "black",
                shadowOpacity: 0.26,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 8,
                elevation: 3,
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "center",
                height: 50,
                width: 50,
                borderRadius: 25,
                backgroundColor: color,
              }}
            >
              <MaterialIcons
                style={{}}
                name="add"
                size={40}
                color={colors.secondary}
              />
            </View>
          ),
        })}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationStack}
        options={(props: any) => ({
          tabBarBadge:
            Platform.OS === "ios" && notifications?.paginator?.read_count > 0
              ? notifications?.paginator?.read_count <= 10
                ? notifications?.paginator?.read_count
                : `10+`
              : null,
          tabBarIcon: (options: any) => (
            <View>
              {Platform.OS === "android" &&
              notifications?.paginator?.read_count > 0 ? (
                <Text
                  style={{
                    position: "absolute",
                    top: -10,
                    right: -12,
                    paddingVertical: 1,
                    paddingHorizontal: 2,
                    fontSize: 12,
                    width: 25,
                    textAlign: "center",
                    borderRadius: 30,
                    zIndex: 1,
                    color: "#fff",
                    backgroundColor: "#ff594c",
                  }}
                >
                  {notifications?.paginator?.read_count <= 10
                    ? notifications?.paginator?.read_count
                    : `10+`}
                </Text>
              ) : null}
              <MaterialIcons
                name={"notifications-none"}
                size={30}
                color={options.focused ? color : "#333"}
              ></MaterialIcons>
            </View>
          ),
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={(props: any) => ({
          tabBarIcon: (options: any) => (
            <MaterialIcons
              name={"person-outline"}
              size={30}
              color={options.focused ? color : "#333"}
            ></MaterialIcons>
          ),
        })}
      />
    </Tab.Navigator>
  );
};

const RoleSelectionStack = (props: any) => {
  const { userSelectedRole } = useSelector((state: any) => state.app);
  if (userSelectedRole) {
    return <CirclesNavigation />;
  } else {
    return (
      <Stack.Navigator
        //headerMode="none"
        initialRouteName={
          userSelectedRole ? "CircleMainNavigation" : "RoleSelection"
        }
      >
        <Stack.Screen
          name="RoleSelection"
          component={RoleSelectionScreen}
          options={getOptions(true,false)}
        />
        <Stack.Screen
          name="CircleMainNavigation"
          component={CirclesNavigation}
        />
      </Stack.Navigator>
    );
  }
};

export default RoleSelectionStack;
