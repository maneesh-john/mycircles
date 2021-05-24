import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import moment from "moment";
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

const Comments = ({
  data,
  item,
  updateMyReaction,
  index,
  setShowReplyIndex,
  reply,
  color,
  parentUser,
}: any) => {
  const getName = (obj: any) => {
    if (obj.role === "doctor") {
      return `${obj.first_name} ${obj.last_name}`;
    } else {
      return obj.display_name;
    }
  };

  return (
    <View>
      <View style={styles.commentContent}>
        <View style={styles.imageHolder1}>
          <Image source={{ uri: data.user[0].url }} style={styles.image} />
        </View>
        <View style={styles.commentBody}>
          <Text style={styles.name}>
            {getName(data.user[0])}
            {"  "}
            <MaterialCommunityIcons
              style={{ paddingHorizontal: 10, marginHorizontal: 10 }}
              name="arrow-right"
              size={15}
            />
            {"  "}
            {reply ? getName(parentUser) : getName(item.user[0])}
          </Text>
          <View style={styles.place}>
            <MaterialIcons name="location-on" size={13} color={"#777"} />
            <Text
              style={{
                fontSize: 12,
                fontFamily: fonts.LATO_REGULAR,
                color: "#777",
              }}
            >
              {`${data.comment_location?.city ? data.comment_location?.city + ', ':""}`}{data.comment_location?.state}
            </Text>
          </View>
          <Text style={styles.desc}>{data.comment_text}</Text>
          {data?.comment_attach_url
            ? data.comment_attach_url.map((uri: string, i: number) => (
                <View key={i} style={styles.descriptionImageHolder}>
                  <Image source={{ uri }} style={styles.descImage} />
                </View>
              ))
            : null}
          <Text style={styles.timeText}>
            Posted {moment(data?.created_at).fromNow()}
          </Text>
        </View>
      </View>
      <View style={styles.reactionSection}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            updateMyReaction(data, "hugs", reply);
          }}
          style={styles.reaction}
        >
          {renderEmbraceIcon(data?._myreactions?.hugs?.value ? color : "#333")}
          <Text style={styles.reactionText}>
            Embrace ({data.reaction.hugs})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            updateMyReaction(data, "likes", reply);
          }}
          style={styles.reaction}
        >
          <MaterialCommunityIcons
            style={styles.reactionIcon}
            name={"heart-outline"}
            size={18}
            color={data?._myreactions?.likes?.value ? color : "#333"}
          />
          <Text style={styles.reactionText}>Like ({data.reaction.likes})</Text>
        </TouchableOpacity>
        {!reply ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              setShowReplyIndex((prev: any) => {
                if (prev === index) {
                  return -1;
                } else {
                  return index;
                }
              })
            }
            style={styles.reaction}
          >
            <MaterialCommunityIcons
              style={styles.reactionIcon}
              name={"reply-outline"}
              size={18}
              color={"#333"}
            />
            <Text style={styles.reactionText}>
              Reply ({data.comments_count})
            </Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            updateMyReaction(data, "favorite", reply);
          }}
          style={styles.reaction}
        >
          <MaterialCommunityIcons
            style={styles.reactionIcon}
            name="bookmark-outline"
            size={18}
            color={data?._myreactions?.favorite?.value ? color : "#333"}
          />
          <Text style={styles.reactionText}>
            Bookmark ({data.reaction.favorite})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            updateMyReaction(data, "flaged", reply);
          }}
          style={styles.reaction}
        >
          <MaterialCommunityIcons
            style={styles.reactionIcon}
            name="flag-variant-outline"
            size={18}
            color={data?._myreactions?.flaged?.value ? "red" : "#333"}
          />
          <Text style={styles.reactionText}>Flag ({data.reaction.flaged})</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  reactionIcon: {},
  reactionText: {
    color: "#333",
    fontSize: 9,
    width: "100%",
    fontFamily: fonts.LATO_REGULAR,
    textAlign: "center",
    overflow: "hidden",
    flexWrap: "nowrap",
  },
  commentContent: {
    flexDirection: "row",
  },
  name: {
    fontSize: 14,
    width: "100%",
    fontFamily: fonts.LATO_REGULAR,
    color: "#333",
    marginBottom: 3,
    textTransform: "capitalize",
  },
  place: {
    flexDirection: "row",
    // alignItems: 'center'
  },
  desc: {
    marginVertical: 8,
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
});

export default Comments;
