import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import {
  getNotifications,
  readNotification,
} from "../../redux/actions/profileActions";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";

const NOTIFICATIONS_PER_PAGE: number = 5;

const NotificationScreen = (props: any) => {
  const { notifications } = useSelector((state: any) => state.profile);
  const { selectedCircle, userData } = useSelector((state: any) => state.app);
  const color = selectedCircle.color_code
    ? selectedCircle.color_code
    : colors.mainColor;

  const dispatch = useDispatch();

  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [notificationData, setNotificationData] = useState<Array<any>>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  useEffect(() => {
    getNotificationData();
  }, [page]);

  useEffect(() => {
    if (isRefreshing) {
      if (page === 1) {
        getNotificationData();
      } else {
        setPage(1);
      }
    }
  }, [isRefreshing]);

  useEffect(() => {
    if (notifications?.data) {
      const pages: number = Math.ceil(
        parseInt(notifications?.paginator?.total_count) / NOTIFICATIONS_PER_PAGE
      );
      const _notification: Array<any> = notifications?.data;
      setTotalPage(pages);
      setNotificationData(_notification);
    }
  }, [notifications]);

  const getNotificationData = async () => {
    await dispatch(
      getNotifications(
        1,
        NOTIFICATIONS_PER_PAGE * page,
        userData.id,
        selectedCircle.id
      )
    );
    setIsRefreshing(false);
  };

  const navigateToResources = (params: any) => {
    props.navigation.navigate("Home", {
      screen: "ResourcesScreen",
      initial: false,
      params: {
        screen: "ResourceDetails",
        initial: false,
        params,
      },
    });
  };

  const navigate = async (item: any) => {
    try {
      const body = { is_read: true };
      await dispatch(
        readNotification(
          item.id,
          body,
          1,
          NOTIFICATIONS_PER_PAGE * page,
          userData.id,
          selectedCircle.id
        )
      );
      switch (item.element_type) {
        case "add to circle":
        case "request to add": {
          const user =
            item?.sender_user.length > 0 ? item?.sender_user[0] : null;
          if (user) {
            props.navigation.navigate("AllOtherProfile", {
              type: "notification_user",
              userInfo: {
                id: user.id,
                name:
                  user?.role === "doctor"
                    ? `${user.first_name} ${user.last_name}`
                    : user?.display_name,
                role: user?.role,
                circle_id: selectedCircle.id,
              },
            });
          }
          break;
        }
        case "post": {
          props.navigation.navigate("NotificationDetails", {
            id: item.element_id,
            role: item.sender_role,
          });
          break;
        }
        case "say hi": {
          const user =
            item?.sender_user.length > 0 ? item?.sender_user[0] : null;
          if (user) {
            props.navigation.navigate("AllOtherProfile", {
              type: "notification_user",
              userInfo: {
                id: user.id,
                name:
                  user?.role === "doctor"
                    ? `${user.first_name} ${user.last_name}`
                    : user?.display_name,
                role: user?.role,
                circle_id: selectedCircle.id,
              },
            });
          }
          break;
        }
        case "poll": {
          navigateToResources({
            title: "Polls",
            type: "poll",
            id: item.element_id,
          });
          break;
        }
        case "article": {
          navigateToResources({
            title: "Articles",
            type: "articles",
            id: item.element_id,
          });
          break;
        }
        case "video": {
          navigateToResources({
            title: "Videos",
            type: "videos",
            id: item.element_id,
          });
          break;
        }
        case "slideshow": {
          navigateToResources({
            title: "Slideshows",
            type: "slideshows",
            id: item.element_id,
          });
          break;
        }
        case "trivia": {
          navigateToResources({
            title: "Trivia",
            type: "trivia",
            id: item.element_id,
          });
          break;
        }
        default:
          break;
      }
    } catch (error) {
      Alert.alert("Oops", error.message);
    }
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={notificationData}
        keyExtractor={(item) => `${item.id}`}
        onRefresh={() => setIsRefreshing(true)}
        refreshing={isRefreshing}
        renderItem={(itemData: any) => {
          let sender =
            itemData.item?.sender_user.length > 0
              ? itemData.item.sender_user[0]
              : null;
          return (
            <TouchableOpacity
              onPress={() => navigate(itemData.item)}
              activeOpacity={0.7}
              key={itemData.item.id}
              style={[
                styles.main,
                {
                  backgroundColor: itemData.item.is_read
                    ? "#f6f6f6"
                    : colors.secondary,
                },
              ]}
            >
              <View style={styles.imageHolder}>
                <Image
                  source={{
                    uri: itemData.item.notification_type?.includes("flag on")
                      ? "img"
                      : sender?.url,
                  }}
                  style={styles.image}
                />
              </View>
              <View style={styles.content}>
                <Text style={{ marginBottom: 5, width: "100%" }}>
                  <Text style={styles.name}>
                    {itemData.item.notification_type?.includes("flag on")
                      ? null
                      : sender?.role === "doctor"
                      ? `${sender?.first_name} ${sender?.last_name} `
                      : `${sender?.display_name}  `}
                  </Text>
                  <Text style={styles.type}>
                    {itemData.item.notification_text}
                  </Text>
                </Text>
                {itemData.item.text ? (
                  <Text style={styles.msg}>{itemData.item.text}</Text>
                ) : null}
                {itemData.item.notification_image ? (
                  <View style={styles.notificationImage}>
                    <Image
                      source={{ uri: itemData.item.url }}
                      style={styles.image}
                    />
                  </View>
                ) : null}
                <Text style={styles.time}>
                  {moment(itemData.item?.notification_time).fromNow()}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={
          <View>
            {page < totalPage ? (
              <Text
                style={[styles.showmore, { color: color }]}
                onPress={() => setPage(page + 1)}
              >
                Show more...
              </Text>
            ) : null}
          </View>
        }
        ListEmptyComponent={() => (
          <Text
            style={{
              marginVertical: 40,
              textAlign: "center",
              fontFamily: fonts.LATO_BOLD,
              color: "#888",
            }}
          >
            No notifications...
          </Text>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    // paddingTop: 20,
    flex: 1,
  },
  main: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  imageHolder: {
    borderRadius: 25,
    height: 50,
    width: 50,
    overflow: "hidden",
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
    backgroundColor: "#cfcfcf",
  },
  content: {
    marginLeft: 20,
    flex: 1,
  },
  notificationImage: {
    maxHeight: 120,
    marginBottom: 5,
  },
  name: {
    fontFamily: fonts.LATO_BOLD,
    fontSize: 14,
    color: "#333",
    marginRight: 5,
  },
  type: {
    fontFamily: fonts.LATO_REGULAR,
    color: "#444",
    fontSize: 13,
  },
  msg: {
    marginBottom: 5,
    fontFamily: fonts.LATO_REGULAR,
    color: "#a8a8a8",
  },
  time: {
    color: "#a8a8a8",
    fontSize: 12,
    fontFamily: fonts.LATO_REGULAR,
  },
  showmore: {
    marginHorizontal: 20,
    paddingVertical: 5,
    marginVertical: 5,
    backgroundColor: "rgba(255,255,255,0)",
    textAlign: "right",
    fontFamily: fonts.LATO_BOLD,
  },
});

export default NotificationScreen;
