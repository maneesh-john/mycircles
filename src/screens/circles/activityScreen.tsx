import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  PermissionsAndroid,
  FlatList,
  Alert,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ImagePicker from "react-native-image-picker";
import { useSelector, useDispatch } from "react-redux";
import Geolocation from "react-native-geolocation-service";
import colors from "../../constants/colors";
import { Checkbox } from "react-native-paper";
import {
  processAndUploadImage,
  makePost,
  getPostsList,
} from "../../redux/actions/profileActions";
import QuestionCard from "../../components/circle/common/questionCard";
import fonts from "../../constants/fonts";
import { getResourcesList } from "../../redux/actions/resourcesAction";
import ResourceCard from "../../components/circle/resources/resourceCard";

const PAGE_SIZE: number = 10;

const ActivityScreen = (props: any) => {
  const dispatch = useDispatch();

  const scrollRef = useRef<any>();
  const postRef = useRef<any>(null);

  const { postList, resourcesData } = useSelector(
    (state: any) => state.profile
  );
  const {
    selectedCircle,
    userData,
    myProfileInfo,
    userSelectedRole,
  } = useSelector((state: any) => state.app);
  const color = selectedCircle.color_code
    ? selectedCircle.color_code
    : colors.mainColor;
  const role = myProfileInfo?.user_info?.role;

  const [postText, setPostText] = useState<string>("");
  const [postTitle, setPostTitle] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [postFilter, setPostFilter] = useState<string>("");
  const [dayType, setDayType] = useState<string>("good");
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedImages, setSelectedImages] = useState<Array<any>>([]);
  const [selectedImageNames, setSelectedImageNames] = useState<Array<string>>(
    []
  );
  const [toggleCheckBox, setToggleCheckBox] = useState<boolean>(false);

  const [page, setpage] = useState<number>(0);
  const [refresh, setrefresh] = useState<boolean>(false);
  const [items, setitems] = useState<Array<any>>([]);
  const [totalPage, setTotalPages] = useState<any>();

  const refCallback = (textInputRef: any) => (node: any) => {
    textInputRef.current = node;
  };
  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      setitems([]);
      resetData();
    });
    return unsubscribe;
  }, [props.navigation]);

  useEffect(() => {
    if (postList?.data) {
      const _items =
        page === 0 ? Array.from(postList.data) : [...items, ...postList.data];
      const total_items = postList?.paginator?.total_count;
      setTotalPages(Math.ceil(total_items / PAGE_SIZE));
      setitems(_items);
    } else {
      if (page === 0) {
        setTotalPages(0);
        setitems([]);
      }
    }
  }, [postList]);

  const scrollTo = () => {
    if (items.length) {
      scrollRef.current.scrollToIndex({ animated: true, index: 0 });
    }
  };

  const getPollsAndTrivia = () => {
    dispatch(
      getResourcesList(1, 100, undefined, selectedCircle.id, undefined, false)
    );
  };

  const getData = async () => {
    let _filter: string = toggleCheckBox
      ? postFilter
        ? `only_with_images,${postFilter}`
        : `only_with_images`
      : postFilter;
    await dispatch(
      getPostsList(
        userSelectedRole.role,
        page + 1,
        PAGE_SIZE,
        "",
        selectedCircle.id,
        "",
        "-created_at",
        _filter,
        true,
        false
      )
    );
    setrefresh(false);
  };

  useEffect(() => {
    if (selectedCircle && selectedCircle.id) {
      getData();
    }
  }, [selectedCircle, page]);

  useEffect(() => {
    if (page === 0) {
      getData();
    } else {
      setpage(0);
    }
  }, [toggleCheckBox, postFilter]);

  const chooseImage = async () => {
    const options = {
      title: "Select Image",
      storageOptions: {
        skipBackup: true,
        path: "images",
        cameraRoll: true,
        waitUntilSaved: true,
      },
    };
    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        const file: any = {
          uri:
            Platform.OS === "android"
              ? response.uri
              : response.uri.replace("file://", ""),
          name: response.fileName
            ? response.fileName
            : `random_image.${response.type?.split("/")[1]}`,
          type: response.type,
        };
        setUploading(true);
        const filename: string = await processAndUploadImage(file);
        file.id = selectedImages.length + 1;
        setSelectedImageNames((prev) => [...prev, filename]);
        setSelectedImages((prev) => [...prev, file]);
        setUploading(false);
      }
    });
  };

  const removeImage = (index: number) => {
    setSelectedImageNames((prev) => {
      const _state = [...prev];
      _state.splice(index, 1);
      return _state;
    });
    setSelectedImages((prev) => {
      const _state = [...prev];
      _state.splice(index, 1);
      return _state;
    });
  };

  const resetData = () => {
    setrefresh(true);
    setDayType("good");
    setPostText("");
    setPostTitle("");
    setSelectedImageNames([]);
    setSelectedImages([]);
    setPostFilter("");
    setToggleCheckBox(false);
    getPollsAndTrivia();
    if (page === 0) {
      getData();
    } else {
      setpage(0);
    }
  };

  const createPost = async (location: any) => {
    const body = {
      user_circle: selectedCircle.id,
      user_role: userSelectedRole.role,
      user: userData.id,
      day_type: dayType,
      receiver_user: null,
      post_attach: selectedImageNames?.length ? selectedImageNames : null,
      latlong: {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
      },
      post_text: postText,
      post_title: postTitle,
      post_time: new Date(),
    };
    try {
      await dispatch(makePost(body));
      scrollTo();
      resetData();
    } catch (error) {
      Alert.alert("Oops", error.message);
    }
  };

  const getLocations = async () => {
    try {
      let permisson;
      if (Platform.OS === "android") {
        permisson = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
      } else if (Platform.OS === "ios") {
        permisson = await Geolocation.requestAuthorization("whenInUse");
      }
      if (permisson === "granted") {
        Geolocation.getCurrentPosition(
          (position) => {
            createPost(position);
          },
          (error) => {},
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const post = async () => {
    if (postText) {
      setError("");
      getLocations();
    } else {
      setError("Field is required");
    }
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={items}
        ref={(c: any) => {
          scrollRef.current = c;
        }}
        keyExtractor={(rs) => `${rs.id}`}
        contentContainerStyle={styles.container}
        onRefresh={resetData}
        refreshing={refresh}
        onEndReached={() => {
          if (page < totalPage) setpage(page + 1);
        }}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        ListHeaderComponent={
          <>
            <View style={styles.card}>
              <View style={styles.header}>
                <View style={{ ...styles.row, marginBottom: 15 }}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: myProfileInfo?.user_info?.url }}
                      style={styles.image}
                    />
                  </View>
                  <Text style={styles.headerText}>
                    {role === "patient" || role === "caregiver"
                      ? "HOW ARE YOU FEELING?"
                      : "CREATE A POST"}
                  </Text>
                </View>
                {role === "patient" || role === "caregiver" ? (
                  <View style={{ ...styles.row, marginHorizontal: -5 }}>
                    <TouchableOpacity
                      style={{
                        ...styles.option,
                        borderColor: color,
                        backgroundColor:
                          dayType === "bad" ? color : colors.secondary,
                      }}
                      activeOpacity={0.7}
                      onPress={() => {
                        setDayType("bad");
                      }}
                    >
                      <Text
                        style={{
                          ...styles.text,
                          color: dayType === "bad" ? colors.secondary : "#333",
                        }}
                      >
                        Bad
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        ...styles.option,
                        borderColor: color,
                        backgroundColor:
                          dayType === "okay" ? color : colors.secondary,
                      }}
                      activeOpacity={0.7}
                      onPress={() => {
                        setDayType("okay");
                      }}
                    >
                      <Text
                        style={{
                          ...styles.text,
                          color: dayType === "okay" ? colors.secondary : "#333",
                        }}
                      >
                        Okay
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        ...styles.option,
                        borderColor: color,
                        backgroundColor:
                          dayType === "good" ? color : colors.secondary,
                      }}
                      activeOpacity={0.7}
                      onPress={() => {
                        setDayType("good");
                      }}
                    >
                      <Text
                        style={{
                          ...styles.text,
                          color: dayType === "good" ? colors.secondary : "#333",
                        }}
                      >
                        Good
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <TextInput
                      placeholder="Add a title"
                      style={[
                        styles.inputField,
                        styles.inputHolder,
                        { paddingVertical: 15 },
                      ]}
                      value={postTitle}
                      onChangeText={(val: any) => setPostTitle(val)}
                    />
                  </View>
                )}
              </View>
              <View style={styles.inputHolder}>
                <TextInput
                  style={{ ...styles.inputField, minHeight: 150 }}
                  placeholder={
                    role === "patient" || role === "caregiver"
                      ? "Share your day"
                      : role === "doctor"
                      ? "Description..."
                      : "Write something"
                  }
                  keyboardType="default"
                  // maxLength={2000}
                  multiline={true}
                  numberOfLines={8}
                  value={postText}
                  ref={refCallback(postRef)}
                  onChangeText={(value: any) => setPostText(value)}
                  returnKeyType="done"
                />
                <View style={[styles.row, styles.btnContainer]}>
                  <MaterialCommunityIcons
                    onPress={chooseImage}
                    name="camera"
                    size={34}
                    color={color}
                    style={{}}
                  />
                  <TouchableOpacity
                    disabled={uploading}
                    style={{
                      ...styles.button,
                      ...styles.row,
                      backgroundColor: color,
                    }}
                    activeOpacity={0.7}
                    onPress={post}
                  >
                    {uploading ? (
                      <ActivityIndicator
                        style={{ paddingHorizontal: 5 }}
                        size={16}
                      />
                    ) : null}
                    <Text style={styles.btntext}>Post</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ paddingHorizontal: 10 }}>
                  {selectedImages.length ? (
                    <View style={styles.commentImagesContainer}>
                      {selectedImages.map((img: any, ind: number) => (
                        <View key={img.id} style={styles.commentImages}>
                          <MaterialCommunityIcons
                            onPress={() => {
                              removeImage(ind);
                            }}
                            name="close-circle-outline"
                            size={20}
                            color={"red"}
                            style={{
                              position: "absolute",
                              zIndex: 10,
                              right: -8,
                              top: -8,
                            }}
                          />
                          <Image
                            source={{ uri: img.uri }}
                            style={{ ...styles.image, borderRadius: 5 }}
                          />
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              </View>
              {error ? <Text style={styles.error}>*{error}</Text> : null}
            </View>
            <View style={{ ...styles.card, marginVertical: 10 }}>
              <View style={{ ...styles.row, justifyContent: "space-between" }}>
                <Text
                  style={{
                    paddingRight: 10,
                    fontSize: 15,
                    fontFamily: fonts.LATO_BOLD,
                  }}
                >
                  {" "}
                  FILTER BY:
                </Text>
                <View style={{ marginLeft: 5, paddingHorizontal: 10, flex: 1 }}>
                  <Text
                    onPress={() => setPostFilter("")}
                    style={{
                      flex: 1,
                      marginBottom: 5,
                      fontSize: 13,
                      fontFamily: fonts.LATO_BOLD,
                      color: postFilter === "" ? color : "#333",
                    }}
                  >
                    ALL
                  </Text>
                  <Text
                    onPress={() => setPostFilter("my_circle_members")}
                    style={{
                      flex: 1,
                      marginBottom: 5,
                      fontSize: 13,
                      fontFamily: fonts.LATO_BOLD,
                      color:
                        postFilter === "my_circle_members" ? color : "#333",
                    }}
                  >
                    MY CIRCLE MEMBERS
                  </Text>
                  <Text
                    onPress={() => setPostFilter("healthcare_professional")}
                    style={{
                      flex: 1,
                      fontSize: 13,
                      fontFamily: fonts.LATO_BOLD,
                      color:
                        postFilter === "healthcare_professional"
                          ? color
                          : "#333",
                    }}
                  >
                    HEALTHCARE PROFESSIONALS
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                ...styles.row,
                marginTop: -10,
                justifyContent: "flex-end",
              }}
            >
              <Checkbox.Android
                accessibilityStates
                color={color}
                uncheckedColor={color}
                status={toggleCheckBox ? "checked" : "unchecked"}
                onPress={() => {
                  setToggleCheckBox(!toggleCheckBox);
                }}
              />
              <Text
                style={{
                  fontFamily: fonts.LATO_REGULAR,
                  minWidth: 130,
                  fontSize: 13,
                }}
              >
                ONLY WITH IMAGES
              </Text>
            </View>
          </>
        }
        renderItem={(itemData: any) => (
          <View>
            {itemData.index !== 0 && itemData.index % 3 === 0 ? (
              itemData.index % 2 === 0 ? (
                <View>
                  {resourcesData?.Trivia?.length &&
                  resourcesData.Trivia[itemData.index / 6 - 1] ? (
                    <ResourceCard
                      otherScreen={true}
                      title={"Trivia"}
                      data={resourcesData.Trivia[itemData.index / 6 - 1]}
                      type={"trivia"}
                      color={color}
                      selectedCircle={selectedCircle}
                      userData={userData}
                    />
                  ) : null}
                  <Text
                    onPress={() => {
                      props.navigation.navigate("ResourcesScreen");
                    }}
                    style={[styles.viewmore, { color }]}
                  >
                    View more trivia
                  </Text>
                </View>
              ) : (
                <View>
                  {resourcesData?.Polls?.length &&
                  resourcesData.Polls[Math.floor(itemData.index / 6)] ? (
                    <ResourceCard
                      otherScreen={true}
                      title={"Polls"}
                      data={resourcesData.Polls[Math.floor(itemData.index / 6)]}
                      type={"poll"}
                      color={color}
                      selectedCircle={selectedCircle}
                      userData={userData}
                    />
                  ) : null}
                  <Text
                    onPress={() => {
                      props.navigation.navigate("ResourcesScreen");
                    }}
                    style={[styles.viewmore, { color }]}
                  >
                    View more polls
                  </Text>
                </View>
              )
            ) : null}
            <QuestionCard
              type="otheruser"
              navigator={props.navigation}
              otherScreen={true}
              item={itemData.item}
              selectedCircle={selectedCircle}
              userProfileInfo={myProfileInfo}
              userData={userData}
            />
          </View>
        )}
        ListFooterComponent={
          page < totalPage ? (
            <ActivityIndicator color={color} size={30} />
          ) : null
        }
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginVertical: 40,
            }}
          >
            {!refresh && (
              <Text
                style={{
                  color: "#888",
                  fontFamily: fonts.LATO_BOLD,
                  fontSize: 16,
                  textTransform: "uppercase",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                No data
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    margin: 20,
    paddingBottom: 40,
  },
  card: {
    padding: 15,
    backgroundColor: colors.secondary,
    borderRadius: 15,
    shadowColor: "#ccc",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  header: {
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: "#f6f6f6",
    marginRight: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  headerText: {
    flex: 1,
    fontFamily: fonts.LATO_BOLD,
    fontSize: 15,
  },
  inputField: {
    textAlignVertical: "top",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  option: {
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  inputHolder: {
    borderRadius: 15,
    // borderWidth: .5,
    elevation: 0.5,
    // borderColor: '#888',
    shadowColor: "#ccc",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    backgroundColor: "#f6f6f6",
  },
  btnContainer: {
    marginHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderColor: "#888",
    justifyContent: "flex-end",
  },
  button: {
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 15,
    marginLeft: 10,
  },
  text: {
    fontFamily: fonts.LATO_REGULAR,
    color: colors.secondary,
    width: "100%",
    textAlign: "center",
  },
  btntext: {
    fontFamily: fonts.LATO_REGULAR,
    color: colors.secondary,
  },
  commentImagesContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginHorizontal: -5,
  },
  commentImages: {
    height: 90,
    width: 90,
    padding: 5,
    borderRadius: 5,
    margin: 5,
    borderWidth: 0.5,
    borderColor: "#ccc",
  },
  error: {
    marginLeft: 5,
    marginTop: 3,
    fontSize: 13,
    fontFamily: fonts.LATO_BOLD,
    color: "red",
  },
  viewmore: {
    fontFamily: fonts.LATO_BOLD,
    width: "100%",
    textAlign: "right",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});

export default ActivityScreen;
