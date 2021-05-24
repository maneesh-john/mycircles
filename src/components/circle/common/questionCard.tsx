import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import colors from "../../../constants/colors";
import {
  addReaction,
  removeReaction,
} from "../../../redux/actions/profileActions";
import { reactionOnType, reactionTypes } from "../../../constants/const_values";
import { useDispatch, useSelector } from "react-redux";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import QuestionComments from "./questionComments";
import ShareModal from "./shareModal";
import PostComments from "./postComments";
import { Menu, Portal, Dialog } from "react-native-paper";
import ReportModal from "./reportModal";
import fonts from "../../../constants/fonts";
import { getUserInfo } from "../../../redux/actions/homeScreenActions";
import { removeUserFromCircle } from "../../../redux/actions/profileActions";
import { Path, Svg } from "react-native-svg";

const renderEmbraceIcon = (color: string) => {
  return (
    <Svg
      aria-hidden="true"
      data-icon="hands-heart"
      viewBox="0 0 640 512"
      width={36}
      height={18}
    >
      <Path
        fill={color}
        d="M436 17.6C421.6 5.1 405.4 0 389.6 0 366.8 0 345 10.7 331 25.3L320 37l-11.1-11.6C295.2 11 273.3 0 250.2 0c-15.7 0-31.8 5.1-46.3 17.6-35.3 30.6-37.2 85.6-5.6 118.7l108.9 114.1c7 7.4 18.4 7.4 25.5 0l108.9-114.1c31.6-33.1 29.8-88.1-5.6-118.7zm-17 96.5l-99 103.8-99-103.8c-16.7-17.5-20.4-51.6 3.4-72.1 8.2-7.1 17.3-9.9 26.3-9.9 13.9 0 27.3 6.9 35.6 15.6L320 82.9l33.7-35.3C361.9 39 375.4 32 389.3 32c8.9 0 18.1 2.8 26.2 9.9 23.9 20.7 20.2 54.6 3.5 72.2zM220 248.8c-14-19.2-49.1-31.4-74.5-3.9-15.6 16.8-15.9 42.8-2.5 61.3l28.6 39.3c6.5 8.9-6.5 19.1-13.6 10.7l-62-73.3V145.8c0-26-21.2-49.3-47.2-49.7C21.9 95.6 0 117.2 0 144v170.4c0 10.9 3.7 21.5 10.5 30l107 133.7c5.4 6.8 8.9 17.5 10.1 27 .5 4 4 6.9 8 6.9h16c4.8 0 8.5-3.9 8-8.7-1.6-16-7.5-33.3-17.1-45.2l-107-133.7c-2.3-2.8-3.5-6.4-3.5-10V144c0-21 32-21.6 32 .7v149.7l64.6 77.5c36.9 44.2 96.8-2.7 70.8-42.4-.2-.3-.4-.5-.5-.8l-30.6-42.2c-4.7-6.5-4.2-16.7 3.5-22.3 7-5.1 17.1-3.8 22.4 3.5l42.4 58.4c12.7 16.9 19.5 37.4 19.5 58v120c0 4.4 3.6 8 8 8h16c4.4 0 8-3.6 8-8v-120c0-27.7-9-54.6-25.6-76.8L220 248.8zM640 144c0-26.8-21.9-48.4-48.8-48-26 .4-47.2 23.7-47.2 49.7v137.1l-62 73.3c-7.1 8.4-20.1-1.7-13.6-10.7l28.6-39.3c13.4-18.5 13.1-44.6-2.5-61.3-25.5-27.4-60.6-15.3-74.5 3.9l-42.4 58.4C361 329.3 352 356.3 352 384v120c0 4.4 3.6 8 8 8h16c4.4 0 8-3.6 8-8V384c0-20.6 6.8-41.1 19.5-58l42.4-58.4c5.3-7.3 15.3-8.7 22.4-3.5 7.8 5.6 8.3 15.8 3.5 22.3l-30.6 42.2c-.2.3-.4.5-.5.8-26.1 39.7 33.9 86.7 70.8 42.4l64.6-77.5V144.6c0-22.3 32-21.7 32-.7v170.4c0 3.6-1.2 7.2-3.5 10L497.6 458c-9.5 11.9-15.5 29.2-17.1 45.2-.5 4.8 3.2 8.7 8 8.7h16c4 0 7.5-2.9 8-6.9 1.2-9.6 4.6-20.2 10.1-27l107-133.7c6.8-8.5 10.5-19.1 10.5-30L640 144z"
      ></Path>
    </Svg>
  );
};

const QuestionCard = (props: any) => {
  const {
    item,
    selectedCircle,
    userData,
    userProfileInfo,
    isOtherProfile,
    navigator,
    otherScreen,
  } = props;
  const color = selectedCircle.color_code
    ? selectedCircle.color_code
    : colors.mainColor;

  const { userSelectedRole } = useSelector((state: any) => state.app);

  const dispatch = useDispatch();

  const [menuVisible, setMenuVisible] = React.useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [toggleComment, settoggleComment] = useState(false);
  const [showRemoveFromCircle, setshowRemoveFromCircle] = useState(false);
  const [openRemoveModal, setopenRemoveModal] = useState(false);
  const [updating, setupdating] = useState<boolean>(false);
  const [counts, setCounts] = useState<any>({
    hugs: 0,
    likes: 0,
    comment: 0,
  });
  const [myReactions, setMyReactions] = useState<any>({
    hugs: {
      id: undefined,
      value: false,
    },
    likes: {
      id: undefined,
      value: false,
    },
    favorite: {
      id: undefined,
      value: false,
    },
  });

  const openMenu = async () => {
    const res = await getUserInfo(
      userSelectedRole.role,
      item?.user[0]?.id,
      selectedCircle.id
    );
    if (res.on_circle) {
      setshowRemoveFromCircle(true);
    } else {
      setshowRemoveFromCircle(false);
    }
    setMenuVisible(true);
  };
  const closeMenu = () => setMenuVisible(false);

  useEffect(() => {
    setCounts({
      hugs: item?.reaction?.hugs ? item.reaction.hugs : 0,
      likes: item?.reaction?.likes ? item.reaction.likes : 0,
      comment: item?.comments_count,
    });
    item.my_reaction.forEach((item: any) => {
      let type: string = "";
      switch (item.reaction_type) {
        case 1:
          type = "hugs";
          break;
        case 2:
          type = "likes";
          break;
        case 4:
          type = "favorite";
          break;
        default:
          break;
      }
      if (type) {
        setMyReactions((prev: any) => {
          const _state = { ...prev };
          _state[type] = {
            id: item.id,
            value: true,
          };
          return _state;
        });
      }
    });
  }, [item]);

  const getHeader = () => {
    if (item.content_type === "post") {
      return (
        <View style={{ flex: 1 }}>
          {item.user[0].role === "doctor" ? (
            <Text style={styles.title}>
              {item.user[0].first_name} {item.user[0].last_name}
            </Text>
          ) : (
            <Text style={styles.title}>{item.user[0].display_name}</Text>
          )}
          {item.user[0].role === "doctor" ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                PHYSICIAN ({item.user[0].speciality})
              </Text>
            </View>
          ) : null}
          {(item.user[0].role === "patient" ||
            item.user[0].role === "caregiver") &&
          item.day_type ? (
            <Text style={styles.subtitle}>
              was feeling <Text style={styles.type}>{item.day_type}</Text>
            </Text>
          ) : null}
          {item?.post_location && item?.post_location?.state ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                flexWrap: "wrap",
                marginLeft: -2,
              }}
            >
              <MaterialIcons
                name="location-on"
                color={"#777"}
                size={14}
                style={{}}
              />
              <Text
                style={{
                  flex: 1,
                  color: "#777",
                  fontFamily: fonts.LATO_REGULAR,
                  fontSize: 13,
                }}
              >
                {item?.post_location?.city
                  ? item?.post_location?.city + ","
                  : ""}{" "}
                {item?.post_location?.state}
              </Text>
            </View>
          ) : null}
        </View>
      );
    } else if (item.content_type === "question") {
      return (
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.question}</Text>
        </View>
      );
    }
  };

  const getBody = () => {
    if (item.content_type === "post") {
      return (
        <>
          {item.user[0].role === "doctor" && item?.post_title ? (
            <Text style={{ ...styles.subtitle1, marginTop: 5 }}>
              {item?.post_title}
            </Text>
          ) : null}
          {item?.post_text ? (
            <Text style={styles.description}>{item.post_text}</Text>
          ) : null}
          {item?.post_attach_url
            ? item.post_attach_url.map((uri: string, i: number) => (
                <View key={i} style={styles.descriptionImageHolder}>
                  <Image source={{ uri }} style={styles.descImage} />
                </View>
              ))
            : null}
        </>
      );
    } else if (item.content_type === "question") {
      return (
        <>
          {item?.question_description ? (
            <Text style={styles.description}>{item.question_description}</Text>
          ) : null}
          {item?.question_attach_url
            ? item.question_attach_url.map((uri: string, i: number) => (
                <View key={i} style={styles.descriptionImageHolder}>
                  <Image source={{ uri }} style={styles.descImage} />
                </View>
              ))
            : null}
        </>
      );
    }
  };

  const navigate = () => {
    if (item.user[0].role === "admin") {
      return;
    }
    let paramName = "";
    if (item?.user[0].role === "doctor") {
      paramName = `${item.first_name} ${item.last_name}`;
    } else if (item?.display_name) {
      paramName = item?.display_name;
    } else {
      paramName =
        item?.user[0].first_name && item?.user[0].last_name
          ? `${item?.user[0].first_name} ${item?.user[0].last_name}`
          : item?.user[0]?.display_name;
    }
    let params: any = {
      userInfo: {
        id: item.user[0].id,
        name: paramName,
        role: item?.user[0].role,
        circle_id: selectedCircle.id,
      },
    };
    if (props["type"]) {
      params["type"] = props.type;
    }
    navigator.push("AllOtherProfile", params);
    // if (otherScreen) {
    //   if (item.user[0].id !== userData.id) {
    //     navigator.navigate("OtherProfile", {
    //       userInfo: {
    //         id: item.user[0].id,
    //         name:
    //           item.user[0].role === "doctor"
    //             ? `${item.user[0].first_name} ${item.user[0].last_name}`
    //             : item.user[0].display_name,
    //         role: item.user[0].role,
    //         circle_id: selectedCircle.id,
    //       },
    //     });
    //   } else {
    //     navigator.navigate("Profile", { screen: "MyProfile" });
    //   }
    // } else if (isOtherProfile) {
    //   if (item.user[0].id !== userData.id) {
    //     navigator.push("OtherProfile", {
    //       userInfo: {
    //         id: item.user[0].id,
    //         name:
    //           item.user[0].role === "doctor"
    //             ? `${item.user[0].first_name} ${item.user[0].last_name}`
    //             : item.user[0].display_name,
    //         role: item.user[0].role,
    //         circle_id: selectedCircle.id,
    //       },
    //     });
    //   } else {
    //     navigator.navigate("MyProfile");
    //   }
    // } else {
    //   if (item.user[0].id !== userData.id) {
    //     navigator.push("OtherProfile", {
    //       userInfo: {
    //         id: item.user[0].id,
    //         name:
    //           item.user[0].role === "doctor"
    //             ? `${item.user[0].first_name} ${item.user[0].last_name}`
    //             : item.user[0].display_name,
    //         role: item.user[0].role,
    //         circle_id: selectedCircle.id,
    //       },
    //     });
    //   }
    // }
  };

  const getTime = () => {
    if (item.content_type === "post") {
      return (
        <View style={styles.timeSection}>
          <Text style={styles.timeText}>
            Posted {moment(item?.post_time).fromNow()}
          </Text>
        </View>
      );
    } else if (item.content_type === "question") {
      return (
        <View style={styles.timeSection}>
          <Text style={styles.timeText}>
            Posted {moment(item?.asked_time).fromNow()} by
          </Text>
          <Text style={{ ...styles.username, color: color }}>
            {item.user[0].role === "doctor"
              ? `${item.user[0].first_name} ${item.user[0].last_name}`
              : item.user[0].display_name}
          </Text>
        </View>
      );
    }
  };

  const getColor = () => {
    switch (item.user[0].role) {
      case "patient":
        return colors.secondary;
      case "caregiver":
        return colors.secondary;
      case "advocate":
        return colors.secondary;
      case "hcp":
        return colors.secondary;
      case "doctor":
        return "rgb(214, 246, 251)";
      case "admin":
        return "rgb(235, 252, 245)";
      default:
        return colors.secondary;
    }
  };

  const updateReaction = async (type: string) => {
    if (updating) return;
    setupdating(true);
    try {
      if (myReactions[type].value) {
        await removeReaction(myReactions[type].id);
        setMyReactions((prev: any) => {
          const _state = { ...prev };
          _state[type] = {
            id: undefined,
            value: false,
          };
          return _state;
        });
        setCounts((prev: any) => {
          const _state = { ...prev };
          _state[type]--;
          return _state;
        });
      } else {
        const body = {
          reacted_on_type: reactionOnType[item.content_type],
          reacted_on_id: item.id,
          user: userData.id,
          reaction_type: reactionTypes[type],
        };
        const res: any = await addReaction(selectedCircle.id, body);
        setMyReactions((prev: any) => {
          const _state = { ...prev };
          _state[type] = {
            id: res.data.id,
            value: true,
          };
          return _state;
        });
        setCounts((prev: any) => {
          const _state = { ...prev };
          _state[type]++;
          return _state;
        });
      }
    } catch (error) {
      Alert.alert("Oops", error.message);
    }
    setupdating(false);
  };

  const getCommentsSection = () => {
    if (item.content_type === "post") {
      return (
        <PostComments
          userProfileInfo={userProfileInfo}
          item={item}
          selectedCircle={selectedCircle}
          userData={userData}
          color={color}
          setCounts={setCounts}
          showComments={toggleComment}
          settoggleComment={settoggleComment}
        />
      );
    } else if (item.content_type === "question") {
      return (
        <QuestionComments
          userProfileInfo={userProfileInfo}
          item={item}
          selectedCircle={selectedCircle}
          userData={userData}
          color={color}
          setCounts={setCounts}
          showComments={toggleComment}
          settoggleComment={settoggleComment}
        />
      );
    }
  };

  const openReportModal = async () => {
    closeMenu();
    setShowReportModal(true);
  };

  const removeCircleCircle = async () => {
    await dispatch(removeUserFromCircle(item?.user[0]?.id, selectedCircle.id));
    setopenRemoveModal(false);
  };

  return (
    <View style={{ ...styles.container, backgroundColor: getColor() }}>
      <View style={styles.dataSection}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={navigate}
            activeOpacity={1}
            style={styles.imageHolder}
          >
            <Image source={{ uri: item.user[0].url }} style={styles.image} />
          </TouchableOpacity>
          {getHeader()}
          {item.user[0].id !== userData.id ? (
            <Menu
              visible={menuVisible}
              onDismiss={closeMenu}
              anchor={
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={24}
                  onPress={openMenu}
                ></MaterialCommunityIcons>
              }
            >
              <Menu.Item
                onPress={openReportModal}
                style={{ height: 30 }}
                titleStyle={{ fontSize: 15 }}
                title="Report Content or Spam"
              />
              {showRemoveFromCircle && (
                <Menu.Item
                  onPress={() => {
                    closeMenu();
                    setopenRemoveModal(true);
                  }}
                  style={{ height: 30 }}
                  titleStyle={{ fontSize: 15 }}
                  title="Remove from Circle"
                />
              )}
            </Menu>
          ) : null}
        </View>
        {getBody()}
        {getTime()}
        <View style={styles.reactionSection}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              updateReaction("hugs");
            }}
            style={styles.reaction}
          >
            {renderEmbraceIcon(myReactions["hugs"].value ? color : "#333")}
            <Text style={styles.reactionText}>Embrace ({counts.hugs})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              updateReaction("likes");
            }}
            style={styles.reaction}
          >
            <MaterialCommunityIcons
              name={"heart-outline"}
              size={18}
              color={myReactions["likes"].value ? color : "#333"}
            />
            <Text style={styles.reactionText}>Like ({counts.likes})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              settoggleComment(!toggleComment);
            }}
            style={styles.reaction}
          >
            <MaterialCommunityIcons
              name="comment-text-outline"
              size={18}
              color={toggleComment ? "#333" : "#333"}
            />
            <Text style={styles.reactionText}>Comment ({counts.comment})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              updateReaction("favorite");
            }}
            style={styles.reaction}
          >
            <MaterialCommunityIcons
              name={"bookmark-outline"}
              size={18}
              color={myReactions["favorite"].value ? color : "#333"}
            />
            <Text style={styles.reactionText}>Bookmark</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setShowModal(true);
            }}
            style={styles.reaction}
          >
            <MaterialCommunityIcons
              name="share-variant"
              size={18}
              color={"#333"}
            />
            <Text style={styles.reactionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
      {getCommentsSection()}
      {showModal && (
        <ShareModal
          color={color}
          showModal={showModal}
          item={item}
          selectedCircle={selectedCircle}
          userData={userData}
          setShowModal={setShowModal}
        />
      )}
      {showReportModal && (
        <ReportModal
          color={color}
          showModal={showReportModal}
          item={item}
          selectedCircle={selectedCircle}
          userData={userData}
          setShowModal={setShowReportModal}
        />
      )}
      <Portal>
        <Dialog
          visible={openRemoveModal}
          dismissable={true}
          onDismiss={() => {
            setopenRemoveModal(false);
          }}
        >
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 10,
                borderBottomColor: "#888",
                borderBottomWidth: 0.5,
              }}
            >
              <Text style={{ color: "#333", fontFamily: fonts.LATO_BOLD }}>
                Remove User
              </Text>
              <MaterialCommunityIcons
                onPress={() => {
                  setopenRemoveModal(false);
                }}
                name="close"
                size={18}
                color={"#333"}
              />
            </View>
            <Text
              style={{
                color: "#333",
                fontFamily: fonts.LATO_REGULAR,
                paddingVertical: 40,
                paddingHorizontal: 10,
              }}
            >
              Do you want to remove {item?.user[0].display_name}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                borderTopColor: "#888",
                borderTopWidth: 0.5,
                padding: 10,
              }}
            >
              <Text
                onPress={() => {
                  setopenRemoveModal(false);
                }}
                style={{
                  color: "#333",
                  fontFamily: fonts.LATO_REGULAR,
                  minWidth: 80,
                  textAlign: "center",
                  backgroundColor: "#f6f6f6",
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  marginRight: 5,
                  borderRadius: 15,
                }}
              >
                Cancel
              </Text>
              <Text
                onPress={removeCircleCircle}
                style={{
                  color: "#fff",
                  fontFamily: fonts.LATO_REGULAR,
                  minWidth: 80,
                  textAlign: "center",
                  backgroundColor: color,
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  marginLeft: 5,
                  borderRadius: 15,
                }}
              >
                Remove
              </Text>
            </View>
          </View>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: colors.secondary,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    marginVertical: 10,
  },
  dataSection: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  imageHolder: {
    borderRadius: 35,
    height: 70,
    width: 70,
    overflow: "hidden",
    marginRight: 15,
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
    backgroundColor: "#f6f6f6",
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.LATO_BOLD,
    width: "100%",
    marginBottom: 4,
    color: "#333",
    letterSpacing: 0.4,
  },
  type: {
    fontFamily: fonts.LATO_BOLD,
    color: "#444",
    textTransform: "capitalize",
  },
  subtitle: {
    width: "100%",
    fontFamily: fonts.LATO_REGULAR,
    color: "#444",
    marginBottom: 3,
    letterSpacing: 0.4,
  },
  subtitle1: {
    width: "100%",
    fontFamily: fonts.LATO_BOLD,
    color: "#333",
    marginBottom: 3,
    letterSpacing: 0.4,
  },
  description: {
    marginVertical: 10,
    letterSpacing: 0.4,
    fontFamily: fonts.LATO_REGULAR,
    color: "#333",
  },
  descriptionImageHolder: {
    height: 120,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
  },
  descImage: {
    height: "100%",
    width: "100%",
    resizeMode: "contain",
  },
  timeSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    color: "#999",
    marginRight: 5,
    fontSize: 13,
    fontFamily: fonts.LATO_REGULAR,
  },
  username: {
    fontFamily: fonts.LATO_REGULAR,
  },
  reactionSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 20,
    marginHorizontal: -15,
    justifyContent: "space-between",
  },
  reaction: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  reactionText: {
    fontFamily: fonts.LATO_REGULAR,
    color: "#333",
    fontSize: 9,
    flex: 1,
    textAlign: "center",
    overflow: "hidden",
    flexWrap: "nowrap",
  },
  badge: {
    flexDirection: "row",
    marginBottom: 5,
  },
  badgeText: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#30cee6",
    color: colors.secondary,
    overflow: "hidden",
    fontFamily: fonts.LATO_REGULAR,
  },
});

export default QuestionCard;
