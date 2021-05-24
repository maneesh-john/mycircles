import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
  Alert,
  SafeAreaView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import colors from "../../../constants/colors";
import {
  getSharePeopleList,
  addReaction,
  sharePosts,
} from "../../../redux/actions/profileActions";
import { reactionOnType, reactionTypes } from "../../../constants/const_values";
import { Snackbar } from "react-native-paper";
import fonts from "../../../constants/fonts";
import { connect, useSelector } from "react-redux";
import { getPeopleList } from "../../../redux/actions/meetOthersAction";

const ShareModal = (props: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [list, setList] = useState<any>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [shared, setShared] = useState<any>([]);
  const [snackMessage, setSnackMessage] = useState<string>("");
  const { userSelectedRole } = useSelector((state: any) => state.app);

  const closeModal = () => {
    props.setShowModal(false);
  };

  const getList = async () => {
    setIsLoading(true);
    let res: any;
    // if (
    //   //userSelectedRole.role === "advocate" ||
    //   userSelectedRole.role === "doctor" ||
    //   userSelectedRole.role === "hospital_administrator" ||
    //   userSelectedRole.role === "clinic_administrator"
    // ) {
    //   res = await props.getPeopleList(page, 50, props.selectedCircle.id);
    // } else {
    res = await getSharePeopleList(
      page,
      100,
      props.selectedCircle.id,
      searchKey ? searchKey : ""
    );
    //}
    if (Object.keys(res).length) {
      setList((prev: any) => {
        const _state = { ...prev, paginator: res.paginator };
        _state.data = page === 1 ? res.data : [...prev.data, ...res.data];
        return _state;
      });
    } else {
      setList({});
    }
    setIsRefreshing(false);
    setIsLoading(false);
  };

  useEffect(() => {
    if (props.showModal) {
      getList();
    }
    return () => {
      setPage(1);
      setList({});
    };
  }, [props.showModal]);

  useEffect(() => {
    getList();
  }, [page, searchKey]);

  useEffect(() => {
    if (isRefreshing) {
      getList();
      setIsRefreshing(true);
    }
  }, [isRefreshing]);

  const send = async (user?: any) => {
    if (list?.data?.length) {
      const body: any = {
        reacted_on_type: reactionOnType[props.item.content_type],
        reacted_on_id: props.item.id,
        reaction_type: reactionTypes["shared"],
      };
      try {
        if (user) {
          body["user"] = user.id;
          await addReaction(props.selectedCircle.id, body);
          setShared((prev: any) => {
            return [...prev, user.id];
          });
        } else {
          body["user"] = list.data.map((user: any) => {
            return { user: user.id, role: user.role };
          });

          await sharePosts(props.selectedCircle.id, body);
          setShared((prev: any) => {
            return body["user"];
          });
        }
        const username = user
          ? user.role === "doctor"
            ? `${user.first_name} ${user.last_name}`
            : user.display_name
          : "everyone";
        setSnackMessage(`Shared successfully with ${username}`);
        setVisible(true);
      } catch (error) {
        Alert.alert("Oops", error.message);
      }
    }
  };

  return (
    <Modal
      transparent={false}
      onRequestClose={closeModal}
      animationType="slide"
      visible={props.showModal}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {isLoading ? (
          <View style={styles.activityIndication}>
            <ActivityIndicator size={40} color={props.color} />
          </View>
        ) : null}
        <View style={styles.modal}>
          <View style={styles.container}>
            <View style={{ ...styles.header, backgroundColor: props.color }}>
              <Text style={styles.modalHeaderText}>
                Share {props.type ? props.type : "Post"}
              </Text>
              <MaterialIcons
                name="close"
                onPress={closeModal}
                size={26}
                color={colors.secondary}
              />
            </View>
            <View style={styles.body}>
              <View style={styles.main}>
                <MaterialCommunityIcons
                  name="account-group"
                  color={props.color}
                  size={30}
                />
                <Text style={styles.tittle}>Share with All Circle Members</Text>
                <Text
                  onPress={() => {
                    shared.length && shared.length === list?.data?.length
                      ? null
                      : send();
                  }}
                  style={{ ...styles.action, backgroundColor: props.color }}
                >
                  {shared.length && shared.length === list?.data?.length
                    ? "SENT"
                    : "SEND"}
                </Text>
              </View>
              <TextInput
                style={{ ...styles.textInput, borderColor: props.color }}
                placeholder="Search Member"
                placeholderTextColor="#ccc"
                value={searchKey}
                onChangeText={setSearchKey}
              />
              <FlatList
                data={list.data}
                keyExtractor={(item) => `${item.id}`}
                onRefresh={() => setIsRefreshing(true)}
                refreshing={isRefreshing}
                renderItem={(itemData: any) => (
                  <View key={itemData.item.id} style={styles.main}>
                    <View style={styles.imageHolder}>
                      <Image
                        source={{ uri: itemData.item.url }}
                        style={styles.image}
                      />
                    </View>
                    <Text style={styles.tittle}>
                      {itemData.item.role === "doctor"
                        ? `${itemData.item.first_name} ${itemData.item.last_name}`
                        : itemData.item.display_name}
                    </Text>
                    <Text
                      onPress={() => {
                        shared.includes(itemData.item.id)
                          ? null
                          : send(itemData.item);
                      }}
                      style={{ ...styles.action, backgroundColor: props.color }}
                    >
                      {shared.includes(itemData.item.id) ? "SENT" : "SEND"}
                    </Text>
                  </View>
                )}
                onEndReached={() => {
                  if (Math.ceil(list?.paginator?.total_count / 1) > page) {
                    setPage(page + 1);
                  }
                }}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={() => (
                  <Text
                    style={{
                      marginVertical: 40,
                      fontFamily: fonts.LATO_REGULAR,
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    No users in your circle
                  </Text>
                )}
              />
            </View>
            <Snackbar
              accessibilityStates
              visible={visible}
              style={{
                ...styles.snackStyle,
                backgroundColor: props.color,
                borderColor: props.color,
              }}
              onDismiss={() => {
                setVisible(false);
              }}
              action={{
                label: "Okay",
                onPress: () => {
                  setVisible(false);
                },
              }}
            >
              {snackMessage}
            </Snackbar>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.8)",
    paddingHorizontal: 10,
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    minWidth: "100%",
    backgroundColor: colors.secondary,
  },
  activityIndication: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,.8)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f6f6f6",
  },
  modalHeaderText: {
    fontFamily: fonts.LATO_BOLD,
    fontSize: 16,
    color: colors.secondary,
    flex: 1,
    textTransform: "capitalize",
  },
  body: {
    padding: 20,
    flex: 1,
  },
  main: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 25,
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 0.5,
    marginVertical: 10,
  },
  tittle: {
    fontSize: 15,
    fontFamily: fonts.LATO_BOLD,
    flex: 1,
    paddingHorizontal: 10,
    textAlign: "center",
  },
  action: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    color: colors.secondary,
    fontFamily: fonts.LATO_REGULAR,
    overflow: "hidden",
  },
  textInput: {
    borderRadius: 10,
    borderWidth: 0.5,
    marginVertical: 15,
    padding: 10,
    color: "#333",
  },
  imageHolder: {
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
  snackStyle: {
    zIndex: 11,
    opacity: 0.8,
    borderRadius: 10,
    borderWidth: 1,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 10,
    overflow: "hidden",
  },
});

export default connect(null, { getPeopleList })(ShareModal);
