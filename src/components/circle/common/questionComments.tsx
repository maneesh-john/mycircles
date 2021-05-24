import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  TextInput,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ImagePicker from "react-native-image-picker";
import colors from "../../../constants/colors";
import {
  getQuestionComments,
  processAndUploadImage,
  postCommentsOnQuestion,
  addReaction,
  removeReaction,
} from "../../../redux/actions/profileActions";
import moment from "moment";
import { reactionTypes, reactionOnType } from "../../../constants/const_values";
import fonts from "../../../constants/fonts";
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

const PAGE_ITEM: number = 1;

const QuestionComments = ({
  userProfileInfo,
  item,
  selectedCircle,
  userData,
  color,
  showComments,
  setCounts,
  settoggleComment,
}: any) => {
  const [comment, setComment] = useState("");
  const [page, setPage] = useState(1);
  const [total, settotal] = useState(0);
  const [selectedImages, setSelectedImages] = useState<Array<any>>([]);
  const [selectedImageNames, setSelectedImageNames] = useState<Array<string>>(
    []
  );
  const [comments, setComments] = useState<any>({
    data: [],
    paginator: {},
  });

  const updateCommentsInfo = async (
    _comments: Array<any>
  ): Promise<Array<any>> => {
    return _comments.map((res: any) => {
      res["_myreactions"] = {
        hugs: { value: false },
        flaged: { value: false },
        useful: { value: false },
      };
      const hugs = res.my_reaction.find(
        (i: any) => i.reaction_type === reactionTypes["hugs"]
      );
      const useful = res.my_reaction.find(
        (i: any) => i.reaction_type === reactionTypes["useful"]
      );
      const flaged = res.my_reaction.find(
        (i: any) => i.reaction_type === reactionTypes["flaged"]
      );
      if (hugs) {
        res["_myreactions"]["hugs"] = {
          value: true,
          id: hugs.id,
        };
      }
      if (useful) {
        res["_myreactions"]["useful"] = {
          value: true,
          id: useful.id,
        };
      }
      if (flaged) {
        res["_myreactions"]["flaged"] = {
          value: true,
          id: flaged.id,
        };
      }
      return res;
    });
  };

  const getData = async () => {
    const res = await getQuestionComments(
      page,
      PAGE_ITEM,
      item.id,
      selectedCircle.id
    );
    res.data = await updateCommentsInfo(res.data);
    setComments((prev: any) => {
      const _state = { ...prev, paginator: res.paginator };
      _state.data = page === 1 ? res.data : [...prev.data, ...res.data];
      return _state;
    });
    settotal(res.paginator.total_count);
    setCounts((prev: any) => {
      return { ...prev, comment: res.paginator.total_count };
    });
  };

  useEffect(() => {
    if (showComments) {
      getData();
    }
  }, [showComments, page]);

  useEffect(() => {
    return () => {
      setPage(1);
      settotal(0);
      setComments({
        data: [],
        paginator: {},
      });
    };
  }, []);
  useEffect(() => {
    if (!showComments) {
      setPage(1);
      settotal(0);
      setComments({
        data: [],
        paginator: {},
      });
    }
  }, [showComments]);

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
        const filename: string = await processAndUploadImage(file);
        file.id = selectedImages.length + 1;
        setSelectedImageNames((prev) => [...prev, filename]);
        setSelectedImages((prev) => [...prev, file]);
      }
    });
  };

  const updateMyReaction = async (_comment: any, type: string) => {
    try {
      if (_comment?._myreactions[type]?.value) {
        await removeReaction(_comment._myreactions[type].id);
        setComments((prev: any) => {
          const _state = { ...prev };
          _state.data = _state.data.map((rs: any) => {
            if (rs.id === _comment.id) {
              rs["_myreactions"][type] = { value: false };
              rs["reaction"][type] -= 1;
              return rs;
            } else {
              return rs;
            }
          });
          return _state;
        });
      } else {
        const body = {
          reacted_on_type: reactionOnType["comment"],
          reacted_on_id: _comment.id,
          user: userData.id,
          reaction_type: reactionTypes[type],
        };
        const res: any = await addReaction(selectedCircle.id, body);
        setComments((prev: any) => {
          const _state = { ...prev };
          _state.data = _state.data.map((rs: any) => {
            if (rs.id === _comment.id) {
              rs["_myreactions"][type] = { value: true, id: res.data.id };
              rs["reaction"][type] += 1;
              return rs;
            } else {
              return rs;
            }
          });
          return _state;
        });
      }
    } catch (error) {
      Alert.alert("Oops", error.message);
    }
  };

  const postComment = async () => {
    if (comment) {
      try {
        const body = {
          question_parent_id: item.id,
          comment_text: comment,
          user: userData.id,
          comment_attach: selectedImageNames,
          commented_on_type: reactionOnType[item.content_type],
          commented_on_id: item.id,
        };
        await postCommentsOnQuestion(selectedCircle.id, body);
        setComment("");
        setSelectedImageNames([]);
        setSelectedImages([]);
        if (showComments) {
          await getData();
        } else {
          settoggleComment(true);
        }
      } catch (error) {
        Alert.alert("Oops", error.message);
      }
    }
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

  return (
    <View style={styles.conatiner}>
      <View style={styles.commentContainer}>
        <View style={styles.commentSection}>
          <View style={styles.imageHolder1}>
            <Image
              source={{ uri: userProfileInfo?.user_info?.url }}
              style={styles.image}
            />
          </View>
          <TextInput
            style={styles.commentInput}
            keyboardType="default"
            maxLength={2000}
            // multiline={true}
            value={comment}
            onChangeText={(value: any) => setComment(value)}
            returnKeyType="done"
            onSubmitEditing={postComment}
          />
          <MaterialCommunityIcons
            onPress={chooseImage}
            name="camera"
            size={24}
            color={color}
            style={{ marginLeft: "-10%", marginTop: -2 }}
          />
        </View>
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

      {showComments ? (
        <View style={styles.commentsList}>
          {comments.data.map((comment: any) => (
            <View key={comment.id} style={styles.commentView}>
              <View style={styles.imageHolder1}>
                <Image
                  source={{ uri: comment.user[0].url }}
                  style={styles.image}
                />
              </View>
              <View style={styles.commentBody}>
                <Text style={styles.name}>
                  {comment.user[0].role === "doctor"
                    ? `${comment.user[0].first_name} ${comment.user[0].last_name}`
                    : comment.user[0].display_name}{" "}
                  says:
                </Text>
                <Text style={styles.desc}>{comment.comment_text}</Text>
                {comment?.comment_attach_url ? (
                  <View style={{ marginBottom: 5 }}>
                    {comment.comment_attach_url.map(
                      (uri: string, i: number) => (
                        <View key={i} style={styles.descriptionImageHolder}>
                          <Image source={{ uri }} style={styles.descImage} />
                        </View>
                      )
                    )}
                  </View>
                ) : null}
                <Text style={styles.timeText}>
                  Posted {moment(comment?.created_at).fromNow()}
                </Text>
                <View style={styles.reactionSection}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      updateMyReaction(comment, "hugs");
                    }}
                    style={styles.reaction}
                  >
                    {renderEmbraceIcon(
                      comment?._myreactions?.hugs?.value ? color : "#333"
                    )}
                    <Text style={styles.reactionText}>
                      Embrace ({comment.reaction.hugs})
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      updateMyReaction(comment, "useful");
                    }}
                    style={styles.reaction}
                  >
                    <MaterialIcons
                      name="done"
                      size={18}
                      color={
                        comment?._myreactions?.useful?.value ? color : "#333"
                      }
                    />
                    <Text style={styles.reactionText}>
                      Useful ({comment.reaction.useful})
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      updateMyReaction(comment, "flaged");
                    }}
                    style={styles.reaction}
                  >
                    <MaterialCommunityIcons
                      name="flag-variant"
                      size={18}
                      color={
                        comment?._myreactions?.flaged?.value ? "red" : "#333"
                      }
                    />
                    <Text style={styles.reactionText}>
                      Flag ({comment.reaction.flaged})
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
          {Math.ceil(total / PAGE_ITEM) > page ? (
            <Text
              style={styles.showmore}
              onPress={() => {
                setPage(page + 1);
              }}
            >
              View more comments ...
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  conatiner: {},
  commentContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  commentSection: {
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  imageHolder1: {
    borderRadius: 20,
    height: 40,
    width: 40,
    overflow: "hidden",
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
    backgroundColor: "#f6f6f6",
  },
  commentInput: {
    backgroundColor: colors.secondary,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    paddingRight: 35,
    marginLeft: 10,
    width: Dimensions.get("screen").width - 120,
    overflow: "hidden",
  },
  commentsList: {},
  commentBody: {
    flex: 1,
    paddingLeft: 10,
  },
  timeText: {
    color: "#999",
    marginRight: 5,
    fontSize: 13,
    fontFamily: fonts.LATO_REGULAR,
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
  reactionSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 15,
    justifyContent: "space-between",
  },
  reaction: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    flex: 1,
  },
  reactionText: {
    fontWeight: "400",
    fontSize: 9,
    fontFamily: fonts.LATO_REGULAR,
    color: "#333",
    width: "100%",
    textAlign: "center",
    overflow: "hidden",
    flexWrap: "nowrap",
  },
  commentView: {
    paddingTop: 15,
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  name: {
    fontSize: 15,
    color: "#333",
    fontFamily: fonts.LATO_REGULAR,
  },
  desc: {
    marginVertical: 5,
    fontFamily: fonts.LATO_REGULAR,
    color: "#444",
  },
  showmore: {
    paddingVertical: 10,
    fontFamily: fonts.LATO_REGULAR,
    marginLeft: 4,
  },
  commentImagesContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginHorizontal: -5,
  },
  commentImages: {
    height: 100,
    width: 100,
    padding: 5,
    borderRadius: 5,
    margin: 5,
    borderWidth: 0.5,
    borderColor: "#ccc",
  },
});

export default QuestionComments;
