import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import colors from "../../../constants/colors";
import AskedComponent from "./qanda/askedComponent";
import AnsweredComponent from "./qanda/answeredComponent";
import fonts from "../../../constants/fonts";
import { useSelector } from "react-redux";

const QandAComponent = (props: any) => {
  const {
    selectedCircle,
    userData,
    userProfileInfo,
    myProfileInfo,
    isOtherProfile,
  } = props;
  const { userSelectedRole } = useSelector((state: any) => state.app);
  const color = selectedCircle.color_code
    ? selectedCircle.color_code
    : colors.mainColor;
  const [selectedItem, setselectedItem] = useState(0);

  const getScreen = () => {
    let userId = userProfileInfo?.user_info?.id
      ? userProfileInfo?.user_info?.id
      : userProfileInfo?.user_info?.user_info?.id;
    let apiRole = userSelectedRole.role;
    if (isOtherProfile) {
      if (userProfileInfo?.user_info?.id) {
        apiRole = userProfileInfo?.user_info?.role;
      } else if (userProfileInfo?.user_info?.user_info?.id) {
        apiRole = userProfileInfo?.user_info?.user_info?.role;
      }
    }
    switch (selectedItem) {
      case 0:
        return (
          <AskedComponent
            navigator={props.navigator}
            isOtherProfile={isOtherProfile}
            userId={userId}
            selectedCircle={selectedCircle}
            userProfileInfo={myProfileInfo}
            userData={userData}
            otherProfileRole={apiRole}
          />
        );
      case 1:
        return (
          <AnsweredComponent
            navigator={props.navigator}
            isOtherProfile={isOtherProfile}
            userId={userId}
            selectedCircle={selectedCircle}
            userProfileInfo={myProfileInfo}
            userData={userData}
            otherProfileRole={apiRole}
          />
        );
      default:
        return (
          <AskedComponent
            navigator={props.navigator}
            isOtherProfile={isOtherProfile}
            userId={userId}
            selectedCircle={selectedCircle}
            userProfileInfo={myProfileInfo}
            userData={userData}
            otherProfileRole={apiRole}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={{ ...styles.navigator, borderColor: color }}>
          <Text
            onPress={() => setselectedItem(0)}
            style={{
              ...styles.navItem,
              color: selectedItem === 0 ? colors.secondary : "#333",
              backgroundColor: selectedItem === 0 ? color : colors.secondary,
            }}
          >
            Asked
          </Text>
          <Text
            onPress={() => setselectedItem(1)}
            style={{
              ...styles.navItem,
              color: selectedItem === 1 ? colors.secondary : "#333",
              backgroundColor: selectedItem === 1 ? color : colors.secondary,
            }}
          >
            Answered
          </Text>
        </View>
        {getScreen()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  contentContainer: {},
  navigator: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 30,
    overflow: "hidden",
  },
  navItem: {
    paddingVertical: 10,
    width: "50%",
    textAlign: "center",
    textAlignVertical: "center",
    backgroundColor: colors.secondary,
    color: "#333",
    fontFamily: fonts.LATO_BOLD,
  },
});

export default QandAComponent;
