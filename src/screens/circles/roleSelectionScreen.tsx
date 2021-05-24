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
} from "react-native";
import colors from "../../constants/colors";
import { connect, useDispatch, useSelector } from "react-redux";
import fonts from "../../constants/fonts";
import {
  getNotifications,
  hasMultiRoles,
  postSelectedRole,
} from "../../redux/actions/profileActions";
import { FlatList } from "react-native-gesture-handler";
import Octicons from "react-native-vector-icons/Octicons";
import {
  getUserProfileDate,
  isUserActive,
  toggleToCircleView,
  updateSnackMessage,
} from "../../redux/actions/homeScreenActions";

const width = Dimensions.get("screen").width;

const RoleSelectionScreen = (props: any) => {
  const { selectedCircle, userData } = useSelector((state: any) => state.app);
  const color = selectedCircle.color_code
    ? selectedCircle.color_code
    : colors.mainColor;

  const [userSelectedRole, setRole] = useState(null);

  const [availableRoles, setAvailableRoles] = useState([]);

  useEffect(() => {
    if (!(userData && userData.token)) {
      props.navigation.replace("CircleLogin");
    }
  }, [userData]);

  useEffect(() => {
    props.hasMultiRoles(selectedCircle.id).then((res: []) => {
      if (res.length > 0) {
        setAvailableRoles(res);
      } else {
        onRoleSelection(userData.role[0]);
      }
    });
  }, []);

  const onRoleSelection = (userRole: any) => {
    if (userRole) {
      props
        .postSelectedRole(selectedCircle.id, userRole, true)
        .then(async (res: any) => {
          if (res) {
            //navigate to different
            //props.navigation.navigate("CircleMainNavigation");
            // const isactive = await isUserActive({
            //   email: props.email,
            // });
            //if (isactive) {
            props.getUserProfileDate(userData.id, selectedCircle.id);
            props.getNotifications(1, 1, userData.id, selectedCircle.id);
            //}
          } else {
            props.updateSnackMessage("Something went wrong");
          }
        });
    }
  };

  const renderItem = ({ item, index }: any) => {
    const locationInfo = item.address;
    return (
      <TouchableOpacity
        onPress={() => {
          setRole(item);
        }}
        activeOpacity={0.4}
        style={{
          ...styles.rowContainer,
          borderColor: color,
          borderWidth: userSelectedRole == item ? 2 : 0,
          maxWidth: width - 28,
        }}
      >
        <View
          style={{
            justifyContent: "flex-start",
            alignItems: "flex-start",
            marginRight: 14,
            width: (width - 28) * 0.6
          }}
        >
          <Text ellipsizeMode={"tail"} numberOfLines={1} style={styles.title}>
            {item.display_name}
          </Text>
          <Text numberOfLines={1} style={styles.name}>
            {item.speciality}
          </Text>
        </View>
        <View
          style={[
            styles.row,
            {
              alignItems: "flex-start",
              marginBottom: 0,
              marginTop: 0,
              width: (width - 28) * 0.3,
              marginLeft: 10,
            },
          ]}
        >
          {locationInfo.city || typeof locationInfo.address === "object" ? (
            <Octicons
              name="location"
              size={20}
              color="#A0AEBE"
              style={{
                alignItems: "center",
                textAlignVertical: "center",
              }}
            />
          ) : null}
          {locationInfo.city ? (
            <Text style={[styles.address]}>
              {`${locationInfo.city},`} {locationInfo.state} {"\n"}
            </Text>
          ) : (
            typeof locationInfo.address === "object" && (
              <Text style={[styles.address]}>
                {locationInfo.address?.city},{locationInfo.address?.state}
              </Text>
            )
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      {/* <View style={{ ...styles.header, backgroundColor: color }}>
        <Text style={styles.headerText}>{selectedCircle.description}</Text>
      </View> */}
      {availableRoles.length > 0 && (
        <View style={styles.body}>
          <Text style={styles.pageHeader}>
            {"Select who you want to login as"}
          </Text>
          <FlatList
            data={availableRoles}
            keyExtractor={(item: any, index) => `${item.display_name}`}
            renderItem={renderItem}
          />
          <View
            style={{
              ...styles.row,
              alignSelf: "stretch",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                ...styles.buttonContainer,
                backgroundColor: "white",
                borderColor: color,
                borderWidth: 1,
                marginRight: 16,
              }}
              onPress={() => {
                props.toggleToCircleView({}, "");
              }}
            >
              <Text
                style={{
                  ...styles.buttonText,
                  color: color,
                }}
              >
                Back
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                ...styles.buttonContainer,
                backgroundColor: color,
              }}
              onPress={async () => {
                onRoleSelection(userSelectedRole);
              }}
            >
              <Text
                style={{
                  ...styles.buttonText,
                  color: "white",
                }}
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    marginTop: "12%",
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
    textTransform: "uppercase",
  },
});

export default connect(null, {
  hasMultiRoles,
  postSelectedRole,
  updateSnackMessage,
  toggleToCircleView,
  isUserActive,
  getUserProfileDate,
  getNotifications,
})(RoleSelectionScreen);
