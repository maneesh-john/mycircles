import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import colors from "../../../constants/colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserToCircle,
  removeUserFromCircle,
} from "../../../redux/actions/profileActions";
import fonts from "../../../constants/fonts";

const PeopleCard = (props: any) => {
  const {
    item,
    selectedCircle,
    showButtons,
    userData,
    navigator,
    userId,
  } = props;
  const { userSelectedRole } = useSelector((state: any) => state.app);
  const color = selectedCircle.color_code
    ? selectedCircle.color_code
    : colors.mainColor;
  const color2 = selectedCircle.color_code
    ? selectedCircle.color_code2
    : colors.mainColor;

  const [added, setadded] = useState<boolean>();
  const dispatch = useDispatch();

  useEffect(() => {
    setadded(item?.on_circle);
  }, [item]);

  const btnPrimaryAction = async () => {
    if (added) {
      removeUser();
    } else {
      await addUser();
    }
  };

  const addUser = async () => {
    try {
      await dispatch(
        addUserToCircle(userSelectedRole.role, selectedCircle.id, item.id)
      );
      setadded(true);
    } catch (error) {
      setadded(false);
    }
  };

  const removeUser = async () => {
    try {
      await dispatch(removeUserFromCircle(item.id, selectedCircle.id));
      setadded(false);
    } catch (error) {
      setadded(true);
    }
  };

  const navigate = () => {
    if (item.id === userData.id) {
      navigator.navigate("MyProfile");
    } else {
      let params: any = {
        userInfo: {
          id: item.id,
          name:
            item?.role === "doctor"
              ? `${item.first_name} ${item.last_name}`
              : item?.display_name,
          role: item?.role,
          circle_id: selectedCircle.id,
        },
      };
      params["type"] = props["type"] ? props["type"] : "otheruser";
      navigator.push("AllOtherProfile", params);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={navigate}
        style={styles.imageHolder}
      >
        <Image source={{ uri: item?.url }} style={styles.image} />
      </TouchableOpacity>
      <View style={styles.descHolder}>
        <Text style={styles.name}>
          {item?.role === "doctor"
            ? `${item.first_name} ${item.last_name}`
            : item?.display_name}
        </Text>
        {item?.address || item?.location ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <MaterialIcons name="location-on" color={"#777"} size={14} />
            <Text style={{ fontFamily: fonts.LATO_REGULAR, color: "#777" }}>
              {item?.ext_ref_id
                ? `${item.address.city ? item.address.city + "," : ""} ${
                    item.address.state
                  }`
                : item?.location
                ? `${
                    item?.location[0]?.city ? item?.location[0]?.city + "," : ""
                  }, ${item?.location[0]?.state}`
                : ""}
            </Text>
          </View>
        ) : null}
        {item?.ext_ref_id || !item?.no_of_members ? null : (
          <Text
            style={{
              color: color,
              marginLeft: 5,
              marginTop: 5,
              fontFamily: fonts.LATO_REGULAR,
            }}
          >
            {item?.no_of_members} circle members
          </Text>
        )}
        {showButtons ? (
          <View style={styles.btnContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={btnPrimaryAction}
              style={{ ...styles.btn, backgroundColor: added ? color2 : color }}
            >
              <Text style={styles.btnText}>
                {added ? "on circle" : "add to circle"}
              </Text>
              {added ? (
                <MaterialIcons
                  name="done"
                  size={16}
                  color={colors.secondary}
                  style={{ marginLeft: 3 }}
                />
              ) : null}
            </TouchableOpacity>
            {/* {item?.ext_ref_id ? null : (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={navigate}
                style={{ ...styles.btn, backgroundColor: color }}
              >
                {item?.recommend ? (
                  <MaterialIcons
                    name="done"
                    size={16}
                    color={colors.secondary}
                    style={{ top: 1, marginRight: 3 }}
                  />
                ) : null}
                {item?.role === "doctor" ? (
                  <Text style={styles.btnText}>
                    {item?.recommend ? "recommended" : "recommend"}
                  </Text>
                ) : (
                  <Text style={styles.btnText}>{"Say hi"}</Text>
                )}
              </TouchableOpacity>
            )} */}
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 20,
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
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
    backgroundColor: "#f6f6f6",
  },
  imageHolder: {
    borderRadius: 50,
    height: 90,
    width: 90,
    overflow: "hidden",
    marginRight: 10,
  },
  descHolder: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    marginBottom: 5,
    // marginLeft: 5,
    fontSize: 15,
    color: "#333",
    fontFamily: fonts.LATO_BOLD,
  },
  btnContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 5,
    marginHorizontal: -5,
  },
  btn: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 13,
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    textTransform: "uppercase",
    color: colors.secondary,
    fontSize: 13,
    fontFamily: fonts.LATO_REGULAR,
  },
});

export default PeopleCard;
