import React, { useState, useEffect, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import colors from "../../constants/colors";
import CoverPictureComponent from "../../components/circle/common/coverPictureComponent";
import { useSelector, useDispatch } from "react-redux";
import ProfileCardComponent from "../../components/circle/common/profileCardComponent";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { ProgressBar, Divider } from "react-native-paper";
import Links from "../../components/homeScreen/links";
import UpdatesComponent from "../../components/circle/profile/updatesComponent";
import StoryComponent from "../../components/circle/profile/storyComponent";
import TreatmentsComponent from "../../components/circle/profile/treatmentsComponent";
import CircleComponent from "../../components/circle/profile/circleComponent";
import QandAComponent from "../../components/circle/profile/qAndAComponent";
import FavouritesComponent from "../../components/circle/profile/favouritesComponent";
import {
  getOtherUserProfile,
  getUserProfileCompletionData,
} from "../../redux/actions/homeScreenActions";
import {
  removeUserFromCircle,
  addUserToCircle,
} from "../../redux/actions/profileActions";
import RecommendDoctorModal from "../../components/circle/common/recommendDoctorModal";
import fonts from "../../constants/fonts";
import { userRoles } from "../../constants/const_values";

const MyProfileScreen = (props: any) => {
  const {
    selectedCircle,
    userProfileInfo,
    myProfileInfo,
    userProfileCompletionInfo,
    userData,
    //role,
    userSelectedRole,
  } = useSelector((state: any) => state.app);

  const color = selectedCircle.color_code
    ? selectedCircle.color_code
    : colors.mainColor;
  const color2 = selectedCircle.color_code
    ? selectedCircle.color_code2
    : colors.mainColor;

  const [
    showUserProfileCompletionInfo,
    setShowUserProfileCompletionInfo,
  ] = useState(false);
  const [scrollOptions, setScrollOptions] = useState<Array<string>>([]);
  const [selectedSubNav, setSelectedSubNav] = useState("UPDATES");
  const [isOtherProfile, setisOtherProfile] = useState<boolean>(false);
  const [recommendationModal, setRecommendationModal] = useState(false);

  const [profileInfo, setProfileInfo] = useState<any>({});

  const dispatch = useDispatch();

  const sayHi = useRef<any>(null);
  const scrollRef = useRef<ScrollView | any>();

  useEffect(() => {
    if (
      // role === "advocate" ||
      // role === "hcp" ||
      // role === "doctor" ||
      userSelectedRole.role === "advocate" ||
      userSelectedRole.role === "hcp" ||
      userSelectedRole.role === "doctor"
    ) {
      setScrollOptions(["UPDATES", "ABOUT", "CIRCLE", "Q&A", "FAVORITES"]);
    } else if (userSelectedRole.role === "caregiver") {
      setScrollOptions(["UPDATES", "STORY", "CIRCLE", "Q&A", "FAVORITES"]);
    } else {
      setScrollOptions([
        "UPDATES",
        "STORY",
        "TREATMENTS",
        "CIRCLE",
        "Q&A",
        "FAVORITES",
      ]);
    }
  }, [profileInfo]);

  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", async () => {
      props.otherProfle
        ? setProfileInfo(userProfileInfo)
        : setProfileInfo(myProfileInfo);
      if (
        (!props.otherProfle && userSelectedRole.role === "patient") ||
        userSelectedRole.role === "caregiver"
      ) {
        dispatch(
          getUserProfileCompletionData(selectedCircle.id, userSelectedRole.role)
        );
      }
      await dispatch(
        getOtherUserProfile(
          userSelectedRole.role,
          profileInfo?.user_info?.id,
          selectedCircle.id
        )
      );
    });
    return unsubscribe;
  }, [props.navigation]);

  useEffect(() => {
    //setisOtherProfile(props.otherProfle);
    props.otherProfle
      ? setProfileInfo(userProfileInfo)
      : setProfileInfo(myProfileInfo);
    if (
      (!props.otherProfle && userSelectedRole.role === "patient") ||
      userSelectedRole.role === "caregiver"
    ) {
      dispatch(
        getUserProfileCompletionData(selectedCircle.id, userSelectedRole.role)
      );
    }
  }, [props.otherProfle, userProfileInfo, myProfileInfo]);

  const refCallback = (textInputRef: any) => (node: any) => {
    textInputRef.current = node;
  };

  const focusSayHi = () => {
    scrollRef.current?.scrollTo({
      x: 0,
      animated: true,
    });
    setSelectedSubNav("UPDATES");
    setTimeout(() => {
      sayHi.current.focus();
    }, 300);
  };

  const updateCircleAction = async () => {
    try {
      if (profileInfo?.on_circle) {
        await dispatch(
          removeUserFromCircle(profileInfo?.user_info?.id, selectedCircle.id)
        );
      } else {
        await dispatch(
          addUserToCircle(
            userSelectedRole.role,
            selectedCircle.id,
            profileInfo?.user_info?.id
          )
        );
      }
      await dispatch(
        getOtherUserProfile(
          userSelectedRole.role,
          profileInfo?.user_info?.id,
          selectedCircle.id
        )
      );
    } catch (error) {
      // Alert.alert("Oops!", error.message)
    }
  };

  const recommendDoctorAction = () => {
    if (!profileInfo?.recommend) {
      setRecommendationModal(true);
    }
  };

  const getNavItem = () => {
    switch (selectedSubNav) {
      case "UPDATES":
        return (
          <UpdatesComponent
            userId={props.userId}
            myProfileInfo={myProfileInfo}
            sayHi={sayHi}
            refCallback={refCallback}
            navigator={props.navigation}
            isOtherProfile={isOtherProfile}
            selectedCircle={selectedCircle}
            userData={userData}
            userProfileInfo={myProfileInfo}
            role={userSelectedRole.role}
          />
        );
      case "STORY":
      case "ABOUT":
        return (
          <StoryComponent
            navigator={props.navigation}
            isOtherProfile={isOtherProfile}
            selectedCircle={selectedCircle}
            userSelectedRole={userSelectedRole}
            userData={userData}
            userProfileInfo={myProfileInfo}
            role={userSelectedRole.role}
          />
        );
      case "TREATMENTS":
        return (
          <TreatmentsComponent
            navigator={props.navigation}
            isOtherProfile={isOtherProfile}
            selectedCircle={selectedCircle}
            userData={userData}
            userProfileInfo={myProfileInfo}
            role={userSelectedRole.role}
          />
        );
      case "CIRCLE":
        return (
          <CircleComponent
            navigator={props.navigation}
            isOtherProfile={isOtherProfile}
            selectedCircle={selectedCircle}
            userData={userData}
            userProfileInfo={myProfileInfo}
            role={userSelectedRole.role}
          />
        );
      case "Q&A":
        return (
          <QandAComponent
            myProfileInfo={myProfileInfo}
            navigator={props.navigation}
            isOtherProfile={isOtherProfile}
            selectedCircle={selectedCircle}
            userData={userData}
            userProfileInfo={myProfileInfo}
            role={userSelectedRole.role}
          />
        );
      case "FAVORITES":
        return (
          <FavouritesComponent
            myProfileInfo={myProfileInfo}
            navigator={props.navigation}
            isOtherProfile={isOtherProfile}
            selectedCircle={selectedCircle}
            userData={userData}
            userProfileInfo={myProfileInfo}
            role={userSelectedRole.role}
          />
        );
      default:
        return (
          <UpdatesComponent
            myProfileInfo={myProfileInfo}
            sayHi={sayHi}
            refCallback={refCallback}
            navigator={props.navigation}
            isOtherProfile={isOtherProfile}
            selectedCircle={selectedCircle}
            userData={userData}
            userProfileInfo={myProfileInfo}
            role={userSelectedRole.role}
          />
        );
    }
  };

  return (
    <FlatList
      nestedScrollEnabled={true}
      contentContainerStyle={styles.screen}
      data={[0]}
      keyExtractor={(item) => `${item}`}
      renderItem={() => (
        <View>
          <CoverPictureComponent
            isOtherProfile={isOtherProfile}
            uri={profileInfo?.user_info?.bg_img_url}
            color={color}
          />
          <View style={styles.container}>
            <ProfileCardComponent
              isOtherProfile={isOtherProfile}
              color={color}
              uri={profileInfo?.user_info?.url}
            >
              <View style={styles.profileInfo}>
                <Text style={styles.name}>
                  {profileInfo?.user_info?.role === "doctor"
                    ? `${profileInfo?.user_info?.first_name} ${profileInfo?.user_info?.last_name}`
                    : profileInfo?.user_info?.display_name}
                </Text>
                <Text style={styles.name}>
                  {userSelectedRole?.role
                    ? userRoles[userSelectedRole?.role]
                    : ""}
                </Text>
                {profileInfo?.user_info?.location ? (
                  <View style={styles.locationHolder}>
                    <MaterialIcons name="location-on" size={15} color={color} />
                    <Text style={styles.location}>
                      {profileInfo?.user_info?.location[0].city
                        ? profileInfo?.user_info?.location[0].city + ", "
                        : ""}
                      {profileInfo?.user_info?.location[0].country
                        ? profileInfo?.user_info?.location[0].country
                        : profileInfo?.user_info?.location[0].state}
                    </Text>
                  </View>
                ) : null}
                {profileInfo?.user_info?.role === "doctor" ? (
                  <Text style={{ ...styles.memberCount, color }}>
                    {isOtherProfile
                      ? profileInfo?.no_of_recommendations
                      : profileInfo?.recommendations}{" "}
                    Recommendations
                  </Text>
                ) : (
                  <Text style={{ ...styles.memberCount, color }}>
                    {profileInfo?.no_of_members} circle members
                  </Text>
                )}
              </View>
              {isOtherProfile ? (
                <View style={styles.actionBtns}>
                  {profileInfo?.user_info?.role === "doctor" ? (
                    <TouchableOpacity
                      onPress={recommendDoctorAction}
                      style={{
                        ...styles.mainBtn,
                        backgroundColor: color,
                        marginRight: 5,
                      }}
                      activeOpacity={0.7}
                    >
                      {profileInfo?.recommend ? (
                        <MaterialIcons
                          name="done"
                          size={16}
                          color={colors.secondary}
                          style={{ top: 1, marginRight: 3 }}
                        />
                      ) : null}
                      <Text style={styles.btnText}>
                        {profileInfo?.recommend ? "Recommended" : "Recommend"}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={updateCircleAction}
                      style={{
                        ...styles.mainBtn,
                        backgroundColor: profileInfo?.on_circle
                          ? color2
                          : color,
                        marginRight: 5,
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.btnText}>
                        {profileInfo?.on_circle ? "on circle" : "add to circle"}
                      </Text>
                      {profileInfo?.on_circle ? (
                        <MaterialIcons
                          name="done"
                          size={16}
                          color={colors.secondary}
                          style={{ marginLeft: 3 }}
                        />
                      ) : null}
                    </TouchableOpacity>
                  )}
                  {/* <TouchableOpacity
                    onPress={focusSayHi}
                    style={{
                      ...styles.mainBtn,
                      backgroundColor: color,
                      marginLeft: 5,
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.btnText}>say hi</Text>
                  </TouchableOpacity> */}
                </View>
              ) : null}
              {!isOtherProfile &&
              Object.keys(userProfileCompletionInfo).length ? (
                <Divider
                  accessibilityStates
                  style={{ backgroundColor: "#ccc", height: 0.7 }}
                />
              ) : null}
              {!isOtherProfile &&
              Object.keys(userProfileCompletionInfo).length ? (
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>
                    {" "}
                    your profile is {userProfileCompletionInfo.message}%
                    complete
                  </Text>
                  <ProgressBar
                    accessibilityStates
                    style={styles.progressBar}
                    color={color}
                    progress={userProfileCompletionInfo.message / 100}
                  />
                  <AntDesign
                    name={
                      showUserProfileCompletionInfo
                        ? "upcircleo"
                        : "downcircleo"
                    }
                    size={20}
                    onPress={() =>
                      setShowUserProfileCompletionInfo((prev) => !prev)
                    }
                    style={{ top: -16, right: -25, alignSelf: "flex-end" }}
                  />
                </View>
              ) : null}
              {showUserProfileCompletionInfo ? (
                <View>
                  {userProfileCompletionInfo.data.map((info: any) => (
                    <View style={styles.progressItems} key={info.key_name}>
                      <MaterialIcons
                        onPress={() => {}}
                        name="add"
                        color={colors.secondary}
                        style={{
                          ...styles.progressIcon,
                          backgroundColor: color,
                        }}
                        size={18}
                      />
                      <Text style={styles.progressItemText}>
                        {info.display_name} - {info.value} %
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </ProfileCardComponent>
            <View style={styles.body}>
              <View style={{ alignItems: "center" }}>
                <ScrollView ref={scrollRef} horizontal={true}>
                  {scrollOptions.map((item: any) => (
                    <Text
                      onPress={() => setSelectedSubNav(item)}
                      style={{
                        ...styles.subNavItem,
                        color: selectedSubNav === item ? color : "#333",
                      }}
                      key={item}
                    >
                      {item}
                    </Text>
                  ))}
                </ScrollView>
              </View>
              <View style={styles.navBody}>{getNavItem()}</View>
            </View>
          </View>
          {recommendationModal ? (
            <RecommendDoctorModal
              selectedCircle={selectedCircle}
              userData={userData}
              userProfileInfo={profileInfo}
              setmodalVisible={setRecommendationModal}
              modalVisible={recommendationModal}
              color={color}
              type={"user"}
            />
          ) : null}
          <Links color={color} />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  screen: {
    minHeight: "100%",
    backgroundColor: "#e4e4e4",
  },
  container: {
    backgroundColor: "#f6f6f6",
  },
  profileInfo: {
    marginTop: 30,
    padding: 10,
    alignItems: "center",
  },
  name: {
    fontSize: 17,
    marginBottom: 5,
    color: "#333",
    fontFamily: fonts.LATO_REGULAR,
  },
  locationHolder: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 15,
    fontFamily: fonts.LATO_REGULAR,
    color: "#444",
    marginLeft: 3,
  },
  memberCount: {
    marginTop: 5,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 15,
  },
  progressContainer: {
    padding: 20,
    paddingBottom: 0,
  },
  progressBar: {
    height: 10,
    borderRadius: 10,
  },
  progressText: {
    textTransform: "uppercase",
    marginBottom: 10,
    color: "#333",
    fontSize: 15,
    alignSelf: "center",
    fontFamily: fonts.LATO_REGULAR,
  },
  progressItems: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 5,
  },
  progressItemText: {
    marginLeft: 10,
    color: "#333",
    fontFamily: fonts.LATO_REGULAR,
  },
  progressIcon: {
    padding: 3,
    overflow: "hidden",
    textAlign: "center",
    borderRadius: 12,
  },
  body: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  subNavItem: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontFamily: fonts.LATO_REGULAR,
    minWidth: 55,
    color: "#333",
  },
  navBody: {
    minHeight: 300,
    marginVertical: 15,
  },
  actionBtns: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  mainBtn: {
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    textTransform: "uppercase",
    color: colors.secondary,
    fontFamily: fonts.LATO_REGULAR,
  },
});

export default MyProfileScreen;
