import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../../constants/colors";
import { useDispatch } from "react-redux";
import consts from "../../constants/consts";
import {
  toggleToCircleView,
  getUserProfileDate,
  isUserActive,
  updateSnackMessage,
} from "../../redux/actions/homeScreenActions";
import { getNotifications } from "../../redux/actions/profileActions";
import fonts from "../../constants/fonts";

const CircleCard = (props: any) => {
  const dispatch = useDispatch();
  const [buttonText, setButtonText] = useState("GET STARTED");

  useEffect(() => {
    if (
      props.userData &&
      props.userData.circles &&
      props.userData.circles.length
    ) {
      const index = props.userData.circles.findIndex(
        (rs: any) => rs.id === props.circle.id
      );
      if (index >= 0) {
        setButtonText("ENTER");
      }
    }
  }, [props.userData]);

  const redirect = async (type: string) => {
    dispatch({ type: consts.SELECTED_CIRCLE, circle: props.circle });
    if (buttonText === "GET STARTED") {
      props.navigation.navigate("SignUpModeSelectionScreen");
    } else {
      dispatch(toggleToCircleView(props.circle, type));
    }
    // else {
    //   const isactive = await isUserActive({ email: props.email });
    //   if (isactive) {
    //     dispatch(getUserProfileDate(props.userId, props.circle.id));
    //     dispatch(getNotifications(1, 1, props.userId, props.circle.id));

    //   } else {
    //     dispatch(updateSnackMessage("Your account is not verified yet!"));
    //   }
    // }
  };

  return (
    <View style={styles.card}>
      <View style={styles.circleHolder}>
        <View
          style={{
            ...styles.circle,
            backgroundColor: props.circle.color_code
              ? props.circle.color_code
              : colors.defaultColor,
          }}
        ></View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{props.circle.condition_type}</Text>
        <Text style={styles.cardDescription}>{props.circle.description}</Text>
        <View style={styles.countHolder}>
          <View style={styles.countItem}>
            <Text style={styles.count}>{props.circle?.other_info?.posts}</Text>
            <Text style={styles.countHeader}>posts</Text>
          </View>
          <View style={styles.countItem}>
            <Text style={styles.count}>
              {props.circle?.other_info?.comments}
            </Text>
            <Text style={styles.countHeader}>replies</Text>
          </View>
          <View style={styles.countItem}>
            <Text style={styles.count}>
              {props.circle?.other_info?.members}
            </Text>
            <Text style={styles.countHeader}>members</Text>
          </View>
        </View>
        <View
          style={{
            ...styles.cardActions,
            justifyContent: !props.showResources ? "center" : "space-between",
          }}
        >
          {props.showResources ? (
            <TouchableOpacity
              onPress={() => redirect("ResourcesScreen")}
              activeOpacity={0.5}
              style={styles.cardResource}
            >
              <Text style={styles.cardResourceText}>View resources</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.cardRegister}
            onPress={() => redirect("ActivityScreen")}
          >
            <Text style={styles.cardRegisterText}>
              {buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 15,
    marginTop: -30,
  },
  circleHolder: {
    flexDirection: "row",
    justifyContent: "center",
  },
  circle: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: "#0dcbbb",
    top: 30,
    shadowColor: "black",
    elevation: 3,
  },
  cardBody: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 15,
    zIndex: -1,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  cardTitle: {
    marginTop: 30,
    textAlign: "center",
    marginBottom: 5,
    fontFamily: fonts.LATO_BOLD,
    fontSize: 24,
    color: "#333333",
    letterSpacing: 1,
  },
  cardDescription: {
    textAlign: "center",
    fontSize: 16,
    color: "#333333",
    letterSpacing: 0.5,
    fontFamily: fonts.LATO_REGULAR,
    marginBottom: 15,
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardResource: {
    paddingHorizontal: 2,
  },
  cardResourceText: {
    fontSize: 12,
    color: colors.mainColor,
    fontFamily: fonts.LATO_REGULAR,
    textTransform: "uppercase",
  },
  cardRegister: {
    backgroundColor: colors.mainColor,
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 11,
  },
  cardRegisterText: {
    color: colors.secondary,
    fontSize: 16,
    fontFamily: fonts.LATO_REGULAR,
    textAlign: "center",
  },
  countHolder: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 5,
  },
  countItem: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  count: {
    fontSize: 16,
    fontFamily: fonts.LATO_REGULAR,
    marginBottom: 5,
  },
  countHeader: {
    fontSize: 16,
    fontFamily: fonts.LATO_REGULAR,
    textTransform: "uppercase",
  },
});

export default CircleCard;
