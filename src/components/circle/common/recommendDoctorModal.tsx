import React, { useState } from "react";
import {
  Modal,
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { AirbnbRating } from "react-native-ratings";
import colors from "../../../constants/colors";
import { recommendDoctor } from "../../../redux/actions/profileActions";
import { useDispatch, useSelector } from "react-redux";
import { getOtherUserProfile } from "../../../redux/actions/homeScreenActions";

const REVIEW_TYPES: Array<string> = [
  "WORST",
  "POOR",
  "AVERAGE",
  "GOOD",
  "EXCELLENT",
];

const RecommendDoctorModal = (props: any) => {
  const dispatch = useDispatch();
  const { userSelectedRole } = useSelector((state: any) => state.app);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);
  const [visitLength, setVisitLength] = useState<number>(0);
  const [finalRating, setfinalRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [reviewDone, setReviewDone] = useState<boolean>(false);
  const [ratings, setRatings] = useState<Array<any>>([
    {
      title: "Ease of Appointment",
      key: "ease_of_appointment",
      subTitle: "How easy was it to schedule an appointment?",
      rating: 0,
    },
    {
      title: "Wait Time",
      key: "wait_time",
      subTitle:
        "How satisifed were you about the wait time before seeing a doctor?",
      rating: 0,
    },
    {
      title: "Friendliness Of The Staff",
      key: "friendliness",
      subTitle: "How friendly was the staff?",
      rating: 0,
    },
    {
      title: "Attentiveness",
      key: "attentiveness",
      subTitle: "How well did your doctor listen to your concerns?",
      rating: 0,
    },
    {
      title: "Quality Time",
      key: "quality_time",
      subTitle: "Did you feel that your doctor spent enough time with you?",
      rating: 0,
    },
    {
      title: "Politeness",
      key: "politeness",
      subTitle: "How polite was your doctor?",
      rating: 0,
    },
    {
      title: "Knowledge",
      key: "knowledge",
      subTitle:
        "How well did your doctor explain your medical condition to you?",
      rating: 0,
    },
  ]);

  const closeModal = () => {
    if (reviewDone) {
      dispatch(
        getOtherUserProfile(
          userSelectedRole.role,
          props.userProfileInfo?.user_info?.id,
          props.selectedCircle.id
        )
      );
    }
    props.setmodalVisible(false);
  };

  const ratingCompleted = (rating: any) => {
    setRatings((prev: any) => {
      const _state = [...prev];
      _state[step].rating = rating;
      return _state;
    });
    setTimeout(() => {
      setStep(step + 1);
    }, 350);
  };

  const selectVisit = (val: number) => {
    setVisitLength(val);
    setTimeout(() => {
      setStep(step + 1);
    }, 350);
  };

  const submitReview = async () => {
    try {
      const body: any = {
        length_of_visit: visitLength,
        description: review,
        doctor: props?.userProfileInfo?.user_info?.id,
        user: props.userData.id,
        user_circle: props.selectedCircle.id,
      };
      let _rate: number = 0;
      ratings.forEach((rate: any) => {
        body[rate.key] = rate.rating;
        _rate += rate.rating;
      });
      setIsLoading(true);
      await recommendDoctor(body);
      setfinalRating(Number((_rate / ratings.length).toFixed(1)));
      setReviewDone(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Oops", error.message);
    }
  };

  const getBody = () => {
    let view = <View></View>;
    switch (step) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        view = (
          <View key={step} style={styles.ratingContainer}>
            <Text style={styles.page}>{`${step + 1} of ${
              ratings.length + 2
            }`}</Text>
            <Text
              style={{
                ...styles.title,
                color: "#333",
                textAlign: "center",
                fontSize: 19,
                marginVertical: 3,
              }}
            >
              {ratings[step].title}
            </Text>
            <Text
              style={{
                ...styles.subTitle,
                color: "#333",
                textAlign: "center",
                fontSize: 14,
                marginBottom: 10,
              }}
            >
              {ratings[step].subTitle}
            </Text>
            <Ratings
              ratingCompleted={ratingCompleted}
              defaultRating={ratings[step].rating}
            />
            <Text style={styles.ratingType}>
              {REVIEW_TYPES[ratings[step].rating - 1]}
            </Text>
            {step ? (
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.navigator}
                onPress={() => setStep(step - 1)}
              >
                <MaterialIcons
                  name="chevron-left"
                  size={30}
                  color={colors.secondary}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        );
        break;
      case 7:
        view = (
          <View key={step} style={styles.ratingContainer}>
            <Text style={styles.page}>{`${step + 1} of ${
              ratings.length + 2
            }`}</Text>
            <Text
              style={{
                ...styles.title,
                color: "#333",
                textAlign: "center",
                fontSize: 19,
                marginVertical: 3,
              }}
            >
              Length of Visit
            </Text>
            <Text
              style={{
                ...styles.subTitle,
                color: "#333",
                textAlign: "center",
                fontSize: 14,
                marginBottom: 10,
              }}
            >
              How much time did you spend with your doctor?
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                ...styles.option,
                backgroundColor:
                  visitLength === 15 ? colors.mainColor : colors.secondary,
              }}
              onPress={() => selectVisit(15)}
            >
              <Text
                style={{
                  ...styles.optionText,
                  color: visitLength === 15 ? colors.secondary : "#333",
                }}
              >
                Less than 30 minutes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                ...styles.option,
                backgroundColor:
                  visitLength === 45 ? colors.mainColor : colors.secondary,
              }}
              onPress={() => selectVisit(45)}
            >
              <Text
                style={{
                  ...styles.optionText,
                  color: visitLength === 45 ? colors.secondary : "#333",
                }}
              >
                30 - 60 minutes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                ...styles.option,
                backgroundColor:
                  visitLength === 75 ? colors.mainColor : colors.secondary,
              }}
              onPress={() => selectVisit(75)}
            >
              <Text
                style={{
                  ...styles.optionText,
                  color: visitLength === 75 ? colors.secondary : "#333",
                }}
              >
                More than 60 minutes
              </Text>
            </TouchableOpacity>
            {step ? (
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.navigator}
                onPress={() => setStep(step - 1)}
              >
                <MaterialIcons
                  name="chevron-left"
                  size={30}
                  color={colors.secondary}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        );
        break;
      case 8:
        view = (
          <View key={step} style={styles.ratingContainer}>
            <Text style={styles.page}>{`${step + 1} of ${
              ratings.length + 2
            }`}</Text>
            <Text
              style={{
                ...styles.title,
                color: "#333",
                textAlign: "center",
                fontSize: 19,
                marginVertical: 3,
              }}
            >
              Few words can be really powerful
            </Text>
            <Text
              style={{
                ...styles.subTitle,
                color: "#333",
                textAlign: "center",
                fontSize: 14,
                marginBottom: 10,
              }}
            >
              - OPTIONAL
            </Text>
            <TextInput
              style={{ ...styles.inputField, minHeight: 130 }}
              placeholder="Ex: I’ve been seeing this doctor regularly and we’ve developed a great relationship. He is attentive, understanding and answers any questions i have. I highly recommend this doctor."
              placeholderTextColor={"#ccc"}
              keyboardType="default"
              maxLength={2500}
              multiline={true}
              numberOfLines={6}
              value={review}
              onChangeText={(value: any) => setReview(value)}
              returnKeyType="done"
            />
            <Text
              style={{ alignSelf: "flex-end", color: "#6d6d6d", marginTop: 2 }}
            >
              {2500 - review.length} Characters remaining.
            </Text>

            <View style={styles.row}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.navigator}
                onPress={() => setStep(step - 1)}
              >
                <MaterialIcons
                  name="chevron-left"
                  size={30}
                  color={colors.secondary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.submit}
                onPress={submitReview}
              >
                <Text style={styles.submitText}>submit</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.declaration}>
              By clicking “Submit” you agree to be at least 18 years old.
            </Text>
          </View>
        );
        break;
      default:
        break;
    }

    return view;
  };
  let displayLabel = "";
  if (props.type === "user" || props.type === "other") {
    displayLabel = `Dr. ${props?.userProfileInfo?.user_info?.first_name} ${props?.userProfileInfo?.user_info?.last_name}`;
  } else if (props.type === "hospital") {
    displayLabel = props?.userProfileInfo?.user_info?.hospital_name;
  } else if (props.type === "clinic") {
    displayLabel = props?.userProfileInfo?.user_info?.clinic_name;
  } else if (props.type === "nfp") {
    displayLabel = props?.userProfileInfo?.user_info?.nfp_name;
  }

  return (
    <Modal
      transparent={true}
      onRequestClose={() => closeModal()}
      animationType="slide"
      visible={props.modalVisible}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {isLoading ? (
          <View style={styles.activityIndication}>
            <ActivityIndicator size={40} color={props.color} />
          </View>
        ) : null}
        <View style={styles.modal}>
          <View style={styles.container}>
            <View style={styles.headerSection}>
              <MaterialIcons
                name="close"
                size={25}
                color={colors.secondary}
                style={styles.closeBtn}
                onPress={closeModal}
              />
              <View style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  source={{ uri: props?.userProfileInfo?.user_info?.url }}
                />
              </View>
              <Text style={styles.subTitle}>
                {reviewDone ? "Thanks for Reviewing" : "You are Reviewing"}
              </Text>
              <Text style={styles.title}>{displayLabel}</Text>
              {reviewDone ? (
                <View style={{ width: "100%", alignItems: "center" }}>
                  <View style={styles.finalRatings}>
                    <Text style={styles.finalRatingText}>your rating</Text>
                    <View style={styles.rating}>
                      <MaterialIcons
                        name="star"
                        size={20}
                        color={colors.secondary}
                        onPress={closeModal}
                      />
                      <Text style={styles.number}>{finalRating}</Text>
                    </View>
                  </View>
                  <Text onPress={closeModal} style={styles.closeText}>
                    Close
                  </Text>
                </View>
              ) : null}
            </View>
            {reviewDone ? null : (
              <View style={styles.bodySection}>{getBody()}</View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const Ratings = (props: any) => {
  return (
    <AirbnbRating
      selectedColor={"#ff9100"}
      reviewSize={18}
      showRating={false}
      defaultRating={props.defaultRating}
      onFinishRating={props.ratingCompleted}
      starContainerStyle={{ marginTop: 15 }}
    />
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.8)",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    width: "100%",
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
  headerSection: {
    backgroundColor: colors.mainColor,
    padding: 15,
    alignItems: "center",
  },
  closeBtn: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  imageContainer: {
    height: 80,
    width: 80,
    borderRadius: 40,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
  subTitle: {
    color: colors.secondary,
    fontWeight: "500",
    fontSize: 15,
    width: "100%",
    textAlign: "center",
    marginBottom: 3,
  },
  title: {
    color: colors.secondary,
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 5,
    width: "100%",
    textAlign: "center",
  },
  bodySection: {
    backgroundColor: colors.secondary,
    padding: 15,
  },
  ratingContainer: {
    alignItems: "center",
  },
  page: {
    marginBottom: 15,
    color: "#888",
  },
  navigator: {
    marginTop: 25,
    padding: 2,
    backgroundColor: "#888",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  option: {
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    width: "60%",
    marginVertical: 5,
    borderColor: colors.mainColor,
    alignItems: "center",
  },
  optionText: {},
  inputField: {
    backgroundColor: colors.secondary,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: "100%",
    marginBottom: 5,
    textAlignVertical: "top",
  },
  declaration: {
    fontSize: 11,
    marginVertical: 3,
    marginTop: 5,
    alignSelf: "flex-end",
  },
  submit: {
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 15,
    marginTop: 25,
    flex: 1,
    marginLeft: 12,
    backgroundColor: colors.mainColor,
    alignItems: "center",
  },
  submitText: {
    color: colors.secondary,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  finalRatings: {
    backgroundColor: colors.secondary,
    width: "80%",
    borderRadius: 15,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
  },
  finalRatingText: {
    textTransform: "uppercase",
    fontWeight: "bold",
    width: "100%",
    textAlign: "center",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginTop: 10,
    backgroundColor: colors.mainColor,
  },
  number: {
    color: colors.secondary,
    fontSize: 15,
    paddingHorizontal: 3,
  },
  closeText: {
    marginTop: 30,
    textTransform: "uppercase",
    color: "#f6f6f6",
    fontWeight: "bold",
    width: "100%",
    textAlign: "center",
  },
  ratingType: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 18,
    fontWeight: "bold",
    width: "100%",
    textAlign: "center",
    color: "#ff9100",
  },
});
export default RecommendDoctorModal;
