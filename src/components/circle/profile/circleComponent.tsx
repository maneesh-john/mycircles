import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import colors from "../../../constants/colors";
import { useSelector, useDispatch } from "react-redux";
import PeopleComponent from "./circle/peopleComponent";
import SubCirclesComponent from "./circle/subCirclesComponent";
import ProvidersComponent from "./circle/providersComponent";
import {
  getProfileCircleSubCircle,
  getProfileCircleDoctors,
  getProfileCirclePeople,
} from "../../../redux/actions/profileActions";
import fonts from "../../../constants/fonts";

const CircleComponent = (props: any) => {
  const { selectedCircle, userData, userProfileInfo, isOtherProfile } = props;
  const color = selectedCircle.color_code
    ? selectedCircle.color_code
    : colors.mainColor;
  const [selectedItem, setselectedItem] = useState(0);
  const {
    profileCirclePeople,
    profileCircleSubCircles,
    profileCircleDoctors,
  } = useSelector((state: any) => state.profile);
  const { userSelectedRole } = useSelector((state: any) => state.app);

  const dispatch = useDispatch();

  useEffect(() => {
    getPageData();
  }, []);

  React.useEffect(() => {
    const unsubscribe = props.navigator.addListener("focus", () => {
      getPageData();
    });
    return unsubscribe;
  }, [props.navigator]);

  let apiRole = userSelectedRole.role;
  if (isOtherProfile) {
    if (userProfileInfo?.user_info?.id) {
      apiRole = userProfileInfo?.user_info?.role;
    } else if (userProfileInfo?.user_info?.user_info?.id) {
      apiRole = userProfileInfo?.user_info?.user_info?.role;
    }
  }

  let userId = userProfileInfo?.user_info?.id
    ? userProfileInfo?.user_info?.id
    : userProfileInfo?.user_info?.user_info?.id;

  const getPageData = () => {
    dispatch(
      getProfileCircleSubCircle(apiRole, 1, 20, userId, selectedCircle.id)
    );
    dispatch(
      getProfileCircleDoctors(apiRole, 1, 20, userId, selectedCircle.id)
    );
    dispatch(getProfileCirclePeople(apiRole, 1, 20, userId, selectedCircle.id));
  };

  const getName = () => {
    if (props.type) {
      if (props.type == "physician") {
        return `${userProfileInfo?.user_info?.first_name} ${userProfileInfo?.user_info?.last_name}`;
      } else if (props.type == "hospital") {
        return userProfileInfo?.user_info?.hospital_info.hospital_name;
      } else if (props.type == "clinic") {
        return userProfileInfo?.user_info?.clinic_info.clinic_name;
      } else if (props.type == "other") {
        return userProfileInfo?.user_info?.hcp_info.hospital_name;
      } else if (
        userProfileInfo?.user_info?.user_info["first_name"] &&
        userProfileInfo?.user_info?.user_info["last_name"]
      ) {
        return `${userProfileInfo?.user_info?.user_info?.first_name} ${userProfileInfo?.user_info?.user_info?.last_name}`;
      } else {
        return userProfileInfo?.user_info?.user_info?.display_name;
      }
    } else {
      // if (
      //   userProfileInfo?.user_info["first_name"] &&
      //   userProfileInfo?.user_info["last_name"]
      // ) {
      //   return `${userProfileInfo?.user_info?.first_name} ${userProfileInfo?.user_info?.last_name}`;
      // } else {
      //   return userProfileInfo?.user_info?.display_name;
      // }
      if (
        userProfileInfo?.user_info?.role === "clinic_administrator" ||
        userProfileInfo?.user_info?.role === "hospital_administrator"
      ) {
        return userProfileInfo?.user_info?.display_name;
      } else {
        return `${userProfileInfo?.user_info?.first_name} ${userProfileInfo?.user_info?.last_name}`;
      }
    }
  };

  const getScreen = () => {
    switch (selectedItem) {
      case 0:
        return (
          <PeopleComponent
            color={color}
            navigator={props.navigator}
            userId={userId}
            selectedCircle={selectedCircle}
            userData={userData}
            isOtherProfile={isOtherProfile}
            otherProfileRole={apiRole}
          />
        );
      case 1:
        return (
          <SubCirclesComponent
            color={color}
            navigator={props.navigator}
            userId={userId}
            selectedCircle={selectedCircle}
            userData={userData}
            isOtherProfile={isOtherProfile}
            otherProfileRole={apiRole}
          />
        );
      case 2:
        return (
          <ProvidersComponent
            key={selectedItem}
            type={selectedItem}
            color={color}
            navigator={props.navigator}
            userId={userId}
            selectedCircle={selectedCircle}
            userData={userData}
            isOtherProfile={isOtherProfile}
            otherProfileRole={apiRole}
          />
        );
      case 3:
        return (
          <ProvidersComponent
            key={selectedItem}
            type={selectedItem}
            color={color}
            navigator={props.navigator}
            userId={userId}
            selectedCircle={selectedCircle}
            userData={userData}
            isOtherProfile={isOtherProfile}
            otherProfileRole={apiRole}
          />
        );
      case 4:
        return (
          <ProvidersComponent
            key={selectedItem}
            type={selectedItem}
            color={color}
            navigator={props.navigator}
            userId={userId}
            selectedCircle={selectedCircle}
            userData={userData}
            isOtherProfile={isOtherProfile}
            otherProfileRole={apiRole}
          />
        );
      case 5:
        return (
          <ProvidersComponent
            key={selectedItem}
            type={selectedItem}
            color={color}
            navigator={props.navigator}
            userId={userId}
            selectedCircle={selectedCircle}
            userData={userData}
            isOtherProfile={isOtherProfile}
            otherProfileRole={apiRole}
          />
        );
      case 6:
        return (
          <ProvidersComponent
            key={selectedItem}
            type={selectedItem}
            color={color}
            navigator={props.navigator}
            userId={userId}
            selectedCircle={selectedCircle}
            userData={userData}
            isOtherProfile={isOtherProfile}
            otherProfileRole={apiRole}
          />
        );
      default:
        return (
          <PeopleComponent
            color={color}
            navigator={props.navigator}
            userId={userId}
            selectedCircle={selectedCircle}
            userData={userData}
            isOtherProfile={isOtherProfile}
            otherProfileRole={apiRole}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <ScrollView
          horizontal={true}
          contentContainerStyle={{ ...styles.navigator, borderColor: color }}
        >
          <Text
            onPress={() => setselectedItem(0)}
            style={{
              ...styles.navItem,
              color: selectedItem === 0 ? colors.secondary : "#333",
              backgroundColor: selectedItem === 0 ? color : colors.secondary,
            }}
          >
            {isOtherProfile ? `${getName()}'s Circle` : "People"} (
            {profileCirclePeople?.paginator?.total_count
              ? profileCirclePeople?.paginator?.total_count
              : 0}
            )
          </Text>
          <Text
            onPress={() => setselectedItem(1)}
            style={{
              ...styles.navItem,
              ...styles.navItemCenter,
              color: selectedItem === 1 ? colors.secondary : "#333",
              backgroundColor: selectedItem === 1 ? color : colors.secondary,
              borderColor: color,
            }}
          >
            {isOtherProfile ? `Circles ${getName()} is part of` : "Circles"} (
            {profileCircleSubCircles?.paginator?.total_count
              ? profileCircleSubCircles?.paginator?.total_count
              : 0}
            )
          </Text>
          <Text
            onPress={() => setselectedItem(2)}
            style={{
              ...styles.navItem,
              ...styles.navItemCenter,
              color: selectedItem === 2 ? colors.secondary : "#333",
              backgroundColor: selectedItem === 2 ? color : colors.secondary,
              borderColor: color,
            }}
          >
            {isOtherProfile ? `${getName()}'s Hospitals` : "Hospitals"} (
            {profileCircleDoctors?.hospitals?.hospitals_paginator?.total_count
              ? profileCircleDoctors?.hospitals?.hospitals_paginator
                  ?.total_count
              : 0}
            )
          </Text>
          <Text
            onPress={() => setselectedItem(3)}
            style={{
              ...styles.navItem,
              ...styles.navItemCenter,
              color: selectedItem === 3 ? colors.secondary : "#333",
              backgroundColor: selectedItem === 3 ? color : colors.secondary,
              borderColor: color,
            }}
          >
            {isOtherProfile ? `${getName()}'s Clinics` : "Clinics"} (
            {profileCircleDoctors?.clinics?.clinics_paginator?.total_count
              ? profileCircleDoctors?.clinics?.clinics_paginator?.total_count
              : 0}
            )
          </Text>
          <Text
            onPress={() => setselectedItem(4)}
            style={{
              ...styles.navItem,
              ...styles.navItemCenter,
              color: selectedItem === 4 ? colors.secondary : "#333",
              backgroundColor: selectedItem === 4 ? color : colors.secondary,
              borderColor: color,
            }}
          >
            {isOtherProfile
              ? `${getName()}'s Non For Profits`
              : "Non For Profits"}{" "}
            (
            {profileCircleDoctors?.nfps?.nfps_paginator?.total_count
              ? profileCircleDoctors?.nfps?.nfps_paginator?.total_count
              : 0}
            )
          </Text>
          <Text
            onPress={() => setselectedItem(5)}
            style={{
              ...styles.navItem,
              ...styles.navItemCenter,
              color: selectedItem === 5 ? colors.secondary : "#333",
              backgroundColor: selectedItem === 5 ? color : colors.secondary,
              borderColor: color,
            }}
          >
            {isOtherProfile
              ? `${getName()}'s Health Care Professionals`
              : "Health Care Professionals"}{" "}
            (
            {profileCircleDoctors?.hcps?.hcps_paginator?.total_count
              ? profileCircleDoctors?.hcps?.hcps_paginator?.total_count
              : 0}
            )
          </Text>
          <Text
            onPress={() => setselectedItem(6)}
            style={{
              ...styles.navItem,
              color: selectedItem === 6 ? colors.secondary : "#333",
              backgroundColor: selectedItem === 6 ? color : colors.secondary,
            }}
          >
            {isOtherProfile ? `${getName()}'s Providers` : "Providers"} (
            {profileCircleDoctors?.doctors?.doctors_paginator?.total_count
              ? profileCircleDoctors?.doctors?.doctors_paginator?.total_count
              : 0}
            )
          </Text>
        </ScrollView>
        {getScreen()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  contentContainer: {},
  navigator: {
    // flexDirection: 'row',
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 30,
    overflow: "hidden",
  },
  navItemCenter: {
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },
  navItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    height: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    backgroundColor: colors.secondary,
    color: "#333",
    fontFamily: fonts.LATO_BOLD,
  },
});

export default CircleComponent;
