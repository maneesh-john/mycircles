import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import AboutPatient from "./story/aboutPatient";
import { useSelector, useDispatch } from "react-redux";
import { getAbout } from "../../../redux/actions/profileActions";
import colors from "../../../constants/colors";
import TreatmentsAndProcedures from "./story/treatments";
import TypeOfSymptoms from "./story/symptoms";
import AdditionalConditions from "./story/conditions";
import OtherInformations from "./story/otherInfos";
import StoryAdvocate from "./story/storyAdvocate";
import StoryDoctor from "./story/storyDoctor";

const StoryComponent = (props: any) => {
  const {
    selectedCircle,
    userData,
    userProfileInfo,
    isOtherProfile,
    role,
    userSelectedRole,
    type,
  } = props;
  const { userAbout } = useSelector((state: any) => state.profile);
  const color = selectedCircle.color_code
    ? selectedCircle.color_code
    : colors.mainColor;

  const dispatch = useDispatch();
  useEffect(() => {
    if (
      (userProfileInfo?.user_info?.id ||
        userProfileInfo?.user_info?.user_info?.id) &&
      selectedCircle.id
    ) {
      dispatch(
        getAbout(
          userProfileInfo?.user_info.id
            ? userProfileInfo?.user_info?.id
            : userProfileInfo?.user_info?.user_info?.id,
          selectedCircle.id,
          props.role === "otheruser" ||
            props.role === "other" ||
            props.role === "notification_user"
            ? userProfileInfo?.user_info?.user_info?.role
            : props.role,
          isOtherProfile,
          props.role === "otheruser" ||
            props.role === "other" ||
            props.role === "notification_user"
            ? userProfileInfo?.user_info?.user_info?.role
            : "",
          type
        )
      );
    }
  }, [selectedCircle, userProfileInfo]);

  React.useEffect(() => {
    const unsubscribe = props.navigator.addListener("focus", () => {
      if (
        (userProfileInfo?.user_info?.id ||
          userProfileInfo?.user_info?.user_info?.id) &&
        selectedCircle.id
      ) {
        dispatch(
          getAbout(
            userProfileInfo?.user_info.id
              ? userProfileInfo?.user_info?.id
              : userProfileInfo?.user_info?.user_info?.id,
            selectedCircle.id,
            props.role === "otheruser" ||
              props.role === "other" ||
              props.role === "notification_user"
              ? userProfileInfo?.user_info?.user_info?.role
              : props.role,
            isOtherProfile,
            props.role === "otheruser" ||
              props.role === "other" ||
              props.role === "notification_user"
              ? userProfileInfo?.user_info?.user_info?.role
              : "",
            type
          )
        );
      }
    });
    return unsubscribe;
  }, [props.navigator]);

  let currentRole = props.role;
  if (
    currentRole === "otheruser" ||
    currentRole === "other" ||
    currentRole === "notification_user"
  ) {
    currentRole = userProfileInfo?.user_info?.role
      ? userProfileInfo?.user_info?.role
      : userProfileInfo?.user_info?.user_info?.role;
  }

  const getViewsBaseOnRole = () => {
    if (currentRole === "patient" || currentRole === "caregiver") {
      return (
        <>
          <AboutPatient
            isOtherProfile={isOtherProfile}
            selectedCircle={selectedCircle}
            userProfileInfo={userProfileInfo}
            userAbout={userAbout}
            color={color}
          />
          <TreatmentsAndProcedures
            isOtherProfile={isOtherProfile}
            selectedCircle={selectedCircle}
            userProfileInfo={userProfileInfo}
            userAbout={userAbout}
            color={color}
          />
          <TypeOfSymptoms
            isOtherProfile={isOtherProfile}
            selectedCircle={selectedCircle}
            userProfileInfo={userProfileInfo}
            userAbout={userAbout}
            color={color}
          />
          <AdditionalConditions
            isOtherProfile={isOtherProfile}
            selectedCircle={selectedCircle}
            userProfileInfo={userProfileInfo}
            userAbout={userAbout}
            color={color}
          />
          <OtherInformations
            isOtherProfile={isOtherProfile}
            selectedCircle={selectedCircle}
            userProfileInfo={userProfileInfo}
            userAbout={userAbout}
            color={color}
          />
        </>
      );
    } else if (props.role === "doctor") {
      return (
        <StoryDoctor
          isOtherProfile={isOtherProfile}
          selectedCircle={selectedCircle}
          userProfileInfo={userProfileInfo}
          userAbout={userAbout}
          color={color}
          role={role}
        />
      );
    } else {
      return (
        <StoryAdvocate
          isOtherProfile={isOtherProfile}
          selectedCircle={selectedCircle}
          userProfileInfo={userProfileInfo}
          userAbout={userAbout}
          color={color}
        />
      );
    }
  };

  return <View style={styles.container}>{getViewsBaseOnRole()}</View>;
};

const styles = StyleSheet.create({
  container: {},
});

export default StoryComponent;
