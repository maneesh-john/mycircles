import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  getPostsList,
  makePost,
  requestToAdd,
} from "../../../redux/actions/profileActions";
import { DataTable } from "react-native-paper";
import QuestionCard from "../common/questionCard";
import colors from "../../../constants/colors";
import { getOtherUserProfile } from "../../../redux/actions/homeScreenActions";
import fonts from "../../../constants/fonts";

const PAGE_SIZE: number = 20;

const UpdatesComponent = (props: any) => {
  const dispatch = useDispatch();

  const {
    selectedCircle,
    userData,
    userProfileInfo,
    isOtherProfile,
    refCallback,
    sayHi,
    myProfileInfo,
    role,
  } = props;
  const color = selectedCircle.color_code
    ? selectedCircle.color_code
    : colors.mainColor;

  const { updatesList } = useSelector((state: any) => state.profile);
  const { userSelectedRole } = useSelector((state: any) => state.app);
  const [page, setpage] = useState(0);
  const [refresh, setrefresh] = useState(false);
  const [items, setitems] = useState<Array<any>>([]);
  const [totalItems, setTotalItems] = useState<any>();
  const [sayHiText, setsayHiText] = useState<string>("");
  const [sayHiTextError, setsayHiTextError] = useState<string>("");

  useEffect(() => {
    if (updatesList?.data) {
      const _items = updatesList.data;
      const total_items = updatesList?.paginator?.total_count;
      setTotalItems(total_items ? Number(total_items) : 0);
      setitems(_items);
    } else {
      setTotalItems(0);
      setitems([]);
    }
  }, [updatesList]);

  React.useEffect(() => {
    const unsubscribe = props.navigator.addListener("focus", () => {
      getData();
    });
    return unsubscribe;
  }, [props.navigator]);

  const getData = async () => {
    setrefresh(true);
    let apiRole =
      isOtherProfile && userProfileInfo?.user_info?.role
        ? userProfileInfo?.user_info?.role
        : userSelectedRole.role;
    if (role === "hospital" || role === "clinic") {
      apiRole = role;
    }
    // if (props.type === "notification_user") {
    //   let userObj = userProfileInfo?.user_info?.id
    //     ? userProfileInfo?.user_info
    //     : userProfileInfo?.user_info?.user_info;
    //   getPostsList(
    //     userObj.role,
    //     page + 1,
    //     PAGE_SIZE,
    //     userObj.id,
    //     selectedCircle.id,
    //     "1",
    //     "-created_at",
    //     "",
    //     false
    //   );
    // } else {

    await dispatch(
      getPostsList(
        apiRole,
        page + 1,
        PAGE_SIZE,
        userProfileInfo?.user_info?.id,
        selectedCircle.id,
        userProfileInfo?.user_info?.id,
        "-created_at",
        "",
        false
      )
    );
    //}
    setrefresh(false);
  };

  useEffect(() => {
    if (userProfileInfo && userProfileInfo.user_info) {
      getData();
    }
  }, [userProfileInfo, page]);

  const makeAPost = async () => {
    if (sayHiText) {
      setsayHiTextError("");
      try {
        const body: any = {
          user_circle: selectedCircle.id,
          user: userData.id,
          day_type: "",
          post_text: sayHiText,
          receiver_user: userProfileInfo?.user_info?.id,
        };
        await dispatch(makePost(body));
        setsayHiText("");
        if (page === 0) {
          await dispatch(
            getPostsList(
              userSelectedRole.role,
              1,
              PAGE_SIZE,
              userProfileInfo?.user_info?.id,
              selectedCircle.id,
              userProfileInfo?.user_info?.id
            )
          );
        } else {
          setpage(0);
        }
      } catch (error) {
        Alert.alert("Oops", error.message);
      }
    } else {
      setsayHiTextError("Required");
    }
  };

  const makeRequestToAdd = async () => {
    try {
      await requestToAdd(
        userSelectedRole.role,
        selectedCircle.id,
        userProfileInfo?.user_info?.id
      );
      await dispatch(
        getOtherUserProfile(
          userSelectedRole.role,
          userProfileInfo?.user_info.id,
          selectedCircle.id
        )
      );
    } catch (error) {
      Alert.alert("Oops", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* {isOtherProfile && userProfileInfo.request_to_add !== true ? (
        <View style={[styles.card, styles.row]}>
          <Text style={{ ...styles.header, marginBottom: 0, width: "65%" }}>
            Ask{" "}
            {role === "doctor"
              ? `${userProfileInfo?.user_info?.first_name} ${userProfileInfo?.user_info?.last_name}`
              : userProfileInfo?.user_info?.display_name}{" "}
            to add you to their circle
          </Text>
          <Text
            style={{
              ...styles.postBtn,
              marginTop: 0,
              backgroundColor: color,
              width: "33%",
            }}
            onPress={makeRequestToAdd}
          >
            {userProfileInfo.request_to_add ? "REQUESTED" : "REQUEST TO ADD"}
          </Text>
        </View>
      ) : null} */}
      {/* {isOtherProfile ? (
        <View style={styles.card}>
          <Text style={styles.header}>
            Say Hi to{" "}
            {role === "doctor"
              ? `${userProfileInfo?.user_info?.first_name} ${userProfileInfo?.user_info?.last_name}`
              : userProfileInfo?.user_info?.display_name}
          </Text>
          <TextInput
            style={{ ...styles.inputField, minHeight: 150 }}
            placeholder="Share your day"
            keyboardType="default"
            maxLength={2000}
            multiline={true}
            numberOfLines={5}
            value={sayHiText}
            ref={refCallback(sayHi)}
            onChangeText={(value: any) => setsayHiText(value)}
            returnKeyType="done"
          />
          {sayHiTextError ? (
            <Text style={styles.error}>{sayHiTextError}</Text>
          ) : null}
          <Text
            onPress={makeAPost}
            style={{ ...styles.postBtn, backgroundColor: color }}
          >
            POST
          </Text>
        </View>
      ) : null} */}
      <FlatList
        nestedScrollEnabled={true}
        data={items}
        keyExtractor={(item) => `${item.id}`}
        renderItem={(itemData) => (
          <View style={{ marginTop: 10 }}>
            <QuestionCard
              navigator={props.navigator}
              isOtherProfile={isOtherProfile}
              item={itemData.item}
              selectedCircle={selectedCircle}
              userProfileInfo={myProfileInfo}
              userData={userData}
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={{ marginTop: 40 }}>
            <Text
              style={{
                color: "#888",
                width: "100%",
                textAlign: "center",
                fontFamily: fonts.LATO_BOLD,
              }}
            >
              No updates found
            </Text>
          </View>
        )}
        onRefresh={getData}
        refreshing={refresh}
      />
      {totalItems ? (
        <DataTable.Pagination
          accessibilityStates
          page={page}
          numberOfPages={Math.ceil(totalItems / PAGE_SIZE)}
          onPageChange={(_page) => setpage(_page)}
          label={`${PAGE_SIZE * page + 1} - ${
            (totalItems < PAGE_SIZE ? totalItems : PAGE_SIZE) * (page + 1)
          } of ${totalItems}`}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  count: {
    textAlign: "center",
    paddingVertical: 10,
  },
  card: {
    marginBottom: 5,
    shadowColor: "#ccc",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
    backgroundColor: colors.secondary,
    paddingVertical: 20,
    borderRadius: 15,
    paddingHorizontal: 10,
  },
  header: {
    marginBottom: 10,
    color: "#333",
    fontFamily: fonts.LATO_BOLD,
  },
  inputField: {
    backgroundColor: colors.secondary,
    borderColor: "#ccc",
    borderWidth: 0.5,
    borderRadius: 15,
    padding: 10,
    width: "100%",
    marginBottom: 5,
    textAlignVertical: "top",
  },
  postBtn: {
    color: colors.secondary,
    width: 120,
    textAlign: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginTop: 10,
    borderRadius: 10,
    alignSelf: "flex-end",
    overflow: "hidden",
    fontFamily: fonts.LATO_REGULAR,
  },
  row: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 12,
    color: "red",
  },
});

export default UpdatesComponent;
