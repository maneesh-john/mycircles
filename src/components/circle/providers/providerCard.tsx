import React, { useState } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Octicons from "react-native-vector-icons/Octicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { connect, useDispatch, useSelector } from "react-redux";
import colors from "../../../constants/colors";
import { addUserToCircle } from "../../../redux/actions/profileActions";
import fonts from "../../../constants/fonts";
import { getAlphaColor } from "../../../utils/getColors";
import { Linking } from "react-native";
import { DIRECTORY_IMAGES_BASE_URL } from "../../../constants/config";
import RecommendDoctorModal from "../common/recommendDoctorModal";

const ProviderCard = (props: any) => {
  const [recommendationModal, setRecommendationModal] = useState(false);
  const { info, color, selectedCircle, type, hide, otherProfile } = props;
  const { isLoggedIn, userData, userSelectedRole } = useSelector(
    (state: any) => state.app
  );
  const [addedCircleList, setAddedCircleList] = useState<Array<Number>>([]);

  const dispatch = useDispatch();
  const color2 = selectedCircle.color_code
    ? selectedCircle.color_code2
    : colors.mainColor;

  const addToCircle = async () => {
    try {
      let _type;
      if (type === "hospital") _type = "addhospital";
      if (type === "clinic") _type = "addclinic";
      if (type === "other") _type = "addhcp";

      let res;
      if (
        userSelectedRole.role === "patient" ||
        userSelectedRole.role === "caregiver"
      ) {
        res = await props.addUserToCircle(
          userSelectedRole.role,
          selectedCircle.id,
          undefined,
          info.id,
          _type
        );
      } else {
        let apiRole = type;
        res = await props.addUserToCircle(
          apiRole,
          selectedCircle.id,
          undefined,
          info.id,
          _type
        );
      }
      if (res) {
        setAddedCircleList([...addedCircleList, info.id]);
      }

      // props
      //   .addUserToCircle(
      //     userSelectedRole.role,
      //     selectedCircle.id,
      //     undefined,
      //     info.id,
      //     _type
      //   )
      //   .then((res: Boolean) => {
      //     if (res) {
      //       setAddedCircleList([...addedCircleList, info.id]);
      //     }
      //   });
    } catch (error) {}
  };
  const getInformation = (value: any) => {
    switch (type) {
      case "physician": {
        switch (value) {
          case "name":
            return `${info.first_name} ${info.last_name}, ${info.title}`;
          case "title":
            return `${info.speciality}`;
          case "area":
            return info.areas_of_practice && info.areas_of_practice[0];
          case "plusarea":
            return info.areas_of_practice && info.areas_of_practice.length - 1;
          case "image":
            return info.picture
              ? info.picture
              : `https://dovemed-prod-k8s.s3.amazonaws.com/static/global/images/${
                  info.gender === "m"
                    ? "MALE DOCTOR2x.png"
                    : "WOMAN DOCTOR2x.png"
                }`;
          default:
            return;
        }
      }
      case "hospital": {
        switch (value) {
          case "name":
            return info.hospital_name;
          case "title":
            return info.hospital_type;
          case "area":
            return info.specialist_tag ? info.specialist_tag[0] : null;
          case "plusarea":
            return info.specialist_tag ? info.specialist_tag - 1 : null;
          case "image":
            return info.image
              ? `${DIRECTORY_IMAGES_BASE_URL}${info.image}`
              : " ";
          default:
            return;
        }
      }
      case "clinic": {
        switch (value) {
          case "name":
            return info.clinic_name;
          case "title":
            return info.clinic_type;
          case "area":
            return info.specialist_tag ? info.specialist_tag[0] : null;
          case "plusarea":
            return info.specialist_tag ? info.specialist_tag - 1 : null;
          case "image":
            return info.image
              ? `${DIRECTORY_IMAGES_BASE_URL}${info.image}`
              : " ";
          default:
            return;
        }
      }
      case "other": {
        switch (value) {
          case "name":
            return info.full_name;
          case "title":
            return selectedCircle.condition_type;
          case "area":
            return info.specialist_tag ? info.specialist_tag[0] : null;
          case "plusarea":
            return info.specialist_tag ? info.specialist_tag - 1 : null;
          case "image":
            return info.picture ? info.picture : " ";
          default:
            return;
        }
      }
      case "nfp": {
        switch (value) {
          case "name":
            return info?.nfp_name;
          case "title":
            return info?.nfp_name;
          case "area":
            return info.specialist_tag ? info.specialist_tag[0] : null;
          case "plusarea":
            return info.specialist_tag ? info.specialist_tag - 1 : null;
          case "image":
            return "https://dovemed-prod-k8s.s3.amazonaws.com/static/global/images/nfp-icon.svg"; //info?.image;
          default:
            return;
        }
      }
      default:
        return;
    }
  };

  const renderLocationView = () => {
    let locationInfo: any = info;
    return (
      <>
        <View
          style={[
            styles.row,
            { alignItems: "flex-start", marginBottom: 0, marginTop: 0 },
          ]}
        >
          {locationInfo.city || typeof locationInfo.address === "object" ? (
            locationInfo.address?.state || locationInfo.city ? (
              <Octicons
                name="location"
                size={13}
                color="#A0AEBE"
                style={{
                  marginLeft: 2,
                  alignItems: "center",
                  textAlignVertical: "center",
                }}
              />
            ) : null
          ) : null}
          <View style={[styles.address]}>
            {locationInfo.city ? (
              <Text style={{ ...styles.address, marginTop: 0, marginLeft: 5 }}>
                {`${locationInfo.city},`} {locationInfo.state} {"\n"}
              </Text>
            ) : (
              typeof locationInfo.address === "object" &&
              locationInfo.address?.state && (
                <Text style={{ ...styles.address, marginTop: 5 }}>
                  {`${locationInfo.address?.city},`}{" "}
                  {locationInfo.address?.state} {"\n"}
                </Text>
              )
            )}
          </View>
        </View>
        {/* {locationInfo.distance ? (
          <Text style={styles.distance}>
            {parseFloat(locationInfo.distance).toFixed(2)} miles away
          </Text>
        ) : null} */}
      </>
    );
  };

  return (
    <TouchableOpacity
      onPress={() => {
        let entityId = info.id;
        if (
          (userSelectedRole?.role == "patient" ||
            userSelectedRole?.role == "caregiver") &&
          !otherProfile
        ) {
          entityId = info.ext_ref_id;
        }
        let entityName =
          type === "physician"
            ? `${info.first_name} ${info.last_name}`
            : info?.display_name;

        props.navigation.push("AllOtherProfile", {
          type: type,
          userInfo: {
            id: entityId,
            name: entityName,
            role: info?.type,
            circle_id: selectedCircle.id,
          },
        });
      }}
      style={{ paddingBottom: 15 }}
    >
      <View style={styles.card}>
        <View style={styles.firstContainer}>
          <View style={styles.badge}>
            <Image
              style={styles.image}
              source={
                info?.is_active_physician
                  ? require("../../../assets/icons/icon-check-badge.png")
                  : require("../../../assets/icons/icon-uncheck-badge.png")
              }
            />
          </View>
          <View style={styles.imageConatiner}>
            <Image
              style={styles.image}
              source={{ uri: getInformation("image") }}
            />
          </View>
          {/* {type !== "nfp" && (
            <View
              style={[
                styles.rating,
                { backgroundColor: info.overall_rating ? color : "#A0AEBE" },
              ]}
            >
              <MaterialIcons name="star" size={14} color={"#fff"} />
              <Text style={styles.rate}>
                {info.overall_rating
                  ? `${parseFloat(`${info.overall_rating / 10}`).toFixed(1)}`
                  : `N/A`}
              </Text>
            </View>
          )}
          {type !== "nfp" && (
            <Text style={styles.reviews}>
              {type == "other" ? info.no_of_reviews : info.rating_count_overall}{" "}
              Reviews
            </Text>
          )} */}
        </View>
        <View style={styles.devider}></View>
        <View style={styles.secondContainer}>
          {info.promoted ? (
            <Text
              style={[
                styles.promoted,
                { backgroundColor: getAlphaColor(color), color: color2 },
              ]}
            >
              Promoted
            </Text>
          ) : null}
          <Text style={styles.name}>{getInformation("name")}</Text>
          <Text style={styles.title}>{getInformation("title")}</Text>
          {info.clinic ? (
            <Text style={styles.subLocation}>Part of Christie Clinic LLC</Text>
          ) : null}
          {/* {getInformation("area") || info.premium ? (
            <View style={styles.tags}>
              {info.premium ? (
                <View
                  style={[
                    styles.tagParts,
                    { backgroundColor: getAlphaColor(color) },
                  ]}
                >
                  <FontAwesome5 name={"crown"} size={16} color={color2} />
                </View>
              ) : null}
              {getInformation("area") ? (
                <Text
                  style={[
                    styles.tag,
                    { backgroundColor: getAlphaColor(color), color: color2 },
                  ]}
                >
                  {getInformation("area")}
                </Text>
              ) : null}
              {getInformation("plusarea") ? (
                <Text
                  style={[
                    styles.tagParts,
                    { backgroundColor: getAlphaColor(color), color: color2 },
                  ]}
                >
                  +{getInformation("plusarea")}
                </Text>
              ) : null}
            </View>
          ) : null} */}
          {info.phone_number ? (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                Linking.openURL(`tel:${info.phone_number}`);
              }}
              style={[styles.row, { margin: 0, marginTop: 5 }]}
            >
              <MaterialCommunityIcons
                name="phone-outline"
                size={14}
                color="#A0AEBE"
              />
              <Text style={styles.phoneNo}>{info.phone_number}</Text>
            </TouchableOpacity>
          ) : null}
          {renderLocationView()}
          {isLoggedIn && (
            <View style={styles.btnContainer}>
              <Text
                onPress={() => {
                  if (!addedCircleList.includes(info.id)) {
                    if (props.onCircle) {
                      return;
                    }
                    addToCircle();
                  }
                }}
                style={[
                  styles.btnPrimary,
                  { backgroundColor: color, borderColor: color },
                ]}
              >
                {addedCircleList.includes(info.id) || props.onCircle
                  ? "On circle"
                  : "Add to circle"}
              </Text>
              {
                <Text
                  onPress={() => {
                    setRecommendationModal(true);
                  }}
                  style={[styles.btnSecondary, { color, borderColor: color }]}
                >
                  Review
                </Text>
              }
            </View>
          )}
        </View>
      </View>
      {recommendationModal ? (
        <RecommendDoctorModal
          selectedCircle={selectedCircle}
          userData={userData}
          userProfileInfo={{ user_info: info }}
          setmodalVisible={setRecommendationModal}
          modalVisible={recommendationModal}
          color={color}
          type={type === "physician" ? "user" : type}
        />
      ) : null}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(6, 43, 84, 0.1)",
    backgroundColor: "#fff",
    flexDirection: "row",
  },
  firstContainer: {
    padding: 16,
    alignItems: "center",
  },
  secondContainer: {
    padding: 16,
    flex: 1,
  },
  devider: {
    borderWidth: 0.5,
    borderColor: "rgba(6, 43, 84, 0.1)",
  },
  imageConatiner: {
    height: 55,
    width: 55,
    overflow: "hidden",
    borderRadius: 28,
    borderWidth: 0.5,
    borderColor: "#ccc",
    backgroundColor: "#f6f6f6",
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    backgroundColor: "#F5B255",
    paddingVertical: 3,
    paddingHorizontal: 7,
    marginTop: 5,
    borderRadius: 10,
  },
  rate: {
    color: "#fff",
    fontSize: 12,
    paddingLeft: 5,
    fontFamily: fonts.LATO_BOLD,
  },
  reviews: {
    fontSize: 8,
    color: "#333",
    marginTop: 3,
    fontFamily: fonts.LATO_BOLD,
  },
  badge: {
    overflow: "hidden",
    position: "absolute",
    zIndex: 1,
    left: 14,
    top: 11,
    height: 23,
    width: 23,
  },
  promoted: {
    fontFamily: fonts.LATO_BOLD,
    fontSize: 12,
    textAlign: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    textTransform: "uppercase",
    borderRadius: 7,
    alignSelf: "flex-start",
    overflow: "hidden",
    marginBottom: 15,
  },
  name: {
    fontFamily: fonts.LATO_BOLD,
    color: "#333",
    fontSize: 20,
    marginBottom: 7,
  },
  title: {
    fontFamily: fonts.LATO_BOLD,
    fontSize: 12,
    color: "rgba(51,51,51,0.87)",
    marginBottom: 5,
  },
  tags: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: -5,
    marginBottom: 10,
    flexWrap: "wrap",
    marginTop: 6,
  },
  tag: {
    fontFamily: fonts.LATO_BOLD,
    fontSize: 12,
    borderRadius: 7,
    paddingVertical: 5.5,
    flex: 1,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    textAlign: "center",
    overflow: "hidden",
  },
  tagParts: {
    fontFamily: fonts.LATO_BOLD,
    fontSize: 12,
    borderRadius: 7,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    overflow: "hidden",
  },
  phoneNo: {
    fontSize: 14,
    fontFamily: fonts.LATO_BOLD,
    color: "#333",
    flex: 1,
    marginLeft: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  address: {
    //flex: 1,
    color: "rgba(51,51,51,0.54)",
    fontSize: 13,
    marginLeft: 6,
    fontFamily: fonts.LATO_BOLD,
  },
  distance: {
    color: "#333",
    fontSize: 12,
    fontFamily: fonts.LATO_BOLD,
    //marginLeft: 30,
  },
  btnContainer: {
    //marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  btnPrimary: {
    paddingVertical: 8,
    paddingHorizontal: 13,
    color: "#fff",
    fontSize: 12,
    fontFamily: fonts.LATO_BOLD,
    borderRadius: 18,
    textTransform: "uppercase",
    borderWidth: 1,
    overflow: "hidden",
    marginRight: 5,
  },
  btnSecondary: {
    paddingVertical: 8,
    marginLeft: 5,
    paddingHorizontal: 26,
    fontSize: 12,
    fontFamily: fonts.LATO_BOLD,
    backgroundColor: "#fff",
    borderRadius: 18,
    textTransform: "uppercase",
    borderWidth: 1,
    overflow: "hidden",
    marginTop: 14,
  },
  subLocation: {
    color: "#0F74BD",
    fontSize: 12,
    fontFamily: fonts.LATO_BOLD,
    marginBottom: 5,
  },
});
export default connect(null, { addUserToCircle })(ProviderCard);
