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
import { useSelector, useDispatch, connect } from "react-redux";
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
import { getOtherProfilePageData } from "../../redux/actions/homeScreenActions";
import {
  //removeUserFromCircle,
  addUserToCircle,
} from "../../redux/actions/profileActions";
import RecommendDoctorModal from "../../components/circle/common/recommendDoctorModal";
import fonts from "../../constants/fonts";
import { userRoles } from "../../constants/const_values";

const AllOtherProfileScreen = (props: any) => {
  const userInfo = props.route?.params.userInfo;
  const {
    selectedCircle,
    userProfileInfo,
    myProfileInfo,
    userProfileCompletionInfo,
    userData,
    userSelectedRole,
  } = useSelector((state: any) => state.app);

  const [loading, setloading] = useState(true);
  let role = "";
  switch (props.route?.params.type) {
    case "physician":
      role = "doctor";
      break;
    default:
      role = props.route?.params.type;
      break;
  }
  const dispatch = useDispatch();
  // useEffect(() => {
  //   const unsubscribe = props.navigation.addListener("focus", async () => {
  //     setloading(true);
  //     await dispatch(
  //       getOtherProfilePageData(
  //         props.route?.params.type,
  //         userSelectedRole.role,
  //         userInfo.id,
  //         userInfo.circle_id
  //       )
  //     );
  //     setloading(false);
  //   });
  //   return unsubscribe;
  // }, [dispatch]);

  useEffect(() => {
    setloading(true);
    getData();
  }, []);

  const getData = () => {
    let apiRole =
      props.route?.params.type === "otheruser" ||
      props.route?.params.type === "notification_user"
        ? userInfo.role
        : userSelectedRole.role;
    props
      .getOtherProfilePageData(
        props.route?.params.type,
        apiRole,
        userInfo.id,
        userInfo.circle_id
      )
      .then((r: boolean) => {
        setloading(false);
      });
  };

  const color = selectedCircle.color_code
    ? selectedCircle.color_code
    : colors.mainColor;
  const color2 = selectedCircle.color_code
    ? selectedCircle.color_code2
    : colors.mainColor;

  const [scrollOptions, setScrollOptions] = useState<Array<string>>([]);
  const [selectedSubNav, setSelectedSubNav] = useState("UPDATES");
  const [isOtherProfile, setisOtherProfile] = useState<boolean>(true);
  const [recommendationModal, setRecommendationModal] = useState(false);

  const [profileInfo, setProfileInfo] = useState<any>(userProfileInfo);

  useEffect(() => {
    setProfileInfo({ user_info: userProfileInfo });
  }, [userProfileInfo]);

  const sayHi = useRef<any>(null);
  const scrollRef = useRef<ScrollView | any>();

  useEffect(() => {
    if (
      (props.route?.params.type === "otheruser" ||
        props.route?.params.type === "notification_user") &&
      (props.route?.params.userInfo?.role === "patient" ||
        props.route?.params.userInfo?.role === "caregiver")
    ) {
      setScrollOptions([
        "UPDATES",
        "ABOUT",
        "TREATMENTS",
        "CIRCLE",
        "Q&A",
        "FAVORITES",
      ]);
    } else if (
      props.route?.params.type === "physician" ||
      props.route?.params.type === "other" ||
      props.route?.params.type === "otheruser" ||
      props.route?.params.type === "notification_user"
    ) {
      setScrollOptions(["UPDATES", "ABOUT", "CIRCLE", "Q&A", "FAVORITES"]);
    } else {
      setScrollOptions([
        "UPDATES",
        "STORY",
        //"TREATMENTS",
        //"CIRCLE",
        "Q&A",
        //"FAVORITES",
      ]);
    }
  }, [profileInfo]);

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

  const is_on_circle =
    typeof profileInfo.user_info?.on_circle == "boolean"
      ? profileInfo.user_info?.on_circle
      : profileInfo.user_info?.user_info?.on_circle;

  const updateCircleAction = async () => {
    try {
      if (is_on_circle) {
        // await dispatch(
        //   removeUserFromCircle(profileInfo?.user_info?.id, selectedCircle.id)
        // );
      } else {
        const uObj = profileInfo.user_info?.id
          ? profileInfo.user_info
          : profileInfo.user_info?.user_info;
        await dispatch(
          addUserToCircle(uObj.role, selectedCircle.id, uObj.id, "")
        );
        getData();
      }
    } catch (error) {
      // Alert.alert("Oops!", error.message)
    }
  };

  const recommendDoctorAction = () => {
    setRecommendationModal(true);
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
            userData={userProfileInfo}
            userProfileInfo={profileInfo}
            role={role}
            type={props.route?.params.type}
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
            userProfileInfo={profileInfo}
            role={role}
            type={props.route?.params.type}
          />
        );
      case "TREATMENTS":
        return (
          <TreatmentsComponent
            navigator={props.navigation}
            isOtherProfile={isOtherProfile}
            selectedCircle={selectedCircle}
            userData={userData}
            userProfileInfo={profileInfo}
            role={role}
          />
        );
      case "CIRCLE":
        return (
          <CircleComponent
            navigator={props.navigation}
            isOtherProfile={isOtherProfile}
            selectedCircle={selectedCircle}
            userData={userData}
            userProfileInfo={profileInfo}
            role={role}
            type={props.route?.params.type}
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
            userProfileInfo={profileInfo}
            role={role}
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
            userProfileInfo={profileInfo}
            role={role}
            type={props.route?.params.type}
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
            userProfileInfo={profileInfo}
            role={role}
            userId={props.userId}
            type={props.route?.params.type}
          />
        );
    }
  };

  let infoObject: any = null;

  if (props.route?.params.type == "physician") {
    infoObject = profileInfo?.user_info?.doctor_info;
  } else if (props.route?.params.type == "hospital") {
    infoObject = profileInfo?.user_info?.hospital_info;
  } else if (props.route?.params.type == "clinic") {
    infoObject = profileInfo?.user_info?.clinic_info;
  } else if (props.route?.params.type == "other") {
    infoObject = profileInfo?.user_info?.hcp_info;
  } else if (props.route?.params.type == "otheruser") {
    infoObject = profileInfo?.user_info?.user_info;
  } else if (props.route?.params.type == "notification_user") {
    infoObject = profileInfo?.user_info?.user_info;
  }
  const getDisplayName = () => {
    if (
      props.route?.params.type == "physician" ||
      props.route?.params.type == "other" ||
      props.route?.params.type == "otheruser" ||
      props.route?.params.type == "notification_user"
    ) {
      let name = infoObject?.display_name
        ? infoObject?.display_name
        : `${infoObject?.first_name} ${infoObject?.last_name}`;
      return name;
    } else if (props.route?.params.type == "hospital") {
      return infoObject.hospital_name;
    } else if (props.route?.params.type == "clinic") {
      return infoObject.clinic_name;
    }
  };

  console.log(profileInfo);

  return (
    <>
      {loading ? null : (
        <FlatList
          nestedScrollEnabled={true}
          contentContainerStyle={styles.screen}
          data={[0]}
          keyExtractor={(item) => `${item}`}
          renderItem={() => (
            <View>
              <CoverPictureComponent
                isOtherProfile={isOtherProfile}
                uri={
                  props.route?.params.type == "otheruser" ||
                  props.route?.params.type == "notification_user"
                    ? infoObject?.bg_img_url
                    : infoObject?.background_image
                }
                color={color}
              />
              <View style={styles.container}>
                <ProfileCardComponent
                  isOtherProfile={isOtherProfile}
                  color={color}
                  uri={
                    props.route?.params.type == "otheruser" ||
                    props.route?.params.type == "notification_user"
                      ? infoObject?.url
                      : profileInfo?.user_info?.picture
                  }
                >
                  <View style={styles.profileInfo}>
                    <Text style={styles.name}>{getDisplayName()}</Text>
                    {profileInfo?.user_info?.address ? (
                      <View style={styles.locationHolder}>
                        <MaterialIcons
                          name="location-on"
                          size={15}
                          color={color}
                        />
                        <Text style={styles.location}>
                          {profileInfo?.user_info?.address?.city
                            ? profileInfo?.user_info?.address?.city + ", "
                            : ""}
                          {profileInfo?.user_info?.address?.country
                            ? profileInfo?.user_info?.address?.country
                            : profileInfo?.user_info?.address?.state}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.actionBtns}>
                    <TouchableOpacity
                      onPress={recommendDoctorAction}
                      style={{
                        ...styles.mainBtn,
                        backgroundColor: color,
                        marginRight: 5,
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.btnText}>Review</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={updateCircleAction}
                      style={{
                        ...styles.mainBtn,
                        backgroundColor: profileInfo?.user_info?.on_circle
                          ? color2
                          : color,
                        marginRight: 5,
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.btnText}>
                        {is_on_circle ? "on circle" : "add to circle"}
                      </Text>
                      {is_on_circle ? (
                        <MaterialIcons
                          name="done"
                          size={16}
                          color={colors.secondary}
                          style={{ marginLeft: 3 }}
                        />
                      ) : null}
                    </TouchableOpacity>
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
      )}
    </>
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

export default connect(null, { getOtherProfilePageData })(
  AllOtherProfileScreen
);
